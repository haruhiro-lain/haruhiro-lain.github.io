#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import https from 'node:https';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../src/data/steamRecentGames.ts');
const CACHE_DIR_PATH = resolve(__dirname, '../src/assets/steam-cache');
const PROFILE_URL = 'https://steamcommunity.com/profiles/76561199036753865/';
const PROFILE_GAMES_URL = `${PROFILE_URL}games/?tab=recent&l=english`;
const REQUEST_TIMEOUT_MS = 20000;

const decodeHtml = (text) =>
	text
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&nbsp;', ' ')
		.trim();

const stripHtml = (text) => decodeHtml(text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());

const parseNumber = (value) => {
	if (!value) return null;
	const normalized = value.replaceAll(',', '');
	const num = Number(normalized);
	return Number.isFinite(num) ? num : null;
};

const formatHours = (value) => {
	if (typeof value !== 'number' || !Number.isFinite(value)) return '';
	const rounded = Math.round(value * 10) / 10;
	return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

const parseTwoWeeksTotal = (html) => {
	const match = html.match(/recentgame_recentplaytime[\s\S]*?<div>([\s\S]*?)<\/div>/i);
	if (!match) {
		return { text: '', hours: null };
	}

	const text = stripHtml(match[1]);
	const hourMatch = text.match(/([\d.,]+)\s*(?:hours?|hrs?)\s*(?:past|last)\s*2\s*weeks/i);
	const normalizedText = hourMatch ? `${hourMatch[1]} hours` : text;
	return {
		text: normalizedText,
		hours: parseNumber(hourMatch?.[1] ?? ''),
	};
};

const parseGames = (html) => {
	const games = [];
	const pattern =
		/<div class="game_info_cap[^\"]*">\s*<a[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*><\/a><\/div>[\s\S]*?<div class="game_info_details">([\s\S]*?)<\/div>\s*<div class="game_name"><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/div>/g;

	for (const match of html.matchAll(pattern)) {
		const coverImageUrl = decodeHtml((match[1] ?? '').trim());
		const detailsRaw = match[2] ?? '';
		const appUrl = decodeHtml((match[3] ?? '').trim());
		const name = stripHtml(match[4] ?? '');
		if (!name || !appUrl) continue;

		const detailsText = stripHtml(detailsRaw.replace(/<br\s*\/?>/gi, ' | '));
		const totalHoursMatch = detailsText.match(/([\d.,]+)\s*hrs?\s*on\s*record/i);
		const twoWeeksHoursMatch = detailsText.match(/([\d.,]+)\s*hrs?\s*(?:last|past)\s*2\s*weeks/i);
		const lastPlayedMatch = detailsText.match(/last\s*played\s*on\s*(.+)$/i);
		const appIdMatch = appUrl.match(/\/app\/(\d+)/);

		games.push({
			name,
			appId: appIdMatch ? Number(appIdMatch[1]) : null,
			appUrl,
			coverImageUrl,
			coverImageLocalPath: '',
			lastTwoWeeksHours: parseNumber(twoWeeksHoursMatch?.[1] ?? ''),
			lastTwoWeeksText: twoWeeksHoursMatch ? `${twoWeeksHoursMatch[1]} hrs` : '',
			totalHours: parseNumber(totalHoursMatch?.[1] ?? ''),
			totalHoursText: totalHoursMatch ? `${totalHoursMatch[1]} hrs` : '',
			lastPlayedText: lastPlayedMatch?.[1]?.trim() ?? '',
		});
	}

	return games;
};

const hasUsableSteamGameData = (html) => {
	if (!html) return false;
	return /recentgame_recentplaytime/i.test(html) || /game_info_cap/i.test(html);
};

const isSteamLoginShell = (html) => {
	if (!html) return false;
	return /login_featuretarget_ctn/i.test(html) || /strRedirectURL/i.test(html);
};

const serializeGames = (games) =>
	games
		.map(
			(game) =>
				`\t\t{\n` +
				`\t\t\tname: ${JSON.stringify(game.name)},\n` +
				`\t\t\tappId: ${game.appId === null ? 'null' : game.appId},\n` +
				`\t\t\tappUrl: ${JSON.stringify(game.appUrl)},\n` +
				`\t\t\tcoverImageUrl: ${JSON.stringify(game.coverImageUrl ?? '')},\n` +
				`\t\t\tcoverImageLocalPath: ${JSON.stringify(game.coverImageLocalPath ?? '')},\n` +
				`\t\t\tlastTwoWeeksHours: ${game.lastTwoWeeksHours === null ? 'null' : game.lastTwoWeeksHours},\n` +
				`\t\t\tlastTwoWeeksText: ${JSON.stringify(game.lastTwoWeeksText)},\n` +
				`\t\t\ttotalHours: ${game.totalHours === null ? 'null' : game.totalHours},\n` +
				`\t\t\ttotalHoursText: ${JSON.stringify(game.totalHoursText)},\n` +
				`\t\t\tlastPlayedText: ${JSON.stringify(game.lastPlayedText)},\n` +
				`\t\t}`,
		)
		.join(',\n');

const buildFileContent = (payload) => {
	const gameRows = payload.games.length > 0 ? `${serializeGames(payload.games)},\n` : '';

	return `export type SteamRecentGame = {\n\tname: string;\n\tappId: number | null;\n\tappUrl: string;\n\tcoverImageUrl: string;\n\tcoverImageLocalPath: string;\n\tlastTwoWeeksHours: number | null;\n\tlastTwoWeeksText: string;\n\ttotalHours: number | null;\n\ttotalHoursText: string;\n\tlastPlayedText: string;\n};\n\nexport type SteamRecentGamesData = {\n\tprofileUrl: string;\n\tfetchedAt: string;\n\ttotalRecentTwoWeeksHours: number | null;\n\ttotalRecentTwoWeeksText: string;\n\tgames: SteamRecentGame[];\n};\n\nexport const steamRecentGamesData: SteamRecentGamesData = {\n\tprofileUrl: ${JSON.stringify(payload.profileUrl)},\n\tfetchedAt: ${JSON.stringify(payload.fetchedAt)},\n\ttotalRecentTwoWeeksHours: ${payload.totalRecentTwoWeeksHours === null ? 'null' : payload.totalRecentTwoWeeksHours},\n\ttotalRecentTwoWeeksText: ${JSON.stringify(payload.totalRecentTwoWeeksText)},\n\tgames: [\n${gameRows}\t],\n};\n`;
};

const requestHtml = (url, extraHeaders = {}) =>
	new Promise((resolvePromise, rejectPromise) => {
		const req = https.get(
			url,
			{
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; Astro-Blog personal site)',
					Accept: 'text/html,application/xhtml+xml',
					...extraHeaders,
				},
				family: 4,
				timeout: REQUEST_TIMEOUT_MS,
			},
			(response) => {
				const statusCode = response.statusCode ?? 0;
				if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
					const nextUrl = new URL(response.headers.location, url).toString();
					requestHtml(nextUrl)
						.then(resolvePromise)
						.catch(rejectPromise);
					return;
				}

				if (statusCode < 200 || statusCode >= 300) {
					rejectPromise(new Error(`请求失败: HTTP ${statusCode}`));
					response.resume();
					return;
				}

				const chunks = [];
				response.on('data', (chunk) => {
					chunks.push(Buffer.from(chunk));
				});
				response.on('end', () => {
					resolvePromise(Buffer.concat(chunks).toString('utf8'));
				});
			},
		);

		req.on('timeout', () => {
			req.destroy(new Error(`请求超时 (${REQUEST_TIMEOUT_MS}ms)`));
		});

		req.on('error', (error) => {
			rejectPromise(error);
		});
	});

const requestBinary = (url) =>
	new Promise((resolvePromise, rejectPromise) => {
		const req = https.get(
			url,
			{
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; Astro-Blog personal site)',
					Accept: '*/*',
				},
				family: 4,
				timeout: REQUEST_TIMEOUT_MS,
			},
			(response) => {
				const statusCode = response.statusCode ?? 0;
				if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
					const nextUrl = new URL(response.headers.location, url).toString();
					requestBinary(nextUrl)
						.then(resolvePromise)
						.catch(rejectPromise);
					return;
				}

				if (statusCode < 200 || statusCode >= 300) {
					rejectPromise(new Error(`图片请求失败: HTTP ${statusCode}`));
					response.resume();
					return;
				}

				const chunks = [];
				response.on('data', (chunk) => {
					chunks.push(Buffer.from(chunk));
				});
				response.on('end', () => {
					resolvePromise(Buffer.concat(chunks));
				});
			},
		);

		req.on('timeout', () => {
			req.destroy(new Error(`图片请求超时 (${REQUEST_TIMEOUT_MS}ms)`));
		});

		req.on('error', (error) => {
			rejectPromise(error);
		});
	});

const requestHtmlViaPowerShell = (url) => {
	if (process.platform !== 'win32') {
		throw new Error('PowerShell fallback is only available on Windows');
	}

	const command = `$resp = Invoke-WebRequest -Uri '${url}' -Headers @{'User-Agent'='Mozilla/5.0 (compatible; Astro-Blog personal site)'}; [Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $resp.Content`;
	const result = spawnSync('powershell', ['-NoProfile', '-Command', command], {
		encoding: 'utf8',
		maxBuffer: 20 * 1024 * 1024,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr?.trim() || 'PowerShell 请求失败');
	}

	const content = (result.stdout ?? '').trim();
	if (!content) {
		throw new Error('PowerShell 返回内容为空');
	}

	return content;
};

const downloadImageViaPowerShell = (url, outputPath) => {
	if (process.platform !== 'win32') {
		throw new Error('PowerShell fallback is only available on Windows');
	}

	const command = `Invoke-WebRequest -Uri '${url}' -Headers @{'User-Agent'='Mozilla/5.0 (compatible; Astro-Blog personal site)'} -OutFile '${outputPath}'`;
	const result = spawnSync('powershell', ['-NoProfile', '-Command', command], {
		encoding: 'utf8',
		maxBuffer: 10 * 1024 * 1024,
	});

	if (result.status !== 0) {
		throw new Error(result.stderr?.trim() || 'PowerShell 图片下载失败');
	}
};

const ensureSteamImageCacheDir = () => {
	mkdirSync(CACHE_DIR_PATH, { recursive: true });
};

const sanitizeFileSegment = (value) =>
	value
		.normalize('NFKC')
		.replace(/[<>:"/\\|?*]/g, ' ')
		.replace(/\s+/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_+|_+$/g, '')
		.slice(0, 80) || 'steam-game';

const getCachedSteamImageFiles = () => {
	ensureSteamImageCacheDir();
	return readdirSync(CACHE_DIR_PATH, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => entry.name);
};

const extractCachedAppId = (fileName) => {
	const match = fileName.match(/-(\d+)\.jpg$/i) ?? fileName.match(/^(\d+)\.[^.]+$/i);
	return match ? Number(match[1]) : null;
};

const buildCacheFileName = (game) => {
	const safeName = sanitizeFileSegment(game.name);
	if (game.appId !== null) {
		return `${safeName}-${game.appId}.jpg`;
	}
	return `${safeName}.jpg`;
};

const cacheSteamGameImages = async (games) => {
	ensureSteamImageCacheDir();
	const existingFiles = getCachedSteamImageFiles();
	const existingFileByAppId = new Map(
		existingFiles
			.map((fileName) => [extractCachedAppId(fileName), fileName])
			.filter(([appId]) => appId !== null),
	);
	const expectedFiles = new Set();

	for (const game of games) {
		const imageUrl = game.coverImageUrl ?? '';
		if (!imageUrl) continue;

		const imageFileName = buildCacheFileName(game);
		const imageFilePath = resolve(CACHE_DIR_PATH, imageFileName);
		expectedFiles.add(imageFileName);

		const existingFileName = game.appId !== null ? existingFileByAppId.get(game.appId) ?? '' : '';
		if (existingFileName) {
			const existingFilePath = resolve(CACHE_DIR_PATH, existingFileName);
			if (existingFileName !== imageFileName && existsSync(existingFilePath)) {
				renameSync(existingFilePath, imageFilePath);
			}
			game.coverImageLocalPath = imageFileName;
			continue;
		}

		try {
			const buffer = await requestBinary(imageUrl);
			writeFileSync(imageFilePath, buffer);
			game.coverImageLocalPath = imageFileName;
		} catch {
			try {
				downloadImageViaPowerShell(imageUrl, imageFilePath);
				game.coverImageLocalPath = imageFileName;
			} catch {
				game.coverImageLocalPath = '';
			}
		}
	}

	for (const fileName of getCachedSteamImageFiles()) {
		if (expectedFiles.has(fileName)) continue;
		rmSync(resolve(CACHE_DIR_PATH, fileName), { force: true });
	}
};

const fetchSteamProfile = async () => {
	const tryFetchFromPage = async ({ targetUrl, sourceType }) => {
		let sawLoginShell = false;
		let lastErrorMessage = '';

		try {
			const html = await requestHtml(targetUrl);
			if (hasUsableSteamGameData(html)) {
				return {
					result: {
						sourceType,
						sourceUrl: targetUrl,
						twoWeeks: parseTwoWeeksTotal(html),
						games: parseGames(html),
					},
					sawLoginShell,
					lastErrorMessage,
				};
			}
			if (isSteamLoginShell(html)) {
				sawLoginShell = true;
				lastErrorMessage = 'Steam profile 页面返回登录壳页，未拿到可解析游戏数据';
			} else {
				lastErrorMessage = '页面已返回但无可解析游戏数据';
			}
		} catch (error) {
			lastErrorMessage = error instanceof Error ? error.message : 'unknown error';
		}

		try {
			const html = requestHtmlViaPowerShell(targetUrl);
			if (hasUsableSteamGameData(html)) {
				return {
					result: {
						sourceType,
						sourceUrl: targetUrl,
						twoWeeks: parseTwoWeeksTotal(html),
						games: parseGames(html),
					},
					sawLoginShell,
					lastErrorMessage,
				};
			}
			if (isSteamLoginShell(html)) {
				sawLoginShell = true;
				lastErrorMessage = 'Steam profile 页面返回登录壳页，未拿到可解析游戏数据';
			} else if (!lastErrorMessage) {
				lastErrorMessage = '页面已返回但无可解析游戏数据';
			}
		} catch (error) {
			if (!lastErrorMessage) {
				lastErrorMessage = error instanceof Error ? error.message : 'unknown error';
			}
		}

		return {
			result: null,
			sawLoginShell,
			lastErrorMessage,
		};
	};

	const gamesPageResult = await tryFetchFromPage({
		targetUrl: PROFILE_GAMES_URL,
		sourceType: 'games-public',
	});

	if (gamesPageResult.result) {
		return gamesPageResult.result;
	}

	const gamesResult = await tryFetchFromPage({
		targetUrl: PROFILE_URL,
		sourceType: 'profile-public',
	});

	if (gamesResult.result) {
		return gamesResult.result;
	}

	throw new Error(
		`未能从 Steam 公开页面获取可用数据。games: ${gamesPageResult.lastErrorMessage || 'unknown'}；profile: ${gamesResult.lastErrorMessage || 'unknown'}`,
	);
};

const main = async () => {
	try {
		console.log('[sync-steam] 开始抓取 Steam 最近游玩数据...');
		const { sourceType, sourceUrl, twoWeeks, games } = await fetchSteamProfile();
		await cacheSteamGameImages(games);

		const payload = {
			profileUrl: PROFILE_URL,
			fetchedAt: new Date().toISOString(),
			totalRecentTwoWeeksHours: twoWeeks.hours,
			totalRecentTwoWeeksText: twoWeeks.text,
			games,
		};

		const existing = readFileSync(DATA_PATH, 'utf8');
		const next = buildFileContent(payload);
		if (existing !== next) {
			writeFileSync(DATA_PATH, next, 'utf8');
			console.log(`[sync-steam] 已更新: ${DATA_PATH}`);
		} else {
			console.log('[sync-steam] 数据无变化。');
		}

		console.log(`[sync-steam] 数据来源类型: ${sourceType}`);
		console.log(`[sync-steam] 数据来源: ${sourceUrl}`);
		console.log(`[sync-steam] 最近两周总时长: ${payload.totalRecentTwoWeeksText || '未知'}`);
		console.log(`[sync-steam] 最近游玩条目: ${payload.games.length}`);
	} catch (error) {
		console.warn(`[sync-steam] 同步失败，保留现有数据。${error instanceof Error ? ` ${error.message}` : ''}`);
	}
};

await main();