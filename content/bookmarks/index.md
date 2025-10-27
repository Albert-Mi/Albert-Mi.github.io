---
title: "Bookmarks"
date: 2025-10-27
draft: false
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">

<style>
:root {
  --transition-speed: 0.25s;
}

#search-box {
  width: 90%;
  max-width: 600px;
  margin: 0 auto 20px auto;
  display: block;
  padding: 10px 16px;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: box-shadow 0.2s;
}
#search-box:focus {
  outline: none;
  box-shadow: 0 0 6px rgba(53,126,221,0.4);
}

.bookmark-section {
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 14px;
  padding: 12px 18px 22px 18px;
  margin-bottom: 24px;
  transition: border-color var(--transition-speed), background-color var(--transition-speed);
}
.bookmark-section.drag-over {
  border-color: #1e90ff;
  background-color: rgba(30,144,255,0.08);
}

.category-title {
  display: inline-block;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.category-title.research { background-color: #357edd; }
.category-title.study { background-color: #4CAF50; }
.category-title.entertainment { background-color: #d67b2e; }
.category-title.tools { background-color: #7b4caf; }

.bookmark-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: flex-start;
  min-height: 100px;
}

.bookmark-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  text-align: center;
  cursor: grab;
  transition: transform 0.18s ease, opacity 0.18s ease;
  will-change: transform, opacity;
}
.bookmark-item.dragging {
  opacity: 0.4;
  transform: scale(1.05);
  cursor: grabbing;
}
.bookmark-item.placeholder {
  opacity: 0.2;
  border: 2px dashed #1e90ff;
  border-radius: 10px;
  height: 100px;
}

.bookmark-item img {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: contain;
  margin-bottom: 6px;
  filter: saturate(1.1);
}

.bookmark-name {
  font-size: 1.0rem;
  margin-bottom: 4px;
  text-align: center;
}

button {
  border: none;
  border-radius: 10px;
  padding: 3px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  color: white;
  margin-top: 2px;
}
button.edit { background-color: #1d73da; }
button.delete { background-color: #e64b3b; }
button.add-btn {
  background-color: #357edd;
  margin-bottom: 20px;
}
</style>

<div>
  <input id="search-box" type="text" placeholder="🔍 Search bookmarks by name or domain...">
  <button class="add-btn" onclick="addBookmark()">+ Add Bookmark</button>
  <div id="bookmark-container"></div>
</div>

<script>
// ======== 分类定义 ========
const categories = [
  { key: "research", name: "科研 / Research" },
  { key: "study", name: "学习 / Study" },
  { key: "entertainment", name: "娱乐 / Entertainment" },
  { key: "tools", name: "工具 / Tools" }
];

// ======== 高清 favicon 加载 ========
function getIcon(url) {
  try {
    const domain = new URL(url).hostname;
    const localIcon = `/bookmark-icons/${domain}.png`;
    return new Promise((resolve) => {
      const img = new Image();
      img.src = localIcon;
      img.onload = () => resolve(localIcon);
      img.onerror = () => resolve(`https://www.google.com/s2/favicons?sz=128&domain_url=${domain}`);
    });
  } catch {
    return Promise.resolve("https://www.google.com/s2/favicons?sz=128&domain_url=google.com");
  }
}

// ======== 自动分类规则 ========
function classify(title, url) {
  const lower = (title + url).toLowerCase();
  if (lower.includes("arxiv") || lower.includes("scholar") || lower.includes("wos") || lower.includes("academia"))
    return "research";
  if (lower.includes("translate") || lower.includes("edu") || lower.includes("learn") || lower.includes("study") || lower.includes("physics") || lower.includes("math"))
    return "study";
  if (lower.includes("bilibili") || lower.includes("movie") || lower.includes("video") || lower.includes("news"))
    return "entertainment";
  return "tools";
}

// ======== 从 HTML 导入书签 ========
async function fetchBookmarks() {
  const response = await fetch("/bookmarks_10_27_25.html");
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const links = Array.from(doc.querySelectorAll("a[href]"));
  return links.map(a => ({
    title: a.textContent.trim(),
    url: a.href
  }));
}

// ======== 渲染函数（带搜索过滤） ========
async function render(filterText = "") {
  const container = document.getElementById("bookmark-container");
  container.innerHTML = "";

  let bookmarks = JSON.parse(localStorage.getItem("bookmarksData"));
  if (!bookmarks) {
    bookmarks = await fetchBookmarks();
    localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
  }

  const filtered = filterText
    ? bookmarks.filter(b =>
        b.title.toLowerCase().includes(filterText.toLowerCase()) ||
        b.url.toLowerCase().includes(filterText.toLowerCase())
      )
    : bookmarks;

  const grouped = {};
  categories.forEach(cat => grouped[cat.key] = []);
  filtered.forEach(b => grouped[classify(b.title, b.url)].push(b));

  for (const cat of categories) {
    const section = document.createElement("div");
    section.className = "bookmark-section";
    section.dataset.category = cat.key;

    const title = document.createElement("div");
    title.className = `category-title ${cat.key}`;
    title.textContent = cat.name;
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "bookmark-grid";
    grid.dataset.category = cat.key;

    // 拖拽事件
    grid.addEventListener("dragover", e => {
      e.preventDefault();
      const dragging = document.querySelector(".dragging");
      const placeholder = document.querySelector(".placeholder");
      const afterElement = getDragAfterElement(grid, e.clientX, e.clientY);
      if (!placeholder) return;
      if (afterElement == null) grid.appendChild(placeholder);
      else grid.insertBefore(placeholder, afterElement);
    });

    grid.addEventListener("dragenter", () => section.classList.add("drag-over"));
    grid.addEventListener("dragleave", () => section.classList.remove("drag-over"));
    grid.addEventListener("drop", e => {
      section.classList.remove("drag-over");
      const dragged = JSON.parse(e.dataTransfer.getData("text"));
      moveBookmark(dragged, cat.key);
      const placeholder = document.querySelector(".placeholder");
      if (placeholder) placeholder.remove();
    });

    for (const b of grouped[cat.key]) {
      const item = document.createElement("div");
      item.className = "bookmark-item";
      item.draggable = true;
      item.addEventListener("dragstart", e => {
        item.classList.add("dragging");
        const placeholder = document.createElement("div");
        placeholder.className = "bookmark-item placeholder";
        item.parentNode.insertBefore(placeholder, item.nextSibling);
        e.dataTransfer.setData("text", JSON.stringify(b));
      });
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        const placeholder = document.querySelector(".placeholder");
        if (placeholder) placeholder.remove();
      });

      const img = document.createElement("img");
      const iconUrl = await getIcon(b.url);
      img.src = iconUrl;
      img.loading = "lazy";

      const name = document.createElement("div");
      name.className = "bookmark-name";
      name.textContent = b.title;

      const edit = document.createElement("button");
      edit.className = "edit";
      edit.textContent = "Edit";
      edit.onclick = () => editBookmark(b);

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "Del";
      del.onclick = () => deleteBookmark(b);

      item.append(img, name, edit, del);
      grid.appendChild(item);
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

// ======== 拖拽辅助函数 ========
function getDragAfterElement(container, x, y) {
  const draggableElements = [...container.querySelectorAll(".bookmark-item:not(.dragging):not(.placeholder)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      else return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// ======== 操作函数 ========
function editBookmark(b) {
  const newName = prompt("Edit name:", b.title);
  const newUrl = prompt("Edit URL:", b.url);
  if (newName && newUrl) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarksData"));
    const idx = bookmarks.findIndex(x => x.url === b.url);
    if (idx !== -1) {
      bookmarks[idx] = { title: newName, url: newUrl };
      localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
      render(document.getElementById("search-box").value);
    }
  }
}

function deleteBookmark(b) {
  if (confirm("Delete this bookmark?")) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarksData"));
    bookmarks = bookmarks.filter(x => x.url !== b.url);
    localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
    render(document.getElementById("search-box").value);
  }
}

function addBookmark() {
  const name = prompt("Bookmark name:");
  const url = prompt("Bookmark URL:");
  if (name && url) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarksData")) || [];
    bookmarks.push({ title: name, url: url });
    localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
    render(document.getElementById("search-box").value);
  }
}

function moveBookmark(bookmark, newCategory) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarksData")) || [];
  bookmarks = bookmarks.filter(b => b.url !== bookmark.url);
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
  render(document.getElementById("search-box").value);
}

// ======== 实时搜索事件绑定 ========
document.getElementById("search-box").addEventListener("input", (e) => {
  const text = e.target.value;
  render(text);
});

render();
</script>
