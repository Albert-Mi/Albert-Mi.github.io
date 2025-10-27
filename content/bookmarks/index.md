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
}

.bookmarks-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

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

/* 分类标签样式 */
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

/* 书签卡片 */
.bookmark-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: grab;
  transition: transform 0.2s ease;
}
.bookmark-item:hover { transform: translateY(-3px); }
.bookmark-item img {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.bookmark-name {
  font-size: 1.1rem;
  margin-top: 0.3rem;
  text-align: center;
  word-wrap: break-word;
}

/* 编辑工具栏 */
.bookmark-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
button {
  background: #007acc;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #005a99;
}

/* 弹出框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.6);
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
}
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.4rem 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>

<div class="bookmarks-container">
  <div class="bookmark-toolbar">
    <button onclick="openModal()">➕ Add New Bookmark</button>
  </div>

  <!-- 动态书签分类容器 -->
  <div id="bookmarks"></div>
</div>

<!-- 弹出框 -->
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
    <div style="margin-top:1rem;">
      <button onclick="saveBookmark()">Save</button>
      <button onclick="closeModal()" style="background:#777;margin-left:1rem;">Cancel</button>
    </div>
  </div>
</div>

<script>
const defaultData = {
  science: [
    {name:"arXiv",url:"https://arxiv.org"},
    {name:"Academia.edu",url:"https://www.academia.edu"},
    {name:"Web of Science",url:"https://www.webofscience.com"},
    {name:"Google Scholar",url:"https://scholar.google.com"}
  ],
  study: [
    {name:"代码随想录",url:"https://programmercarl.com/qita/algo_pdf.html"},
    {name:"Physics & Matlab",url:"https://d-arora.github.io/Doing-Physics-With-Matlab/"},
    {name:"古诗文网",url:"https://www.gushiwen.cn"},
    {name:"Google 翻译",url:"https://translate.google.com"}
  ],
  fun: [
    {name:"哔哩哔哩",url:"https://www.bilibili.com"},
    {name:"欧乐影院",url:"https://www.olevod.com"},
    {name:"唐人街影院",url:"https://www.tangrenjie.tv"},
    {name:"BBC News",url:"https://www.bbc.com/news"}
  ],
  tools: [
    {name:"CloudConvert",url:"https://cloudconvert.com"},
    {name:"飞书文档",url:"https://vcnqclesoe89.feishu.cn/drive/home/"},
    {name:"北大网盘",url:"https://disk.pku.edu.cn"},
    {name:"幕布",url:"https://mubu.com"}
  ]
};

let bookmarks = JSON.parse(localStorage.getItem("bookmarksData")) || defaultData;
let editing = null;

function renderBookmarks() {
  const container = document.getElementById("bookmarks");
  container.innerHTML = "";
  Object.keys(bookmarks).forEach(category => {
    const labelMap = {
      science: "科研 / Research",
      study: "学习 / Study",
      fun: "娱乐 / Entertainment",
      tools: "工具 / Tools"
    };
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <div class="category-label category-${category}">${labelMap[category]}</div>
      <div class="bookmark-grid" id="${category}">
        ${bookmarks[category].map((b,i)=>`
          <div class="bookmark-item" draggable="true">
            <a href="${b.url}" target="_blank">
              <img src="https://www.google.com/s2/favicons?domain=${b.url}" />
              <div class="bookmark-name">${b.name}</div>
            </a>
            <button onclick="editBookmark('${category}',${i})" style="font-size:0.7rem;margin-top:0.3rem;">Edit</button>
            <button onclick="deleteBookmark('${category}',${i})" style="font-size:0.7rem;background:#e74c3c;">Del</button>
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
  saveData();
  renderBookmarks();
  closeModal();
}

function editBookmark(cat,i){openModal(cat,i);}
function deleteBookmark(cat,i){
  if(confirm("确定删除此书签？")){
    bookmarks[cat].splice(i,1);
    saveData();
    renderBookmarks();
  }
}

renderBookmarks();
</script>
