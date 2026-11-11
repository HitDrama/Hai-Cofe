/**
 * Displays a pill toast notification matching ES.message()
 */
export function showToast(type = 'success', text = '', icon = 'ok') {
  const msgWrap = document.createElement('div');
  const msgInner = document.createElement('div');
  const msgText = document.createElement('p');

  msgWrap.className = `message ${type}`;
  msgWrap.setAttribute('role', 'status');
  msgWrap.setAttribute('aria-live', 'polite');
  msgInner.className = 'msg_inner';

  const iconEl = document.createElement('i');
  iconEl.className = `icon-${icon}`;
  const spanEl = document.createElement('span');
  spanEl.textContent = text;

  msgText.appendChild(iconEl);
  msgText.appendChild(spanEl);
  msgInner.appendChild(msgText);
  msgWrap.appendChild(msgInner);
  document.body.appendChild(msgWrap);

  window.setTimeout(() => {
    msgWrap.classList.add('leave');
  }, 2200);
  window.setTimeout(() => {
    msgWrap.remove();
  }, 2700);
}

/**
 * Opens an accessible craft story / video showcase modal matching ESvideoPopup
 */
export function openCraftModal({ title, subtitle, description, image }) {
  const existing = document.querySelector('.espopup');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'espopup';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title || 'Hai Cofe Craft Film');

  const inner = document.createElement('div');
  inner.className = 'inner';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'closer';
  closeBtn.setAttribute('aria-label', 'Đóng cửa sổ');

  const content = document.createElement('div');
  content.style.maxWidth = '640px';
  content.innerHTML = `
    <figure style="max-height: 42vh; overflow: hidden; margin-bottom: 1.5rem; border-radius: 4px;">
      <img src="${image}" alt="${title}" style="width: 100%; height: 42vh; object-fit: cover;" />
    </figure>
    <p class="bellfont" style="color: var(--text-accent-aa); font-size: 1.2rem; letter-spacing: 2px;">${subtitle}</p>
    <h3 style="color: var(--text-strong); margin: 0.4rem 0 0.8rem;">${title}</h3>
    <p style="color: var(--text-muted); font-size: 0.95rem;">${description}</p>
  `;

  inner.appendChild(closeBtn);
  inner.appendChild(content);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  closeBtn.focus();

  const close = () => {
    window.removeEventListener('keydown', onKey);
    overlay.classList.add('leave');
    window.setTimeout(() => overlay.remove(), 400);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener('keydown', onKey);
}

