/* ================================================================
   KANASA Conditioning Studio — Style Graft Motion Layer
   ----------------------------------------------------------------
   目的：style-graft.css と対になるアニメーション制御。
         IntersectionObserver + requestAnimationFrame ベース。

   設計原則：
     - IIFE でグローバル汚染を回避
     - 既存 IntersectionObserver（index.html 内 .active 付与）を壊さない
     - prefers-reduced-motion 最優先
     - GSAP / ScrollTrigger に依存しない（単体で動く）
     - DOMContentLoaded 1回でバインド、以降イベントドリブン
   ================================================================ */

(function (window, document) {
  'use strict';

  /* ── Reduced Motion Gate ───────────────────────────────────── */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    // 何もしない。style-graft.css 側で最終状態を強制表示する。
    return;
  }

  /* ── Utility ──────────────────────────────────────────────── */
  function $all(sel, root) { return (root || document).querySelectorAll(sel); }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ── 1. Stagger index 付与 ────────────────────────────────────
     既存 .reveal-stagger.active > *:nth-child(1..4) を拡張。
     5件以上の stagger グループ（例: voice-grid, blog-grid）に対して
     各子要素に --i: n を付与し、CSS 側で transition-delay を計算。
  ─────────────────────────────────────────────────────────────── */
  function assignStaggerIndex() {
    var groups = $all('.reveal-stagger');
    groups.forEach(function (group) {
      var children = group.children;
      // 既存 4件までは CSS 側の nth-child が効く。
      // 5件目以降（または全件統一したい場合）に --i を付与する。
      for (var i = 0; i < children.length; i++) {
        // 既存 nth-child(1..4) のトランジションディレイを打ち消さないように、
        // 常に --i を付与（CSS 側では [style*="--i:"] の特異性で処理）。
        children[i].style.setProperty('--i', i);
      }
    });
  }

  /* ── 2. lx-rule（装飾ライン）の draw-in 制御 ──────────────── */
  function initRuleDraw() {
    var rules = $all('.lx-rule');
    if (!rules.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-inview');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    rules.forEach(function (el) { io.observe(el); });
  }

  /* ── 3. SVG stroke draw（.svg-draw 要素のみ） ──────────────── */
  function initSVGDraw() {
    var svgs = $all('.svg-draw');
    if (!svgs.length) return;

    // 各 path の実長を計算して CSS 変数にセット
    svgs.forEach(function (svg) {
      var paths = svg.querySelectorAll('path, line, polyline');
      paths.forEach(function (p) {
        try {
          var len = p.getTotalLength ? p.getTotalLength() : 1000;
          p.style.setProperty('--svg-len', len);
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
        } catch (err) { /* fail silent */ }
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-drawn');
          // transition で 0 に引かれる
          var paths = e.target.querySelectorAll('path, line, polyline');
          paths.forEach(function (p) { p.style.strokeDashoffset = 0; });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });

    svgs.forEach(function (el) { io.observe(el); });
  }

  /* ── 4. Parallax（控えめ / data-graft-parallax 属性付き限定） ─── */
  function initParallax() {
    var els = $all('[data-graft-parallax]');
    if (!els.length) return;

    // 要素ごとのキャッシュ
    var items = [];
    els.forEach(function (el) {
      var rate = parseFloat(el.getAttribute('data-graft-parallax')) || 0.15;
      // rate は "移動幅の強さ"（0.1〜0.3 推奨。大きすぎ厳禁）
      items.push({ el: el, rate: Math.min(Math.max(rate, 0), 0.3) });
    });

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (item) {
        var rect = item.el.getBoundingClientRect();
        // ビューポート中央からの相対位置（-1..+1）
        var center = (rect.top + rect.height / 2) - vh / 2;
        var translate = center * -item.rate;
        item.el.style.transform = 'translate3d(0,' + translate.toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ── 5. Header scrolled 状態（既存 main.js 未読込の index.html 用） ──
     既存の index.html は header.scrolled を自分で付与しているため、
     ここでは重複バインドを避ける。存在チェックのみ。
  ─────────────────────────────────────────────────────────────── */
  function detectHeaderScrollBinding() {
    // 何もしない。既存 inline script が処理済み。
    return;
  }

  /* ── 6. Reveal 補助：既存 IntersectionObserver（.active 付与）を
         そのまま活かす。本レイヤーでは新規 observer は増やさない。
         ただし .reveal-stagger の nth-child(5+) 用に --i を事前に付与。
  ─────────────────────────────────────────────────────────────── */

  /* ── 起動 ─────────────────────────────────────────────────── */
  onReady(function () {
    assignStaggerIndex();
    initRuleDraw();
    initSVGDraw();
    initParallax();
    detectHeaderScrollBinding();
  });

})(window, document);

/* End of Motion Layer */
