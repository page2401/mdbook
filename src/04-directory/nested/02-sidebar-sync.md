# 嵌套子页 B：多级子目录与侧边栏同步机制

在 `mdBook` 体系下，`src/SUMMARY.md` 既是全书侧边栏树，又是上一章 / 下一章翻页器（Prev / Next）和全文检索索引的唯一编译清单：无需在子目录内散落 `_index.md` 或 `_category_.json` 等元数据文件，但每次新增或移动子目录文档时都必须同步更新 `src/SUMMARY.md`。

- [返回上一篇：《嵌套子页 A：排序前缀与 URL 纯净度权衡》](./01-order-and-url.md)
- [返回《04. 目录结构与路由取舍》](../index.md)
