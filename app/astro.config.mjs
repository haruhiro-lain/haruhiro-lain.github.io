// @ts-check

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import { defineConfig, fontProviders } from 'astro/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
// 项目根目录下的外部缓存目录（app 外，存放启动时同步脚本维护的数据）
const CACHE_STEAM_DIR = resolve(__dirname, '../cache/steam-cache');

const copyDir = (src, dest) => {
	if (!existsSync(src)) return;
	mkdirSync(dest, { recursive: true });
	for (const entry of readdirSync(src)) {
		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		if (statSync(srcPath).isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			copyFileSync(srcPath, destPath);
		}
	}
};

// 将根目录 cache/steam-cache 作为 /steam-cache/* 静态资源提供：
//  - 开发服务器通过中间件直接读取
//  - 构建完成后复制到 dist/steam-cache
const steamCachePlugin = {
	name: 'external-steam-cache',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			const urlPath = (req.url ?? '').split('?')[0];
			if (!urlPath.startsWith('/steam-cache/')) {
				return next();
			}
			const relative = urlPath.slice('/steam-cache/'.length);
			const filePath = resolve(CACHE_STEAM_DIR, relative);
			// 安全校验：确保解析后的路径仍位于缓存目录内
			if (!filePath.startsWith(CACHE_STEAM_DIR) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
				res.statusCode = 404;
				res.end('Not Found');
				return;
			}
			const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
			const mimeTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp', avif: 'image/avif' };
			res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream');
			res.end(readFileSync(filePath));
		});
	},
	closeBundle() {
		copyDir(CACHE_STEAM_DIR, resolve(__dirname, 'dist/steam-cache'));
	},
};

const [githubOwner = '', githubRepo = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSiteRepo = githubOwner && githubRepo === `${githubOwner}.github.io`;
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

const site =
    process.env.SITE_URL ||
    (githubOwner ? `https://${githubOwner}.github.io` : 'https://example.com');

const base =
    isGitHubActions && githubOwner && githubRepo && !isUserSiteRepo
        ? `/${githubRepo}`
        : '/';

// https://astro.build/config
export default defineConfig({
  // 网站基础URL，用于生成sitemap和RSS等
  site,
    base,

    // 开发服务器配置：4321 落在 Windows 保留端口范围(4278-4377)，改用 3000
    server: {
        host: '127.0.0.1',
        port: 3000,
    },

    // 关闭开发工具栏（Dev Toolbar）
    devToolbar: {
        enabled: false,
    },

  // 集成配置：启用MDX和sitemap功能
  integrations: [mdx(), sitemap(), vue()],

  // 图片优化：所有图片构建时自动压缩为 WebP
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // 允许处理超大图片
      },
    },
  },
  vite: {
    plugins: [steamCachePlugin],
    optimizeDeps: {
      include: ['mermaid'],
    },
  },

  // 字体配置
  fonts: [
      {
          // 霞鹜文楷：全局默认字体（本地）
          provider: fontProviders.local(),
          name: 'LXGW WenKai',
          cssVariable: '--font-wenkai',
          fallbacks: ['KaiTi', 'STKaiti', 'serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/LXGWWenKai-Regular.ttf'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/LXGWWenKai-Medium.ttf'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
      {
          // ZCOOL 青科黄油字：life 分区专用（本地）
          provider: fontProviders.local(),
          name: 'ZCOOL QingKe HuangYou',
          cssVariable: '--font-zcool',
          fallbacks: ['KaiTi', 'STKaiti', 'serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/ZCOOLQingKeHuangYou-Regular.ttf'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
	],
});