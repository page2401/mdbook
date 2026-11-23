# mdBook 0.5 基准实测子站 (`page2401/mdbook`)

本仓库为 [page.2401.xyz](https://page.2401.xyz/) 静态网站生成器多版本基准对比平台的 **Rust 单体二进制 `mdBook v0.5.4`** 独立派生子模块。

- **线上实测地址**：<https://page.2401.xyz/mdbook/>
- **核心引擎**：`mdbook 0.5.4`（内置 `pulldown-cmark`）
- **本地零 CDN 扩展**：`katex@0.19.1`（含内嵌 Webfont）+ `mermaid@12.3.0`
- **构建命令**：`mdbook build`（产物输出至 `book/`，推送到孤儿分支 `page`）
