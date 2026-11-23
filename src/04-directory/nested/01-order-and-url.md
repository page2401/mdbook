# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在 `mdBook` 的 `src/04-directory/nested/` 目录中，阅读顺序实际上由 `src/SUMMARY.md` 的缩进列表顺序决定，而非文件名排序。保留母版 `01-order-and-url.md` 命名虽能让代码编辑器文件树与 `SUMMARY.md` 顺序一致，但编译产物路径也会带入 `01-order-and-url.html`；不过得益于 `mdBook` 原生将相对 `.md` 链接重写为 `.html`，本地跳转与线上浏览均保持完好。

- [返回《04. 目录结构与路由取舍》](../index.md)
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》](./02-sidebar-sync.md)
