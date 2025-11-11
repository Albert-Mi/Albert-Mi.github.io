(function () {
  const INIT_EVENT = 'pjax:success';

  // Find a reliable bottom container and the dark mode toggle
  function findBottom() {
    const sidebar = document.querySelector('aside.sidebar') || document;
    const bottom =
      sidebar.querySelector('.menu-bottom') ||
      sidebar.querySelector('.sidebar-bottom') ||
      sidebar.querySelector('.site-menu-bottom');
    const dark =
      sidebar.querySelector('button[aria-label*="Dark" i]') ||
      sidebar.querySelector('.darkmode-toggle') ||
      sidebar.querySelector('.menu-bottom button');
    return { bottom, dark };
  }

  // Create (or return) the trigger element
  function getTrigger() {
    let el = document.querySelector('.secret-trigger');
    if (!el) {
      el = document.createElement('a');
      el.className = 'secret-trigger';
      el.href = 'javascript:void(0)'; // your script will attach click behavior later
      el.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:.5rem;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
        'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M12 2a7 7 0 0 0-7 7v2l-1 1v4h16v-4l-1-1V9a7 7 0 0 0-7-7Z" ' +
        'stroke="currentColor" stroke-width="1.5" fill="none"/></svg>' +
        '<span>Private</span></span>';
    }
    return el;
  }

  // Insert trigger above dark-mode button inside bottom area
  function insertTrigger() {
    const { bottom, dark } = findBottom();
    if (!bottom || !dark) return;

    const trig = getTrigger();

    // Ensure it's in the right place
    if (trig.parentElement !== bottom) {
      bottom.insertBefore(trig, dark); // right before Dark Mode
    } else {
      // If it's already there but not in the right order, fix order:
      if (trig.nextElementSibling !== dark) {
        bottom.insertBefore(trig, dark);
      }
    }
  }

  // Run now and after PJAX swaps
  function init() { insertTrigger(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  document.addEventListener(INIT_EVENT, init);
})();
