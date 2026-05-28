---
name: git-workflow
description: "Use when: committing code, creating git commits, preparing to merge, or any git operation. Covers commit message format, type/scope conventions, and the step-by-step merge process."
---

# Git 工作流

## 提交约定

每个独立逻辑单元完成后立即提交，不攒多个不相关改动。

### 提交信息格式

```
<type>(<scope>): <描述>
```

### type 可选值

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 |
| `chore` | 构建、依赖、配置 |
| `style` | 样式调整 |
| `refactor` | 重构 |
| `content` | 内容（博客文章、数据文件） |

### scope 可选值

| scope | 对应目录 |
|-------|---------|
| `content` | `src/content/` |
| `components` | `src/components/` |
| `layouts` | `src/layouts/` |
| `pages` | `src/pages/` |
| `styles` | `src/styles/` |
| `config` | 配置文件 |

### 示例

```bash
git add -A
git commit -m "feat(content): 新增 KMP 算法笔记"
git commit -m "fix(style): 修复 Footer 暗色模式适配"
git commit -m "chore(deps): 升级 Astro 到 5.x"
```


