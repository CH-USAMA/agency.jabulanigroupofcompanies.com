/* ═══════════════════════════════════════════════════════
   Jabulani Tech Solutions — main.js  v2
   Theme · Cursor · Scroll Progress · Magnetic Buttons ·
   3D Card Tilt · Hero Load Animation · Nav · Scroll Reveals
   Counter · AJAX Form
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DARK MODE ────────────────────────────────────── */
  const themeToggle    = document.getElementById('themeToggle');
  const themeIcon      = document.getElementById('themeIcon');
  const themeToggleMob = document.getElementById('themeToggleMobile');
  const themeIconMob   = document.getElementById('themeIconMobile');
  const themeLabel     = document.getElementById('themeLabel');
  const DARK_KEY       = 'jts-theme';

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      [themeIcon, themeIconMob].forEach(function(i){ if(i) i.className = 'fa-solid fa-sun'; });
      if (themeLabel)    themeLabel.textContent = 'Switch to light mode';
      if (themeToggle)   themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      [themeIcon, themeIconMob].forEach(function(i){ if(i) i.className = 'fa-solid fa-moon'; });
      if (themeLabel)    themeLabel.textContent = 'Switch to dark mode';
      if (themeToggle)   themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  function getInitialTheme() {
    var s = localStorage.getItem(DARK_KEY);
    return s !== null ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme(getInitialTheme());

  function handleThemeClick() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    localStorage.setItem(DARK_KEY, !isDark ? 'dark' : 'light');
  }

  if (themeToggle)    themeToggle.addEventListener('click', handleThemeClick);
  if (themeToggleMob) themeToggleMob.addEventListener('click', handleThemeClick);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem(DARK_KEY)) applyTheme(e.matches);
  });


  /* ─── CUSTOM CURSOR ────────────────────────────────── */
  var cursorDot      = document.getElementById('cursorDot');
  var cursorFollower = document.getElementById('cursorFollower');
  var cursorLabel    = document.getElementById('cursorLabel');
  var isTouchDevice  = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorDot && cursorFollower && !isTouchDevice) {
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var fx = mx, fy = my;
    var rafRunning = false;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
      if (!rafRunning) { rafRunning = true; requestAnimationFrame(lerpFollower); }
    }, { passive: true });

    function lerpFollower() {
      fx += (mx - fx) * 0.10;
      fy += (my - fy) * 0.10;
      cursorFollower.style.left = fx + 'px';
      cursorFollower.style.top  = fy + 'px';
      if (Math.abs(mx - fx) > 0.2 || Math.abs(my - fy) > 0.2) {
        requestAnimationFrame(lerpFollower);
      } else {
        rafRunning = false;
      }
    }

    document.addEventListener('mouseleave', function() {
      cursorDot.style.opacity      = '0';
      cursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      cursorDot.style.opacity      = '1';
      cursorFollower.style.opacity = '1';
    });

    /* Hover state on links & buttons */
    document.querySelectorAll('a, button').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursorDot.classList.add('is-link');
        cursorFollower.classList.add('is-link');
      });
      el.addEventListener('mouseleave', function() {
        cursorDot.classList.remove('is-link');
        cursorFollower.classList.remove('is-link');
      });
    });

    /* Portfolio cards — show "View" label */
    document.querySelectorAll('.card--portfolio').forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        cursorFollower.classList.add('is-view');
      });
      card.addEventListener('mouseleave', function() {
        cursorFollower.classList.remove('is-view');
      });
    });
  }


  /* ─── SCROLL PROGRESS BAR ──────────────────────────── */
  var progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = 'scaleX(' + pct + ')';
  }


  /* ─── NAV: scrolled state ──────────────────────────── */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', function() {
    updateNav();
    updateProgress();
    setActiveLink();
  }, { passive: true });

  updateNav();
  updateProgress();


  /* ─── MOBILE MENU ──────────────────────────────────── */
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobileMenu');
  var mobileLinks = document.querySelectorAll('[data-mobile-link]');

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    hamburger && hamburger.classList.remove('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    hamburger && hamburger.classList.add('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });
  }
  mobileLinks.forEach(function(l) { l.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });


  /* ─── SMOOTH SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 56;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });


  /* ─── HERO LOAD ANIMATION ──────────────────────────── */
  /* Fires immediately on DOM ready — hero is always above fold */
  document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(function() {
      document.body.classList.add('page-loaded');
    });
  });


  /* ─── SCROLL REVEAL ────────────────────────────────── */
  var animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(function(el) { revealObserver.observe(el); });
  } else {
    animatedEls.forEach(function(el) { el.classList.add('is-visible'); });
  }


  /* ─── COUNTER ANIMATION ────────────────────────────── */
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var start    = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { counterObserver.observe(el); });
  }


  /* ─── MAGNETIC BUTTONS ─────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll('.btn--primary.btn--lg').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r  = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        var dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        btn.style.transition = 'transform 0.08s linear';
        btn.style.transform  = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
      });
    });
  }


  /* ─── 3D CARD TILT ─────────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll('.card--portfolio').forEach(function(card) {
      var inTransition = false;

      card.addEventListener('mousemove', function(e) {
        var r  = card.getBoundingClientRect();
        var x  = ((e.clientX - r.left)  / r.width  - 0.5) * 14;
        var y  = ((e.clientY - r.top)   / r.height - 0.5) * -14;
        card.style.transition = 'transform 0.06s linear, box-shadow 0.3s ease';
        card.style.transform  = 'perspective(900px) rotateY(' + x + 'deg) rotateX(' + y + 'deg) translateZ(6px)';
        card.style.boxShadow  = '0 24px 60px rgba(70,65,240,' + (0.08 + Math.abs(x + y) * 0.004) + ')';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
      });
    });

    /* Subtle tilt on service cards */
    document.querySelectorAll('.card--service').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
        var y = ((e.clientY - r.top)  / r.height - 0.5) * -7;
        card.style.transition = 'transform 0.08s linear';
        card.style.transform  = 'perspective(900px) rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = '';
      });
    });
  }


  /* ─── ACTIVE NAV LINK ──────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('[data-nav-link]');

  function setActiveLink() {
    var current = '';
    sections.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 80) current = s.getAttribute('id');
    });
    navLinks.forEach(function(l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
    });
  }


  /* ─── CONTACT FORM (AJAX) ──────────────────────────── */
  var form       = document.getElementById('contactForm');
  var submitBtn  = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (form.querySelector('[name="_honeypot"]').value) return;

      var name    = form.querySelector('#name').value.trim();
      var email   = form.querySelector('#email').value.trim();
      var message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) { showStatus('error', 'Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus('error', 'Please enter a valid email address.'); return; }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      clearStatus();

      fetch('form.php', { method: 'POST', body: new FormData(form) })
        .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function(j) {
          if (j.success) { showStatus('success', j.message); form.reset(); }
          else showStatus('error', j.message);
        })
        .catch(function() {
          var sub  = encodeURIComponent('Enquiry from ' + name);
          var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
          window.location.href = 'mailto:info@jabulanigroupofcompanies.co.za?subject=' + sub + '&body=' + body;
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Enquiry <i class="fa-solid fa-paper-plane"></i>';
        });
    });
  }

  function showStatus(type, msg) {
    if (!formStatus) return;
    formStatus.className = 'form-status is-' + type;
    formStatus.textContent = msg;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function clearStatus() {
    if (!formStatus) return;
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }

})();
