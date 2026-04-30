# Astro-Blog 手动配置与写作指南

> 目标：这份文档用于日常手动维护博客，包括基础配置、导航修改、写文章发布和常见排错。

---

## 1. 快速开始

```bash
npm install
npm run dev
```

本地预览地址：`http://localhost:4321`

常用命令：

```bash
npm run dev       # 本地开发
npm run build     # 生产构建（推荐每次改动后执行）
npm run preview   # 预览构建产物
```

---

## 2. 你最常改的配置文件

## 2.1 站点标题与描述

文件：`src/consts.ts`

```ts
export const SITE_TITLE = 'Haruhiro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';
```

说明：
- `SITE_TITLE` 会影响站点头部标题显示。
- `SITE_DESCRIPTION` 用于页面描述（SEO）。

---

## 2.2 站点 URL（sitemap/RSS 必需）

文件：`astro.config.mjs`

```js
site: 'https://example.com'
```

说明：
- 发布前务必改成你的真实域名。
- 这个值影响 `sitemap` 和 `rss` 里的绝对链接。

---

## 2.3 导航菜单（首页左侧）

文件：`src/components/Header.astro`

你可以在这里修改：
- 顶部链接文字（如“笔记/杂谈/日志/关于”）
- 子菜单入口（如“题解/实验室/八股”）
- 社交链接（目前是 GitHub）

提示：
- 新增栏目时，建议先保证存在对应路由页面，再加导航链接。

---

## 2.4 全站视觉样式

文件：`src/styles/global.css`

可改内容：
- 颜色变量（`:root` 与 `:root[data-theme='light']`）
- 版心/排版（如 `main`、标题字号）
- 布局外壳类（`.page-shell*`）
- 卡片网格类（`.entry-grid*`、`.entry-card*`）

说明：
- 项目已经把常用布局样式抽到全局，后续优先在这里改，避免分散在页面内联样式中。

---

## 3. 内容系统说明（写博客前必看）

文件：`src/content.config.ts`

当前已启用的集合（栏目）：
- `blog`
- `algorithms`
- `projects`
- `interview`
- `life`

对应内容目录：
- `src/content/blog`
- `src/content/algorithms`
- `src/content/projects`
- `src/content/interview`
- `src/content/life`

### 3.1 Frontmatter 字段规范

所有集合共用同一套 schema，字段如下：

必填：
- `title: string`
- `description: string`
- `pubDate: date`

可选：
- `updatedDate: date`
- `heroImage: image`
- `tags: string[]`

示例：

```md
---
title: "Astro 入门笔记"
description: "记录 Astro 博客从 0 到 1 的配置过程"
pubDate: 2026-04-17
updatedDate: 2026-04-18
heroImage: ../../assets/blog-placeholder-1.jpg
tags: ["Astro", "Blog", "前端"]
---

正文内容写在这里。
```

注意：
- 日期建议用 `YYYY-MM-DD`。
- `heroImage` 路径要确保文件真实存在。

---

## 4. 发布一篇新文章（标准流程）

以发布 blog 文章为例：

1. 在 `src/content/blog/` 新建文件，例如：`my-new-post.md`
2. 按 schema 补齐 frontmatter
3. 编写正文（Markdown 或 MDX）
4. 运行构建检查：

```bash
npm run build
```

5. 本地确认访问路径：
- `/blog/my-new-post/`

### 其他栏目的访问路径

- `src/content/algorithms/*.md` → `/algorithms/<slug>/`
- `src/content/projects/*.md` → `/projects/<slug>/`
- `src/content/interview/*.md` → `/interview/<slug>/`
- `src/content/life/*.md` → `/life/<slug>/`

其中 `<slug>` 默认来自文件名。

---

## 5. 新增一个栏目（进阶）

如果你要新增例如 `reading` 栏目，步骤如下：

1. 新建内容目录：
- `src/content/reading/`

2. 在 `src/content.config.ts` 的 `collections` 中增加 `reading` 配置（复用 `baseSchema`）

3. 新建列表页和详情页路由：
- `src/pages/reading/index.astro`
- `src/pages/reading/[...slug].astro`

4. 在 `src/components/Header.astro` 增加导航入口

5. 运行 `npm run build` 验证

---

## 6. 常见问题与排错

## 6.1 构建时报 schema 错误

现象：提示某篇文章字段缺失或类型不对。

处理：
- 检查 frontmatter 是否缺 `title/description/pubDate`
- 检查 `tags` 是否是数组格式
- 检查日期格式是否可被解析

## 6.2 图片不显示

处理：
- 检查 `heroImage` 路径是否正确
- 检查图片文件是否实际存在
- 重新执行 `npm run build` 看是否有静态资源报错

## 6.3 导航点了 404

处理：
- 检查 `Header.astro` 中链接路径
- 检查对应 `src/pages/...` 路由文件是否存在

---

## 7. 日常维护建议

- 每次改配置或内容后，至少执行一次 `npm run build`。
- 文章优先写在 `src/content`，不要把内容散落到 `src/pages`。
- 样式优先改 `src/styles/global.css`，尽量减少页面局部重复样式。
- 发布前检查 `astro.config.mjs` 的 `site` 是否为正式域名。

---

如果你希望，我可以继续给这份手册补一版“复制即用模板集”（如：
- 文章模板
- 项目复盘模板
- 算法题解模板
- 面试八股模板）方便你新建文件时直接套用。

```markdown
当前项目分层是清晰的：内容在 src/content，路由在 src/pages，布局在 src/layouts，组件在 src/components。
主要冗余集中在两类：多栏目页面重复的“取集合并按日期排序”，以及 5 个动态详情页重复的“getStaticPaths 映射逻辑”。
```