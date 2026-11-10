import { registerRafTask } from '../core/raf.js';
import { scrollState } from '../core/scroll.js';

/**
 * Seamless horizontal marquee driven by rAF and accelerated by scroll velocity.
 */
export function railTrack(wrap, speed = 1.5) {
  if (!wrap || !wrap.children[0]) return () => {};

  let val = 0;
  return registerRafTask(wrap, () => {
    const firstChild = wrap.children[0];
    const objWidth = firstChild ? firstChild.offsetWidth : 0;
    if (!objWidth) return;

    const absSpeed = Math.abs(scrollState.speed);
    const combineSpeed = Math.max(speed, speed * Math.min(absSpeed, 14));

    val += combineSpeed;
    if (val >= objWidth) {
      val -= objWidth;
    }
    wrap.style.transform = `translate3d(-${val.toFixed(1)}px, 0, 0)`;
  });
}

