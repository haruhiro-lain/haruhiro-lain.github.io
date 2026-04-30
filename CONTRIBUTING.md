# Contributing

感谢贡献！本仓库是一个单项目 Astro 博客。

## 环境要求

- Node.js >= 22.12.0

## 本地开发

```bash
npm install
npm run dev
```

## 提交前检查

```bash
npm run build
```

## 内容新增规范

- 内容文件放在 `src/content/*` 子目录下（`md`/`mdx`）。
- frontmatter 字段参考 `src/content.config.ts`：
  - `title`
  - `description`
  - `pubDate`
  - `updatedDate`（可选）
  - `heroImage`（可选）
  - `tags`（可选）

## 代码修改建议

- 保持改动聚焦，避免无关重命名和格式化噪音。
- 新增页面请放在 `src/pages`，不要放到 `src/content`。
- 如果变更会影响路由或内容渲染，请在 PR 描述中说明影响范围。
