import { prefersReducedMotion } from '../core/raf.js';
import { scrollToTarget, updateScrollEngine } from '../core/scroll.js';
import { followCursorPara } from '../effects/followCursorPara.js';

export function initDrinksView(container = document) {
  const cleanups = [];
  const timers = new Set();

  const safeTimeout = (fn, delay) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, delay);
    timers.add(id);
    return id;
  };

  function swapBgSlide(figures, nextIdx, prevIdx) {
    figures.forEach((fig) => {
      fig.style.zIndex = '0';
      fig.classList.remove('active');
    });
    if (figures[prevIdx]) figures[prevIdx].style.zIndex = '1';
    if (figures[nextIdx]) {
      figures[nextIdx].style.zIndex = '2';
      figures[nextIdx].classList.add('active');
    }
  }

  function swapTextPanels(nodes, idx, delay = 420) {
    safeTimeout(() => {
      nodes.forEach((el, i) => {
        el.style.display = i === idx ? 'block' : 'none';
      });
    }, delay);
  }

  // 1. Top Auto-Playing Cup Slider (.cup_slider)
  const cupSlider = container.querySelector('.cup_slider');
  if (cupSlider) {
    const cupMainFig = cupSlider.querySelector('.main_drink figure');
    const cupStrip = cupSlider.querySelector('.cup_smimg > div');
    const bgFigures = Array.from(cupSlider.querySelectorAll('.bgimg figure'));
    const desItems = Array.from(cupSlider.querySelectorAll('.cup_des > div'));
    const seriesTexts = Array.from(cupSlider.querySelectorAll('.series_text > div'));
    const bellTexts = Array.from(cupSlider.querySelectorAll('.cup_title .bellfont > div'));

    let cupPreIdx = 0;
    let isChanging = false;
    let cupInterval = null;

    // Clone thumbnails once for infinite conveyor strip
    const initialCups = Array.from(cupSlider.querySelectorAll('.cup_smimg .cups'));
    initialCups.forEach((cup) => {
      const clone = cup.cloneNode(true);
      cupStrip.appendChild(clone);
    });

    function changeCup(stepIndex, immediate = false) {
      if (isChanging) return;
      const cupArr = Array.from(cupSlider.querySelectorAll('.cup_smimg .cups'));
      const targetCup = cupArr[stepIndex];
      if (!targetCup) return;

      const curNav = Math.max(0, Number(targetCup.dataset.nav || 1) - 1);
      const imgSrc = targetCup.querySelector('img')?.getAttribute('src') || '';
      const imgAlt = targetCup.querySelector('img')?.getAttribute('alt') || 'Hai Cofe Drink';
      const cupWidth = targetCup.offsetWidth || 150;

      if (immediate) {
        cupMainFig.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}" />`;
        cupSlider.style.backgroundColor = targetCup.dataset.color || '#FAFAFA';
        swapBgSlide(bgFigures, curNav, curNav);
        desItems.forEach((el, i) => { el.style.display = i === curNav ? 'block' : 'none'; });
        seriesTexts.forEach((el, i) => { el.style.display = i === curNav ? 'block' : 'none'; });
        bellTexts.forEach((el, i) => { el.style.display = i === curNav ? 'block' : 'none'; });
        cupStrip.style.transform = `translate3d(-${cupWidth - 1}px, 0, 0)`;
        cupPreIdx = curNav;
        return;
      }

      isChanging = true;
      cupSlider.classList.add('isChanging');

      const nextImg = document.createElement('img');
      nextImg.setAttribute('src', imgSrc);
      nextImg.setAttribute('alt', imgAlt);
      cupMainFig.appendChild(nextImg);

      const movedVal = cupWidth * (stepIndex + 1);
      cupStrip.style.transform = `translate3d(-${movedVal}px, 0, 0)`;

      cupSlider.style.backgroundColor = targetCup.dataset.color || '#FAFAFA';
      swapBgSlide(bgFigures, curNav, cupPreIdx);
      swapTextPanels(desItems, curNav);
      swapTextPanels(seriesTexts, curNav);
      swapTextPanels(bellTexts, curNav);

      safeTimeout(() => {
        cupPreIdx = curNav;
        while (cupMainFig.children.length > 1) {
          cupMainFig.children[0].remove();
        }
        cupSlider.classList.remove('isChanging');
        const currentItems = Array.from(cupSlider.querySelectorAll('.cup_smimg .cups'));
        for (let i = 0; i < stepIndex; i++) {
          if (currentItems[i]) cupStrip.appendChild(currentItems[i]);
        }
        cupStrip.style.transform = `translate3d(-${cupWidth - 1}px, 0, 0)`;
        isChanging = false;
      }, 1050);
    }

    const startAutoPlay = () => {
      if (prefersReducedMotion()) return;
      if (cupInterval) window.clearInterval(cupInterval);
      cupInterval = window.setInterval(() => {
        changeCup(1);
      }, 3200);
    };

    const onStripClick = (e) => {
      const clicked = e.target.closest('.cups');
      if (!clicked) return;
      const cupArr = Array.from(cupSlider.querySelectorAll('.cup_smimg .cups'));
      const idx = cupArr.indexOf(clicked);
      if (idx >= 0) {
        if (cupInterval) window.clearInterval(cupInterval);
        changeCup(idx);
        startAutoPlay();
      }
    };

    cupStrip.addEventListener('click', onStripClick);
    cleanups.push(() => cupStrip.removeEventListener('click', onStripClick));

    changeCup(0, true);
    startAutoPlay();

    cleanups.push(() => {
      if (cupInterval) window.clearInterval(cupInterval);
    });
  }

  // 2. French Cream Craft Slider (.cream_slide_wrap)
  const creamWrap = container.querySelector('.cream_slide_wrap');
  if (creamWrap) {
    const creamNavs = Array.from(creamWrap.querySelectorAll('.cream_navs li'));
    const creamLeaf = creamWrap.querySelector('.cream_navs i');
    const creamBigCupFig = creamWrap.querySelector('.cream_bigcup figure');
    const creamBgFigs = Array.from(creamWrap.querySelectorAll('.cream_bigimg figure'));
    const creamInfos = Array.from(creamWrap.querySelectorAll('.creaminfo'));
    const creamRibbons = Array.from(creamWrap.querySelectorAll('.criboon'));
    const ribbonInner = creamWrap.querySelector('.cream_ribbon > div');

    let creamPreIdx = 0;
    let creamBusy = false;

    if (ribbonInner) {
      cleanups.push(followCursorPara(ribbonInner, creamWrap));
    }

    function changeCream(idx, { immediate = false, scrollInto = false } = {}) {
      if (creamBusy || !creamNavs[idx]) return;

      if (scrollInto) {
        scrollToTarget(creamWrap, { offset: -80 });
      }

      const cupSrc = creamNavs[idx].dataset.cupimg || '';
      const cupAlt = creamNavs[idx].textContent?.trim() || 'French Cream';
      const itemH = creamNavs[0]?.offsetHeight || 40;

      creamNavs.forEach((li, i) => li.classList.toggle('active', i === idx));
      if (creamLeaf) {
        creamLeaf.style.top = `${itemH * idx}px`;
      }

      if (immediate) {
        creamBigCupFig.innerHTML = `<img src="${cupSrc}" alt="${cupAlt}" />`;
        swapBgSlide(creamBgFigs, idx, idx);
        creamInfos.forEach((el, i) => { el.style.display = i === idx ? 'block' : 'none'; });
        creamRibbons.forEach((el, i) => { el.style.display = i === idx ? 'block' : 'none'; });
        creamPreIdx = idx;
        return;
      }

      creamBusy = true;
      creamWrap.classList.add('isChanging');

      const nextImg = document.createElement('img');
      nextImg.setAttribute('src', cupSrc);
      nextImg.setAttribute('alt', cupAlt);
      creamBigCupFig.appendChild(nextImg);

      swapBgSlide(creamBgFigs, idx, creamPreIdx);
      swapTextPanels(creamInfos, idx);
      swapTextPanels(creamRibbons, idx);

      safeTimeout(() => {
        creamPreIdx = idx;
        while (creamBigCupFig.children.length > 1) {
          creamBigCupFig.children[0].remove();
        }
        creamWrap.classList.remove('isChanging');
        creamBusy = false;
      }, 1000);
    }

    creamNavs.forEach((li, idx) => {
      const onClick = () => {
        if (idx !== creamPreIdx) {
          changeCream(idx, { scrollInto: false });
        }
      };
      li.addEventListener('click', onClick);
      cleanups.push(() => li.removeEventListener('click', onClick));
    });

    changeCream(0, { immediate: true });
  }

  // 3. Sticky Cup + Accordion Menu (.drisec_c)
  const collapseItems = Array.from(container.querySelectorAll('.es_collapse'));
  const menuImgWrap = container.querySelector('#menuImg');
  const menuFigure = menuImgWrap?.querySelector('figure');

  if (collapseItems.length > 0 && menuFigure) {
    const firstUrl = collapseItems[0].dataset.img || '';
    const firstTitle = collapseItems[0].querySelector('.me_title')?.textContent?.trim() || 'Hai Cofe';
    menuFigure.innerHTML = `<img src="${firstUrl}" alt="${firstTitle}" />`;

    // Open first item initially for clear visual affordance
    const firstPanel = collapseItems[0].querySelector('.me_des');
    if (firstPanel && firstPanel.children[0]) {
      collapseItems[0].classList.add('open');
      firstPanel.style.height = `${firstPanel.children[0].offsetHeight}px`;
    }

    collapseItems.forEach((item) => {
      const headerTrigger = item.querySelector('.me_title');
      if (!headerTrigger) return;

      const onToggle = () => {
        const isOpen = item.classList.contains('open');

        collapseItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAns = other.querySelector('.me_des');
            if (otherAns) otherAns.style.height = '0px';
          }
        });

        const ans = item.querySelector('.me_des');
        const inner = ans?.children[0];
        if (ans && inner) {
          if (isOpen) {
            item.classList.remove('open');
            ans.style.height = '0px';
          } else {
            item.classList.add('open');
            ans.style.height = `${inner.offsetHeight}px`;
          }
        }

        safeTimeout(() => updateScrollEngine(), 720);

        // Cross-animate sticky cup image
        const imgUrl = item.dataset.img;
        if (imgUrl && menuImgWrap && !menuImgWrap.classList.contains('isChanging')) {
          menuImgWrap.classList.add('isChanging');
          const nextImg = document.createElement('img');
          nextImg.setAttribute('src', imgUrl);
          nextImg.setAttribute('alt', headerTrigger.textContent?.trim() || 'Hai Cofe Drink');
          menuFigure.appendChild(nextImg);

          safeTimeout(() => {
            while (menuFigure.children.length > 1) {
              menuFigure.children[0].remove();
            }
            menuImgWrap.classList.remove('isChanging');
          }, 1000);
        }
      };

      headerTrigger.addEventListener('click', onToggle);
      cleanups.push(() => headerTrigger.removeEventListener('click', onToggle));
    });
  }

  return () => {
    for (const id of timers) window.clearTimeout(id);
    timers.clear();
    for (const fn of cleanups) fn();
  };
}

