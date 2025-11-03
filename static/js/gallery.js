(function() {
  const root = document.querySelector("#gallery-root");
  if (!root) return;

  // 从 HTML data-* 里拿配置
  const images = JSON.parse(root.dataset.images || "[]");
  let perPage = parseInt(root.dataset.perPage || "20", 10);
  let perRow = parseInt(root.dataset.perRow || "5", 10);
  let mode = root.dataset.mode || "square";

  let currentPage = 1;
  const totalPages = Math.max(1, Math.ceil(images.length / perPage));

  // 创建 lightbox
  const lb = document.createElement("div");
  lb.className = "gallery-lightbox";
  lb.innerHTML = `
    <button class="gallery-lightbox-close">&times;</button>
    <img src="" alt="preview">
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  const lbClose = lb.querySelector(".gallery-lightbox-close");
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target === lbClose) {
      lb.classList.remove("is-active");
    }
  });

  // 渲染函数
  function render() {
    // 1. 顶部控制条
    root.innerHTML = `
      <div class="gallery-pagination-top">
        <span>当前是第 <strong>${currentPage}</strong> / ${totalPages} 页</span>
        <button type="button" data-goto="prev">上一页</button>
        <button type="button" data-goto="next">下一页</button>
        <span>跳转到第</span>
        <input type="number" min="1" max="${totalPages}" value="${currentPage}" class="gallery-page-input" />
        <span>页</span>
      </div>

      <div class="gallery-controls">
        <span>每页</span>
        <input type="number" min="1" value="${perPage}" class="gallery-perpage-input" />
        <span>张</span>

        <span>每行</span>
        <input type="number" min="1" value="${perRow}" class="gallery-perrow-input" />

        <span>显示模式：</span>
        <button type="button" class="gallery-mode-btn ${mode === "square" ? "active" : ""}" data-mode="square">正方形</button>
        <button type="button" class="gallery-mode-btn ${mode === "original" ? "active" : ""}" data-mode="original">原尺寸</button>
      </div>

      <div class="gallery-grid" style="--per-row: ${perRow};"></div>

      <div class="gallery-pagination-bottom">
        <span>当前是第 <strong>${currentPage}</strong> / ${totalPages} 页</span>
        <button type="button" data-goto="prev">上一页</button>
        <button type="button" data-goto="next">下一页</button>
        <span>跳转到第</span>
        <input type="number" min="1" max="${totalPages}" value="${currentPage}" class="gallery-page-input" />
        <span>页</span>
      </div>
    `;

    const grid = root.querySelector(".gallery-grid");

    // 2. 当前页的图片
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageImages = images.slice(start, end);

    pageImages.forEach((img) => {
      const item = document.createElement("div");
      item.className = `gallery-item ${mode}`;
      item.innerHTML = `
        <img loading="lazy" src="${img.src}" alt="${img.title || ""}">
        ${img.title ? `<div class="gallery-item-title">${img.title}</div>` : ""}
      `;
      item.addEventListener("click", () => {
        lbImg.src = img.src;
        lb.classList.add("is-active");
      });
      grid.appendChild(item);
    });

    // 3. 绑定事件
    // 上/下一页
    root.querySelectorAll("[data-goto]").forEach(btn => {
      btn.addEventListener("click", () => {
        const dir = btn.dataset.goto;
        if (dir === "prev" && currentPage > 1) {
          currentPage--;
        } else if (dir === "next" && currentPage < Math.ceil(images.length / perPage)) {
          currentPage++;
        }
        render();
      });
    });

    // 顶部 & 底部跳页输入框
    root.querySelectorAll(".gallery-page-input").forEach(input => {
      input.addEventListener("change", () => {
        let v = parseInt(input.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v > Math.ceil(images.length / perPage)) v = Math.ceil(images.length / perPage);
        currentPage = v;
        render();
      });
    });

    // 修改每页数量
    const perPageInput = root.querySelector(".gallery-perpage-input");
    perPageInput.addEventListener("change", () => {
      let v = parseInt(perPageInput.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      perPage = v;
      currentPage = 1; // 重置到第一页
      render();
    });

    // 修改每行数量
    const perRowInput = root.querySelector(".gallery-perrow-input");
    perRowInput.addEventListener("change", () => {
      let v = parseInt(perRowInput.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      perRow = v;
      render();
    });

    // 修改显示模式
    root.querySelectorAll(".gallery-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        mode = btn.dataset.mode;
        render();
      });
    });
  }

  render();
})();
