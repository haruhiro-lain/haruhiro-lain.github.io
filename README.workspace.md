# Astro 博客项目工作区

[![Astro](https://img.shields.io/badge/Astro-6.1.5-FF5D01)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

这是一个基于 Astro 框架构建的现代化个人博客网站项目工作区，专注于提供优秀的开发体验和内容创作体验。

## ✨ 项目特色

- 🚀 **高性能**: 基于 Astro 的静态站点生成，优秀的 Lighthouse 评分
- 📝 **内容丰富**: 支持 Markdown、MDX，包含博客、算法、面试、生活、项目等多类内容
- 🎨 **现代化设计**: 使用 Tailwind CSS，支持自定义主题和响应式设计
- 🔧 **开发友好**: 完整的 TypeScript 支持，现代化的开发工具链
- 📱 **SEO 优化**: 内置 SEO 优化，RSS 订阅源，站点地图支持
- 🛠️ **代码质量**: 集成 ESLint、Biome、Prettier、Knip 等质量工具

## 📁 工作区结构

```
Astro/
├── init.ps1                    # PowerShell 初始化脚本
│                                 # 自动克隆项目、安装依赖、设置环境
└── Astro-Blog/                 # 主项目目录
    ├── public/                 # 静态资源 (图片、字体等)
    ├── src/
    │   ├── assets/            # 资源文件
    │   ├── components/        # 可复用组件
    │   ├── content/           # 内容集合
    │   │   ├── blog/         # 博客文章
    │   │   ├── algorithms/   # 算法相关
    │   │   ├── interview/    # 面试经验
    │   │   ├── life/         # 生活随笔
    │   │   └── projects/     # 项目展示
    │   ├── layouts/          # 页面布局
    │   ├── pages/            # 路由页面
    │   └── styles/           # 全局样式
    ├── astro.config.mjs      # Astro 主配置
    ├── biome.jsonc           # Biome 格式化和检查配置
    ├── eslint.config.js      # ESLint 代码检查配置
    ├── knip.js              # 依赖分析配置
    ├── package.json         # 项目依赖和脚本
    ├── pnpm-workspace.yaml  # pnpm 工作区配置
    ├── prettier.config.mjs  # Prettier 格式化配置
    ├── tsconfig.json        # TypeScript 配置
    ├── turbo.json           # Turbo 构建缓存配置
    └── README.md            # 详细项目文档
```

## 🖥️ 环境要求

- **Node.js**: >= 22.12.0
- **包管理器**: pnpm (推荐) 或 npm
- **操作系统**: Windows 10+、macOS、Linux
- **Git**: 用于版本控制

## 🚀 快速开始

### 方法一：使用初始化脚本（推荐）

```bash
# 在 PowerShell 中运行初始化脚本
./init.ps1
```

脚本将自动：
- 检查环境依赖
- 安装项目依赖
- 设置开发环境
- 启动开发服务器

### 方法二：手动设置

1. **克隆项目**（如果还没有）：
```bash
git clone <repository-url>
cd Astro
```

2. **进入项目目录**：
```bash
cd Astro-Blog
```

3. **安装依赖**：
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

4. **启动开发服务器**：
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

5. **访问网站**：
打开浏览器访问 `http://localhost:4321`

## 🛠️ 开发工作流

### 常用命令

```bash
# 开发
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览构建结果

# 代码质量
pnpm lint         # 代码检查
pnpm format       # 代码格式化
pnpm astro check  # Astro 代码检查

# 内容管理
pnpm astro sync   # 同步内容集合类型
```

### 内容创作

在 `src/content/` 目录下创建相应的 Markdown 或 MDX 文件：

- `blog/` - 博客文章
- `algorithms/` - 算法学习笔记
- `interview/` - 面试经验分享
- `life/` - 生活随笔
- `projects/` - 项目展示

## 📝 写作指南

### 1. 准备工作

#### 选择内容类型
根据文章主题选择合适的目录：
- **blog**: 技术博客、教程、经验分享
- **algorithms**: 算法题解、数据结构学习
- **interview**: 面试题解析、八股文整理
- **life**: 生活随笔、个人感悟
- **projects**: 项目总结、技术方案

#### 准备图片资源
- 将图片放在 `src/assets/` 目录下
- 支持格式：JPG、PNG、WebP、SVG
- 建议尺寸：封面图 1020x510px，文中图片按需调整

### 2. 创建文章文件

#### 文件命名规则
```bash
# 推荐格式：kebab-case + .md
my-awesome-article.md
algorithm-two-sum.md
interview-javascript-basics.md
```

#### 文件位置
```bash
src/content/
├── blog/
│   ├── my-awesome-article.md
│   └── another-post.md
├── algorithms/
│   └── algorithm-two-sum.md
└── ...
```

### 3. 编写 Frontmatter

在文件顶部添加 YAML frontmatter：

```yaml
---
title: '文章标题'
description: '简短的文章描述，用于 SEO 和预览'
pubDate: '2026-04-11'
updatedDate: '2026-04-11'  # 可选，更新日期
heroImage: '../../assets/your-image.jpg'  # 可选，封面图片
tags: ['标签1', '标签2', '标签3']  # 可选，文章标签
---
```

**字段说明：**
- `title`: 文章标题（必填）
- `description`: 描述，用于 SEO（必填）
- `pubDate`: 发布时间，格式：YYYY-MM-DD（必填）
- `updatedDate`: 更新时间（可选）
- `heroImage`: 封面图片路径，相对于 content 目录（可选）
- `tags`: 标签数组，用于分类（可选）

### 4. 编写 Markdown 内容

#### 基本语法


```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体** *斜体* ~~删除线~~

> 引用块
> 支持多行

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

[链接文本](URL)
![图片描述](../../assets/image.jpg)

`行内代码`
```

#### 代码块

````markdown
```javascript
// JavaScript 代码块
function hello() {
    console.log('Hello, World!');
}
```

```python
# Python 代码块
def hello():
    print("Hello, World!")
```
````

#### 表格

```markdown
| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 数据1  | 数据2  | 数据3 |
```

#### 任务列表

```markdown
- [x] 已完成任务
- [ ] 待完成任务
- [x] 另一个已完成任务
```

### 5. MDX 高级特性

如果使用 `.mdx` 文件，可以嵌入 React 组件：

```jsx
---
title: '使用 MDX 的文章'
description: '展示 MDX 功能'
pubDate: '2026-04-11'
---

import { CodeBlock } from '../components/CodeBlock';

# MDX 文章示例

<CodeBlock language="javascript">
{`console.log('Hello from MDX!');`}
</CodeBlock>

<Alert type="info">
  这是一个自定义组件！
</Alert>
```

### 6. 图片和资源管理

#### 图片引用
```markdown
<!-- 相对路径 -->
![图片描述](../../assets/my-image.jpg)

<!-- 绝对路径（不推荐） -->
![图片描述](/assets/my-image.jpg)
```

#### 图片优化
Astro 会自动优化图片：
- 转换为 WebP 格式
- 生成响应式图片
- 懒加载支持

### 7. 内容集合配置

#### Schema 定义
在 `src/content.config.ts` 中定义内容结构：

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
});

export const collections = {
    'blog': defineCollection({
        loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
        schema: blogSchema,
    }),
};
```

#### 类型生成
运行以下命令生成 TypeScript 类型：

```bash
pnpm astro sync
```

### 8. 构建和预览

#### 本地预览
```bash
pnpm dev
```
访问 `http://localhost:4321` 查看效果

#### 构建检查
```bash
pnpm build
pnpm preview
```

#### 常见问题排查
- **图片不显示**: 检查路径是否正确
- **类型错误**: 运行 `pnpm astro sync`
- **构建失败**: 检查 frontmatter 格式

### 9. 部署发布

#### 自动部署
推送到主分支后自动部署（如果配置了 CI/CD）

#### 手动部署
```bash
pnpm build
# 将 dist/ 目录部署到服务器
```

### 10. 最佳实践

#### 内容规范
- 使用有意义的标题和描述
- 添加适当的标签便于分类
- 保持文章结构清晰

#### SEO 优化
- 填写完整的 frontmatter
- 使用语义化的 HTML 结构
- 添加 alt 文本到图片

#### 性能优化
- 合理使用图片大小
- 避免过长的单页文章
- 使用懒加载和代码分割

#### 写作工具
- **VS Code**: 推荐的编辑器
- **Markdown Preview**: 实时预览
- **Prettier**: 自动格式化
- **Grammarly**: 语法检查

### 示例文章

查看 `src/content/` 目录下的示例文章，了解完整的写作格式和结构。

---

*更多详细信息请参考 [Astro 内容集合文档](https://docs.astro.build/en/guides/content-collections/)*

### 组件开发

在 `src/components/` 目录下创建 `.astro` 组件文件，支持：
- Astro 组件语法
- TypeScript 类型检查
- 响应式设计
- 现代 CSS

## 📖 详细文档

📚 **[完整项目文档](Astro-Blog/README.md)** 包含：
- 配置文件详细说明
- 常见错误及解决方案
- 部署指南
- 贡献规范

## 🛠️ 技术栈

### 核心框架
- **[Astro 6.1.5](https://astro.build/)** - 静态站点生成框架
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - 类型安全的 JavaScript

### 前端开发
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Vite](https://vitejs.dev/)** - 快速的构建工具

### 包管理和构建
- **[pnpm](https://pnpm.io/)** - 高效的包管理器
- **[Turbo](https://turbo.build/)** - 构建缓存和任务编排

### 代码质量工具
- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript 代码检查
- **[Biome](https://biomejs.dev/)** - 快速的格式化和检查工具
- **[Prettier](https://prettier.io/)** - 代码格式化
- **[Knip](https://github.com/webpro/knip)** - 依赖分析和未使用代码检测

### 内容处理
- **[MDX](https://mdxjs.com/)** - Markdown + JSX
- **[Sharp](https://sharp.pixelplumbing.com/)** - 图像处理
- **[RSS](https://github.com/jpmonette/feed)** - RSS 订阅源生成

## 🔧 配置说明

项目包含完整的配置文件中文注释：

- `astro.config.mjs` - Astro 主配置（站点信息、集成、字体等）
- `package.json` - 项目依赖和脚本
- TypeScript 配置系列 - 类型检查配置
- 代码质量工具配置 - ESLint、Biome、Prettier、Knip

## 🚀 部署选项

- **Vercel** - 推荐，自动部署
- **Netlify** - 静态站点托管
- **GitHub Pages** - 免费静态托管
- **Cloudflare Pages** - 全球 CDN
- **自托管** - 任何支持静态文件的服务器

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 编写新代码
- 遵循现有的代码风格和命名约定
- 添加适当的类型定义和注释
- 运行 `pnpm lint` 和 `pnpm format` 检查代码
- 更新相关文档

## 📞 联系方式

- **项目主页**: [GitHub Repository]
- **问题反馈**: [Issues](https://github.com/username/repo/issues)
- **讨论交流**: [Discussions](https://github.com/username/repo/discussions)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

⭐ 如果这个项目对你有帮助，请给它一个星标！