---
title: 'GitHub Copilot Agent 规范化配置'
description: '配置 Hooks → AGENTS.md → Skills 三级限制，让 AI Agent 可追溯地在隔离分支上工作'
pubDate: '2026-05-17'
updatedDate: '2026-05-25'
heroImage: './assets/2026--05--17_copilot-agent-config/agent-three-tier.png'
tags: ['Copilot', 'Agent', 'Git', '开发规范', 'AI']
---

# GitHub Copilot Agent 规范化配置

## 前言

GitHub Copilot 的 Agent 模式能直接编辑文件、执行命令，极大提升效率，但也带来了两个核心问题：

1. **安全**：Agent 可能误操作主分支、执行危险命令
2. **可追溯**：Agent 的修改难以排查和回滚

本文基于 Hooks → AGENTS.md → Skills 三级规范结构，构建一套**泛用、安全、可审查**的 Agent 工作流。

---

## 三级结构总览

```mermaid
flowchart TD
    subgraph ALWAYS["🟢 每次对话必读（精简）"]
        AGENTS["📄 AGENTS.md"]
        A1["项目概览"]
        A2["目录职责"]
        A3["常用命令"]
        A4["安全约束"]
        A5["核心约定"]
        A6["Skill 引用"]
        AGENTS --> A1
        AGENTS --> A2
        AGENTS --> A3
        AGENTS --> A4
        AGENTS --> A5
        AGENTS --> A6
    end

    subgraph ONDEMAND["🟡 需要时才读（详情）"]
        SKILLS["📂 Skills/*"]
        S1["git-workflow"]
        S2["...按需扩展"]
        SKILLS --> S1
        SKILLS --> S2
    end

    subgraph LIFECYCLE["🔵 生命周期自动触发"]
        HOOKS["⚡ Hooks/*"]
        H1["SessionStart → 切分支"]
        H2["PreToolUse → 分支守护"]
        H3["PostToolUse → 自动暂存"]
        HOOKS --> H1
        HOOKS --> H2
        HOOKS --> H3
    end

    A6 -.->|"按需加载"| SKILLS
    HOOKS -.->|"确定性强执"| AGENTS
```

| 层级 | 文件 | 加载时机 | 设计意图 |
|------|------|---------|---------|
| **AGENTS.md** | 根目录 | 每次对话必读 | 核心约定 + 安全底线，始终在上下文中 |
| **Hooks** | `.github/hooks/*.json` | 生命周期事件触发 | 确定性执行——切分支、阻断危险操作 |
| **Skills** | `.github/skills/<name>/SKILL.md` | 按需加载 | 详细信息，不占日常上下文 |

---

## 第一层：AGENTS.md — 核心约束

`AGENTS.md` 放在仓库根目录，Copilot **无条件自动读取**，每次对话都会注入到 system prompt。因此内容必须短小精悍，**控制在 30 行以内**以避免占用上下文空间

### 模板

```markdown
# AGENTS 指南

{项目简介}

## 工作边界
- {目录A}：{用途}
- {目录B}：{用途}

## 常用命令
{install / dev / build / test}

## 修改约定
- 优先做最小改动，避免无关重构
- {项目特定高频规则}

## 安全约束
- **禁止**直接操作主分支（push / merge / rebase）
- **禁止**执行 rm -rf / git reset --hard / git clean -fdx
- **禁止**修改 .github/hooks/ 下的钩子配置
- 涉及环境变量、密钥的操作需先确认

## 协作规范
- 分支策略：Agent 在 beta 分支工作
- 提交规范：详见 git-workflow Skill
```

### 核心原则

- **最小化**：只放每次对话都需要的规则
- **链接不内嵌**：详细内容放到 Skill 中引用
- **安全第一**：危险操作清单始终保持可见

---

## 第二层：Hooks — 强制性执行

`AGENTS.md`本质还是在调用大模型时预输入一部分文本，无法防止ai幻觉产生的误操作

`Hooks` 是 **shell 命令**，在 Agent 生命周期的特定事件触发，执行结果具有确定性——可以做 Agent "建议"做不到的事。

**以当前项目的 Hooks 配置为例：**

### 钩子 1：会话启动自动切分支

**文件**：`.github/hooks/agent-branch.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "git checkout beta 2>$null; if ($LASTEXITCODE -ne 0) { git checkout -b beta main }",
        "timeout": 15
      }
    ],
    "PreToolUse": [
      {
        "type": "command",
        "command": "$branch = git branch --show-current 2>$null; if ($branch -ne 'beta') { git checkout beta 2>$null; Write-Host '[hook] switched to beta' }",
        "timeout": 5
      }
    ],
    "PostToolUse": [
      {
        "type": "command",
        "command": "git add -A 2>$null",
        "timeout": 5
      }
    ]
  }
}
```

**行为**：

| Hook | 触发时机 | 行为 |
|------|---------|------|
| `SessionStart` | 新对话开始 | 切换到 `beta`；若不存在则从 `main` 创建 |
| `PreToolUse` | 每次工具调用前 | 检查当前分支，若不在 `beta` 则自动切回 |
| `PostToolUse` | 每次工具调用后 | `git add -A` 自动暂存所有变更，**不提交**——由 Agent 决定何时按规范提交 |

> ⚠️ PostToolUse 曾配置为自动 `git commit -m "chore(auto): agent modification"`，导致每次工具调用都生成无意义提交。现已改为仅暂存，Agent 在逻辑单元完成时手动执行有意义的 commit。

### 钩子 2：阻断推送到主分支（可选）

Guard hook 用于拦截 `git push` 指向 `main`/`master` 的操作，可通过 `PreToolUse` 检测命令内容实现。本项目当前未启用，按需添加即可。

### 可用事件一览

| 事件 | 触发时机 |
|------|---------|
| `SessionStart` | 新对话开始 |
| `UserPromptSubmit` | 用户发送消息 |
| `PreToolUse` | 工具调用前 |
| `PostToolUse` | 工具调用后 |
| `Stop` | 会话结束 |

---

## 第三层：Skills — 按需加载

Skills 的核心价值是**不占日常上下文**。只有当 Agent 检测到需要时（通过 `description` 字段匹配），才加载 Skill 文件。

### Skill 示例：Git 工作流

**文件**：`.github/skills/git-workflow/SKILL.md`

```yaml
---
name: git-workflow
description: "Use when: committing code, creating git commits,
  preparing to merge. Covers commit format, branch workflow,
  type/scope conventions."
---

# Git 工作流

## 分支策略
Agent 所有修改均在 `beta` 分支上进行，**禁止直接操作 {主分支}**。

## 提交约定
每个独立逻辑单元完成后立即提交，不攒多个不相关改动。

### 格式
<type>(<scope>): <描述>

### type
| type | 用途 |
|------|------|
| feat | 新功能 |
| fix | 修复 |
| chore | 构建、依赖、配置 |
| style | 样式 |
| refactor | 重构 |
| content | 内容 / 文档 |

### scope（按项目调整）
按项目目录结构调整

## 合并流程（手动审查后）
git checkout {主分支}
git merge --squash beta; git commit -m "feat: <会话改动摘要>"
git push origin {主分支}
```

### description 编写要点

`description` 是 Agent 发现 Skill 的**唯一入口**：

- ✅ `"Use when: committing code, creating git commits"`
- ❌ `"Git workflow"` — 太模糊，无法匹配

---

## 完整工作流

```
main ──●────────────────────────────●──  (squash 合并后只有一个提交)
        \                          /
beta    ●── feat: A ──●── fix: B ──╳  (合并后 beta reset 到 main 同步)
```

1. **SessionStart 钩子** → 切换到 `beta`（不存在则从 `main` 创建），保留已有工作
2. **Agent 在 beta 上工作** → PostToolUse 自动 `git add -A`；Agent 在逻辑单元完成时手动 `git commit`
3. **PreToolUse 钩子** → 防止 Agent 误在 main 上操作
4. **人工审查** → 确认无误后，手动将 beta 多条提交 squash 成一条，合并到 main 并推送
5. **同步 beta** → 合并后将 beta reset 到 main：`git checkout beta && git reset --hard main`

> ⚠️ `git merge --squash beta` 会自动生成 `SQUASH_MSG` 模板。请用 `; git commit -m "..."` 一步完成，`-m` 会跳过模板。**不要**单独执行 `git commit`（无 `-m`）。

---

## Tips:

### 1. 钩子只在会话启动时触发

如果先创建钩子文件、再进行对话，钩子在**当前会话不会生效**。必须开启新对话才能触发 `SessionStart`。

### 2. Windows 兼容性

Hook 中的 shell 语法需要注意平台差异：

```bash
# Unix
git checkout beta 2>/dev/null || git checkout -b beta main

# Windows PowerShell
git checkout beta 2>$null; if ($LASTEXITCODE -ne 0) { git checkout -b beta main }
```

Hook JSON 支持 `windows` / `linux` / `osx` 字段分别指定。

### 3. PreToolUse 防止中途偏离 beta

SessionStart 只在对话开始时切一次分支。如果用户中途手动切到 main（例如合并操作），后续 Agent 修改会直接落在 main 上。

**解决**：增加 PreToolUse Hook —— 每次工具调用前检查当前分支，若不在 beta 则自动切回。

```json
"PreToolUse": [
  {
    "type": "command",
    "command": "$branch = git branch --show-current 2>$null; if ($branch -ne 'beta') { git checkout beta 2>$null; Write-Host '[hook] switched to beta' }",
    "timeout": 5
  }
]
```

### 4. beta 分支本地化，不推远端

beta 仅存在于本地，合并到 main 后只需 `git push origin main`。SessionStart 采用条件切换而非强制重建——保留已有提交，避免"孤儿提交"。

```json
"command": "git checkout beta 2>$null; if ($LASTEXITCODE -ne 0) { git checkout -b beta main }"
```

> 纯本地操作，无网络依赖，无远端标签残留。beta 的提交通过 reflog 可追溯，即使意外丢失也能恢复。

### 5. PostToolUse 仅暂存，不自动提交

自动提交（`git commit -m "chore(auto)"`）会导致每次工具调用都生成一条无意义提交，淹没真正的工作改动。改为仅 `git add -A`，交给 Agent 在逻辑单元完成时决定提交时机。

```json
"command": "git add -A 2>$null"
```

---

## 配置快照

模板已存放于 `TEMP/agent-template/`，新项目复制后替换 `{占位符}` 即可。以下是三文件当前内容：

### AGENTS.md
```markdown
# AGENTS 指南

{项目简介，一句话说明仓库类型}

## 工作边界
- {目录A}：{用途}
- {目录B}：{用途}

## 常用命令
{install / dev / build / test 等常用命令}

## 修改约定
- 优先做最小改动，避免无关重构。
- 修改后至少执行一次构建验证。
- {项目特定高频规则}

## Git 分支工作流
- Agent 修改均在 `beta` 分支上（SessionStart 钩子自动切换）。
- **每次修改文件前**，必须确认当前在 `beta` 分支；若不在，先 `git checkout beta` 再继续。
- 提交规范与合并流程详见 `git-workflow` Skill（需要时自动加载）。
```

### .github/hooks/agent-branch.json

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "git checkout beta 2>$null; if ($LASTEXITCODE -ne 0) { git checkout -b beta main }",
        "timeout": 15
      }
    ],
    "PreToolUse": [
      {
        "type": "command",
        "command": "$branch = git branch --show-current 2>$null; if ($branch -ne 'beta') { git checkout beta 2>$null; Write-Host '[hook] switched to beta' }",
        "timeout": 5
      }
    ],
    "PostToolUse": [
      {
        "type": "command",
        "command": "git add -A 2>$null",
        "timeout": 5
      }
    ]
  }
}
```

### .github/skills/git-workflow/SKILL.md

```yaml
---
name: git-workflow
description: "Use when: committing code, creating git commits,
  preparing to merge, or any git operation."
---

# Git 分支工作流

## 分支策略
Agent 所有修改均在 `beta` 分支上进行，**禁止直接操作 {主分支}**。
- SessionStart Hook：每次新会话切换到 `beta`；若 `beta` 不存在则从 `main` 创建
- PreToolUse Hook：每次工具调用前检查当前分支，若不在 beta 则自动切换
- PostToolUse Hook：每次工具调用后 `git add -A` 自动暂存，不提交
- beta 分支仅存在于本地，不推送远端

## 提交约定
### 格式
<type>(<scope>): <描述>

### type
| type | 用途 |
|------|------|
| feat | 新功能 |
| fix  | 修复 |
| chore | 构建、依赖、配置 |
| style | 样式调整 |
| refactor | 重构 |
| content | 内容 |

### scope
按项目目录结构调整。

## 合并流程（由用户手动执行）
beta 上的所有修改仅存在于本地。用户手动将 beta 多条提交 squash 成一条，合并到 main 并推送：
```bash
git checkout {主分支}
git merge --squash beta; git commit -m "feat: <会话改动摘要>"
git push origin {主分支}
git checkout beta && git reset --hard {主分支}
```

---

## 踩坑记录（2026-05-25）

### 坑 1：SessionStart 强制重建导致"孤儿提交"

**现象**：在 beta 上工作了多轮对话，积累若干提交。某次切换分支后再切回，发现所有 beta 提交消失。

**根因**：旧版 SessionStart 执行 `git checkout main; git branch -D beta; git checkout -b beta main`，每次新会话都**强制删除** beta 并从 main 重建。

**恢复**：提交并未真正丢失，通过 `git reflog` 可找到孤儿提交的 SHA，用 `git cherry-pick -n` 批量暂存后重新提交：

```bash
git reflog                          # 找到孤儿提交 SHA
git cherry-pick -n <sha1> <sha2>...  # 批量暂存（不自动提交）
git commit -m "周掸（2025/0525）"     # 压缩为一条
```

**修复**：SessionStart 改为条件切换 —— beta 存在则复用，不存在才创建。

### 坑 2：PostToolUse 自动提交淹没工作记录

**现象**：beta 分支上出现大量 `chore(auto): agent modification` 提交，真正的改动被淹没在噪音中。

**根因**：PostToolUse 配置为 `git add -A; git commit -m "chore(auto): agent modification"`，每次工具调用后无条件提交。

**修复**：移除自动提交，仅保留 `git add -A` 暂存。Agent 在逻辑单元完成时手动按 `type(scope): 描述` 格式提交。

### 坑 3：beta 和 main 的分叉与同步

**现象**：beta 合并到 main 后，两个分支指向不同提交，继续在 beta 上工作会基于旧提交产生分叉。

**解决**：合并后立即同步 beta 到 main：

```bash
git checkout main
git merge --squash beta; git commit -m "feat: <摘要>"
git push origin main
git checkout beta
git reset --hard main      # 同步 beta 到 main 最新位置
```

> 核心原则：**永远 beta → main 单向合并**，合并后 beta 紧跟 main。

---

## 泛用模板

本文的所有配置已整理为项目无关的模板，新项目只需：

1. 复制 `.github/` 和 `AGENTS.md` 到目标仓库
2. 修改所有 `{占位符}` 为实际值
3. 提交，下次对话即生效

---

## 总结

| 问题 | 解决方案 | 层级 |
|------|---------|------|
| Agent 误改主分支 | SessionStart 钩子自动切 beta | Hooks |
| Agent 中途偏离 beta | PreToolUse 钩子每次调用前检查并切回 | Hooks |
| 自动提交淹没工作历史 | PostToolUse 仅 `git add -A`，Agent 手动 commit | Hooks |
| SessionStart 强制重建导致孤儿提交 | 改为条件切换：存在则复用，不存在才创建 | Hooks |
| 合并后 beta 与 main 分叉 | `git checkout beta && git reset --hard main` 同步 | 流程 |
| beta 不污染远端 | 仅本地操作，不推送 beta | Hooks |
| 提交记录混乱 | 每个逻辑单元一提交 | Skill 约定 |
| main 历史污染 | beta squash merge | Skill 约定 |
| AGENTS.md 臃肿 | 详情拆到 Skill 按需加载 | 架构 |
| 危险命令无防护 | 安全约束清单（可选 guard hook） | AGENTS + Hooks |
