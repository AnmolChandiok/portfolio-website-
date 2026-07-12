/* site-work.js - Updated with Behance + Instagram support */
(function () {
  'use strict';

  const grid = document.getElementById('work-grid');
  if (!grid) return;

  const sheetOverlay = document.getElementById('video-sheet');
  const sheetPlayer = document.getElementById('sheet-player');
  const sheetTitle = document.getElementById('sheet-title');
  const sheetDesc = document.getElementById('sheet-desc');

  function posterFor(v) {
    if (v.poster) return v.poster;
    if (v.platform === 'youtube' || !v.platform) {
      return `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`;
    }
    return '';
  }

  function getEmbedSrc(v) {
    if (v.platform === 'youtube') {
      return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (v.platform === 'instagram') {
      return `https://www.instagram.com/reel/${v.id}/embed/?cr=1`;
    }
    return null;
  }

  function openSheet(v) {
    if (!sheetOverlay) return;

    sheetTitle.textContent = v.title || 'Untitled';
    sheetDesc.textContent = [v.client, v.category, v.year].filter(Boolean).join(' · ');

    // Description
    const metaWrap = sheetDesc.parentNode;
    const oldDesc = document.getElementById('sheet-long-desc');
    if (oldDesc) oldDesc.remove();

    if (v.description) {
      const p = document.createElement('p');
      p.id = 'sheet-long-desc';
      p.style.marginTop = '12px';
      p.style.color = '#aaa';
      p.textContent = v.description;
      metaWrap.appendChild(p);
    }

    sheetPlayer.innerHTML = '';

    if (v.platform === 'behance') {
      sheetPlayer.innerHTML = `
        <div style="padding:40px; text-align:center;">
          <h3>${v.title}</h3>
          <p style="color:#888; margin:20px 0;">This is a Behance project.</p>
          <a href="https://www.behance.net/gallery/${v.id}" target="_blank" 
             style="background:#fb5607; color:white; padding:12px 28px; border-radius:8px; text-decoration:none;">
            View Full Project on Behance
          </a>
        </div>
      `;
    } else {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-player-wrapper';
      wrapper.setAttribute('data-ratio', v.aspect || '9:16');

      const iframe = document.createElement('iframe');
      iframe.src = getEmbedSrc(v);
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      wrapper.appendChild(iframe);
      sheetPlayer.appendChild(wrapper);
    }

    sheetOverlay.hidden = false;
    requestAnimationFrame(() => sheetOverlay.classList.add('is-open'));
    document.documentElement.style.overflow = 'hidden';
  }

  // Build cards + preview logic (with thumbnail fallback)
  function buildCard(v, i) {
    // ... your existing buildCard code with improved preview handling
  }

  // ... rest of your existing code (load, wireFilters, init, etc.)

  (async function init() {
    // your existing init code
  })();
})();
