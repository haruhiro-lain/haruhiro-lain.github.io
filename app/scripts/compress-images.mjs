/**
 * 构建前自动压缩 src/ 下所有 > 300KB 的图片（原地覆盖）。
 * 通过缓存文件 mtime+size 避免重复压缩未变化的图片。
 */
import { readdir, stat, rename, unlink, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');
const CACHE_DIR = join(__dirname, '..', '..', 'cache', 'compress');
const CACHE_FILE = join(CACHE_DIR, 'compress-images.json');
const MIN_SIZE = 300 * 1024; // 300KB

async function loadCache() {
  try {
    const raw = await readFile(CACHE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

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
  const cache = await loadCache();
  const largeImages = [];
  let skipped = 0;

  for await (const filePath of walk(SRC_DIR)) {
    const ext = extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    if (filePath.includes('\\dist\\') || filePath.includes('/dist/')) continue;
    const s = await stat(filePath);
    if (s.size < MIN_SIZE) continue;

    // 检查缓存：文件 mtime+size 未变则跳过
    const key = filePath;
    const cached = cache[key];
    if (cached && cached.mtimeMs === s.mtimeMs && cached.size === s.size) {
      skipped++;
      continue;
    }

    largeImages.push({ path: filePath, size: s.size, mtimeMs: s.mtimeMs });
  }

  if (largeImages.length === 0) {
    console.log(`[compress-images] All ${Object.keys(cache).length} image(s) up to date${skipped ? ` (${skipped} skipped)` : ''}.`);
    return;
  }

  console.log(`[compress-images] Found ${largeImages.length} large image(s) to compress${skipped ? ` (${skipped} skipped)` : ''}...`);
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
      // 更新缓存
      cache[img.path] = { mtimeMs: outStat.mtimeMs, size: outStat.size };
    } catch (e) {
      console.log(`  ${name}: Skipped (${e.message})`);
      try { await unlink(tmpPath); } catch {}
    }
  }

  await saveCache(cache);
  console.log('[compress-images] Done.');
}

main().catch((e) => {
	console.error('[compress-images] Error:', e.message);
	process.exit(1);
});
