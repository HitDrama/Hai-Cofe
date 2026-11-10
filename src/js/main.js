import barba from '@barba/core';
import imagesLoaded from 'imagesloaded';
import '../styles/main.css';

import { clearAllRafTasks } from './core/raf.js';
import { destroyScrollEngine, initScrollEngine, updateScrollEngine } from './core/scroll.js';
import { closeNavDrawer, destroyHeader, initHeader, syncActiveNavLink } from './core/header.js';
import { initHomeView } from './views/home.js';
import { initAboutView } from './views/about.js';
import { initDrinksView } from './views/drinks.js';
import { initBlogView } from './views/blog.js';

let activeViewCleanup = null;

function mountNamespaceView(namespace, container) {
  if (activeViewCleanup) {
    activeViewCleanup();
    activeViewCleanup = null;
  }

  switch (namespace) {
    case 'home':
      activeViewCleanup = initHomeView(container);
      break;
    case 'about':
      activeViewCleanup = initAboutView(container);
      break;
    case 'drinks':
      activeViewCleanup = initDrinksView(container);
      break;
    case 'blog':
    case 'blogSingle':
      activeViewCleanup = initBlogView(container);
      break;
    default:
      break;
  }
}

function bootApp() {
  initScrollEngine();
  initHeader();

  const initialContainer = document.querySelector('[data-barba="container"]');
  const initialNamespace = initialContainer?.dataset.barbaNamespace || 'home';
  mountNamespaceView(initialNamespace, initialContainer || document);

  barba.init({
    debug: false,
    timeout: 15000,
    prevent: ({ el }) => el.hasAttribute('data-no-barba') || el.getAttribute('target') === '_blank',
    transitions: [
      {
        name: 'editorial-loader-transition',
        leave() {
          const done = this.async();
          closeNavDrawer();
          document.body.classList.remove('loaded');
          document.body.classList.add('loading');

          window.setTimeout(() => {
            if (activeViewCleanup) {
              activeViewCleanup();
              activeViewCleanup = null;
            }
            clearAllRafTasks();
            destroyHeader();
            destroyScrollEngine();
            done();
          }, 950);
        },
        after(data) {
          window.scrollTo(0, 0);
          initScrollEngine();
          initHeader();
          syncActiveNavLink();

          const nextContainer = data.next.container;
          const nextNamespace = data.next.namespace;
          mountNamespaceView(nextNamespace, nextContainer);

          imagesLoaded(nextContainer, () => {
            updateScrollEngine();
          });

          window.setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
          }, 380);

          window.setTimeout(() => {
            document.body.classList.remove('loaded');
          }, 1450);
        },
      },
    ],
  });
}

document.addEventListener('DOMContentLoaded', () => {
  imagesLoaded(document.body, () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    bootApp();
    window.setTimeout(() => {
      document.body.classList.remove('loaded');
    }, 1450);
  });
});

