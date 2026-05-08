#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR_PATH = resolve(__dirname, '../public/steam-cache');
const OUTPUT_PATH = resolve(CACHE_DIR_PATH, 'github-avatar-haruhiro-lain.png');
const AVATAR_URL = 'https://github.com/haruhiro-lain.png?size=200';

const ensureCacheDir = () => {
	mkdirSync(CACHE_DIR_PATH, { recursive: true });
};

const main = async () => {
	try {
		ensureCacheDir();

		const response = await fetch(AVATAR_URL, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; Astro-Blog personal site)',
				Accept: 'image/*,*/*;q=0.8',
			},
		});

		if (!response.ok) {
			throw new Error(`请求失败: HTTP ${response.status}`);
		}

		const nextBuffer = Buffer.from(await response.arrayBuffer());
		if (nextBuffer.length === 0) {
			throw new Error('头像内容为空');
		}

		if (existsSync(OUTPUT_PATH)) {
			const currentBuffer = readFileSync(OUTPUT_PATH);
			if (currentBuffer.equals(nextBuffer)) {
				console.log('[sync-github-avatar] Avatar cache is unchanged.');
				return;
			}
		}

		writeFileSync(OUTPUT_PATH, nextBuffer);
		console.log(`[sync-github-avatar] Updated: ${OUTPUT_PATH}`);
	} catch (error) {
		console.warn(`[sync-github-avatar] Sync failed; keeping existing avatar cache.${error instanceof Error ? ` ${error.message}` : ''}`);
	}
};

await main();