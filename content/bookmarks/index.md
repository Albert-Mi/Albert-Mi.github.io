---
title: "Bookmarks"
slug: "bookmarks"
layout: "custom"
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">

<style>
/* 页面整体布局 */
.bookmarks-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1rem 0;
}

/* 每个类别卡片 */
.category-card {
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color, #ccc);
  background-color: var(--bg-color, #f9f9f9);
  transition: background 0.3s, border-color 0.3s;
}
html.dark .category-card {
  background-color: #1f1f1f;
  border-color: #333;
}

/* 类别标签 */
.category-label {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #fff;
}
.category-science { background: #007acc; }
.category-study { background: #2ecc71; }
.category-fun { background: #e67e22; }
.category-tools { background: #9b59b6; }

/* 网站图标列表 */
.bookmark-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 0.8rem;
}
.bookmark-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  text-align: center;
  cursor: grab;
  transition: transform 0.2s ease;
}
.bookmark-item:hover {
  transform: translateY(-3px);
}
.bookmark-item img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}
.bookmark-name {
  font-size: 1rem;
  margin-top: 0.4rem;
  word-wrap: break-word;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.bookmark-grid');
  containers.forEach(container => {
    new Sortable(container, {
      animation: 150,
      ghostClass: 'sortable-ghost'
    });
  });
});
</script>

<div class="bookmarks-container">

  <!-- 科研类 -->
  <div class="category-card">
    <div class="category-label category-science">科研 / Research</div>
    <div class="bookmark-grid" id="science">
      <div class="bookmark-item"><a href="https://arxiv.org/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=arxiv.org"><div class="bookmark-name">arXiv</div></a></div>
      <div class="bookmark-item"><a href="https://www.academia.edu/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=academia.edu"><div class="bookmark-name">Academia.edu</div></a></div>
      <div class="bookmark-item"><a href="https://www.webofscience.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=webofscience.com"><div class="bookmark-name">Web of Science</div></a></div>
      <div class="bookmark-item"><a href="https://scholar.google.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=scholar.google.com"><div class="bookmark-name">Google Scholar</div></a></div>
    </div>
  </div>

  <!-- 学习类 -->
  <div class="category-card">
    <div class="category-label category-study">学习 / Study</div>
    <div class="bookmark-grid" id="study">
      <div class="bookmark-item"><a href="https://programmercarl.com/qita/algo_pdf.html" target="_blank"><img src="https://www.google.com/s2/favicons?domain=programmercarl.com"><div class="bookmark-name">代码随想录</div></a></div>
      <div class="bookmark-item"><a href="https://d-arora.github.io/Doing-Physics-With-Matlab/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=d-arora.github.io"><div class="bookmark-name">Physics & Matlab</div></a></div>
      <div class="bookmark-item"><a href="https://www.gushiwen.cn/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=gushiwen.cn"><div class="bookmark-name">古诗文网</div></a></div>
      <div class="bookmark-item"><a href="https://translate.google.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=translate.google.com"><div class="bookmark-name">Google 翻译</div></a></div>
    </div>
  </div>

  <!-- 娱乐类 -->
  <div class="category-card">
    <div class="category-label category-fun">娱乐 / Entertainment</div>
    <div class="bookmark-grid" id="fun">
      <div class="bookmark-item"><a href="https://www.bilibili.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=bilibili.com"><div class="bookmark-name">哔哩哔哩</div></a></div>
      <div class="bookmark-item"><a href="https://www.olevod.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=olevod.com"><div class="bookmark-name">欧乐影院</div></a></div>
      <div class="bookmark-item"><a href="https://www.tangrenjie.tv/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=tangrenjie.tv"><div class="bookmark-name">唐人街影院</div></a></div>
      <div class="bookmark-item"><a href="https://www.bbc.com/news" target="_blank"><img src="https://www.google.com/s2/favicons?domain=bbc.com"><div class="bookmark-name">BBC News</div></a></div>
    </div>
  </div>

  <!-- 工具类 -->
  <div class="category-card">
    <div class="category-label category-tools">工具 / Tools</div>
    <div class="bookmark-grid" id="tools">
      <div class="bookmark-item"><a href="https://cloudconvert.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=cloudconvert.com"><div class="bookmark-name">CloudConvert</div></a></div>
      <div class="bookmark-item"><a href="https://vcnqclesoe89.feishu.cn/drive/home/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=feishu.cn"><div class="bookmark-name">飞书文档</div></a></div>
      <div class="bookmark-item"><a href="https://disk.pku.edu.cn/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=pku.edu.cn"><div class="bookmark-name">北大网盘</div></a></div>
      <div class="bookmark-item"><a href="https://mubu.com/" target="_blank"><img src="https://www.google.com/s2/favicons?domain=mubu.com"><div class="bookmark-name">幕布</div></a></div>
    </div>
  </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
