# 01. 专属标注与元数据（mdBook 0.5 实测）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由原始 GFM 母版派生至 **`mdBook v0.5.4`**，直观展示了“**必须剥离 YAML Frontmatter**”与“**0.5 原生直通 GFM Alerts**”两大鲜明特征。

## 1. Frontmatter 元数据机制（实测陷阱：默认不剥离 YAML）

与绝大多数静态站点生成器不同，`mdBook v0.5.4` 的章节标题与层级完全由全局 `book.toml` 与 `src/SUMMARY.md` 索引文件集中声明，**内置 `pulldown-cmark` 默认不会剥离文件顶部的 `--- ... ---` YAML Frontmatter**：

- **实测现象**：若原样保留母版顶部的 `---\ntitle: "..."\ndescription: "..."\n---`，`mdBook 0.5.4` 会把首行 `---` 渲染为 `<hr>` 分割线，并把末尾 `---` 当作 Setext 二级标题下划线，将整段 YAML 原文直接印成页面顶部的巨大 `<h2>` 标题！
- **派生改造**：真实 `mdBook` 工程（如 *The Rust Programming Language*）均不在 `src/*.md` 顶部编写 YAML 元数据；本派生文件按原生惯例移除了顶部 4 行 YAML。

## 2. 标准提示语义块（mdBook 0.5 原生支持 GFM Alerts）

在旧版 `mdBook 0.4.x` 时代，开发者通常需要额外安装 `mdbook-admonish` 预处理器并改写为私有 ` ```admonish warning ` 围栏语法；而升级至 **`mdBook 0.5.4`** 后，内核原生解析全部五类标准 GFM 引用警报（自动渲染为带 Octicons 图标的 `.blockquote-tag`），母版正文无需改写任何私有 `:::` 容器：

> [!NOTE]
> 默认信息提示块：静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。

> [!TIP]
> **性能优化建议（自定义标题语义）**：在派生到三冒号体系时，VitePress / VuePress 写作 `::: tip 性能优化建议`，而 `mdBook 0.5` 直接沿用母版 GFM `> [!TIP]` 即可零插件渲染。

> [!WARNING]
> **版本边界注意**：注意区分各派系关键字命名——VitePress 与 VuePress 使用 `warning`，Starlight 使用 `caution`，而 `mdBook 0.5` 与 GitHub 网页端保持 100% 一致。

> [!CAUTION]
> **不可逆分支覆盖警告**：自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！

## 3. 可折叠详情容器（标准 HTML `<details>`）

`mdBook` 原生透传标准 HTML `<details>` 与 `<summary>` 标签（注意 `<summary>` 下方须保留空行，以便 `pulldown-cmark` 正确解析内部 Markdown 代码块与行内公式）：

<details>
<summary>点击展开查看母版折叠容器源码结构</summary>

```markdown
> [!TIP]
> 母版使用纯正 GFM 语法，在 GitHub 仓库网页端与 mdBook 0.5 中均可直接原样渲染。
```

除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

</details>

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

以下三段与母版**保持一字不改**，用于测试：如果不做任何方言改写、直接把母版 `.md` 丢进目标生成器，`mdBook 0.5.4` 能否零改造直通渲染：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
