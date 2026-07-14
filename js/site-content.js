/* ==========================================================================
   site-content.js — makes every text block on the site editable from
   admin.html's Content panel, driven by data/content.json.

   Every field here has a hardcoded default already sitting in index.html,
   so if this file, the fetch, or a single field fails, the page still
   reads correctly — this only overwrites what it actually finds.
   ========================================================================== */

(function () {
  'use strict';

  // [element id, dotted path into content.json, "text" | "html"]
  var FIELDS = [
    ['c-nav-brand', 'nav.brand', 'text'],
    ['c-nav-header-cta', 'nav.headerCta', 'text'],
    ['c-nav-mobile-cta', 'nav.mobileCta', 'text'],

    ['c-hero-eyebrow', 'hero.eyebrow', 'text'],
    ['c-hero-sub', 'hero.sub', 'html'],
    ['c-hero-cta-primary', 'hero.ctaPrimary', 'text'],
    ['c-hero-cta-secondary', 'hero.ctaSecondary', 'text'],

    ['c-work-eyebrow', 'work.eyebrow', 'text'],
    ['c-work-title', 'work.title', 'text'],
    ['c-work-sub', 'work.sub', 'text'],

    ['c-services-eyebrow', 'services.eyebrow', 'text'],
    ['c-services-title', 'services.title', 'text'],
    ['c-services-1-title', 'services.item1Title', 'html'],
    ['c-services-1-body', 'services.item1Body', 'html'],
    ['c-services-2-title', 'services.item2Title', 'html'],
    ['c-services-2-body', 'services.item2Body', 'html'],
    ['c-services-3-title', 'services.item3Title', 'html'],
    ['c-services-3-body', 'services.item3Body', 'html'],
    ['c-services-4-title', 'services.item4Title', 'html'],
    ['c-services-4-body', 'services.item4Body', 'html'],

    ['c-about-eyebrow', 'about.eyebrow', 'text'],
    ['c-about-title', 'about.title', 'html'],
    ['c-about-p1', 'about.p1', 'html'],
    ['c-about-p2', 'about.p2', 'html'],
    ['c-about-li1', 'about.li1', 'html'],
    ['c-about-li2', 'about.li2', 'html'],
    ['c-about-li3', 'about.li3', 'html'],

    ['c-process-eyebrow', 'process.eyebrow', 'text'],
    ['c-process-title', 'process.title', 'text'],
    ['c-process-1-num', 'process.step1Num', 'text'],
    ['c-process-1-title', 'process.step1Title', 'text'],
    ['c-process-1-body', 'process.step1Body', 'text'],
    ['c-process-2-num', 'process.step2Num', 'text'],
    ['c-process-2-title', 'process.step2Title', 'text'],
    ['c-process-2-body', 'process.step2Body', 'text'],
    ['c-process-3-num', 'process.step3Num', 'text'],
    ['c-process-3-title', 'process.step3Title', 'text'],
    ['c-process-3-body', 'process.step3Body', 'text'],
    ['c-process-4-num', 'process.step4Num', 'text'],
    ['c-process-4-title', 'process.step4Title', 'text'],
    ['c-process-4-body', 'process.step4Body', 'text'],

    ['c-contact-eyebrow', 'contact.eyebrow', 'text'],
    ['c-contact-title', 'contact.title', 'text'],
    ['c-contact-sub', 'contact.sub', 'text'],
    ['c-contact-direct-title', 'contact.directTitle', 'text'],
    ['c-contact-social-title', 'contact.socialTitle', 'text'],
    ['c-contact-status-label', 'contact.statusLabel', 'text'],
    ['c-contact-status-text', 'contact.statusText', 'html'],

    ['c-footer-brand', 'footer.brand', 'text'],
    ['c-footer-tagline', 'footer.tagline', 'text']
  ];

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, obj);
  }

  function applyField(data, id, path, mode) {
    var val = get(data, path);
    if (val === undefined || val === null || val === '') return;
    var el = document.getElementById(id);
    if (!el) return;
    if (mode === 'html') el.innerHTML = val; else el.textContent = val;
  }

  function applyNavLinks(data) {
    var links = {
      work: data.nav && data.nav.linkWork,
      services: data.nav && data.nav.linkServices,
      about: data.nav && data.nav.linkAbout,
      process: data.nav && data.nav.linkProcess,
      contact: data.nav && data.nav.linkContact
    };
    Object.keys(links).forEach(function (key) {
      var val = links[key];
      if (!val) return;
      ['c-nav-link-' + key, 'c-nav-mlink-' + key].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
      });
    });
  }

  function applyHeroTitle(data) {
    var h = data.hero;
    if (!h) return;
    var el = document.getElementById('c-hero-title');
    if (!el) return;
    var hasAny = h.titleLine1 || h.titleLine1Accent || h.titleLine2 || h.titleLine2Accent;
    if (!hasAny) return;

    function buildLine(plain, accent) {
      var line = document.createElement('span');
      line.className = 'line';
      (plain || '').split(/\s+/).filter(Boolean).forEach(function (word) {
        var w = document.createElement('span');
        w.className = 'word';
        w.textContent = word;
        line.appendChild(w);
      });
      if (accent) {
        var a = document.createElement('span');
        a.className = 'word accent-text';
        a.textContent = accent;
        line.appendChild(a);
      }
      return line;
    }

    el.innerHTML = '';
    el.appendChild(buildLine(h.titleLine1, h.titleLine1Accent));
    el.appendChild(buildLine(h.titleLine2, h.titleLine2Accent));
  }

  function applyMarquee(data) {
    var raw = data.hero && data.hero.marquee;
    if (!raw) return;
    var words = raw.split(',').map(function (w) { return w.trim(); }).filter(Boolean);
    if (!words.length) return;
    var track = document.getElementById('c-hero-marquee');
    if (!track) return;
    // Duplicated once so the CSS scroll loop reads as seamless, same as the
    // hand-written markup this replaces.
    var all = words.concat(words);
    track.innerHTML = all.map(function (w) {
      return '<span>' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span><span>•</span>';
    }).join('');
  }

  function applyContact(data) {
    var c = data.contact;
    if (!c) return;
    if (c.email) {
      var emailLink = document.getElementById('c-contact-email-link');
      var emailText = document.getElementById('c-contact-email-text');
      if (emailLink) emailLink.href = 'mailto:' + c.email;
      if (emailText) emailText.textContent = c.email;
      window.CONTACT_EMAIL = c.email; // keep the form's mailto fallback in sync
    }
    if (c.phone) {
      var phoneLink = document.getElementById('c-contact-phone-link');
      var phoneText = document.getElementById('c-contact-phone-text');
      if (phoneLink) phoneLink.href = 'tel:' + c.phone.replace(/\s+/g, '');
      if (phoneText) phoneText.textContent = c.phone;
    }
  }

  fetch('data/content.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data) return;
      FIELDS.forEach(function (f) { applyField(data, f[0], f[1], f[2]); });
      applyNavLinks(data);
      applyHeroTitle(data);
      applyMarquee(data);
      applyContact(data);
    })
    .catch(function () { /* content.json not reachable yet — hardcoded defaults stay */ });
})();
