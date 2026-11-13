# MiniFlow

一个极简的本地社交动态应用（类 Twitter 的最小可用版本），使用纯 HTML + CSS + JavaScript 实现，无需任何框架和后端。

## 功能

- 发布动态：输入内容（最多 280 字），点击"发布"或 `Ctrl/Cmd + Enter`
- 查看动态：按时间倒序展示所有动态
- 删除动态
- 数据通过 `localStorage` 持久化保存在本地浏览器中

## 运行

直接用浏览器打开 `index.html` 即可；或启动一个本地静态服务器：

```bash
# Python
python -m http.server 8080
# Node
npx serve .
```

然后访问 http://localhost:8080

## 文件结构

```
├── index.html   # 页面结构
├── style.css    # 样式
├── script.js    # 逻辑（发布、渲染、localStorage 存取）
└── README.md
```

## 说明

- 所有数据仅保存在当前浏览器的 localStorage 中，清除浏览器数据会删除所有动态。
- 用户内容渲染前经过 HTML 转义，防止 XSS。
