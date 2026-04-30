---
title: 'Markdown 语法全攻略'
description: '从基础到高级，掌握 Markdown 的所有语法和最佳实践'
pubDate: '2026-04-11'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ['Markdown', '写作', '教程', '工具']
---

# Markdown 语法全攻略

## 前言

Markdown 是一种轻量级标记语言，由 John Gruber 于 2004 年创建。它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 XHTML（或者 HTML）。

本文将全面介绍 Markdown 的语法，从基础到高级用法，帮助你更好地使用这种标记语言。

## 基础语法

### 标题 (Headings)

使用 `#` 符号创建标题，`#` 的数量表示标题级别：

```markdown
# 一级标题 (H1)
## 二级标题 (H2)
### 三级标题 (H3)
#### 四级标题 (H4)
##### 五级标题 (H5)
###### 六级标题 (H6)
```

### 段落和换行 (Paragraphs and Line Breaks)

段落由一行或多行文本组成，段落之间用空行分隔：

```
这是第一段。

这是第二段。
```

强制换行：在行末添加两个或更多空格，然后回车。

### 强调 (Emphasis)

```markdown
*斜体* 或 _斜体_
**粗体** 或 __粗体__
***粗体斜体*** 或 ___粗体斜体___
~~删除线~~
```

效果：
- *斜体*
- **粗体**
- ***粗体斜体***
- ~~删除线~~

## 列表 (Lists)

### 无序列表 (Unordered Lists)

使用 `*`、`+` 或 `-` 创建无序列表：

```markdown
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3
```

### 有序列表 (Ordered Lists)

使用数字后跟点号：

```markdown
1. 第一项
2. 第二项
   1. 子项 2.1
   2. 子项 2.2
3. 第三项
```

### 任务列表 (Task Lists)

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务
```

效果：
- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务

## 链接和图片 (Links and Images)

### 链接 (Links)

```markdown
[链接文本](URL)
[带标题的链接](URL "标题")
<直接URL>
```

### 引用式链接 (Reference-style Links)

```markdown
[链接文本][引用标签]

[引用标签]: URL "可选标题"
```

### 图片 (Images)

```markdown
![替代文本](图片URL)
![带标题的图片](图片URL "图片标题")
```

## 代码 (Code)

### 行内代码 (Inline Code)

使用反引号包围：`console.log('Hello World')`

### 代码块 (Code Blocks)

使用三个反引号：

```javascript
function hello() {
    console.log('Hello, World!');
}
```

### 语法高亮 (Syntax Highlighting)

指定语言：

```python
def hello():
    print("Hello, World!")
```

## 引用 (Blockquotes)

使用 `>` 符号：

```markdown
> 这是一段引用文本。
>
> > 嵌套引用
```

效果：

> 这是一段引用文本。
>
> > 嵌套引用

## 表格 (Tables)

```markdown
| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |
```

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |

### 对齐方式

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容1  |  内容2   |  内容3 |
```

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容1  |  内容2   |  内容3 |

## 分隔线 (Horizontal Rules)

使用三个或更多 `-`、`*` 或 `_`：

```markdown
---
***
___
```

---

## HTML 内嵌 (Inline HTML)

Markdown 支持内嵌 HTML：

```html
<p style="color: red;">这是红色文本</p>
```

<p style="color: red;">这是红色文本</p>

## 转义字符 (Escaping Characters)

使用反斜杠转义特殊字符：

```markdown
\*这不是斜体\*
\[这不是链接\]
```

\*这不是斜体\*

\[这不是链接\]

## 高级用法

### 脚注 (Footnotes)

```markdown
这是一个脚注示例[^1]。

[^1]: 这是脚注的内容。
```

这是一个脚注示例[^1]。

[^1]: 这是脚注的内容。

### 定义列表 (Definition Lists)

```markdown
术语 1
: 定义 1

术语 2
: 定义 2a
: 定义 2b
```

### 缩写 (Abbreviations)

```markdown
*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

HTML 和 CSS 是前端开发的核心技术。
```

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

HTML 和 CSS 是前端开发的核心技术。

### 数学公式 (Math)

使用 LaTeX 语法（需要支持）：

```latex
$$\sum_{i=1}^{n} x_i = x_1 + x_2 + \dots + x_n$$
```

$$\sum_{i=1}^{n} x_i = x_1 + x_2 + \dots + x_n$$

## 最佳实践

### 1. 保持一致性

- 选择一种列表符号并坚持使用
- 统一标题级别和格式

### 2. 语义化

- 使用正确的标题层级
- 合理使用强调和引用

### 3. 可读性

- 适当使用空行
- 代码块添加语言标识
- 表格保持整洁

### 4. 兼容性

- 避免过度使用扩展语法
- 测试在不同平台上的渲染效果

## 常用工具

### 编辑器

- **VS Code**: 优秀的 Markdown 支持
- **Typora**: 所见即所得编辑器
- **Obsidian**: 知识管理工具

### 转换工具

- **Pandoc**: 强大的文档转换器
- **Marked**: JavaScript Markdown 解析器
- **Remark**: 基于插件的 Markdown 处理工具

## 总结

Markdown 以其简洁的语法和强大的表达能力，成为了现代文档编写的主流选择。掌握这些语法将大大提高你的写作效率。

记住：**好的文档不仅要内容丰富，更要结构清晰、易于阅读**。

---

*本文档基于 CommonMark 规范编写，适用于大多数 Markdown 处理器。*