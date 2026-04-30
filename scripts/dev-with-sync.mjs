#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const syncScriptPaths = [resolve(__dirname, 'sync-hpoi.mjs'), resolve(__dirname, 'sync-steam.mjs')];
const astroBin =
	process.platform === 'win32'
		? resolve(projectRoot, 'node_modules', '.bin', 'astro.cmd')
		: resolve(projectRoot, 'node_modules', '.bin', 'astro');

for (const syncScriptPath of syncScriptPaths) {
	const syncResult = spawnSync(process.execPath, [syncScriptPath], {
		cwd: projectRoot,
		stdio: 'inherit',
	});

	if (syncResult.error || syncResult.status !== 0) {
		console.warn(`[dev-with-sync] 同步失败 (${syncScriptPath})，继续使用当前本地数据启动开发服务器。`);
	}
}

const astroArgs = ['dev', '--root', projectRoot, ...process.argv.slice(2)];
const astroProcess = spawn(astroBin, astroArgs, {
	cwd: projectRoot,
	stdio: 'inherit',
	shell: process.platform === 'win32',
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, () => {
		if (!astroProcess.killed) {
			astroProcess.kill(signal);
		}
	});
});

astroProcess.on('error', (error) => {
	console.error('[dev-with-sync] 启动 Astro 开发服务器失败:', error.message);
	process.exit(1);
});

astroProcess.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});