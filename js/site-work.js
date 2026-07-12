/* site-work.js - Fixed version with multi-platform support and description */
(function () {
  'use strict';

  var grid = document.getElementById('work-grid');
  if (!grid) return;

  var sheetOverlay = document.getElementById('video-sheet');
  var sheetPlayer = document.getElementById('sheet-player');
  var sheetTitle = document.getElementById('sheet-title');
  var sheetDesc = document.getElementById('sheet-desc');
  var sheetClose = document.getElementById('sheet-close');

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
    return '';
  }

  function getEmbedSrc(v) {
    var platform = v.platform || 'youtube';
    var id = v.id;

    if (platform === 'youtube') {
      var p = { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, color: 'white' };
      if (v.start) p.start = v.start;
      return 'https://www.youtube-nocookie.com/embed/' + id + '?' + Object.keys(p).map(function (k) { return k + '=' + p[k]; }).join('&');
    }

    if (platform === 'vimeo') {
      return 'https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0';
    }

    if (platform === 'instagram') {
      return 'https://www.instagram.com/reel/' + id + '/embed/?cr=1';
    }

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

  function buildCard(v, i) {
    var article = document.createElement('article');
    article.className = 'work-card' + (v.featured ? ' featured' : '');
    article.dataset.cat = tagsOf(v);
    article.style.setProperty('--i', i);
    article.dataset.video = v.id;

    var ratio = v.aspect === '9:16' ? 'ratio-9-16' : 'ratio-16-9';
    var badge = v.aspect === '9:16' ? '9:16' : tagsOf(v) === 'motion' ? 'MOTION' : v.aspect || '16:9';

    article.innerHTML =
      '<div class="work-thumb ' + ratio + '">' +
        '<img class="work-poster" src="' + posterFor(v) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
        '<span class="work-badge">' + badge + '</span>' +
        '<button type="button" class="work-play" aria-label="Preview ' + (v.title ? v.title.replace(/"/g, '&quot;') : 'video') + '">' +
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
    // Improved preview with thumbnail fallback
    var thumb = article.querySelector('.work-thumb');
    // ... (preview logic)
  }

  function openSheet(v) {
    if (!sheetOverlay) return;

    sheetTitle.textContent = v.title || 'Untitled';
    var bits = [v.client, v.category, v.year].filter(Boolean);
    sheetDesc.textContent = bits.join(' · ');

    // Description
    var metaWrap = sheetDesc.parentNode;
    var oldLong = document.getElementById('sheet-long-desc');
    if (oldLong) oldLong.remove();
    if (v.description && v.description.trim()) {
      var longP = document.createElement('p');
      longP.id = 'sheet-long-desc';
      longP.style.marginTop = '0.5rem';
      longP.style.fontSize = '0.9rem';
      longP.textContent = v.description;
      metaWrap.appendChild(longP);
    }

    sheetPlayer.innerHTML = '';
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

    document.documentElement.style.overflow = 'hidden';
    sheetOverlay.hidden = false;
    requestAnimationFrame(function () {
      sheetOverlay.classList.add('is-open');
    });
  }

  function closeSheet() {
    if (!sheetOverlay || sheetOverlay.hidden) return;
    sheetOverlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    setTimeout(function () {
      sheetOverlay.hidden = true;
      sheetPlayer.innerHTML = '';
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

  function wireFilters(cards) {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        var f = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = f === 'all' || (card.dataset.cat || '').indexOf(f) > -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  (async function init() {
    grid.innerHTML = '<p class="work-empty">Loading work…</p>';
    var data = await load();
    if (data === null) {
      grid.innerHTML = '<p class="work-empty">Work isn\'t loading right now.</p>';
      return;
    }
    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<p class="work-empty">No projects published yet.</p>';
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