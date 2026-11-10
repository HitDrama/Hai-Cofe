import { railTrack } from '../effects/railTrack.js';

export function initAboutView(container = document) {
  const cleanups = [];

  const trackWrap = container.querySelector('.track_wrap');
  if (trackWrap) {
    cleanups.push(railTrack(trackWrap, 1.5));
  }

  return () => {
    for (const fn of cleanups) fn();
  };
}

