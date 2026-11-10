import { registerRafTask } from '../core/raf.js';
import { scrollState } from '../core/scroll.js';

/**
 * Rotates an element continuously at `speed` deg/frame, accelerating proportionally to `scrollState.speed`.
 */
export function circleTrack(obj, speed = 0.3) {
  if (!obj) return () => {};

  let val = 0;
  return registerRafTask(obj, () => {
    const absSpeed = Math.abs(scrollState.speed);
    const combineSpeed =
      scrollState.winW <= 768
        ? speed
        : Math.max(speed, speed * Math.min(absSpeed, 18));

    val = (val + combineSpeed) % 360;
    obj.style.transform = `rotate(${val.toFixed(2)}deg)`;
  });
}

