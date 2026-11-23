# mdBook 0.5 基准实测子站（Rust 单体二进制电子书引擎）

本子站（`page2401/mdbook`）由主仓库 `page2401.github.io/docs/` 的**标准 GitHub Flavored Markdown（GFM）母版**派生适配而来，用于实测 Rust 官方生态最经典的单体二进制文档引擎 **`mdBook v0.5.4`** 在零外部 CDN 依赖下的真实表现。

## 锁定版本与技术栈档案

| 模块 / 组件 | 锁定版本 | 角色与实测说明 |
| :--- | :--- | :--- |
| `mdbook` | `0.5.4` | Rust 官方电子书编译器，零 Node / Python 运行时，亚秒级构建输出至 `book/` |
| `pulldown-cmark` | `builtin` | 内置 CommonMark + GFM 扩展解析器；0.5 原生支持 `> [!NOTE]` 五类警报，但**默认不剥离 YAML Frontmatter** 且会先行消费公式中的单反斜杠 |
| `katex` | `0.19.1` | 通过 `additional-css` / `additional-js` 本地静态注入（含内嵌 `.woff2` 字体，零外部 CDN） |
| `mermaid` | `12.3.0` | 通过 `theme/init.js` 拦截 `code.language-mermaid` 并联动 `navy` / `light` 主题重绘 |

## 五大基准测试章节导航

| 章节路径 | 测试维度 | `mdBook 0.5.4` 派生适配实录 |
| :--- | :--- | :--- |
| [`01-annotations.md`](./01-annotations.md) | 专属标注与元数据 | **关键发现**：必须移除顶部 `---` YAML Frontmatter（否则被误解析为 `<hr> + <h2>`）；0.5 内核零插件原生渲染全部 5 类 GFM `> [!NOTE]` 警报 |
| [`02-diagrams.md`](./02-diagrams.md) | 流程图与时序图 | 正文 ` ```mermaid ` 保持零改动，由 `book.toml` 挂载本地 `mermaid@12.3.0` 客户端渲染 |
| [`03-math.md`](./03-math.md) | 数学公式排版 | 因未开启外部 CDN 的 `mathjax-support`，`pulldown-cmark` 会将 `\\`、`\,`、`\$` 当作普通标点转义，派生版需写作 `\\\\`、`\\,`、`\\$` 供 KaTeX 解析 |
| [`04-directory/`](./04-directory/index.md) | 目录结构与路由取舍 | 强中心化 `src/SUMMARY.md` 白名单驱动侧边栏与路由；保留相对 `.md` 互链并自动编译为 `.html` |
