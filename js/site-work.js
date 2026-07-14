/* ==========================================================================
   site-work.js — makes data/videos.json drive the existing #work-grid
   and the existing #video-sheet player. No new markup patterns, no new
   visual system — it builds the same .work-card / .sheet-overlay elements
   already in index.html, just from data instead of hardcoding six of them.

   Requires nothing else from you except:
     1. this file included after config.js / before main.js (or after — order
        doesn't matter, it only touches #work-grid and #video-sheet)
     2. data/videos.json sitting next to index.html
     3. the filter buttons and #work-grid / #video-sheet already in the page
   ========================================================================== */

(function () {
  'use strict';

  var grid = document.getElementById('work-grid');
  if (!grid) return;

  var sheetOverlay = document.getElementById('video-sheet');
  var sheetPlayer  = document.getElementById('sheet-player');
  var sheetTitle   = document.getElementById('sheet-title');
  var sheetDesc    = document.getElementById('sheet-desc');
  var sheetClose   = document.getElementById('sheet-close');

  /* ---------- data ---------------------------------------------------- */

  function tagsOf(v) {
    if (v.tags) return v.tags;
    var c = (v.category || '').toLowerCase();
    if (c.indexOf('reel') > -1 || c.indexOf('short') > -1) return 'reel';
    if (c.indexOf('motion') > -1) return 'motion';
    return 'brand';
  }

  function posterFor(v) {
    if (v.type === 'external') return v.poster || '';
    return v.poster || ('https://i.ytimg.com/vi/' + v.id + '/maxresdefault.jpg');
  }

  function embedURL(id, opts) {
    var p = Object.assign({ autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, color: 'white' }, opts || {});
    return 'https://www.youtube-nocookie.com/embed/' + id + '?' +
      Object.keys(p).map(function (k) { return k + '=' + p[k]; }).join('&');
  }

  async function load() {
    var src = grid.dataset.src || 'data/videos.json';
    try {
      var res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      var json = await res.json();
      var list = Array.isArray(json) ? json : (json.videos || []);
      return list.filter(function (v) { return v && v.id && !v.hidden; });
    } catch (err) {
      console.warn('[work] could not load ' + src, err);
      return null;
    }
  }

  /* ---------- build one .work-card, matching the hand-written markup --- */

  function buildCard(v, i) {
    var isExternal = v.type === 'external';

    var article = document.createElement('article');
    article.className = 'work-card' + (v.featured ? ' featured' : '');
    article.dataset.cat = tagsOf(v);
    article.style.setProperty('--i', i);
    article.dataset.video = v.id;

    var ratio = v.aspect === '9:16' ? 'ratio-9-16' : 'ratio-16-9';

    var badge = isExternal
      ? (v.externalKind === 'instagram' ? 'INSTAGRAM' : 'BEHANCE')
      : v.aspect === '9:16' ? '9:16'
      : tagsOf(v) === 'motion' ? 'MOTION'
      : v.aspect || '16:9';

    var icon = isExternal ? 'fa-arrow-up-right-from-square' : 'fa-play';

    // A regular (non-external) video can also carry a cross-link to an
    // Instagram post of the same piece — show a small badge on the
    // thumbnail itself so that's visible without opening the sheet.
    var igCrossLink = !isExternal && v.instagramUrl
      ? '<span class="work-ig-badge" title="Also on Instagram" aria-hidden="true"><i class="fa-brands fa-instagram"></i></span>'
      : '';

    // Instagram/Behance give us no thumbnail API — when there's no poster
    // (or it fails to load), fall back to a plain platform-icon panel
    // instead of leaving the card looking broken/blank.
    var poster = posterFor(v);
    var posterImg = poster
      ? '<img class="work-poster" src="' + poster + '" alt="" loading="lazy" ' +
          'onerror="this.style.display=\'none\'">'
      : '';
    var posterFallback =
      '<div class="work-poster-fallback"><i class="fa-brands ' +
      (isExternal && v.externalKind === 'behance' ? 'fa-behance' : 'fa-instagram') +
      '" aria-hidden="true"></i></div>';

    article.innerHTML =
      '<div class="work-thumb ' + ratio + '">' +
        (isExternal ? posterFallback : '') +
        posterImg +
        '<span class="work-badge">' + badge + '</span>' +
        igCrossLink +
        '<button type="button" class="work-play" aria-label="' + (isExternal ? 'Open ' : 'Preview ') +
          (v.title ? v.title.replace(/"/g, '&quot;') : 'video') + '">' +
          '<i class="fa-solid ' + icon + '"></i>' +
        '</button>' +
      '</div>' +
      '<div class="work-meta">' +
        '<h3>' + (v.title || 'Untitled') + '</h3>' +
        '<p>' + [v.client, v.category].filter(Boolean).join(' · ') + '</p>' +
      '</div>';

    // Instagram/Behance have no embed that plays inline the way YouTube
    // does — no muted-autoplay-loop option, and their widget only shows a
    // small static card requiring a manual click. Rather than fake parity
    // with a half-working inline embed, these still just open the real
    // post in a new tab.
    var openThis = isExternal
      ? function () { window.open(v.externalUrl, '_blank', 'noopener'); }
      : function () { openSheet(v); };

    article.querySelector('.work-play').addEventListener('click', openThis);
    article.querySelector('.work-thumb').addEventListener('click', openThis);

    // Auto-playing preview is reserved for Featured videos — everything
    // else stays a static poster until clicked open.
    if (!isExternal && v.featured && (v.previewMode === 'youtube' || v.previewMode === 'clip')) {
      wirePreview(article, v);
    }

    return article;
  }

  function wirePreview(article, v) {
    var thumb = article.querySelector('.work-thumb');
    var media = null;
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    function start() {
      if (mqReduce.matches || media) return;
      if (v.previewMode === 'clip' && v.preview) {
        media = document.createElement('video');
        media.className = 'work-preview';
        media.src = v.preview; media.muted = true; media.loop = true;
        media.playsInline = true; media.setAttribute('aria-hidden', 'true');
        thumb.appendChild(media);
        var p = media.play(); if (p && p.catch) p.catch(function () {});
      } else if (v.previewMode === 'youtube') {
        media = document.createElement('iframe');
        media.className = 'work-preview work-preview--yt';
        media.src = embedURL(v.id, { mute: 1, controls: 0, loop: 1, playlist: v.id, start: v.start || 0, disablekb: 1, iv_load_policy: 3 });
        media.setAttribute('tabindex', '-1');
        media.setAttribute('aria-hidden', 'true');
        media.setAttribute('allow', 'autoplay; encrypted-media');
        thumb.appendChild(media);
      }
      if (media) requestAnimationFrame(function () { thumb.classList.add('is-previewing'); });
    }

    function stop() {
      thumb.classList.remove('is-previewing');
      if (!media) return;
      var m = media; media = null;
      setTimeout(function () { if (m.parentNode) m.remove(); }, 300);
    }

    // Automatic: the preview starts the moment the card is visibly on screen
    // (desktop scroll or mobile scroll — no hover, no click needed) and stops
    // when it scrolls back out, so only what's actually on screen is playing.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.5) start(); else stop();
        });
      }, { threshold: [0, 0.5, 1] }).observe(thumb);
    } else {
      // No IntersectionObserver support at all — fall back to just playing it.
      start();
    }
  }

  /* ---------- open/close the EXISTING sheet ----------------------------- */

  var sheetDescription = document.getElementById('sheet-description');
  var lastFocus = null;

  function openSheet(v) {
    if (!sheetOverlay) return;
    lastFocus = document.activeElement;

    sheetTitle.textContent = v.title || 'Untitled';
    var bits = [v.client, v.category, v.year].filter(Boolean);
    sheetDesc.textContent = bits.join(' · ');

    if (sheetDescription) {
      sheetDescription.textContent = v.description || '';
      sheetDescription.hidden = !v.description;
    }

    // "Watch elsewhere" links — YouTube is always there; Instagram only if set.
    var existingLinks = sheetOverlay.querySelector('.sheet-links');
    if (existingLinks) existingLinks.remove();
    var linksRow = document.createElement('div');
    linksRow.className = 'sheet-links';
    var ytLink = document.createElement('a');
    ytLink.href = 'https://www.youtube.com/watch?v=' + v.id;
    ytLink.target = '_blank';
    ytLink.rel = 'noopener';
    ytLink.textContent = 'Watch on YouTube \u2197';
    linksRow.appendChild(ytLink);
    if (v.instagramUrl) {
      var igLink = document.createElement('a');
      igLink.href = v.instagramUrl;
      igLink.target = '_blank';
      igLink.rel = 'noopener';
      igLink.textContent = 'View on Instagram \u2197';
      linksRow.appendChild(igLink);
    }
    sheetTitle.parentElement.appendChild(linksRow);

    // Same ratio-aware wrapper the hero player uses (.video-player-wrapper),
    // so a 9:16 video gets a tall box and a 16:9 video gets a wide one —
    // instead of both being squeezed into whatever box happened to be there.
    sheetPlayer.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'video-player-wrapper';
    wrapper.setAttribute('data-ratio', v.aspect || '16:9');

    var iframe = document.createElement('iframe');
    iframe.src = embedURL(v.id, v.start ? { start: v.start } : {});
    iframe.title = v.title || 'Video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    wrapper.appendChild(iframe);
    sheetPlayer.appendChild(wrapper);

    document.documentElement.style.overflow = 'hidden';
    sheetOverlay.hidden = false;
    requestAnimationFrame(function () {
      sheetOverlay.classList.add('is-open');
      var sheet = sheetOverlay.querySelector('.sheet');
      if (sheet) sheet.focus && sheet.focus({ preventScroll: true });
    });
  }

  function closeSheet() {
    if (!sheetOverlay || sheetOverlay.hidden) return;
    sheetOverlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    setTimeout(function () {
      sheetOverlay.hidden = true;
      sheetPlayer.innerHTML = '';           // stops playback
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 300);
  }

  if (sheetClose) sheetClose.addEventListener('click', closeSheet);
  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', function (e) {
      if (e.target === sheetOverlay) closeSheet();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  /* ---------- mobile only: swipe the handle down to dismiss -------------- */

  (function wireSwipeToDismiss() {
    var sheetEl = sheetOverlay && sheetOverlay.querySelector('.sheet');
    var handle = sheetOverlay && sheetOverlay.querySelector('.sheet-handle');
    if (!sheetEl || !handle) return;

    var isMobile = function () { return window.matchMedia('(max-width: 760px)').matches; };
    var startY = 0, dy = 0, dragging = false;

    handle.style.touchAction = 'none';

    handle.addEventListener('pointerdown', function (e) {
      if (!isMobile()) return;
      dragging = true; dy = 0; startY = e.clientY;
      sheetEl.classList.add('is-dragging');
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
    });

    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);   // only allow dragging downward
      sheetEl.style.transform = 'translateY(' + dy + 'px)';
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      sheetEl.classList.remove('is-dragging');
      sheetEl.style.transform = '';
      // Past ~18% of the sheet's height, or a decisive flick — dismiss it.
      var threshold = sheetEl.offsetHeight * 0.18;
      if (dy > threshold) closeSheet();
      dy = 0;
    }

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  })();

  /* ---------- filters: reuse the existing .filter-btn buttons ----------- */

  function wireFilters(cards) {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var f = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = f === 'all' || (card.dataset.cat || '').indexOf(f) > -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- boot -------------------------------------------------------- */

  (async function init() {
    grid.innerHTML = '<p class="work-empty">Loading work…</p>';

    var data = await load();

    if (data === null) {
      grid.innerHTML =
        '<p class="work-empty">' +
        'Work isn\u2019t loading right now \u2014 <code>data/videos.json</code> couldn\u2019t be reached. ' +
        'If you\u2019re viewing this file locally (double-clicked, address bar says <code>file://</code>), ' +
        'browsers block that on purpose \u2014 view it through your live site or a local server instead. ' +
        'Otherwise check that <code>data/videos.json</code> was actually uploaded next to this page.' +
        '</p>';
      return;
    }

    // A capped grid (the home page's showcase) shows Featured videos first,
    // then fills any remaining slots with the rest \u2014 same relative order
    // within each group as the dashboard's own list \u2014 instead of just
    // whatever happened to come first in the file.
    var limit = parseInt(grid.dataset.limit, 10);
    if (limit > 0) {
      data = data.filter(function (v) { return v.featured; })
        .concat(data.filter(function (v) { return !v.featured; }))
        .slice(0, limit);
      grid.classList.add('work-grid--bento');
    }

    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<p class="work-empty">No projects published yet \u2014 add one from admin.html.</p>';
      return;
    }

    var cards = data.map(function (v, i) {
      var card = buildCard(v, i);
      grid.appendChild(card);
      return card;
    });

    wireFilters(cards);
  })();
})();

/* ---------- social links: read from data/social.json, set by admin.html --- */
(function () {
  'use strict';
  var MAP = { instagram: 'social-instagram', youtube: 'social-youtube', linkedin: 'social-linkedin', behance: 'social-behance' };

  fetch('data/social.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (links) {
      if (!links) return;
      Object.keys(MAP).forEach(function (key) {
        var el = document.getElementById(MAP[key]);
        if (!el) return;
        var url = (links[key] || '').trim();
        if (url) {
          el.href = url;
          el.target = '_blank';
          el.rel = 'noopener';
        } else {
          el.style.display = 'none';   // no link set — don't show a dead icon
        }
      });
    })
    .catch(function () { /* social.json not reachable yet — icons stay as-is */ });
})();

/* ---------- profile photo: read from data/profile.json, set by admin.html - */
(function () {
  'use strict';
  var img = document.getElementById('about-img');
  var initials = document.getElementById('about-initials');
  if (!img || !initials) return;

  fetch('data/profile.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      var src = data && data.image;
      if (!src) return; // nothing published — keep the "AC" mark
      img.src = src;
      img.hidden = false;
      img.addEventListener('load', function () { initials.style.display = 'none'; });
      img.addEventListener('error', function () { img.hidden = true; }, { once: true });
    })
    .catch(function () { /* profile.json not reachable yet — mark stays as-is */ });
})();
