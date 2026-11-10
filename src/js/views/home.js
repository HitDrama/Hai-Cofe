import imagesLoaded from 'imagesloaded';
import { prefersReducedMotion } from '../core/raf.js';
import { onScrollTick, scrollState, scrollToTarget } from '../core/scroll.js';
import { circleTrack } from '../effects/circleTrack.js';
import { followCursorInSec } from '../effects/followCursorInSec.js';
import { followCursorPara } from '../effects/followCursorPara.js';
import { openCraftModal } from '../effects/popupAndToast.js';

export function initHomeView(container = document) {
  const cleanups = [];

  // 1. Hero Rotating SVG Circle Text
  const heroCircleH1 = container.querySelector('.hga_text h1');
  if (heroCircleH1) {
    cleanups.push(circleTrack(heroCircleH1, 0.3));
  }

  // 2. News List Cursor-Follow Elliptical Preview
  container.querySelectorAll('.listpost').forEach((row) => {
    const preview = row.querySelector('.post_image');
    if (preview) {
      cleanups.push(followCursorInSec(preview, row));
    }
  });

  // 3. Craft Film / Story Play Trigger (.es_video)
  const videoBlocks = container.querySelectorAll('.es_video');
  if (videoBlocks.length > 0) {
    imagesLoaded(videoBlocks, () => {
      videoBlocks.forEach((sec) => {
        const badge = sec.querySelector('.video_play');
        if (badge) {
          cleanups.push(followCursorInSec(badge, sec));
        }
        const handleOpen = () => {
          openCraftModal({
            title: sec.dataset.modalTitle || 'Nghệ Thuật Kem Muối Pháp & Trà Thượng Hạng',
            subtitle: sec.dataset.modalSub || 'CRAFT FILM • HAI COFE STUDIO',
            description:
              sec.dataset.modalDesc ||
              'Từ lá trà vùng cao nguyên sương phủ và hạt Arabica Cầu Đất rang mộc, lớp kem muối biển Pháp được đánh bông lạnh ở 4°C để tan chậm trên đầu lưỡi.',
            image: sec.querySelector('img')?.getAttribute('src') || '/assets/img/scenes/craft-cream.jpg',
          });
        };
        sec.addEventListener('click', handleOpen);
        cleanups.push(() => sec.removeEventListener('click', handleOpen));
      });
    });
  }

  // 4. Sticky Rotary Drink Showcase (#cirsliTarget) - Dynamic N Series
  const targetEl = container.querySelector('#cirsliTarget');
  const circleSec = container.querySelector('.circle_section');
  const slides = Array.from(container.querySelectorAll('.cir_slide'));
  const titleWrap = container.querySelector('#cirTitlezh');
  const navListWrap = container.querySelector('#cirinList');
  const desWrap = container.querySelector('#cirDes');
  const ribbonWrap = container.querySelector('.circle_ribbon');
  const ribbonInner = ribbonWrap ? ribbonWrap.querySelector('div') : null;
  const skipBtn = container.querySelector('.cir_skip');
  const nextSection = container.querySelector('.section_hgc');
  const dotsWrap = container.querySelector('.cir_dots');

  const count = slides.length;
  const stepAngle = count > 0 ? 360 / count : 72;
  const totalSweep = count > 1 ? stepAngle * (count - 1) : 0;

  let activeIdx = 0;
  let listIsAni = false;
  let isSnapping = false;
  let settleTimer = null;

  // Initialize initial rotation angles dynamically for N slides
  slides.forEach((slide, idx) => {
    slide.style.transform = `rotate(-${idx * stepAngle}deg)`;
    slide.classList.toggle('in', idx === 0);
  });

  if (ribbonInner && circleSec) {
    cleanups.push(followCursorPara(ribbonInner, circleSec));
  }

  function updateSeriesUI(idx) {
    if (idx === undefined || idx < 0 || idx >= count) return;

    // Slide Vietnamese category title vertically
    if (titleWrap && titleWrap.children[0]?.children[0]) {
      const itemH = titleWrap.children[0].children[0].offsetHeight;
      titleWrap.children[0].style.transform = `translate3d(0, -${itemH * idx}px, 0)`;
    }

    // Move leaf pointer & highlight series list
    if (navListWrap) {
      const items = Array.from(navListWrap.querySelectorAll('li'));
      const leafIcon = navListWrap.querySelector('i');
      if (items[0] && leafIcon) {
        leafIcon.style.top = `${items[0].offsetHeight * idx}px`;
      }
      items.forEach((li, i) => li.classList.toggle('active', i === idx));
    }

    // Quick dots sync
    if (dotsWrap) {
      Array.from(dotsWrap.querySelectorAll('button')).forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
        btn.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
      });
    }

    // Crossfade descriptions & bottom ribbon when active series changes
    if (activeIdx !== idx && !listIsAni) {
      listIsAni = true;
      activeIdx = idx;

      if (desWrap) desWrap.classList.add('leave');
      if (ribbonWrap) ribbonWrap.classList.add('leave');

      window.setTimeout(() => {
        if (desWrap) {
          Array.from(desWrap.children).forEach((panel, i) => {
            panel.classList.toggle('active', i === idx);
          });
          desWrap.classList.remove('leave');
        }
        if (ribbonWrap) {
          Array.from(ribbonWrap.querySelectorAll('.ciriboon')).forEach((rib, i) => {
            rib.classList.toggle('active', i === idx);
          });
          ribbonWrap.classList.remove('leave');
        }
        listIsAni = false;
      }, 320);
    }
  }

  function scrollToSeries(idx) {
    if (!targetEl || count <= 1 || isSnapping) return;
    isSnapping = true;
    const rect = targetEl.getBoundingClientRect();
    const secDocTop = scrollState.y + rect.top;
    const scrollable = Math.max(1, targetEl.offsetHeight - window.innerHeight);
    const destY = secDocTop + (scrollable * idx) / (count - 1);

    scrollToTarget(destY, {
      duration: 450,
      callback: () => {
        isSnapping = false;
      },
    });
    window.setTimeout(() => {
      isSnapping = false;
    }, 520);
  }

  if (navListWrap) {
    navListWrap.querySelectorAll('li').forEach((li, idx) => {
      const onClick = () => scrollToSeries(idx);
      li.addEventListener('click', onClick);
      cleanups.push(() => li.removeEventListener('click', onClick));
    });
  }

  if (dotsWrap) {
    dotsWrap.querySelectorAll('button').forEach((btn, idx) => {
      const onClick = () => scrollToSeries(idx);
      btn.addEventListener('click', onClick);
      cleanups.push(() => btn.removeEventListener('click', onClick));
    });
  }

  if (skipBtn && nextSection) {
    const onSkip = () => scrollToTarget(nextSection);
    skipBtn.addEventListener('click', onSkip);
    cleanups.push(() => skipBtn.removeEventListener('click', onSkip));
  }

  // 5. Scroll-driven Animations (Hero scale/translate + Rotary Cups + Curved SVG Text)
  const heroDrinkImg = container.querySelector('.hga_img > img');
  const heroBgImg = container.querySelector('.hga_bg');
  const ovalSection = container.querySelector('.section_hgd');
  const ovalTextPath = container.querySelector('.ovaltext textPath');

  const unsubScroll = onScrollTick(({ y }) => {
    const reduced = prefersReducedMotion();

    // 5a. Hero split motion
    if (!reduced && heroBgImg && heroDrinkImg && y < window.innerHeight * 1.4) {
      heroBgImg.style.transform = `scale(${(1 + y / 2000).toFixed(4)})`;
      heroDrinkImg.style.transform = `translate3d(0, ${(y * 0.42).toFixed(1)}px, 0)`;
    }

    // 5b. Sticky Rotary Drink Showcase
    if (targetEl && slides.length > 0) {
      const rect = targetEl.getBoundingClientRect();
      const scrollable = Math.max(1, targetEl.offsetHeight - window.innerHeight);

      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const rawProgress = -rect.top / scrollable;
        const progress = Math.max(0, Math.min(1, rawProgress));
        const curAngle = progress * totalSweep;

        let detectedIdx = activeIdx;
        let activeBgColor = null;

        slides.forEach((slide, i) => {
          const baseAngle = i * stepAngle;
          const startAngle = rect.top > 0 ? -baseAngle : curAngle - baseAngle;
          slide.style.transform = reduced ? 'rotate(0deg)' : `rotate(${startAngle.toFixed(2)}deg)`;

          const isInWindow = reduced
            ? Math.round(progress * (count - 1)) === i
            : startAngle >= -46 && startAngle <= 28;

          if (isInWindow) {
            slide.classList.add('in');
            detectedIdx = i;
            activeBgColor = slide.querySelector('figure')?.dataset.bgcolor || null;
          } else {
            slide.classList.remove('in');
          }
        });

        if (activeBgColor) {
          targetEl.style.backgroundColor = activeBgColor;
        }
        updateSeriesUI(detectedIdx);

        // Gentle auto-snap when user stops scrolling inside rotary zone (desktop smooth mode)
        if (!reduced && rect.top < -20 && rect.bottom > window.innerHeight + 20 && scrollState.winW > 768) {
          if (settleTimer) window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(() => {
            const snapIdx = Math.round(progress * (count - 1));
            const snapProgress = snapIdx / (count - 1);
            if (Math.abs(progress - snapProgress) > 0.035 && !isSnapping) {
              scrollToSeries(snapIdx);
            }
          }, 420);
        }
      }
    }

    // 5c. Curved SVG textPath scrub
    if (ovalSection && ovalTextPath) {
      if (scrollState.winW > 500 && !reduced) {
        const oRect = ovalSection.getBoundingClientRect();
        if (oRect.top < window.innerHeight && oRect.bottom > 0) {
          const travelled = window.innerHeight - oRect.top;
          const offsetPct = -(travelled * 0.018);
          ovalTextPath.setAttribute('startOffset', `${offsetPct.toFixed(2)}%`);
        }
      } else {
        ovalTextPath.setAttribute('startOffset', '0%');
      }
    }
  });

  cleanups.push(unsubScroll);
  cleanups.push(() => {
    if (settleTimer) window.clearTimeout(settleTimer);
  });

  return () => {
    for (const fn of cleanups) fn();
  };
}

