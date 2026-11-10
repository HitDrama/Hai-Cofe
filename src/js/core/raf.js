const tasks = new Set();
let rafId = null;

const reducedMotionQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

export function prefersReducedMotion() {
  return Boolean(reducedMotionQuery.matches);
}

function tick(now) {
  if (tasks.size === 0) {
    rafId = null;
    return;
  }
  for (const task of tasks) {
    if (task.visible && (!task.pauseOnReducedMotion || !prefersReducedMotion())) {
      task.fn(now);
    }
  }
  rafId = window.requestAnimationFrame(tick);
}

function ensureLoop() {
  if (rafId === null && tasks.size > 0) {
    rafId = window.requestAnimationFrame(tick);
  }
}

/**
 * Registers a frame callback tied to an element's viewport visibility.
 */
export function registerRafTask(element, fn, { pauseOnReducedMotion = true } = {}) {
  const task = {
    fn,
    visible: true,
    pauseOnReducedMotion,
    observer: null,
  };

  if (element && 'IntersectionObserver' in window) {
    task.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          task.visible = entry.isIntersecting;
        }
      },
      { rootMargin: '150px 0px 150px 0px' }
    );
    task.observer.observe(element);
  }

  tasks.add(task);
  ensureLoop();

  return () => {
    if (task.observer) {
      task.observer.disconnect();
    }
    tasks.delete(task);
    if (tasks.size === 0 && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

export function clearAllRafTasks() {
  for (const task of tasks) {
    if (task.observer) {
      task.observer.disconnect();
    }
  }
  tasks.clear();
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
}

