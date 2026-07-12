/* ==========================================================================
   work.js — Pluseshot work grid + bottom-sheet YouTube player
   Drop into: js/work.js

   Markup it expects on the page:

     <div class="pw-filters" data-work-filters></div>
     <div class="pw-grid" data-work-grid data-src="data/videos.json"></div>

   Everything else is built at runtime. No dependencies.

   Data comes from data/videos.json, which the dashboard (admin.html) writes.
   Change the JSON -> the site changes. You never touch this file again.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- helpers ---------------------------------------------------- */

  var mqHover  = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  function posterFor(v) {
    if (v.poster) return v.poster;
    return 'https://i.ytimg.com/vi/' + v.id + '/maxresdefault.jpg';
  }

  function isVideoFile(url) {
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url || '');
  }

  /* What actually plays in the small screen: 'clip', 'youtube' or 'none'. */
  function previewOf(v) {
    var mode = v.previewMode || (v.preview ? 'clip' : 'none');
    if (mode === 'clip' && !isVideoFile(v.preview)) return 'none';
    return mode;
  }

  function embedURL(id, opts) {
    var p = Object.assign({
      autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, color: 'white'
    }, opts || {});
    var q = Object.keys(p).map(function (k) { return k + '=' + p[k]; }).join('&');
    return 'https://www.youtube-nocookie.com/embed/' + id + '?' + q;
  }

  var ICON_PLAY  = '<svg viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M11.5 6.13a1 1 0 0 1 0 1.74l-10 5.6A1 1 0 0 1 0 12.6V1.4A1 1 0 0 1 1.5.53l10 5.6Z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11"/></svg>';

  /* ---------- the player sheet ------------------------------------------- */

  var Sheet = (function () {
    var root, panel, stage, titleEl, subEl, ytLink;
    var lastFocus = null;
    var built = false;

    function build() {
      root = el('div', 'pw-sheet');
      root.hidden = true;

      var scrim = el('button', 'pw-sheet__scrim', {
        'data-close': '', 'aria-label': 'Close player', 'tabindex': '-1'
      });

      panel = el('div', 'pw-sheet__panel', {
        role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Video player'
      });

      var grab = el('button', 'pw-sheet__grab', { 'data-close': '', 'aria-label': 'Close player' });

      stage = el('div', 'pw-sheet__stage');

      var meta   = el('div', 'pw-sheet__meta');
      var textCol = el('div');
      titleEl = el('h2');
      subEl   = el('p');
      textCol.appendChild(titleEl);
      textCol.appendChild(subEl);

      ytLink = el('a', 'pw-sheet__yt', { target: '_blank', rel: 'noopener' });
      ytLink.textContent = 'Watch on YouTube \u2197';

      meta.appendChild(textCol);
      meta.appendChild(ytLink);

      var close = el('button', 'pw-sheet__close', { 'data-close': '', 'aria-label': 'Close player' });
      close.innerHTML = ICON_CLOSE;

      panel.appendChild(grab);
      panel.appendChild(stage);
      panel.appendChild(meta);
      panel.appendChild(close);

      root.appendChild(scrim);
      root.appendChild(panel);
      document.body.appendChild(root);

      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-close]')) hide();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !root.hidden) hide();
      });

      dragToDismiss(grab);
      built = true;
    }

    /* Drag the handle down to dismiss, the way a native sheet behaves. */
    function dragToDismiss(handle) {
      var startY = 0, dy = 0, dragging = false;

      handle.addEventListener('pointerdown', function (e) {
        dragging = true; dy = 0; startY = e.clientY;
        handle.setPointerCapture(e.pointerId);
        root.classList.add('is-dragging');
      });

      handle.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        dy = Math.max(0, e.clientY - startY);
        panel.style.transform = 'translateY(' + dy + 'px)';
      });

      function end() {
        if (!dragging) return;
        dragging = false;
        root.classList.remove('is-dragging');
        panel.style.transform = '';
        if (dy > 110) hide();
      }

      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    }

    function show(v) {
      if (!built) build();
      lastFocus = document.activeElement;

      panel.setAttribute('data-aspect', v.aspect || '16:9');
      titleEl.textContent = v.title || 'Untitled';

      var bits = [v.client, v.category, v.year].filter(Boolean);
      subEl.textContent = bits.join('  \u00b7  ');
      subEl.hidden = !bits.length;

      ytLink.href = 'https://www.youtube.com/watch?v=' + v.id;

      stage.innerHTML = '';
      var frame = el('iframe', null, {
        src: embedURL(v.id, v.start ? { start: v.start } : {}),
        title: v.title || 'Video player',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: '',
        referrerpolicy: 'strict-origin-when-cross-origin'
      });
      stage.appendChild(frame);

      lockScroll(true);
      root.hidden = false;
      requestAnimationFrame(function () {
        root.classList.add('is-open');
        panel.focus({ preventScroll: true });
      });
    }

    function hide() {
      if (!built || root.hidden) return;
      root.classList.remove('is-open');
      lockScroll(false);

      window.setTimeout(function () {
        root.hidden = true;
        stage.innerHTML = '';           // kills the iframe -> stops playback
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }, 300);
    }

    var savedPad = '';
    function lockScroll(on) {
      var doc = document.documentElement;
      if (on) {
        var bar = window.innerWidth - doc.clientWidth;
        savedPad = document.body.style.paddingRight;
        if (bar > 0) document.body.style.paddingRight = bar + 'px';
        doc.style.overflow = 'hidden';
      } else {
        doc.style.overflow = '';
        document.body.style.paddingRight = savedPad;
      }
    }

    return { show: show, hide: hide };
  })();

  /* ---------- previews ---------------------------------------------------- */

  function startPreview(card, v) {
    if (mqReduce.matches) return;
    if (card.classList.contains('is-previewing')) return;

    var frame = card.querySelector('.pw-card__frame');
    var mode = previewOf(v);
    var node;

    if (mode === 'clip') {
      node = el('video', 'pw-card__preview', {
        src: v.preview, muted: '', loop: '', playsinline: '',
        preload: 'auto', 'aria-hidden': 'true'
      });
      node.muted = true;                // the attribute alone is not enough on iOS
      var p = node.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked, poster stays */ });

    } else if (mode === 'youtube') {
      node = el('iframe', 'pw-card__preview pw-card__preview--yt', {
        src: embedURL(v.id, {
          mute: 1, controls: 0, loop: 1, playlist: v.id,
          start: v.start || 0, disablekb: 1, iv_load_policy: 3
        }),
        tabindex: '-1', 'aria-hidden': 'true', frameborder: '0',
        allow: 'autoplay; encrypted-media'
      });

    } else {
      return;                           // no clip, no iframe -> poster zoom only
    }

    frame.appendChild(node);
    requestAnimationFrame(function () { card.classList.add('is-previewing'); });
  }

  function stopPreview(card) {
    card.classList.remove('is-previewing');
    var node = card.querySelector('.pw-card__preview');
    if (!node) return;
    window.setTimeout(function () {
      if (node.parentNode && !card.classList.contains('is-previewing')) node.remove();
    }, 380);
  }

  /* ---------- card -------------------------------------------------------- */

  function buildCard(v) {
    var card = el('article', 'pw-card');
    card.setAttribute('data-aspect', v.aspect || '16:9');
    if (previewOf(v) !== 'none') card.setAttribute('data-preview', '');

    var hit = el('button', 'pw-card__hit', {
      type: 'button',
      'aria-label': 'Play ' + (v.title || 'video')
    });

    var frame = el('div', 'pw-card__frame');

    var img = el('img', 'pw-card__poster', {
      src: posterFor(v), alt: '', loading: 'lazy', decoding: 'async'
    });
    // maxresdefault does not exist for every upload — fall back once.
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    });

    frame.appendChild(img);

    if (v.duration) {
      var badge = el('span', 'pw-card__badge');
      badge.textContent = v.duration;
      frame.appendChild(badge);
    }

    var play = el('span', 'pw-card__play');
    play.innerHTML = ICON_PLAY;
    frame.appendChild(play);

    hit.appendChild(frame);

    var meta  = el('div', 'pw-card__meta');
    var title = el('h3', 'pw-card__title');
    title.textContent = v.title || 'Untitled';
    meta.appendChild(title);

    var bits = [v.client, v.category, v.year].filter(Boolean);
    if (bits.length) {
      var sub = el('p', 'pw-card__sub');
      bits.forEach(function (b) {
        var s = document.createElement('span');
        s.textContent = b;
        sub.appendChild(s);
      });
      meta.appendChild(sub);
    }

    card.appendChild(hit);
    card.appendChild(meta);

    hit.addEventListener('click', function () { Sheet.show(v); });

    if (mqHover.matches) {
      hit.addEventListener('mouseenter', function () { startPreview(card, v); });
      hit.addEventListener('mouseleave', function () { stopPreview(card); });
      hit.addEventListener('focus',      function () { startPreview(card, v); });
      hit.addEventListener('blur',       function () { stopPreview(card); });
    }

    return card;
  }

  /* On touch, previews play when the card is the thing you are looking at. */
  function watchInView(cards, data) {
    if (mqHover.matches || mqReduce.matches || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var card = e.target;
        var v = data[+card.dataset.i];
        if (e.isIntersecting && e.intersectionRatio > 0.65) startPreview(card, v);
        else stopPreview(card);
      });
    }, { threshold: [0, 0.65, 1] });

    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- filters ------------------------------------------------------ */

  function buildFilters(host, data, cards) {
    if (!host) return;

    var cats = [];
    data.forEach(function (v) {
      if (v.category && cats.indexOf(v.category) === -1) cats.push(v.category);
    });
    if (cats.length < 2) return;        // one category is not a filter

    host.innerHTML = '';
    ['All'].concat(cats).forEach(function (c, i) {
      var chip = el('button', 'pw-chip', {
        type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false'
      });
      chip.textContent = c;
      chip.addEventListener('click', function () {
        host.querySelectorAll('.pw-chip').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === chip));
        });
        cards.forEach(function (card, idx) {
          var v = data[idx];
          card.hidden = !(c === 'All' || v.category === c);
        });
      });
      host.appendChild(chip);
    });
  }

  /* ---------- boot --------------------------------------------------------- */

  function normalise(raw) {
    var list = Array.isArray(raw) ? raw : (raw && raw.videos) || [];
    return list.filter(function (v) { return v && v.id && !v.hidden; });
  }

  async function load(grid) {
    var src = grid.dataset.src || 'data/videos.json';
    try {
      var res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      return normalise(await res.json());
    } catch (err) {
      // file:// or offline — fall back to an inline array if the page set one.
      if (window.WORK_DATA) return normalise(window.WORK_DATA);
      console.warn('[work] could not load ' + src, err);
      return null;
    }
  }

  async function init() {
    var grid = document.querySelector('[data-work-grid]');
    if (!grid) return;

    var filters = document.querySelector('[data-work-filters]');

    grid.setAttribute('data-loading', '');
    grid.innerHTML = '';
    for (var i = 0; i < 6; i++) grid.appendChild(el('div', 'pw-skeleton'));

    var data = await load(grid);
    grid.innerHTML = '';
    grid.removeAttribute('data-loading');

    if (data === null) {
      var err = el('p', 'pw-note');
      err.textContent = 'Work is taking a moment to load. Refresh to try again.';
      grid.appendChild(err);
      return;
    }

    if (!data.length) {
      var empty = el('p', 'pw-note');
      empty.textContent = 'No projects published yet.';
      grid.appendChild(empty);
      return;
    }

    var cards = data.map(function (v, i) {
      var card = buildCard(v);
      card.dataset.i = i;
      grid.appendChild(card);
      return card;
    });

    buildFilters(filters, data, cards);
    watchInView(cards, data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
