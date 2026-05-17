---
name: git-workflow
description: "Use when: committing code, creating git commits, preparing to merge, or any git operation. Covers commit message format, branch workflow (beta → squash merge to main), type/scope conventions, and the step-by-step merge process."
---

# Git 分支工作流

## 分支策略

Agent 所有修改均在 `beta` 分支上进行，**禁止直接操作 main**。

- **SessionStart Hook**：每次新会话自动从 `main` 强制重建 `beta`
- **PreToolUse Hook**：每次工具调用前检查当前分支，若不在 `beta` 则自动切换

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

## 合并流程（由用户手动执行）

确认 beta 分支无误后：

```bash
git checkout main
git merge --squash beta
git commit -m "feat: <会话改动摘要>"
git push origin main
```

> 旧 beta 会被备份到 `archive/beta-时间戳` 标签，误操作时可从中恢复。SessionStart Hook 自动完成备份 + 重建，无需手动操作。
