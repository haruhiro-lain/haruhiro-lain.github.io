// @ts-check

// 导入必要的Astro集成和配置函数
import mdx from '@astrojs/mdx';           // MDX集成，支持在Markdown中使用JSX
import sitemap from '@astrojs/sitemap';   // 自动生成网站地图
import { defineConfig, fontProviders } from 'astro/config'; // Astro配置API

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

    // 关闭开发工具栏（Dev Toolbar）
    devToolbar: {
        enabled: false,
    },

  // 集成配置：启用MDX和sitemap功能
  integrations: [mdx(), sitemap()],

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