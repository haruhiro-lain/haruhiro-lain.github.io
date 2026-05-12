#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Parse -s flag: only sync Steam when explicitly requested
const userArgs = process.argv.slice(2);
const syncSteam = userArgs.includes('-s');

const alwaysSyncScripts = [
	resolve(__dirname, 'sync-hpoi.mjs'),
	resolve(__dirname, 'sync-github-avatar.mjs'),
];

const steamScript = resolve(__dirname, 'sync-steam.mjs');

const syncScriptPaths = syncSteam
	? [...alwaysSyncScripts, steamScript]
	: alwaysSyncScripts;

const astroEntry = resolve(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');

for (const syncScriptPath of syncScriptPaths) {
	const syncResult = spawnSync(process.execPath, [syncScriptPath], {
		cwd: projectRoot,
		stdio: 'inherit',
	});

	if (syncResult.error || syncResult.status !== 0) {
		console.warn(`[dev-with-sync] 同步失败 (${syncScriptPath})，继续以本地数据启动开发服务器。`);
	}
}

if (!syncSteam) {
	console.log('[dev-with-sync] 已跳过 Steam 同步（使用 -s 参数可启用）。');
}

const astroArgs = [astroEntry, 'dev', '--root', projectRoot, ...userArgs.filter((arg) => arg !== '-s')];
const astroProcess = spawn(process.execPath, astroArgs, {
	cwd: projectRoot,
	stdio: 'inherit',
	shell: false,
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, () => {
		if (!astroProcess.killed) {
			astroProcess.kill(signal);
		}
	});
});

astroProcess.on('error', (error) => {
	console.error('[dev-with-sync] 启动 Astro 开发服务器失败：', error.message);
	process.exit(1);
});

astroProcess.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});
