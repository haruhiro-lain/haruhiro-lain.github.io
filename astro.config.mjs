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

  // Vite 配置：修复 mermaid 在 dev 模式下的 dayjs ESM 兼容性问题
  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
  },

  // 字体配置：定义本地字体
  fonts: [
      {
          // 使用本地字体提供商
          provider: fontProviders.local(),
          // 字体名称
          name: 'Atkinson',
          // CSS变量名，用于在样式中引用
          cssVariable: '--font-atkinson',
          // 后备字体
          fallbacks: ['sans-serif'],
          // 字体变体配置
          options: {
              variants: [
                  {
                      // 常规字重字体文件路径
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      // 字体粗细
                      weight: 400,
                      // 字体样式
                      style: 'normal',
                      // 显示策略
                      display: 'swap',
                  },
                  {
                      // 粗体字重字体文件路径
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      // 字体粗细
                      weight: 700,
                      // 字体样式
                      style: 'normal',
                      // 显示策略
                      display: 'swap',
                  },
              ],
          },
      },
	],
});