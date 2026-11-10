import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';
import { prefersReducedMotion } from './raf.js';

export const scrollState = {
  y: 0,
  speed: 0,
  direction: 'down',
  winW: typeof window !== 'undefined' ? window.innerWidth : 1440,
  winH: typeof window !== 'undefined' ? window.innerHeight : 900,
  isSmooth: false,
};

let scrollInstance = null;
let fallbackObserver = null;
let nativeScrollHandler = null;
let resizeHandler = null;
const listeners = new Set();

function notifyListeners(payload) {
  for (const fn of listeners) {
    fn(payload);
  }
}

function setupRevealFallback(container) {
  if (fallbackObserver) {
    fallbackObserver.disconnect();
  }
  if (!('IntersectionObserver' in window)) {
    container.querySelectorAll('[data-scroll]').forEach((el) => el.classList.add('esin'));
    return;
  }
  fallbackObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('esin');
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  container.querySelectorAll('[data-scroll]').forEach((el) => fallbackObserver.observe(el));
}

export function initScrollEngine() {
  const scrollContainer = document.querySelector('[data-scroll-container]');
  if (!scrollContainer) return null;

  destroyScrollEngine();

  scrollState.winW = window.innerWidth;
  scrollState.winH = window.innerHeight;
  const enableSmooth = !prefersReducedMotion() && scrollState.winW > 768;

  scrollInstance = new LocomotiveScroll({
    el: scrollContainer,
    smooth: enableSmooth,
    repeat: true,
    getDirection: true,
    getSpeed: true,
    class: 'esin',
    reloadOnContextChange: true,
    tablet: {
      breakpoint: 1024,
      smooth: !prefersReducedMotion(),
    },
    smartphone: {
      breakpoint: 768,
      smooth: false,
    },
  });

  scrollState.isSmooth = Boolean(scrollInstance.smooth);

  let lastNativeY = window.scrollY || 0;

  scrollInstance.on('scroll', (val) => {
    scrollState.y = val.scroll.y;
    scrollState.speed = typeof val.speed === 'number' ? val.speed : 0;
    scrollState.direction = val.direction || 'down';
    notifyListeners({
      y: scrollState.y,
      speed: scrollState.speed,
      direction: scrollState.direction,
      currentElements: val.currentElements || {},
    });
  });

  // Ensure native scroll on mobile/reduced-motion always updates scrollState reliably
  nativeScrollHandler = () => {
    if (document.documentElement.classList.contains('has-scroll-smooth')) return;
    const y = window.scrollY || window.pageYOffset || 0;
    const delta = y - lastNativeY;
    lastNativeY = y;
    scrollState.y = y;
    scrollState.speed = Math.max(-12, Math.min(12, delta * 0.15));
    scrollState.direction = delta >= 0 ? 'down' : 'up';
    notifyListeners({
      y: scrollState.y,
      speed: scrollState.speed,
      direction: scrollState.direction,
      currentElements: {},
    });
  };
  window.addEventListener('scroll', nativeScrollHandler, { passive: true });

  resizeHandler = () => {
    scrollState.winW = window.innerWidth;
    scrollState.winH = window.innerHeight;
    if (scrollInstance) {
      scrollInstance.update();
    }
  };
  window.addEventListener('resize', resizeHandler, { passive: true });

  setupRevealFallback(scrollContainer);

  imagesLoaded(scrollContainer, { background: true }, () => {
    if (scrollInstance) {
      scrollInstance.update();
    }
  });

  return scrollInstance;
}

export function onScrollTick(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function updateScrollEngine() {
  if (scrollInstance) {
    scrollInstance.update();
  }
}

export function scrollToTarget(target, options = {}) {
  if (scrollInstance && document.documentElement.classList.contains('has-scroll-smooth')) {
    scrollInstance.scrollTo(target, options);
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({
      top: target,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      const offset = options.offset || 0;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  }
}

/**
 * Computes an element's document top offset accurately whether Locomotive smooth scroll is active or not.
 */
export function getElementDocTop(el) {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  return rect.top + scrollState.y;
}

export function destroyScrollEngine() {
  listeners.clear();
  if (fallbackObserver) {
    fallbackObserver.disconnect();
    fallbackObserver = null;
  }
  if (nativeScrollHandler) {
    window.removeEventListener('scroll', nativeScrollHandler);
    nativeScrollHandler = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (scrollInstance) {
    scrollInstance.destroy();
    scrollInstance = null;
  }
  scrollState.y = 0;
  scrollState.speed = 0;
}

