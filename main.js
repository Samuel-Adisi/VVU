/* ============================================
   VVU DIGITAL PORTAL — MAIN.JS
   Shared: Navbar, Image Slider (Task 1)
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlider();
  setActiveNav();
});

/* ── NAVBAR ─────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll: add .scrolled class
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── ACTIVE NAV LINK (Task 5: highlight active link) ── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('#')) {
      const linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === page) link.classList.add('active');
      else if (page === '' && linkPage === 'index.html') link.classList.add('active');
    }
  });
}

/* ── IMAGE SLIDER (Task 1: auto + manual next button) ── */
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!slides.length) return;

  let current  = 0;
  let autoTimer = null;
  const INTERVAL = 5000; // auto-advance every 5 seconds

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL); // automatic advance
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // Manual next button (Task 1 JS requirement)
  nextBtn?.addEventListener('click', () => { next(); startAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); startAuto(); });

  // Dot buttons
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  // Touch/swipe support (mobile friendly — Task 5)
  let touchStartX = 0;
  const sliderEl = document.getElementById('slider');
  sliderEl?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  sliderEl?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  // Pause auto on hover
  sliderEl?.addEventListener('mouseenter', stopAuto);
  sliderEl?.addEventListener('mouseleave', startAuto);

  startAuto(); // begin automatic sliding
}