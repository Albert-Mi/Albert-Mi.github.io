---
title: "项目结构与说明（Begining）"
date: 2025-11-04
description: "本页说明整个仓库的目录结构、每个文件/文件夹的用途，以及相册与短代码的放置位置，便于后续维护与扩展。"
tags: ["hugo","stack","gallery","shortcodes"]
categories:
    - Example
draft: false
---

> 主题：Hugo + Stack v3（见 `config/_default/module.toml`）  
> 生成方式：Hugo Modules & GitHub Actions 自动部署

本文根据当前仓库快照撰写，目录与说明**一一对应**，方便快速定位与维护。

---

# 顶层（仓库根）
.
├─ .devcontainer/
├─ .github/workflows/
├─ .vscode/
├─ archetypes/
├─ assets/
├─ config/_default/
├─ content/
├─ layouts/
├─ static/
├─ go.mod / go.sum
├─ README.md / LICENSE
└─ .gitignore


- **go.mod / go.sum**  
  Hugo Modules 依赖定义（引入主题 `github.com/CaiJimmy/hugo-theme-stack/v3` 等）。
- **README.md / LICENSE**  
  仓库自述与授权信息。
- **.gitignore**  
  忽略发布目录、系统文件等。

---

# `.devcontainer/`
- **Dockerfile，devcontainer.json**  
  VS Code/Dev Containers 开发环境定义。用于提供一致的本地开发容器（Node/Hugo 等版本统一）。

---

# `.github/workflows/`
- **deploy.yml**  
  GitHub Actions 部署流程：构建 Hugo 静态站点并发布到 GitHub Pages。
- **update-theme.yml**  
  自动更新主题版本或依赖（按设定的触发策略）。

---

# `.vscode/`
- **tasks.json**  
  VS Code 任务配置（如一键构建/预览）。

---

# `archetypes/`
- **images.md**  
  自定义 **Archetype**（文章蓝本）。用于快速创建“图片/图集类”文章时，自动生成 front matter 与基础结构（如需要可继续扩展字段）。


---

# `assets/`
Hugo 资源管线入口（可被处理/打包）。

- **css/**
  - `gallery.css`：相册页的样式草案（注意：当前相册页主要由短代码内联样式控制，此文件可作为后续外置样式的汇总位置）。
- **js/**
  - `gallery.js`：相册交互脚本（如有需要，可在短代码或主题头部 partial 中引入）。
- **icons/**  
  站点内使用的 SVG 图标（archive/bookmark/search 等）。
- **img/**  
  站点静态素材（头像等），但仍通过 Hugo 资源管线管理。
- **scss/custom.scss**  
  主题样式的增量/覆盖（Sass 版，可与 Stack 主题的 Pipe 配合）。
- **smail.png**  
  单文件资源示例。

---

# `config/_default/`
Hugo 主配置（TOML）。

- **config.toml**  
  站点基础配置（站点名、语言、构建等）。
- **params.toml**  
  Stack 主题的参数开关（社交链接、外观、页眉页脚等）。
- **menu.toml**  
  顶部/侧边导航菜单。
- **permalinks.toml**  
  各内容类型的永久链接规则。
- **markup.toml**  
  Markdown 渲染细节（如代码高亮、Goldmark 设置）。
- **related.toml**  
  相关文章算法配置。
- **_languages.toml**  
  多语言设定（若启用）。
- **module.toml**  
  Hugo Modules 引用。

  
---

# `content/`
站点内容源（Markdown 为主）。

content/
├─ _index.md
├─ page/
│ ├─ archives/index.md
│ ├─ links/index.md
│ ├─ search/index.md
│ └─ secret/index.md
├─ bookmarks/index.md
├─ post/
│ ├─ Cat-state-encoding/ # 文章：猫态编码（含多张配图）
│ ├─ images/
│ │ ├─ _index.md
│ │ └─ Wallpaper/ # 相册页（见下）
│ │ ├─ index.md # 使用 gallery 短代码调用资源
│ │ ├─ Arise.jpg / Beauties.jpg / ...
│ ├─ markdown-syntax/index.md # Markdown 示例
│ ├─ math-typesetting/index.md # 数学公式示例
│ ├─ shortcodes/
│ │ ├─ index.md
│ │ └─ cover.jpg
│ └─ others/
│ └─ kemu3light.md # 科目三灯光考试文章
└─ private/
├─ _index.md
├─ links.md
└─ twitter.md


- **content/page/**  
  非博客型页面（归档、链接、搜索、私密入口说明等）。
- **content/bookmarks/index.md**  
  书签页入口（结合 `static/bookmarks_10_27_25.html` 使用）。
- **content/post/images/Wallpaper/**  
  当前**相册**示例目录。  
  - `index.md` 内通过短代码调用资源（见下“相册使用速记”）。  
  - 图片资源（`.jpg` / `.jpeg` / `.png` / `.JPG` 等）放在同目录即可被短代码读取。
- **content/post/begining/index.md**  
  你正在阅读的这篇**仓库结构说明**。

---

# `layouts/`
自定义模板、短代码与局部模板。

- **layouts/shortcodes/gallery.html**  
  自定义 **gallery** 短代码。  
  - 采用“正方形容器 + `object-fit: contain`”且**水平/垂直双向居中**；  
  - 移动端断点保持每行等分；  
  - 与 `content/post/images/Wallpaper/index.md` 配合使用。  
  （你之前反馈的“横图/竖图留白并居中”效果就在这里实现。）

- **layouts/images/list.html**、**layouts/images/single.html**  
  若定义了 `images` 内容类型时的列表/详情页面模板（可与 `archetypes/images.md` 搭配形成独立图集类型）。

- **layouts/partials/head/custom.html**  
  头部注入点（可引入外部 CSS/JS、自定义 meta 等）。

- **layouts/private/list.json.json**  
  私密区的 JSON 列表模板（配合搜索/过滤用）。

---

# `static/`
原样拷贝到发布目录 `public/`，**不走资源管线**。

- **static/js/secret-entrance.js**  
  私密入口脚本（多击触发 + 密码校验 + DEBUG 开关等）。
- **static/css/custom.css**  
  直接加载的额外样式（覆盖主题或做特定页面的补充）。
- **static/others/kemu3-exam.html**  
  独立的前端页面（科目三灯光考试交互页，文章末尾可直接外链）。  
- **static/bookmarks_10_27_25.html、favicon.png**  
  书签 HTML 与站点图标等静态资源。

> 提醒：**模板/短代码/Archetype 不应放在 `static/`**，否则会被当作静态文件暴露，而不会被 Hugo 识别为构建期资源。若确需改变物理位置，请考虑使用 **Hugo Modules mounts** 做目录映射。

---

# 相册（Gallery）使用速记
在某个文章目录（例如 `content/post/images/YourAlbum/`）放入图片与 `index.md`，然后在 `index.md` 写入：

```text
---
title: "Your Album"
date: 2025-11-04
---
{{< gallery cols=4 >}}

