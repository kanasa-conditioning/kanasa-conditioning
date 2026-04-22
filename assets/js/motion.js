/* ================================================================
   KANASA Conditioning Studio — Motion Layer v4.1
   GSAP + Lenis + IntersectionObserver
   ================================================================ */

(function () {
  'use strict';

  /* ── 0. Reduced Motion Gate ─────────────────────────────────── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Lenis Smooth Scroll ─────────────────────────────────── */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* ScrollTrigger との連携 */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ── 2. GSAP Animations ─────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    /* ScrollTrigger mobile config */
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ── Hero: Text Stagger ── */
    var heroSub   = document.querySelector('.hero-sub');
    var heroMain  = document.querySelector('.hero-main');
    var heroLead  = document.querySelector('.hero-lead');
    var heroSlide = document.querySelector('.hero-slideshow');

    if (heroMain) {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
      if (heroSub) {
        tl.fromTo(heroSub,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 1.0 }, 0.1);
      }
      tl.fromTo(heroMain,
        { opacity: 0, y: 24, filter: 'blur(10px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)' }, 0.3);
      if (heroLead) {
        tl.fromTo(heroLead,
          { opacity: 0, y: 18, filter: 'blur(6px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 1.0 }, 0.6);
      }
      if (heroSlide) {
        tl.fromTo(heroSlide,
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 1.2 }, 0.8);
      }
    }

    /* ── Blur Reveal: all .reveal elements ── */
    document.querySelectorAll('.reveal:not(.hero-main):not(.hero-sub):not(.hero-lead):not(.hero-slideshow)').forEach(function (el) {
      /* skip elements already animated by hero timeline */
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'expo.out'
          });
          el.classList.add('active');
        }
      });
    });

    /* ── Stagger: reveal-stagger groups ── */
    document.querySelectorAll('.reveal-stagger').forEach(function (group) {
      var children = Array.from(group.children);
      ScrollTrigger.create({
        trigger: group,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.1
          });
          group.classList.add('active');
        }
      });
    });

    /* ── Image Reveal (clip-path) — Method & Profile — PC only ── */
    if (!isMobile) {
      document.querySelectorAll('.method-card-img img').forEach(function (img) {
        gsap.set(img, { clipPath: 'inset(0 100% 0 0)' });
        ScrollTrigger.create({
          trigger: img.closest('.method-card'),
          start: 'top 80%',
          once: true,
          onEnter: function () {
            gsap.to(img, {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.2,
              ease: 'expo.out'
            });
          }
        });
      });
    }

    /* ── lx-rule draw-in ── */
    document.querySelectorAll('.lx-rule').forEach(function (rule) {
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
      ScrollTrigger.create({
        trigger: rule,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(rule, {
            scaleX: 1,
            duration: 1.0,
            ease: 'expo.out'
          });
        }
      });
    });

    /* ── Hero Parallax (PC only) ── */
    if (!isMobile) {
      var heroSlideshow = document.querySelector('.hero-slideshow');
      if (heroSlideshow) {
        gsap.to(heroSlideshow, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }

  /* ── 3. Scroll Reveal Fallback (no GSAP) ───────────────────── */
  function initRevealFallback() {
    if (typeof gsap !== 'undefined') return; /* GSAP handles it */

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 4. Header Scroll Effect ────────────────────────────────── */
  function initHeader() {
    var header = document.querySelector('header');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 5. Hero Slideshow ──────────────────────────────────────── */
  function initHeroSlideshow() {
    var slides = document.querySelectorAll('.hero-slideshow img');
    if (slides.length < 2) return;

    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('slide-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('slide-active');
    }, 4500);
  }

  /* ── 6. Profile Slideshow ───────────────────────────────────── */
  function initProfileSlideshow() {
    var container = document.getElementById('profileSlideshow');
    if (!container) return;

    var imgs = container.querySelectorAll('img');
    if (imgs.length < 2) return;

    var current = 0;
    setInterval(function () {
      imgs[current].classList.remove('is-active');
      current = (current + 1) % imgs.length;
      imgs[current].classList.add('is-active');
    }, 3500);
  }

  /* ── 7. Hamburger Menu ──────────────────────────────────────── */
  function initHamburger() {
    var btn      = document.getElementById('hamburgerBtn');
    var overlay  = document.getElementById('navOverlay');
    var drawer   = document.getElementById('navDrawer');
    var closeBtn = document.getElementById('drawerClose');

    if (!btn || !drawer) return;

    function openMenu() {
      btn.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      drawer.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      btn.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      drawer.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay)  overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.drawer-link').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ── 8. FAQ Accordion ───────────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var wrap = item.querySelector('.faq-answer-wrap');
        var isOpen = item.classList.contains('is-open');

        /* 他を閉じる */
        document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-answer-wrap').style.maxHeight = '0';
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          wrap.style.maxHeight = '0';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          wrap.style.maxHeight = wrap.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── 9. Read More Expander ──────────────────────────────────── */
  function initReadMore() {
    document.querySelectorAll('.readmore-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        var wrap = document.querySelector('.readmore-wrap[data-readmore="' + targetId + '"]');
        if (!wrap) return;

        var isOpen = wrap.classList.contains('is-open');

        if (isOpen) {
          wrap.style.maxHeight = '0';
          wrap.classList.remove('is-open');
          btn.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          if (btn.textContent.includes('CLOSE')) {
            btn.textContent = 'READ MORE';
          } else if (btn.textContent.includes('HIDE')) {
            btn.textContent = 'VIEW SOAP DETAIL';
          }
        } else {
          wrap.style.maxHeight = wrap.scrollHeight + 'px';
          wrap.classList.add('is-open');
          btn.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          if (btn.textContent.includes('VIEW SOAP')) {
            btn.textContent = 'HIDE DETAIL';
          } else {
            btn.textContent = 'CLOSE';
          }
        }
      });
    });
  }

  /* ── 10. Contact Form ───────────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);

      fetch(form.action, { method: 'POST', body: data })
        .then(function () {
          form.style.display = 'none';
          var success = document.getElementById('contactSuccess');
          if (success) success.classList.add('show');
        })
        .catch(function () {
          alert('送信に失敗しました。お手数ですが時間をおいて再度お試しいただくか、直接メールにてご連絡ください。');
        });
    });
  }

  /* ── 11. Cursor Hover (PC only) ─────────────────────────────── */
  function initCursorHover() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var interactables = document.querySelectorAll('a, button, [role="button"]');
    interactables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ── 12. Flow Arrow SVG Draw ────────────────────────────────── */
  function initFlowArrow() {
    var svg  = document.querySelector('.flow-arrow');
    var path = svg && svg.querySelector('.flow-arrow__path');
    if (!svg || !path) return;

    /* Read rendered height after layout */
    var h = svg.getBoundingClientRect().height || 400;
    var cx       = 20;   /* centre of 40px column */
    var headSize = 7;
    var tipY     = h - 4;
    /* Combined path: shaft then arrowhead chevron */
    var d =
      'M ' + cx + ' 0 L ' + cx + ' ' + (tipY - headSize) +
      ' M ' + (cx - headSize) + ' ' + (tipY - headSize) +
      ' L ' + cx + ' ' + tipY +
      ' L ' + (cx + headSize) + ' ' + (tipY - headSize);
    path.setAttribute('d', d);

    var len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;

    if (prefersReduced) {
      path.style.strokeDashoffset = 0;
      return;
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: svg.closest('.flow-timeline'),
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3.6,
            delay: 0.3,
            ease: 'expo.out'
          });
        }
      });
    } else {
      /* CSS fallback when GSAP unavailable */
      path.style.transition = 'stroke-dashoffset 3600ms 300ms cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(function () {
        path.style.strokeDashoffset = 0;
      });
    }
  }

  /* ── 13. Method Line Draw ──────────────────────────────────── */
  function initMethodLine() {
    var bar  = document.querySelector('.method-line-bar');
    var line = bar && bar.querySelector('.method-line__shaft');
    if (!bar || !line) return;

    var len = 1000; /* matches SVG viewBox width */
    line.style.strokeDasharray  = len;
    line.style.strokeDashoffset = len;

    var dots = bar.querySelectorAll('.method-line__dot');

    if (prefersReduced) {
      line.style.strokeDashoffset = 0;
      dots.forEach(function (d) { d.style.opacity = '1'; });
      return;
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: bar.closest('.method-grid-wrap'),
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'expo.out'
          });
          gsap.to(dots, {
            opacity: 1,
            duration: 0.35,
            stagger: 0.3,
            delay: 0.1
          });
        }
      });
    } else {
      line.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(function () { line.style.strokeDashoffset = 0; });
      dots.forEach(function (d, i) {
        d.style.transition = 'opacity 350ms ' + (100 + i * 300) + 'ms ease';
        requestAnimationFrame(function () { d.style.opacity = '1'; });
      });
    }
  }

  /* ── Boot ───────────────────────────────────────────────────── */
  function boot() {
    if (prefersReduced) {
      /* Reduced motion: show everything immediately */
      document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right').forEach(function (el) {
        el.classList.add('active');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      document.querySelectorAll('.reveal-stagger > *').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
    } else {
      initLenis();
      initGSAP();
      initRevealFallback();
    }

    initHeader();
    initHeroSlideshow();
    initProfileSlideshow();
    initHamburger();
    initFAQ();
    initReadMore();
    initContactForm();
    initCursorHover();
    initFlowArrow();
    initMethodLine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
