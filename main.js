/* ============================================================
   VVU DIGITAL PORTAL — MAIN.JS
   Shared: Navbar (scroll + hamburger), Image Slider (Task 1)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlider();
});

/* ── NAVBAR ──────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Add .scrolled on scroll
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger open/close
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside the navbar
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) closeMenu();
    });
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── IMAGE SLIDER (Task 1: auto advance + manual next) ────── */
function initSlider() {
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;
  const DELAY   = 5000; // 5 seconds between auto-advances

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, DELAY); // automatic advance every 5s
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }

  // Manual next button (Task 1 JS requirement)
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  // Touch swipe (mobile — Task 5)
  const sliderEl = document.getElementById('slider');
  let touchStartX = 0;
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });
    // Pause auto on hover
    sliderEl.addEventListener('mouseenter', stopAuto);
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  startAuto(); // begin automatic sliding immediately
}