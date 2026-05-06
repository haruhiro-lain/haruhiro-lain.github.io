# Astro Blog

基于 Astro 的个人博客项目，支持 Markdown/MDX 内容发布。

页面公共骨架统一收敛到 `src/layouts/PageShell.astro`，用于减少首页、聚合页和日志页的重复结构。

## 特性

- Astro 静态生成
- Markdown / MDX 内容驱动
- 多栏目内容集合（blog / projects / interview / algorithms / life）
- RSS 与 Sitemap

## 目录结构

```text
Astro-Blog/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 快速开始

```bash
npm install
npm run dev
```

开发地址：`http://localhost:4321`

## 常用命令

```bash
npm run dev       # 本地开发
npm run build     # 生产构建
npm run preview   # 预览构建结果
npm run astro     # Astro CLI
```

## 环境变量（Steam 同步）

`scripts/sync-steam.mjs` 采用以下优先级拉取数据：

1. `STEAM_WEB_API_KEY`（推荐）
2. 登录态 Cookie：`STEAM_COOKIE_STEAMLOGINSECURE`（可选 `STEAM_COOKIE_SESSIONID`）

项目已提供模板文件：`.env.example`。

### 本地配置

1. 复制模板并填写：

```bash
cp .env.example .env
```

2. 在 `.env` 中填写真实值（不要提交到仓库）。

PowerShell 临时设置示例：

```powershell
$env:STEAM_WEB_API_KEY="your_key_here"
$env:STEAM_STEAM_ID="76561199036753865"
```

### GitHub 托管建议

- 不要在代码中硬编码 key。

仅在你希望使用 Steam Web API 或登录态时，才需要在仓库 `Settings > Secrets and variables > Actions` 中配置：
	- `STEAM_WEB_API_KEY`
	- `STEAM_STEAM_ID`（可选）
	- `STEAM_COOKIE_STEAMLOGINSECURE`（仅 fallback 需要）
	- `STEAM_COOKIE_SESSIONID`（可选）

若不配置这些变量，脚本会尝试仅从 Steam 公开页面抓取可见数据。

## 部署到 GitHub Pages（私有仓库）

本仓库已包含工作流：`.github/workflows/deploy-pages.yml`。

### 1) 推送到 GitHub 私有仓库

```bash
git init
git add .
git commit -m "chore: setup github pages deployment"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
git push -u origin main
```

### 2) 打开 Pages 配置

在仓库页面进入：`Settings > Pages`

- `Source` 选择 `GitHub Actions`

### 3) （可选）配置 Actions Secrets（用于 API / 登录态）

在：`Settings > Secrets and variables > Actions > New repository secret`

- `STEAM_WEB_API_KEY`（推荐）
- `STEAM_STEAM_ID`（可选）
- `STEAM_COOKIE_STEAMLOGINSECURE`（可选，fallback）
- `STEAM_COOKIE_SESSIONID`（可选）

若你只使用公开页面抓取，可以跳过这一步，直接部署。

### 4) 触发部署

每次 push 到 `main` 都会自动部署；也可在 `Actions` 页手动运行 `Deploy to GitHub Pages`。

> 说明：GitHub Pages 使用私有仓库通常需要可用的付费方案（如 GitHub Pro / Team / Enterprise）。

## 内容规范

内容 schema 定义在 `src/content.config.ts`。

必填字段：

- `title`
- `description`
- `pubDate`

可选字段：

- `updatedDate`
- `heroImage`
- `tags`

## 注意事项

- `src/content` 只放内容文件（`md/mdx`）。
- 页面路由统一放在 `src/pages`。
- 改动后建议执行一次 `npm run build` 验证。
