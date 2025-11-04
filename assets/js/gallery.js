(function () {
  const root = document.querySelector("#gallery-root");
  if (!root) return;

  const images = JSON.parse(root.dataset.images || "[]");
  let perPage = parseInt(root.dataset.perPage || "20", 10);
  let perRow  = parseInt(root.dataset.perRow  || "4", 10);
  let currentPage = 1;

  function totalPages() {
    return Math.max(1, Math.ceil(images.length / perPage));
  }

  // Lightbox
  const lb = document.createElement("div");
  lb.className = "gallery-lightbox";
  lb.innerHTML = `
    <button class="gallery-lightbox-close" aria-label="Close">&times;</button>
    <img src="" alt="preview" />
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  const lbClose = lb.querySelector(".gallery-lightbox-close");
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target === lbClose) lb.classList.remove("is-active");
  });

  function render() {
    const pages = totalPages();

    root.innerHTML = `
      <div class="gallery-pagination-top">
        <span>当前是第 <strong>${currentPage}</strong> / ${pages} 页</span>
        <button type="button" data-goto="prev">上一页</button>
        <button type="button" data-goto="next">下一页</button>
        <span>跳转到第</span>
        <input type="number" min="1" max="${pages}" value="${currentPage}" class="gallery-page-input" />
        <span>页</span>

        <span style="margin-left: .75rem;">每页</span>
        <input type="number" min="1" value="${perPage}" class="gallery-perpage-input" />
        <span>张</span>

        <span style="margin-left: .75rem;">每行</span>
        <input type="number" min="1" value="${perRow}" class="gallery-perrow-input" />
      </div>

      <div class="gallery-grid" style="--per-row:${perRow};"></div>

      <div class="gallery-pagination-bottom">
        <span>当前是第 <strong>${currentPage}</strong> / ${pages} 页</span>
        <button type="button" data-goto="prev">上一页</button>
        <button type="button" data-goto="next">下一页</button>
        <span>跳转到第</span>
        <input type="number" min="1" max="${pages}" value="${currentPage}" class="gallery-page-input" />
        <span>页</span>
      </div>
    `;

    const grid = root.querySelector(".gallery-grid");
    const start = (currentPage - 1) * perPage;
    const end   = start + perPage;
    const slice = images.slice(start, end);

    slice.forEach(img => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<img loading="lazy" src="${img.src}" alt="${img.title || ""}">`;
      item.addEventListener("click", () => {
        lbImg.src = img.src;
        lb.classList.add("is-active");
      });
      grid.appendChild(item);
    });

    // 绑定事件
    root.querySelectorAll("[data-goto]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pages = totalPages();
        const dir = btn.dataset.goto;
        if (dir === "prev" && currentPage > 1) currentPage--;
        if (dir === "next" && currentPage < pages) currentPage++;
        render();
      });
    });

    root.querySelectorAll(".gallery-page-input").forEach(input => {
      input.addEventListener("change", () => {
        let v = parseInt(input.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v > totalPages()) v = totalPages();
        currentPage = v;
        render();
      });
    });

    root.querySelector(".gallery-perpage-input").addEventListener("change", (e) => {
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      perPage = v;
      currentPage = 1;
      render();
    });

    root.querySelector(".gallery-perrow-input").addEventListener("change", (e) => {
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      perRow = v;
      render();
    });
  }

  render();
})();
