/**
 * Lindner Foto — Mobile UX & Interactive Architecture
 * Touch-optimized carousels, responsive sheet drawer & smooth reveal
 */

const assetBase = (typeof window !== 'undefined' && (window.location.pathname.startsWith('/fotografia') || window.location.pathname.startsWith('/lindner_site_preview')))
  ? '/lindner_site_preview/lindner_site/'
  : '';

const galleries = {
  dona: Array.from({ length: 6 }, (_, i) => `${assetBase}assets/media_DdxIog2kZbc_photo_dl_3995008048258397578_6941749006_${i + 1}.webp`),
  idade: Array.from({ length: 9 }, (_, i) => `${assetBase}assets/media_DcJYxkNETH1_photo_dl_3965809525827004279_6941749006_${i + 1}.webp`),
  medidas: Array.from({ length: 8 }, (_, i) => `${assetBase}assets/media_DbPRJ1uADeV_photo_dl_3949450752883216489_6941749006_${i + 1}.webp`),
  familia: Array.from({ length: 11 }, (_, i) => `${assetBase}assets/media_DdZPW7tEXdm_photo_dl_3988286354118595560_6941749006_${i + 1}.webp`)
};

function initCarousels() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preload all gallery images in background
  Object.values(galleries).forEach((imgs) => {
    imgs.forEach((src) => {
      const p = new Image();
      p.src = src;
    });
  });

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const key = root.dataset.carousel;
    const images = galleries[key];
    if (!images || !images.length) return;

    const frame = root.querySelector('.frame');
    const track = root.querySelector('.track');
    const dotsContainer = root.querySelector('.dots');
    const counter = root.querySelector('.counter');
    const prevBtn = root.querySelector('.prev');
    const nextBtn = root.querySelector('.next');

    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // Create Slides
    images.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} de ${images.length}`);

      const img = document.createElement('img');
      img.src = src;
      img.alt = `${root.getAttribute('aria-label') || 'Foto'} — registro ${i + 1}`;
      img.loading = 'eager';
      img.decoding = 'async';

      const cap = document.createElement('span');
      cap.className = 'caption';
      cap.textContent = `${String(i + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;

      slide.append(img, cap);
      track.appendChild(slide);

      // Create Dot with accessible touch area
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Ver foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dotButtons = Array.from(dotsContainer.children);

    function render() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
      dotButtons.forEach((btn, i) => {
        const isActive = i === currentIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function goTo(n) {
      currentIndex = (n + images.length) % images.length;
      render();
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoTimer);
      if (!isReduced) {
        autoTimer = setInterval(() => goTo(currentIndex + 1), 4000);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Touch Gestures
    frame.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    frame.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        goTo(currentIndex + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });

    // Pointer events fallback for desktop click-drag
    let pointerStartX = null;
    frame.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') pointerStartX = e.clientX;
    });
    frame.addEventListener('pointerup', (e) => {
      if (pointerStartX === null) return;
      const dx = e.clientX - pointerStartX;
      if (Math.abs(dx) > 40) goTo(currentIndex + (dx < 0 ? 1 : -1));
      pointerStartX = null;
    });

    root.addEventListener('mouseenter', () => clearInterval(autoTimer));
    root.addEventListener('mouseleave', resetAutoplay);

    render();
    resetAutoplay();
  });
}

function initDrawer() {
  const menuBtn = document.querySelector('.menu-btn');
  const backdrop = document.querySelector('#drawerBackdrop');
  const closeBtn = document.querySelector('#drawerClose');
  const links = document.querySelectorAll('.drawer-link');

  if (!menuBtn || !backdrop) return;

  function toggle(open) {
    backdrop.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-locked', open);
    if (open && closeBtn) closeBtn.focus();
  }

  menuBtn.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) toggle(false);
  });
  links.forEach(l => l.addEventListener('click', () => toggle(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) toggle(false);
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '120px 0px 40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('in'));
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
  initDrawer();
  initScrollReveal();
});
