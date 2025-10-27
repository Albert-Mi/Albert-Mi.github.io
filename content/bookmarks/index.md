---
title: "Bookmarks"
slug: "bookmarks"
layout: "custom"
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

<style>
:root {
  --bg-light: #f9f9f9;
  --bg-dark: #1f1f1f;
  --border-light: #ccc;
  --border-dark: #333;
  --font-main: "Inter", "Helvetica Neue", sans-serif;
}

.bookmarks-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

/* 类别外框 */
.category-card {
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--bg-light);
  transition: background 0.3s, border-color 0.3s;
}
html.dark .category-card {
  background-color: var(--bg-dark);
  border-color: var(--border-dark);
}

/* 标签 */
.category-label {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 0.6rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
}
.category-science { background-color: #007acc; }
.category-study { background-color: #2ecc71; }
.category-fun { background-color: #e67e22; }
.category-tools { background-color: #9b59b6; }

/* 网格布局 */
.bookmark-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: flex-start;
}

/* 单个书签卡片 */
.bookmark-item {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: grab;
  transition: transform 0.2s ease;
  font-family: var(--font-main);
  text-align: center;
}
.bookmark-item:hover { transform: translateY(-3px); }

.bookmark-item img {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-bottom: 0.3rem;
}

.bookmark-name {
  font-size: 1rem;
  line-height: 1.2;
  margin-bottom: 0.3rem;
  max-width: 90px;
  word-wrap: break-word;
}

/* 对齐的按钮组 */
.bookmark-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.bookmark-buttons button {
  width: 60px;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
}
.btn-edit { background-color: #007acc; }
.btn-edit:hover { background-color: #005fa3; }
.btn-del { background-color: #e74c3c; }
.btn-del:hover { background-color: #c0392b; }

/* 编辑弹窗 */
.modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.6);
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
}
.modal-content input, .modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.4rem 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button { font-family: var(--font-main); }
</style>

<div class="bookmarks-container">
  <div style="margin-bottom:1rem;">
    <button onclick="openModal()" style="background:#007acc;color:white;border:none;padding:0.6rem 1.2rem;border-radius:8px;cursor:pointer;">➕ Add Bookmark</button>
  </div>
  <div id="bookmarks"></div>
</div>

<div class="modal" id="bookmarkModal">
  <div class="modal-content">
    <h3>Edit / Add Bookmark</h3>
    <label>Category:</label>
    <select id="category">
      <option value="science">科研 / Research</option>
      <option value="study">学习 / Study</option>
      <option value="fun">娱乐 / Entertainment</option>
      <option value="tools">工具 / Tools</option>
    </select>
    <label>Name:</label>
    <input type="text" id="name">
    <label>URL:</label>
    <input type="text" id="url">
    <div style="margin-top:1rem;text-align:right;">
      <button onclick="saveBookmark()" style="background:#007acc;">Save</button>
      <button onclick="closeModal()" style="background:#777;margin-left:1rem;">Cancel</button>
    </div>
  </div>
</div>

<script>
// ========== 自动分类关键字 ==========
const CATEGORY_RULES = {
  science: ["arxiv", "scholar", "webofscience", "researchgate", "academia", "nature", "springer"],
  study: ["edu", "course", "learn", "class", "study", "tutorial", "physics", "math", "mooc", "translate", "gushiwen"],
  fun: ["bilibili", "youtube", "movie", "tv", "ent", "bbc", "olevod", "douyin"],
  tools: ["convert", "tool", "drive", "cloud", "mubu", "feishu", "notion", "github", "disk"]
};

// ========== 默认书签数据（当没有本地存储或HTML导入失败时） ==========
const defaultData = {
  science: [],
  study: [],
  fun: [],
  tools: []
};

let bookmarks = JSON.parse(localStorage.getItem("bookmarksData")) || null;
let editing = null;

// ========== 自动导入 Chrome HTML 文件 ==========
async function importBookmarksFromHTML() {
  try {
    const response = await fetch("/bookmarks_10_27_25.html"); // 文件放在 static 根目录或 content 同层
    if (!response.ok) return defaultData;
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const links = doc.querySelectorAll("A[href]");
    const data = JSON.parse(JSON.stringify(defaultData));

    links.forEach(a => {
      const name = a.textContent.trim();
      const url = a.href.trim();
      const lower = url.toLowerCase();
      let cat = "tools"; // 默认
      for (const [key, keywords] of Object.entries(CATEGORY_RULES)) {
        if (keywords.some(k => lower.includes(k))) {
          cat = key; break;
        }
      }
      data[cat].push({ name, url });
    });
    return data;
  } catch (err) {
    console.warn("HTML import failed:", err);
    return defaultData;
  }
}

// ========== 页面加载 ==========
(async () => {
  if (!bookmarks) {
    bookmarks = await importBookmarksFromHTML();
    localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
  }
  renderBookmarks();
})();

// ========== 渲染界面 ==========
function renderBookmarks() {
  const container = document.getElementById("bookmarks");
  container.innerHTML = "";
  const labelMap = {
    science: "科研 / Research",
    study: "学习 / Study",
    fun: "娱乐 / Entertainment",
    tools: "工具 / Tools"
  };
  Object.keys(bookmarks).forEach(category => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <div class="category-label category-${category}">${labelMap[category]}</div>
      <div class="bookmark-grid" id="${category}">
        ${bookmarks[category].map((b,i)=>`
          <div class="bookmark-item" draggable="true">
            <a href="${b.url}" target="_blank">
              <img src="https://www.google.com/s2/favicons?domain=${b.url}">
              <div class="bookmark-name">${b.name}</div>
            </a>
            <div class="bookmark-buttons">
              <button class="btn-edit" onclick="editBookmark('${category}',${i})">Edit</button>
              <button class="btn-del" onclick="deleteBookmark('${category}',${i})">Del</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(div);
    new Sortable(div.querySelector(".bookmark-grid"), {
      group: "shared",
      animation: 150,
      onEnd: saveOrder
    });
  });
}

function saveOrder() {
  document.querySelectorAll(".bookmark-grid").forEach(grid => {
    const category = grid.id;
    const newList = [];
    grid.querySelectorAll(".bookmark-item a").forEach(a => {
      newList.push({
        name: a.querySelector(".bookmark-name").innerText,
        url: a.href
      });
    });
    bookmarks[category] = newList;
  });
  saveData();
}

function saveData() {
  localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
}

// ========== 弹窗逻辑 ==========
function openModal(cat=null,index=null) {
  editing = cat!==null ? {cat,index} : null;
  document.getElementById("bookmarkModal").style.display="flex";
  if(editing){
    const b=bookmarks[cat][index];
    document.getElementById("category").value=cat;
    document.getElementById("name").value=b.name;
    document.getElementById("url").value=b.url;
  } else {
    document.getElementById("category").value="science";
    document.getElementById("name").value="";
    document.getElementById("url").value="";
  }
}
function closeModal(){document.getElementById("bookmarkModal").style.display="none";}
function saveBookmark(){
  const cat=document.getElementById("category").value;
  const name=document.getElementById("name").value.trim();
  const url=document.getElementById("url").value.trim();
  if(!name||!url)return alert("请输入完整信息");
  if(editing){
    bookmarks[editing.cat][editing.index]={name,url};
  }else{
    bookmarks[cat].push({name,url});
  }
  saveData(); renderBookmarks(); closeModal();
}
function editBookmark(cat,i){openModal(cat,i);}
function deleteBookmark(cat,i){
  if(confirm("确定删除此书签？")){
    bookmarks[cat].splice(i,1);
    saveData(); renderBookmarks();
  }
}
</script>
