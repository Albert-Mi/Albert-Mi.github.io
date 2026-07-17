(() => {
  const target = document.getElementById('llm-docs-local-toc');
  const article = document.querySelector('.llm-docs-content .fta-document');
  if (!target || !article) return;

  const headings = article.querySelectorAll('h2[id], h3[id], h4[id], h5[id]');
  if (!headings.length) return;

  const content = article.closest('.llm-docs-content');
  const pageNumber = content?.dataset.pageNumber;
  const rootLevel = Number(content?.dataset.rootHeadingLevel);
  if (!pageNumber || !rootLevel) return;

  const counters = { 2: 0, 3: 0, 4: 0, 5: 0 };
  const list = document.createElement('ol');
  let directChildCount = 0;

  headings.forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    let number = pageNumber;
    if (level > rootLevel) {
      counters[level] += 1;
      for (let deeper = level + 1; deeper <= 5; deeper += 1) {
        counters[deeper] = 0;
      }
      const suffix = [];
      for (let current = rootLevel + 1; current <= level; current += 1) {
        suffix.push(String(counters[current]));
      }
      number += '.' + suffix.join('.');
    }
    const title = heading.textContent.trim();

    const headingNumber = document.createElement('span');
    headingNumber.className = 'llm-docs-heading-number';
    headingNumber.setAttribute('aria-hidden', 'true');
    headingNumber.textContent = number;
    heading.prepend(headingNumber);

    if (level === rootLevel + 1) {
      directChildCount += 1;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      const tocNumber = document.createElement('span');
      tocNumber.className = 'llm-docs-toc-number';
      tocNumber.textContent = number;
      const tocTitle = document.createElement('span');
      tocTitle.textContent = title;
      link.append(tocNumber, tocTitle);
      item.appendChild(link);
      list.appendChild(item);
    }
  });

  if (directChildCount) {
    target.replaceChildren(list);
  } else {
    target.closest('.llm-docs-local-toc')?.setAttribute('hidden', '');
  }
})();
