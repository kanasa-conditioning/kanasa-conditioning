/* ================================================================
   KANASA Conditioning Studio — main.js
   GSAP 3.12.5 + ScrollTrigger
   ================================================================ */

(function () {
  'use strict';

  /* ── Reduced Motion Check ── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ── Register GSAP Plugins ── */
  gsap.registerPlugin(ScrollTrigger);

  /* ================================================================
     §5.2 In-view Reveal (all pages)
     ================================================================ */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    reveals.forEach(function (el) {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    /* Stagger groups */
    var staggerGroups = document.querySelectorAll('.reveal-stagger');
    staggerGroups.forEach(function (group) {
      var children = group.children;
      if (!children.length) return;

      gsap.fromTo(
        children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }

  /* ================================================================
     §5.1 SVG Connection Line Animation (HOME only)
     ================================================================ */
  function initSVGLines() {
    var paths = document.querySelectorAll('.svg-line path');
    if (!paths.length || prefersReducedMotion) return;

    paths.forEach(function (path) {
      var length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      var trigger = path.closest('.section') || path.parentElement;

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
        },
      });
    });
  }

  /* ================================================================
     §5.3 Parallax (background images)
     ================================================================ */
  function initParallax() {
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length || prefersReducedMotion) return;

    parallaxElements.forEach(function (el) {
      gsap.fromTo(
        el,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  /* ================================================================
     §5.4 Custom Cursor (pointer: fine only)
     ================================================================ */
  function initCursor() {
    if (prefersReducedMotion) return;
    var isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    var dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    document.body.appendChild(dot);

    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    /* Hover scale on interactive elements */
    var interactiveEls = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, label'
    );
    interactiveEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('is-hover');
      });
    });
  }

  /* ================================================================
     Header Scroll State
     ================================================================ */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var scrollThreshold = 80;

    function checkScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ================================================================
     Mobile Navigation
     ================================================================ */
  function initMobileNav() {
    var hamburger = document.querySelector('.header__hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    var links = mobileNav.querySelectorAll('.mobile-nav__link');

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.contains('is-open');
      hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================================================================
     FAQ Accordion
     ================================================================ */
  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        /* Close all others */
        items.forEach(function (otherItem) {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            var otherAnswer = otherItem.querySelector('.faq__answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ================================================================
     Journal Modal
     ================================================================ */
  function initJournalModals() {
    var cards = document.querySelectorAll('[data-journal]');
    var modals = document.querySelectorAll('.journal-modal');
    if (!cards.length || !modals.length) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var targetId = card.getAttribute('data-journal');
        var modal = document.getElementById(targetId);
        if (!modal) return;

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    /* Close buttons */
    var closeButtons = document.querySelectorAll('.journal-modal__close');
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = btn.closest('.journal-modal');
        if (modal) {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });

    /* Close on ESC */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        modals.forEach(function (modal) {
          if (modal.classList.contains('is-open')) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
          }
        });
      }
    });
  }

  /* ================================================================
     Contact Form (GitHub Pages — no Netlify Forms)
     ================================================================ */
  function initContactForm() {
    var form = document.querySelector('.contact__form form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var action = form.getAttribute('action');

      if (!action) {
        /* Fallback: show success message */
        showFormSuccess(form);
        return;
      }

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            showFormSuccess(form);
          }
        })
        .catch(function () {
          /* Silent fail — show success anyway for UX */
          showFormSuccess(form);
        });
    });
  }

  function showFormSuccess(form) {
    form.style.display = 'none';
    var success = document.querySelector('.form__success');
    if (success) success.classList.add('is-visible');
  }

  /* ================================================================
     Smooth Scroll for Anchor Links
     ================================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var headerHeight = document.querySelector('.header')
          ? document.querySelector('.header').offsetHeight
          : 0;
        var top =
          target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ================================================================
     Image Hover Scale — §5.4
     ================================================================ */
  function initImageHover() {
    if (prefersReducedMotion) return;

    /* Already handled in CSS with transition: transform 0.6s */
    /* This function is a placeholder for any additional JS-driven hovers */
  }

  /* ================================================================
     Initialize All
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initReveal();
    initSVGLines();
    initParallax();
    initCursor();
    initFAQ();
    initJournalModals();
    initContactForm();
    initSmoothScroll();
    initImageHover();

    /* Refresh ScrollTrigger after all images loaded */
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  });
})();
