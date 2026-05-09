#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const syncScriptPaths = [
	resolve(__dirname, 'sync-hpoi.mjs'),
	resolve(__dirname, 'sync-steam.mjs'),
	resolve(__dirname, 'sync-github-avatar.mjs'),
];
const astroEntry = resolve(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');

for (const syncScriptPath of syncScriptPaths) {
	const syncResult = spawnSync(process.execPath, [syncScriptPath], {
		cwd: projectRoot,
		stdio: 'inherit',
	});

	if (syncResult.error || syncResult.status !== 0) {
		console.warn(`[dev-with-sync] Sync failed (${syncScriptPath}). Continuing to start dev server with current local data.`);
	}
}

const astroArgs = [astroEntry, 'dev', '--root', projectRoot, ...process.argv.slice(2)];
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
	console.error('[dev-with-sync] Failed to start Astro dev server:', error.message);
	process.exit(1);
});

astroProcess.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});