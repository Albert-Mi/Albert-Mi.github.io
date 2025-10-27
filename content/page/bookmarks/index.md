---
title: "My Bookmarks"
date: 2025-10-27
draft: false
description: "A visual bookmark gallery with add/edit/delete/drag and drop."
math: false
---

<style>
/* 容器与工具栏 */
.bookmark-wrap{max-width:1100px;margin:0 auto;}
.bookmark-toolbar{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
.bookmark-toolbar button,.bookmark-toolbar label{
  padding:.5rem .75rem;border:1px solid var(--card-border,#3333);border-radius:.6rem;
  background:var(--card-bg,transparent);cursor:pointer
}
.bookmark-toolbar input[type="file"]{display:none}

/* 网格 */
.bookmark-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
  gap:1rem
}

/* 卡片 */
.b-card{
  user-select:none; background:var(--card-bg,rgba(255,255,255,.02));
  border:1px solid var(--card-border,#0002); border-radius:1rem;
  padding:1rem; text-align:center; position:relative
}
.b-card[draggable="true"]{cursor:grab}
.b-card.dragging{opacity:.5}

/* 图标：圆与方切换 */
.b-icon{width:72px;height:72px;margin:0 auto .6rem auto;display:grid;place-items:center;
  background:linear-gradient(180deg,#7aa6ff22,#7aa6ff11); border:1px solid #0002;
  overflow:hidden; font-weight:600; font-size:22px; color:#8892b0
}
.b-icon.circle{border-radius:999px}
.b-icon.rounded{border-radius:18px}
.b-icon img{width:100%;height:100%;object-fit:cover}

/* 名称 */
.b-name{font-weight:600;font-size:.98rem;line-height:1.2;margin-top:.25rem;word-break:break-word}

/* 控制按钮（hover 显示） */
.b-ctrl{position:absolute;top:.4rem;right:.4rem;display:flex;gap:.25rem;opacity:0;transition:.15s}
.b-card:hover .b-ctrl{opacity:1}
.b-ctrl button{
  border:1px solid #0002;background:rgba(0,0,0,.05);backdrop-filter:saturate(1.2);
  border-radius:.5rem;padding:.2rem .45rem;font-size:.8rem;cursor:pointer
}

/* 新建/编辑面板 */
.b-editor{display:none;margin:1rem 0;padding:1rem;border:1px dashed #0003;border-radius:1rem}
.b-editor label{display:block;font-size:.9rem;margin:.35rem 0 .15rem}
.b-editor input{width:100%;padding:.55rem;border-radius:.6rem;border:1px solid #0003;background:transparent}
.b-editor .row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.b-editor .actions{display:flex;gap:.5rem;margin-top:.75rem}
.b-empty{opacity:.6;text-align:center;padding:2rem 0}

/* 主题变量（兼容暗色） */
:root{--card-bg:transparent;--card-border:#0003}
html.dark :root{--card-border:#fff1}
</style>

<div class="bookmark-wrap">
  <div class="bookmark-toolbar">
    <button id="btn-add">＋ Add</button>
    <button id="btn-reorder">Reorder</button>
    <button id="btn-shape">Icon: Circle</button>
    <button id="btn-export">Export</button>
    <label>Import <input id="file-import" type="file" accept="application/json"></label>
    <small style="opacity:.7;margin-left:.25rem">（数据保存在本机浏览器，可导出/导入备份）</small>
  </div>

  <!-- 新建/编辑表单 -->
  <div class="b-editor" id="editor">
    <div class="row">
      <div>
        <label>Title / 名称</label>
        <input id="f-title" placeholder="例如：Overleaf">
      </div>
      <div>
        <label>URL / 网址</label>
        <input id="f-url" placeholder="https://www.overleaf.com/">
      </div>
    </div>
    <div class="row">
      <div>
        <label>Icon URL（可留空，自动抓取网站图标）</label>
        <input id="f-icon" placeholder="https://.../logo.png">
      </div>
      <div>
        <label>Tag（可选）</label>
        <input id="f-tag" placeholder="科研 / 工具">
      </div>
    </div>
    <div class="actions">
      <button id="btn-save">Save</button>
      <button id="btn-cancel" type="button">Cancel</button>
    </div>
  </div>

  <div id="grid" class="bookmark-grid"></div>
  <div id="empty" class="b-empty" style="display:none;">空空如也，点击上方「Add」开始添加吧。</div>
</div>

<script>
(() => {
  const KEY = "bookmarks_v1";
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const editor = document.getElementById('editor');
  const fTitle = document.getElementById('f-title');
  const fUrl = document.getElementById('f-url');
  const fIcon = document.getElementById('f-icon');
  const fTag = document.getElementById('f-tag');
  const btnAdd = document.getElementById('btn-add');
  const btnSave = document.getElementById('btn-save');
  const btnCancel = document.getElementById('btn-cancel');
  const btnReorder = document.getElementById('btn-reorder');
  const btnShape = document.getElementById('btn-shape');
  const btnExport = document.getElementById('btn-export');
  const fileImport = document.getElementById('file-import');

  let shape = localStorage.getItem('bm_shape') || 'circle'; // circle or rounded
  let reorderMode = false;
  let editingIndex = null;

  // 默认示例（仅首次）
  const defaults = [
    {title:"Overleaf", url:"https://www.overleaf.com/", icon:"", tag:"科研"},
    {title:"GitHub", url:"https://github.com/", icon:"", tag:"Dev"},
    {title:"ArXiv", url:"https://arxiv.org/", icon:"", tag:"Paper"}
  ];

  function load(){
    const raw = localStorage.getItem(KEY);
    let arr = [];
    try{ arr = raw ? JSON.parse(raw) : []; }catch{ arr = []; }
    if(arr.length === 0){
      arr = defaults;
      save(arr);
    }
    return arr;
  }
  function save(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
    render();
  }

  function faviconFor(u){
    try{
      const url = new URL(u);
      return `https://www.google.com/s2/favicons?sz=128&domain_url=${url.origin}`;
    }catch{
      return "";
    }
  }

  function initials(name){
    const s = (name||"").trim();
    if(!s) return "∎";
    const parts = s.split(/\s+/);
    const t = (parts[0][0]||"") + (parts[1]?.[0]||"");
    return t.toUpperCase();
  }

  function render(){
    const data = load();
    grid.innerHTML = "";
    empty.style.display = data.length ? "none" : "block";
    data.forEach((it,idx)=>{
      const card = document.createElement('div');
      card.className = 'b-card';
      card.dataset.index = idx;
      card.draggable = reorderMode;

      const ctrl = document.createElement('div');
      ctrl.className = 'b-ctrl';
      ctrl.innerHTML = `
        <button data-act="edit">Edit</button>
        <button data-act="del">Del</button>
      `;
      card.appendChild(ctrl);

      const icon = document.createElement('div');
      icon.className = 'b-icon ' + (shape === 'rounded' ? 'rounded' : 'circle');

      const img = document.createElement('img');
      const src = it.icon || faviconFor(it.url);
      if(src){
        img.src = src;
        img.alt = it.title || "";
        img.onerror = () => { icon.innerHTML = initials(it.title); img.remove(); };
        icon.appendChild(img);
      }else{
        icon.textContent = initials(it.title);
      }

      const name = document.createElement('div');
      name.className = 'b-name';
      name.textContent = it.title || '(untitled)';

      card.appendChild(icon);
      card.appendChild(name);
      grid.appendChild(card);

      // 点击直达
      card.addEventListener('click', e=>{
        const act = e.target?.dataset?.act;
        if(act) return; // 点击的是控制按钮
        if(reorderMode) return;
        window.open(it.url, '_blank','noopener');
      });

      // 控制按钮
      ctrl.addEventListener('click', e=>{
        const act = e.target?.dataset?.act;
        if(act === 'edit'){
          showEditor(idx, it);
        }else if(act === 'del'){
          const arr = load();
          arr.splice(idx,1);
          save(arr);
        }
        e.stopPropagation();
      });

      // 拖拽排序
      card.addEventListener('dragstart', e=>{
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', String(idx));
      });
      card.addEventListener('dragend', ()=>card.classList.remove('dragging'));
      card.addEventListener('dragover', e=>{
        if(!reorderMode) return;
        e.preventDefault();
        const from = Number(e.dataTransfer.getData('text/plain'));
        const to = Number(card.dataset.index);
        if(from === to) return;
        const arr = load();
        const [moved] = arr.splice(from,1);
        arr.splice(to,0,moved);
        save(arr);
        // 需要更新 data-index
        Array.from(grid.children).forEach((c,i)=>c.dataset.index=i);
        e.dataTransfer.setData('text/plain', String(to));
      });
    });

    // 按钮文案
    btnReorder.textContent = reorderMode ? "Done" : "Reorder";
    btnShape.textContent = shape === 'circle' ? "Icon: Circle" : "Icon: Rounded";
  }

  function showEditor(index=null, item=null){
    editingIndex = index;
    editor.style.display = 'block';
    fTitle.value = item?.title || "";
    fUrl.value = item?.url || "";
    fIcon.value = item?.icon || "";
    fTag.value = item?.tag || "";
    fTitle.focus();
    window.scrollTo({top: editor.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'});
  }
  function hideEditor(){ editor.style.display='none'; editingIndex=null; }

  // 事件绑定
  btnAdd.addEventListener('click', ()=>showEditor());
  btnCancel.addEventListener('click', hideEditor);
  btnSave.addEventListener('click', ()=>{
    const title = fTitle.value.trim();
    const url = fUrl.value.trim();
    const icon = fIcon.value.trim();
    const tag  = fTag.value.trim();
    if(!title || !url){ alert("Title 与 URL 不能为空"); return; }
    const arr = load();
    const obj = {title,url,icon,tag};
    if(editingIndex==null){ arr.push(obj); } else { arr[editingIndex]=obj; }
    save(arr);
    hideEditor();
  });

  btnReorder.addEventListener('click', ()=>{
    reorderMode = !reorderMode;
    render();
  });

  btnShape.addEventListener('click', ()=>{
    shape = (shape === 'circle' ? 'rounded' : 'circle');
    localStorage.setItem('bm_shape', shape);
    render();
  });

  btnExport.addEventListener('click', ()=>{
    const data = load();
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bookmarks.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  fileImport.addEventListener('change', async (e)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const txt = await f.text();
    try{
      const arr = JSON.parse(txt);
      if(!Array.isArray(arr)) throw new Error('not array');
      save(arr);
    }catch(err){
      alert('导入失败：JSON 格式不正确');
    } finally {
      e.target.value = "";
    }
  });

  // 初始化
  render();
})();
</script>
