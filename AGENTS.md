# AGENTS 指南

本仓库是一个**单项目 Astro 博客站点**（非 monorepo）。

## 工作边界

- 页面路由：`src/pages/`
- 内容数据：`src/content/`（只放 `md/mdx` 内容，不放 `.astro` 路由）
- 组件：`src/components/`
- 布局：`src/layouts/`

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 修改约定

- 优先做最小改动，避免无关重构。
- 修改后至少执行一次 `npm run build` 验证。
- 新增内容请补齐 frontmatter，字段需符合 `src/content.config.ts`。
- 文章引用的图片放到 `src/content/{collection}/assets/{文章slug}/` 下，heroImage 用相对路径 `./assets/{文章slug}/{文件名}`。


