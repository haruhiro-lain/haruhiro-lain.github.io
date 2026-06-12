// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import { defineConfig, fontProviders } from 'astro/config';

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