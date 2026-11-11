import { onScrollTick, scrollToTarget } from './scroll.js';

let cleanupFns = [];

export function closeNavDrawer() {
  const header = document.getElementById('header');
  const navBtn = document.getElementById('navWave');
  document.body.classList.remove('lock');
  if (!header || !header.classList.contains('navopen')) return;

  header.classList.add('isclose');
  header.classList.remove('navopen');
  if (navBtn) {
    navBtn.setAttribute('aria-expanded', 'false');
  }
  window.setTimeout(() => {
    header.classList.remove('isclose');
  }, 1000);
}

export function syncActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('#mainNav ul a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const cleanHref = href.replace(/^\.\//, '/');
    const isMatch =
      (cleanHref !== '/' && cleanHref !== '/index.html' && path.endsWith(cleanHref)) ||
      (cleanHref === '/news.html' && path.endsWith('/news-detail.html'));
    if (isMatch) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function initHeader() {
  destroyHeader();

  const header = document.getElementById('header');
  const navBtn = document.getElementById('navWave');
  const backBtn = document.getElementById('backtop');

  if (!header) return;

  syncActiveNavLink();

  const toggleNav = () => {
    if (header.classList.contains('navopen')) {
      closeNavDrawer();
    } else {
      header.classList.add('navopen');
      if (window.innerWidth <= 768) {
        document.body.classList.add('lock');
      }
      if (navBtn) navBtn.setAttribute('aria-expanded', 'true');
    }
  };

  const handleBackTop = () => {
    scrollToTarget(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && header.classList.contains('navopen')) {
      closeNavDrawer();
    }
  };

  if (navBtn) {
    navBtn.addEventListener('click', toggleNav);
    cleanupFns.push(() => navBtn.removeEventListener('click', toggleNav));
  }

  if (backBtn) {
    backBtn.addEventListener('click', handleBackTop);
    cleanupFns.push(() => backBtn.removeEventListener('click', handleBackTop));
  }

  window.addEventListener('keydown', handleKeyDown);
  cleanupFns.push(() => window.removeEventListener('keydown', handleKeyDown));

  const samePageGuard = (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor || anchor.target === '_blank') return;
    const url = new URL(anchor.href, window.location.origin);
    const normCurrent = window.location.pathname.replace(/\/index\.html$/, '/');
    const normTarget = url.pathname.replace(/\/index\.html$/, '/');
    if (url.origin === window.location.origin && normCurrent === normTarget && !url.hash) {
      e.preventDefault();
      closeNavDrawer();
      scrollToTarget(0);
    }
  };
  header.addEventListener('click', samePageGuard);
  cleanupFns.push(() => header.removeEventListener('click', samePageGuard));

  const unsubScroll = onScrollTick(({ y }) => {
    if (y > 50) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });
  cleanupFns.push(unsubScroll);
}

export function destroyHeader() {
  for (const fn of cleanupFns) {
    fn();
  }
  cleanupFns = [];
}
