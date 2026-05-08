#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { openSync, closeSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const lockFilePath = resolve(projectRoot, '.dev-with-sync.lock');
const syncScriptPaths = [
	resolve(__dirname, 'sync-hpoi.mjs'),
	resolve(__dirname, 'sync-steam.mjs'),
	resolve(__dirname, 'sync-github-avatar.mjs'),
];
const astroEntry = resolve(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');

const isPidAlive = (pid) => {
	if (!Number.isInteger(pid) || pid <= 0) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
};

const acquireLock = () => {
	const writeLock = () => {
		const fd = openSync(lockFilePath, 'wx');
		closeSync(fd);
		writeFileSync(lockFilePath, String(process.pid), 'utf-8');
	};

	try {
		writeLock();
		return true;
	} catch (error) {
		if (error?.code !== 'EEXIST') throw error;
		const existingPid = Number.parseInt(readFileSync(lockFilePath, 'utf-8').trim(), 10);
		if (isPidAlive(existingPid)) {
			console.warn(`[dev-with-sync] Another instance is already running (PID: ${existingPid}). Startup canceled.`);
			return false;
		}

		try {
			unlinkSync(lockFilePath);
			writeLock();
			return true;
		} catch {
			console.warn('[dev-with-sync] Failed to acquire startup lock. Please retry in a moment.');
			return false;
		}
	}
};

const releaseLock = () => {
	try {
		unlinkSync(lockFilePath);
	} catch {
		// ignore
	}
};

if (!acquireLock()) {
	process.exit(1);
}

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
		releaseLock();
	});
});

astroProcess.on('error', (error) => {
	console.error('[dev-with-sync] Failed to start Astro dev server:', error.message);
	releaseLock();
	process.exit(1);
});

astroProcess.on('exit', (code, signal) => {
	releaseLock();
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});