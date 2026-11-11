import { updateScrollEngine } from '../core/scroll.js';
import { followCursorInSec } from '../effects/followCursorInSec.js';
import { showToast } from '../effects/popupAndToast.js';

export function initBlogView(container = document) {
  const cleanups = [];

  // 1. Category Filter on News Listing Page
  const filterBtns = Array.from(container.querySelectorAll('[data-filter-cat]'));
  const postCards = Array.from(container.querySelectorAll('.the_post[data-cat]'));

  if (filterBtns.length > 0 && postCards.length > 0) {
    filterBtns.forEach((btn) => {
      const onClick = () => {
        const cat = btn.dataset.filterCat || 'all';
        filterBtns.forEach((b) => b.closest('.blognav')?.classList.remove('current'));
        btn.closest('.blognav')?.classList.add('current');

        postCards.forEach((card) => {
          const match = cat === 'all' || card.dataset.cat === cat;
          card.classList.toggle('is-hidden', !match);
          if (match) {
            card.querySelector('.the_post_thumb')?.classList.add('esin');
          }
        });

        window.setTimeout(() => updateScrollEngine(), 100);
      };
      btn.addEventListener('click', onClick);
      cleanups.push(() => btn.removeEventListener('click', onClick));
    });
  }

  // 2. Cursor-Following Elliptical Previews on Related News (news-detail.html)
  container.querySelectorAll('.listpost').forEach((row) => {
    const preview = row.querySelector('.post_image');
    if (preview) {
      cleanups.push(followCursorInSec(preview, row));
    }
  });

  // 3. Copy Link Button with Toast Notification
  container.querySelectorAll('[data-copy-link]').forEach((btn) => {
    const onCopy = async () => {
      const url = decodeURI(window.location.href);
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
        showToast('success', `Đã sao chép liên kết bài viết: ${url}`, 'ok');
      } catch {
        showToast('success', `Liên kết bài viết: ${url}`, 'ok');
      }
    };
    btn.addEventListener('click', onCopy);
    cleanups.push(() => btn.removeEventListener('click', onCopy));
  });

  return () => {
    for (const fn of cleanups) fn();
  };
}

