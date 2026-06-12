/**
 * 构建前自动压缩 src/ 下所有 > 300KB 的图片（原地覆盖）。
 * 每次构建都会检查并压缩，保证图片始终最优。
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');
const MIN_SIZE = 300 * 1024; // 300KB

async function* walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
			yield* walk(full);
		} else if (entry.isFile()) {
			yield full;
		}
	}
}

async function main() {
	const largeImages = [];
	for await (const filePath of walk(SRC_DIR)) {
		const ext = extname(filePath).toLowerCase();
		if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
		if (filePath.includes('\\dist\\') || filePath.includes('/dist/')) continue;
		const s = await stat(filePath);
		if (s.size < MIN_SIZE) continue;
		largeImages.push({ path: filePath, size: s.size });
	}

	if (largeImages.length === 0) {
		console.log('[compress-images] Nothing to compress.');
		return;
	}

	console.log(`[compress-images] Found ${largeImages.length} large images, compressing...`);
	for (const img of largeImages) {
		const name = basename(img.path);
		const tmpPath = img.path + '.tmp';
		try {
			await sharp(img.path)
				.resize({ width: 1920, withoutEnlargement: true })
				.jpeg({ quality: 80, mozjpeg: true })
				.toFile(tmpPath);
			const bakPath = img.path + '.bak';
			await rename(img.path, bakPath);
			await rename(tmpPath, img.path);
			await unlink(bakPath);
			const outStat = await stat(img.path);
			const ratio = ((1 - outStat.size / img.size) * 100).toFixed(0);
			console.log(`  ${name}: ${(img.size / 1024).toFixed(0)}KB -> ${(outStat.size / 1024).toFixed(0)}KB (${ratio}%)`);
		} catch (e) {
			console.log(`  ${name}: Skipped (${e.message})`);
			try { await unlink(tmpPath); } catch {}
		}
	}
	console.log('[compress-images] Done.');
}

main().catch((e) => {
	console.error('[compress-images] Error:', e.message);
	process.exit(1);
});
