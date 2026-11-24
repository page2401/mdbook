# 05. 高阶代码块与语法高亮（mdBook 0.5 + `hidelines` 实测）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由原始 GFM 母版派生适配至 **`mdBook v0.5.4`**（遵循原生惯例剥离了顶部 YAML Frontmatter，并在 `src/SUMMARY.md` 注册章节）。

## 1. 代码块文件名标题栏与基础语法高亮（客户端内置 `highlight.js`）

与其他 Rust/Go 生成器在构建期直出静态 HTML Token 不同，`mdBook` 内置了一套完全离线的**客户端 `highlight.js` + 一键复制按钮（Copy to clipboard）**，随页面顶部的 `Light / Rust / Coal / Navy / Ayu` 五套主题实时切换代码配色。对于文件名标题栏，沿用母版在代码块上方以粗体路径标注：

**`scripts/resolve-route.ts`**

```ts
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 关键行聚焦：mdBook 独门绝技 `hidelines`（隐藏样板行而非背景高亮）

`mdBook` 原生不支持 `{3,7-9}` 或 `hl_lines` 背景色高亮，但它源自 *The Rust Programming Language* 官方教程需求，发明了全行业独树一帜的 **`hidelines`（隐藏上下文样板行）** 机制：

1. **Rust 代码块默认识别行首 `# `**：凡是以 `# ` 开头的初始化/断言样板行默认折叠为 `<span class="boring">`，代码块右上角自动浮现 **“👁 Show hidden lines”** 切换按钮，既让读者一眼聚焦核心逻辑，又保证整段代码可完整复制编译；
2. **任意语言自定义前缀 `hidelines=...`**：在非 Rust 代码块（如 `json` 或 `ts`）的信息串追加 `hidelines=~ `，同样可折叠次要字段，聚焦第 `3` 行与第 `7–9` 行关键配置！

**实测 A：Rust 原生 `# ` 隐藏样板行（点击代码块右上角眼睛图标可展开完整源码）**

```rust,noplayground
# use std::path::{Component, Path, PathBuf};
#
# pub fn normalize_rel(raw: &str) -> PathBuf {
#     Path::new(raw)
#         .components()
#         .filter(|c| matches!(c, Component::Normal(_)))
#         .collect()
# }
#
pub fn mount_subsite(base_dir: &Path, sub_path: &str) -> Option<PathBuf> {
    let resolved_base = base_dir.canonicalize().ok()?;
    let target = resolved_base.join(normalize_rel(sub_path));
    target.starts_with(&resolved_base).then_some(target)
}
#
# fn main() {
#     let out = mount_subsite(Path::new("."), "hugo/05-code-blocks");
#     assert!(out.is_none() || out.is_some());
# }
```

**实测 B：母版 JSON 配置配合 `json,hidelines=~` 聚焦关键配置行（展开可见全量 11 行）**

```json,hidelines=~
{
~   "id": "ssg-benchmark",
  "routeStyle": "clean",
~   "strictZeroCdn": true,
  "markdown": {
~     "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 代码增删对比着色（`highlight.js` 标准 `diff` 语法）

内置 `highlight.js` 包含 `diff` 语法包，自动将 `-` 行包裹为 `.hljs-deletion`、将 `+` 行包裹为 `.hljs-addition`（同样不嵌套解析内部 TypeScript 关键字）：

```diff
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（标准 HTML `<details>` 折叠组）

`mdBook` 不内置横向 `<Tabs>` 预处理器，实务中无需引入第三方 `mdbook-tabs` 插件即可利用标准 `<details name="mdbook-cmd-group">` 实现多运行时切换：

<details name="mdbook-cmd-group" open>
<summary>Rust 单体二进制（<code>book.toml</code> · 当前子站）</summary>

```bash
mdbook build
```

</details>

<details name="mdbook-cmd-group">
<summary>Node.js（<code>package.json</code>）</summary>

```bash
npm ci && npm run build
```

</details>

<details name="mdbook-cmd-group">
<summary>Deno 2（<code>deno.json</code>）</summary>

```bash
deno task build
```

</details>

<details name="mdbook-cmd-group">
<summary>Python（<code>requirements.txt</code>）与 Ruby（<code>Gemfile</code>）</summary>

```bash
pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
bundle install && bundle exec jekyll build
```

</details>

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、Eleventy (plugin)、Gatsby | ✅ 静态 Token 类名 | ✅ `{1,3-5}` / 魔法注释 | ⚠️ 需配 diff-highlight 插件 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、**mdBook (客户端 hljs)** | ⚠️ **mdBook 为本地离线客户端 hljs** | ✅ **mdBook 独创 `# ` / `hidelines` 隐藏样板行** | ⚠️ 仅标准 `diff` 块红绿 |
