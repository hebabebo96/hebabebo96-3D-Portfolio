const pages = document.querySelectorAll('.page');
const htmlRoot = document.getElementById('html-root');
const shapes = document.querySelectorAll('.geo-shape, .code-symbol');

function updateZIndex() {
  pages.forEach((page, index) => {
    if (page.classList.contains('flipped')) {
      page.style.zIndex = index + 1;
    } else {
      page.style.zIndex = pages.length - index;
    }
  });
}
updateZIndex();

pages.forEach((page) => {
  page.addEventListener('click', (e) => {
    if (
      e.target.closest('a') ||
      e.target.closest('button') ||
      e.target.closest('.skill-card')
    ) {
      return;
    }

    page.classList.toggle('flipped');
    setTimeout(updateZIndex, 300);
  });
});

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  shapes.forEach((shape) => {
    const speed = parseFloat(shape.getAttribute('data-speed')) || 20;
    const moveX = x * speed;
    const moveY = y * speed;
    shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
});

document.addEventListener('keydown', (e) => {
  const isRTL = htmlRoot.getAttribute('dir') === 'rtl';
  if (e.key === 'ArrowLeft') {
    for (let i = 0; i < pages.length; i++) {
      if (isRTL && !pages[i].classList.contains('flipped')) {
        pages[i].classList.add('flipped');
        setTimeout(updateZIndex, 300);
        break;
      }
    }
    if (!isRTL) {
      for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i].classList.contains('flipped')) {
          pages[i].classList.remove('flipped');
          setTimeout(updateZIndex, 300);
          break;
        }
      }
    }
  } else if (e.key === 'ArrowRight') {
    if (isRTL) {
      for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i].classList.contains('flipped')) {
          pages[i].classList.remove('flipped');
          setTimeout(updateZIndex, 300);
          break;
        }
      }
    } else {
      for (let i = 0; i < pages.length; i++) {
        if (!pages[i].classList.contains('flipped')) {
          pages[i].classList.add('flipped');
          setTimeout(updateZIndex, 300);
          break;
        }
      }
    }
  }
});

function toggleLanguage(event) {
  event.stopPropagation();
  const currentLang = htmlRoot.getAttribute('lang');
  const newLang = currentLang === 'ar' ? 'en' : 'ar';

  htmlRoot.setAttribute('lang', newLang);
  htmlRoot.setAttribute('dir', currentLang === 'ar' ? 'ltr' : 'rtl');

  const langBtnSpan = document.querySelector('.lang-switch-btn span');
  langBtnSpan.innerText = currentLang === 'ar' ? 'العربية' : 'English';

  document.querySelectorAll('[data-ar]').forEach((el) => {
    const targetText = el.getAttribute(`data-${newLang}`);
    if (targetText) {
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = icon.outerHTML + ' ' + targetText;
      } else {
        el.innerText = targetText;
      }
    }
  });

  pages.forEach((p) => p.classList.remove('flipped'));
  setTimeout(updateZIndex, 100);
}