/* ==========================================================================
   site-work.js — makes data/videos.json drive the existing #work-grid
   and the existing #video-sheet player. No new markup patterns, no new
   visual system — it builds the same .work-card / .sheet-overlay elements
   already in index.html, just from data instead of hardcoding six of them.

   Requires nothing else from you except:
     1. this file included after config.js / before main.js
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
    if (v.poster) return v.poster;
    if (v.platform === 'youtube' || !v.platform) {
      return 'https://i.ytimg.com/vi/' + v.id + '/maxresdefault.jpg';
    }
    if (v.platform === 'vimeo') {
      return 'https://vumbnail.com/' + v.id + '.jpg';
    }
    return ''; // Instagram or others
  }

  function getEmbedSrc(v) {
    var platform = v.platform || 'youtube';
    var id = v.id;

    if (platform === 'youtube') {
      var p = { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, color: 'white' };
      if (v.start) p.start = v.start;
      return 'https://www.youtube-nocookie.com/embed/' + id + '?' +
        Object.keys(p).map(function (k) { return k + '=' + p[k]; }).join('&');
    }

    if (platform === 'vimeo') {
      return 'https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0';
    }

    if (platform === 'instagram') {
      return 'https://www.instagram.com/reel/' + id + '/embed/?cr=1';
    }

    // Fallback
    return 'https://www.youtube-nocookie.com/embed/' + id;
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

  /* ---------- build one .work-card ----------------------------------- */

  function buildCard(v, i) {
    var article = document.createElement('article');
    article.className = 'work-card' + (v.featured ? ' featured' : '');
    article.dataset.cat = tagsOf(v);
    article.style.setProperty('--i', i);
    article.dataset.video = v.id;

    var ratio = v.aspect === '9:16' ? 'ratio-9-16' : 'ratio-16-9';
    var badge = v.aspect === '9:16' ? '9:16'
              : tagsOf(v) === 'motion' ? 'MOTION'
              : v.aspect || '16:9';

    article.innerHTML =
      '<div class="work-thumb ' + ratio + '">' +
        '<img class="work-poster" src="' + posterFor(v) + '" alt="" loading="lazy" ' +
             'onerror="this.style.display=\'none\'">' +
        '<span class="work-badge">' + badge + '</span>' +
        '<button type="button" class="work-play" aria-label="Preview ' +
          (v.title ? v.title.replace(/"/g, '&quot;') : 'video') + '">' +
          '<i class="fa-solid fa-play"></i>' +
        '</button>' +
      '</div>' +
      '<div class="work-meta">' +
        '<h3>' + (v.title || 'Untitled') + '</h3>' +
        '<p>' + [v.client, v.category].filter(Boolean).join(' · ') + '</p>' +
      '</div>';

    article.querySelector('.work-play').addEventListener('click', function () { openSheet(v); });
    article.querySelector('.work-thumb').addEventListener('click', function () { openSheet(v); });

    if (v.previewMode === 'youtube' || v.previewMode === 'clip') {
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
        media.src = v.preview;
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.setAttribute('aria-hidden', 'true');
        thumb.appendChild(media);
        var p = media.play();
        if (p && p.catch) p.catch(function () {});
      } else if (v.previewMode === 'youtube') {
        media = document.createElement('iframe');
        media.className = 'work-preview work-preview--yt';
        media.src = getEmbedSrc(v).replace('autoplay=1', 'autoplay=0');
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
      var m = media;
      media = null;
      setTimeout(function () { if (m.parentNode) m.remove(); }, 300);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.5) start(); else stop();
        });
      }, { threshold: [0, 0.5, 1] }).observe(thumb);
    } else {
      start();
    }
  }

  /* ---------- open/close the sheet (with description + ratio fix) ------ */

  var lastFocus = null;

  function openSheet(v) {
  if (!sheetOverlay) return;

  lastFocus = document.activeElement;

  sheetTitle.textContent = v.title || 'Untitled';
  var bits = [v.client, v.category, v.year].filter(Boolean);
  sheetDesc.textContent = bits.join(' · ');

  // Add description if available
  var metaWrap = sheetDesc.parentNode;
  var oldLong = document.getElementById('sheet-long-desc');
  if (oldLong) oldLong.remove();

  if (v.description && v.description.trim()) {
    var longP = document.createElement('p');
    longP.id = 'sheet-long-desc';
    longP.className = 'sheet-long-desc muted';
    longP.style.marginTop = '0.5rem';
    longP.style.fontSize = '0.9rem';
    longP.style.lineHeight = '1.5';
    longP.textContent = v.description;
    metaWrap.appendChild(longP);
  }

  sheetPlayer.innerHTML = '';

  // ==================== BEHANCE HANDLING ====================
  if (v.platform === 'behance') {
    var behanceBox = document.createElement('div');
    behanceBox.style.cssText = 'padding:40px 30px; text-align:center; color:#ddd;';

    behanceBox.innerHTML = `
      <h3 style="margin-bottom:12px; color:#fff;">${v.title}</h3>
      <p style="margin-bottom:30px; color:#aaa;">This is a Behance project.</p>
      <a href="https://www.behance.net/gallery/${v.id}" 
         target="_blank"
         style="display:inline-block; background:#fb5607; color:white; 
                padding:14px 32px; border-radius:8px; text-decoration:none; 
                font-weight:600; font-size:15px;">
        View Full Project on Behance →
      </a>
    `;
    sheetPlayer.appendChild(behanceBox);

  } else {
    // ==================== YOUTUBE / INSTAGRAM ====================
    var wrapper = document.createElement('div');
    wrapper.className = 'video-player-wrapper';
    wrapper.setAttribute('data-ratio', v.aspect || '9:16');

    var iframe = document.createElement('iframe');
    iframe.src = getEmbedSrc(v);
    iframe.title = v.title || 'Video player';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    wrapper.appendChild(iframe);

    sheetPlayer.appendChild(wrapper);
  }

  document.documentElement.style.overflow = 'hidden';
  sheetOverlay.hidden = false;

  requestAnimationFrame(function () {
    sheetOverlay.classList.add('is-open');
    if (lastFocus && lastFocus.focus) {
      // optional: keep focus management
    }
  });
}

    // Build responsive player with correct ratio
    sheetPlayer.innerHTML = '';
    var ratio = (v.aspect || '9:16').replace(/\s/g, '');
    var wrapper = document.createElement('div');
    wrapper.className = 'video-player-wrapper';
    wrapper.setAttribute('data-ratio', ratio);

    var iframe = document.createElement('iframe');
    iframe.src = getEmbedSrc(v);
    iframe.title = v.title || 'Video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';

    wrapper.appendChild(iframe);
    sheetPlayer.style.position = 'relative';
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
      sheetPlayer.innerHTML = ''; // stops playback
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

  /* ---------- filters -------------------------------------------------- */

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

  /* ---------- boot ----------------------------------------------------- */

  (async function init() {
    grid.innerHTML = '<p class="work-empty">Loading work…</p>';

    var data = await load();

    if (data === null) {
      grid.innerHTML =
        '<p class="work-empty">' +
        'Work isn’t loading right now — <code>data/videos.json</code> couldn’t be reached. ' +
        'If you’re viewing this file locally, browsers block that on purpose — view it through your live site or a local server instead.' +
        '</p>';
      return;
    }

    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<p class="work-empty">No projects published yet — add one from admin.html.</p>';
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
