const pages = document.querySelectorAll('.page');
const htmlRoot = document.getElementById('html-root');
const shapes = document.querySelectorAll('.geo-shape, .code-symbol');

const allFaces = [];
pages.forEach((page) => {
  const front = page.querySelector('.front');
  const back = page.querySelector('.back');
  if (front) allFaces.push({ page, face: front });
  if (back) allFaces.push({ page, face: back });
});

let mobileStep = 0;

function isMobile() {
  return window.innerWidth <= 768;
}

function renderMobileFace() {
  pages.forEach((p) => p.classList.remove('active-mobile-page'));
  allFaces.forEach((item) => item.face.classList.remove('active-face'));

  const current = allFaces[mobileStep];
  if (current) {
    current.page.classList.add('active-mobile-page');
    current.face.classList.add('active-face');
  }
}

function updateZIndex() {
  pages.forEach((page, index) => {
    if (page.classList.contains('flipped')) {
      page.style.zIndex = index + 1;
    } else {
      page.style.zIndex = pages.length - index;
    }
  });
}

if (isMobile()) {
  renderMobileFace();
} else {
  updateZIndex();
}

window.addEventListener('resize', () => {
  if (isMobile()) {
    renderMobileFace();
  } else {
    pages.forEach((p) => p.classList.remove('active-mobile-page'));
    allFaces.forEach((item) => item.face.classList.remove('active-face'));
    updateZIndex();
  }
});

pages.forEach((page) => {
  page.addEventListener('click', (e) => {
    if (
      e.target.closest('a') ||
      e.target.closest('button') ||
      e.target.closest('.skill-card')
    ) {
      return;
    }

    if (isMobile()) {
      mobileStep = (mobileStep + 1) % allFaces.length;
      renderMobileFace();
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
  if (isMobile()) return;
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

  if (isMobile()) {
    mobileStep = 0;
    renderMobileFace();
  } else {
    pages.forEach((p) => p.classList.remove('flipped'));
    setTimeout(updateZIndex, 100);
  }
}
