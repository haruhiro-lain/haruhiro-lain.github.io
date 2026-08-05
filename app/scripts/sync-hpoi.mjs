#!/usr/bin/env node
/**
 * 同步 HPOI 堆积列表到 data/gkModelSelection.ts
 * 运行：npm run sync:hpoi
 *
 * 该脚本会：
 *   1. 抓取 HPOI 用户页面的全部 buy 收藏条目
 *   2. 将结果写入 allModels 字段（自动维护，不要手动修改此字段）
 *   3. 保留 selectedLinks / selectedNames / maxVisible 等手动配置不变
 */

import { readFileSync, writeFileSync, writeSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = resolve(__dirname, '../../data/gkModelSelection.ts');
const HPOI_URL = 'https://www.hpoi.net/user/113242/hobby?favState=buy&category=-1';
const DETAIL_FETCH_CONCURRENCY = 5;

const logInfo = (message) => {
	writeSync(1, `${message}\n`, undefined, 'utf-8');
};

const logError = (message) => {
	writeSync(2, `${message}\n`, undefined, 'utf-8');
};

const decodeHtml = (text) =>
	text
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.trim();

const buildAbsoluteUrl = (value) => {
	if (!value) return '';
	if (value.startsWith('http://') || value.startsWith('https://')) return value;
	return `https://www.hpoi.net/${value.replace(/^\/+/, '')}`;
};

const normalize = (value) => value.trim().toLowerCase();

const parseStringArrayField = (source, fieldName) => {
	const fieldMatch = source.match(new RegExp(`${fieldName}\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*,`));
	if (!fieldMatch) return [];

	const result = [];
	const stringPattern = /"(?:\\.|[^"\\])*"/g;
	for (const match of fieldMatch[1].matchAll(stringPattern)) {
		result.push(JSON.parse(match[0]));
	}

	return result;
};

const parseAutoSelectRules = (source) => {
	const rulesMatch = source.match(/autoSelectRules\s*:\s*\[([\s\S]*?)\]\s*,/);
	if (!rulesMatch) return [];

	const rules = [];
	const objectPattern = /\{([\s\S]*?)\}/g;
	for (const objectMatch of rulesMatch[1].matchAll(objectPattern)) {
		const objectBody = objectMatch[1];
		const makerMatch = objectBody.match(/makerIncludes\s*:\s*("(?:\\.|[^"\\])*")/);
		const seriesMatch = objectBody.match(/seriesIncludes\s*:\s*("(?:\\.|[^"\\])*")/);
		if (!makerMatch && !seriesMatch) continue;

		rules.push({
			makerIncludes: makerMatch ? JSON.parse(makerMatch[1]) : '',
			seriesIncludes: seriesMatch ? JSON.parse(seriesMatch[1]) : '',
		});
	}

	return rules;
};

const parseExistingModels = (source) => {
	const blockMatch = source.match(/\/\/ @@ALLMODELS_START([\s\S]*?)\/\/ @@ALLMODELS_END/);
	if (!blockMatch) return [];

	const items = [];
	const lines = blockMatch[1].split('\n').map((line) => line.trim()).filter(Boolean);

	for (const line of lines) {
		if (!line.startsWith('{ id:')) continue;

		const baseMatch = line.match(
			/^\{\s*id:\s*(\d+),\s*name:\s*("(?:\\.|[^"\\])*"),\s*link:\s*("(?:\\.|[^"\\])*"),\s*image:\s*("(?:\\.|[^"\\])*"),\s*maker:\s*("(?:\\.|[^"\\])*"),\s*series:\s*("(?:\\.|[^"\\])*")/,
		);
		if (!baseMatch) continue;

		const tagsMatch = line.match(/,\s*tags:\s*(\[.*\])\s*\}\s*,?$/);
		const tags = tagsMatch ? JSON.parse(tagsMatch[1]) : [];

		items.push({
			id: Number(baseMatch[1]),
			name: JSON.parse(baseMatch[2]),
			link: JSON.parse(baseMatch[3]),
			image: JSON.parse(baseMatch[4]),
			maker: JSON.parse(baseMatch[5]),
			series: JSON.parse(baseMatch[6]),
			tags,
		});
	}

	return items;
};

const attachStableIds = (fetchedItems, existingItems) => {
	if (existingItems.length === 0) {
		const newItems = fetchedItems.map((item, index) => ({
			...item,
			id: fetchedItems.length - index,
		}));

		return {
			items: newItems,
			newItems,
		};
	}

	const fetchedByLink = new Map(fetchedItems.map((item) => [item.link, item]));
	const existingByLink = new Map(existingItems.map((item) => [item.link, item]));
	const existingVisibleItems = existingItems
		.filter((item) => fetchedByLink.has(item.link))
		.map((item) => ({
			...item,
			...fetchedByLink.get(item.link),
		}));
	const newItems = fetchedItems.filter((item) => !existingByLink.has(item.link));
	const maxExistingId = existingItems.reduce((maxId, item) => Math.max(maxId, item.id), 0);
	const newItemsWithIds = newItems.map((item, index) => ({
		...item,
		id: maxExistingId + newItems.length - index,
	}));

	return {
		items: [...newItemsWithIds, ...existingVisibleItems],
		newItems: newItemsWithIds,
	};
};

const extractItemsFromHtml = (html, seenLinks, items) => {
	const pattern =
		/<a class="cover" href="([^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<div class="name">[\s\S]*?<a href="[^"]+"[^>]*>([\s\S]*?)<\/a>/g;

	let pageCount = 0;

	for (const match of html.matchAll(pattern)) {
		const link = buildAbsoluteUrl(match[1] ?? '');
		if (!link || seenLinks.has(link)) continue;
		const image = buildAbsoluteUrl((match[2] ?? '').trim());
		const nameFromText = decodeHtml((match[4] ?? '').replace(/<[^>]*>/g, ''));
		const nameFromAlt = decodeHtml(match[3] ?? '');
		const name = nameFromText || nameFromAlt;
		if (!name) continue;

		items.push({ name, link, image, maker: '', series: '' });
		seenLinks.add(link);
		pageCount += 1;
	}

	return pageCount;
};

const fetchPageHtml = async (page) => {
	const pageUrl = page === 1 ? HPOI_URL : `${HPOI_URL}&page=${page}`;
	logInfo(`[sync-hpoi] 抓取第 ${page} 页: ${pageUrl}`);

	const response = await fetch(pageUrl, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; Astro-Blog personal site)',
			Accept: 'text/html,application/xhtml+xml',
		},
	});

	if (!response.ok) {
		throw new Error(`第 ${page} 页请求失败: HTTP ${response.status} ${response.statusText}`);
	}

	return response.text();
};

const fetchAll = async () => {
	const items = [];
	const seenLinks = new Set();

	for (let page = 1; page <= 20; page += 1) {
		const html = await fetchPageHtml(page);
		const pageCount = extractItemsFromHtml(html, seenLinks, items);
		if (pageCount === 0) break;
	}

	logInfo(`[sync-hpoi] 共获取到 ${items.length} 条条目`);
	return items;
};

const stripHtml = (text) => decodeHtml(text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')).trim();

const isPriceFieldLabel = (label) => /价格|價格|定价|定價|售价|售價|価格|價額|价位/.test(label);

const fetchItemMeta = async (item) => {
	try {
		const response = await fetch(item.link, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; Astro-Blog personal site)',
				Accept: 'text/html,application/xhtml+xml',
			},
		});

		if (!response.ok) return { maker: item.maker ?? '', series: item.series ?? '', tags: item.tags ?? [] };

		const html = await response.text();
		const infoPattern = /<div class="hpoi-infoList-item">[\s\S]*?<span>\s*([^<]+)\s*<\/span>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>/g;
		let maker = item.maker ?? '';
		let series = item.series ?? '';
		const allTags = [];

		for (const match of html.matchAll(infoPattern)) {
			const label = stripHtml(match[1] ?? '');
			const value = stripHtml(match[2] ?? '');
			if (!value) continue;
			
			// 收集属性值（过滤价格字段，避免汇率波动导致无意义更新）
			if (!isPriceFieldLabel(label)) {
				allTags.push(value);
			}
			
			if (!maker && label === '制作') maker = value;
			if (!series && label === '系列') series = value;
		}

		return { maker, series, tags: allTags };
	} catch {
		return { maker: item.maker ?? '', series: item.series ?? '', tags: item.tags ?? [] };
	}
};

const runWithConcurrency = async (items, concurrency, worker) => {
	const results = new Array(items.length);
	let cursor = 0;

	const runWorker = async () => {
		while (cursor < items.length) {
			const index = cursor;
			cursor += 1;
			results[index] = await worker(items[index], index);
		}
	};

	const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length || 1)) }, () => runWorker());
	await Promise.all(workers);
	return results;
};

const enrichItemsMeta = async (items, existingItems) => {
	const existingByLink = new Map(existingItems.map((item) => [item.link, item]));
	const needFetchIndices = [];
	const preparedItems = items.map((item, index) => {
		const existing = existingByLink.get(item.link);
		const merged = {
			...item,
			maker: existing?.maker ?? item.maker ?? '',
			series: existing?.series ?? item.series ?? '',
			tags: existing?.tags ?? item.tags ?? [],
		};
		if (!merged.maker || !merged.series || (!merged.tags || merged.tags.length === 0)) {
			needFetchIndices.push(index);
		}
		return merged;
	});

	if (needFetchIndices.length === 0) return preparedItems;

	logInfo(`[sync-hpoi] 补充详情字段（制作/系列/属性），共 ${needFetchIndices.length} 条...`);
	const metaList = await runWithConcurrency(
		needFetchIndices,
		DETAIL_FETCH_CONCURRENCY,
		async (index) => fetchItemMeta(preparedItems[index]),
	);

	metaList.forEach((meta, i) => {
		const targetIndex = needFetchIndices[i];
		preparedItems[targetIndex] = {
			...preparedItems[targetIndex],
			maker: meta.maker,
			series: meta.series,
			tags: meta.tags,
		};
	});

	return preparedItems;
};

const rewriteAllModels = (source, items) => {
	const serialized = items
		.map(
			(item) => {
				const tags = item.tags && item.tags.length > 0 
					? `, tags: ${JSON.stringify(item.tags)}` 
					: '';
				return `\t\t{ id: ${item.id}, name: ${JSON.stringify(item.name)}, link: ${JSON.stringify(item.link)}, image: ${JSON.stringify(item.image)}, maker: ${JSON.stringify(item.maker ?? '')}, series: ${JSON.stringify(item.series ?? '')}${tags} }`;
			}
		)
		.join(',\n');

	const block = `\tallModels: [\n${serialized},\n\t],`;

	if (/\/\/ @@ALLMODELS_START[\s\S]*?\/\/ @@ALLMODELS_END/.test(source)) {
		return source.replace(
			/\/\/ @@ALLMODELS_START[\s\S]*?\/\/ @@ALLMODELS_END/,
			`// @@ALLMODELS_START\n${block}\n\t// @@ALLMODELS_END`,
		);
	}

	return source.replace(
		/(export const gkModelSelection[^=]*=\s*\{)/,
		`$1\n\t// @@ALLMODELS_START\n${block}\n\t// @@ALLMODELS_END`,
	);
};

const shouldMatchRule = (item, rule) => {
	const makerNeedle = normalize(rule.makerIncludes ?? '');
	const seriesNeedle = normalize(rule.seriesIncludes ?? '');
	const maker = normalize(item.maker ?? '');
	const series = normalize(item.series ?? '');

	if (makerNeedle && !maker.includes(makerNeedle)) return false;
	if (seriesNeedle && !series.includes(seriesNeedle)) return false;
	return makerNeedle !== '' || seriesNeedle !== '';
};

const hasGkInTags = (item) => {
	// 检查 tags 中是否包含 "GK" 字符串
	if (!item.tags || item.tags.length === 0) return false;
	return item.tags.some(tag => normalize(tag).includes('gk'));
};

const normalizeIds = (items) => {
	const n = items.length;
	const needsNormalization = items.some((item, index) => item.id !== n - index);

	if (!needsNormalization) {
		logInfo('[sync-hpoi] allModels 的 id 序列正确无需修正。');
		return items;
	}

	logInfo('[sync-hpoi] 检测到 id 序列不连续，进行修正...');
	return items.map((item, index) => ({
		...item,
		id: n - index,
	}));
};

const updateSelectedNamesByRules = (source, items) => {
	const currentSelectedNames = parseStringArrayField(source, 'selectedNames');
	const rules = parseAutoSelectRules(source);
	if (rules.length === 0) return source;

	const currentSet = new Set(currentSelectedNames.map(normalize));
	const autoSelectedNames = [];

	for (const item of items) {
		// 检查是否匹配规则或包含 GK 标签
		if (!rules.some((rule) => shouldMatchRule(item, rule)) && !hasGkInTags(item)) continue;
		const key = normalize(item.name);
		if (currentSet.has(key)) continue;
		currentSet.add(key);
		autoSelectedNames.push(item.name);
	}

	if (autoSelectedNames.length === 0) return source;

	const merged = [...currentSelectedNames, ...autoSelectedNames];
	const serialized = merged.map((name) => JSON.stringify(name)).join(', ');
	logInfo(`[sync-hpoi] 根据 autoSelectRules 或 GK 标签自动追加 selectedNames ${autoSelectedNames.length} 项。`);

	return source.replace(/selectedNames\s*:\s*\[[\s\S]*?\]\s*,/, `selectedNames: [${serialized}],`);
};

const run = async () => {
	const source = readFileSync(CONFIG_PATH, 'utf-8');
	const existingItems = parseExistingModels(source);
	const fetchedItems = await fetchAll();
	const enrichedItems = await enrichItemsMeta(fetchedItems, existingItems);
	const { items, newItems } = attachStableIds(enrichedItems, existingItems);
	const normalizedItems = normalizeIds(items);
	const withModels = rewriteAllModels(source, normalizedItems);
	const updated = updateSelectedNamesByRules(withModels, newItems);

	if (updated === source) {
		logInfo('[sync-hpoi] 数据无变化。');
		return;
	}

	writeFileSync(CONFIG_PATH, updated, 'utf-8');
	logInfo(`[sync-hpoi] 已更新: ${CONFIG_PATH}`);
	logInfo('[sync-hpoi] 可在 selectedLinks / selectedNames 中手动指定，或通过 autoSelectRules 自动追加。');

	if (newItems.length === 0) {
		logInfo('[sync-hpoi] 无新增内容。');
		return;
	}

	logInfo(`[sync-hpoi] 新增条目 ${newItems.length} 条：`);
	newItems.forEach((item) => logInfo(`  ${String(item.id).padStart(2, ' ')}. ${item.link}  ${item.name}`));
};

run().catch((err) => {
	logError(`[sync-hpoi] 失败: ${err.message}`);
	process.exit(1);
});
