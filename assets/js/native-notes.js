(() => {
  const menuButton = document.querySelector('.native-notes-menu');
  const tocButton = document.querySelector('.native-notes-toc-menu');
  const sidebar = document.querySelector('.native-notes-sidebar');
  const tocPanel = document.querySelector('.native-notes-toc');
  const toc = document.querySelector('#native-notes-toc');
  const article = document.querySelector('.native-notes-content');
  const closePanels = () => {
    document.body.classList.remove('native-notes-menu-open', 'native-notes-toc-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    tocButton?.setAttribute('aria-expanded', 'false');
  };
  menuButton?.addEventListener('click', () => {
    const open = !document.body.classList.contains('native-notes-menu-open');
    closePanels();
    if (open) { document.body.classList.add('native-notes-menu-open'); menuButton.setAttribute('aria-expanded', 'true'); }
  });
  tocButton?.addEventListener('click', () => {
    const open = !document.body.classList.contains('native-notes-toc-open');
    closePanels();
    if (open) { document.body.classList.add('native-notes-toc-open'); tocButton.setAttribute('aria-expanded', 'true'); }
  });
  sidebar?.addEventListener('click', (event) => { if (event.target.closest('a')) closePanels(); });
  tocPanel?.addEventListener('click', (event) => { if (event.target.closest('a')) closePanels(); });
  if (!toc || !article) return;
  article.querySelectorAll('.native-notes-prose h2[id],.native-notes-prose h3[id]').forEach((heading) => {
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.dataset.level = heading.tagName.slice(1);
    link.textContent = heading.textContent.trim();
    toc.append(link);
  });
})();
