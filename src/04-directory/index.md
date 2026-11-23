# 04. 目录结构与路由取舍（mdBook `SUMMARY.md` 强中心化模式）

本章节将母版 `docs/04-directory/` 多级嵌套目录派生至 **`mdBook v0.5.4`** 的 `src/` 目录树中，检验 Rust 电子书流派独特的 **`src/SUMMARY.md` 单一真相源（Whitelist）** 机制：

1. **工程隔离（`src/`）**：`book.toml` 指定 `src = "src"`，仓库根目录的 `README.md` 与 `ssg-lock.json` 天然不会被误编译进电子书。
2. **`SUMMARY.md` 绝对控制权**：
   - 任何未登记在 `src/SUMMARY.md` 中的 `.md` 文件**完全不会被编译**（杜绝了意外暴露草稿，但新增子页必须同步手改 `SUMMARY.md`）；
   - 侧边栏支持为任意深层嵌套路径（如 `nested/01-order-and-url.md`）直接赋予纯中文章节名并自动编号；
   - 正文内保留母版原汁原味的相对 `.md` 链接（`./nested/01-order-and-url.md`），`mdBook` 构建期会自动将其重写为 `.html` 路由，兼顾离线编辑器跳转与静态托管兼容性。

## 嵌套子文档入口

- [进入子文档 A：排序前缀与 URL 纯净度权衡](./nested/01-order-and-url.md)
- [进入子文档 B：多级子目录与侧边栏同步机制](./nested/02-sidebar-sync.md)
