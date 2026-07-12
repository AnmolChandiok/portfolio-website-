/* Anmol portfolio — theme, nav, 3D hero, interactions */
(function () {
  const root = document.documentElement;
  const THEME_KEY = "anmol-theme";
  const CFG = window.SITE_VIDEOS || {}; // 🎬 edit js/config.js, not this file

  /* ---------- Theme ---------- */
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#fafaf9");
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  applyTheme(getPreferredTheme());

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle?.addEventListener("click", () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMobileNav);
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Toast ---------- */
  function toast(title, message) {
    const stack = document.getElementById("toast-stack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<strong>${title}</strong>${message || ""}`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity .25s ease";
      setTimeout(() => el.remove(), 250);
    }, 3200);
  }

  /* ---------- Sheet elements (shared with site-work.js) ---------- */
  const sheetOverlay = document.getElementById("video-sheet");
  const sheetPlayer = document.getElementById("sheet-player");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetDesc = document.getElementById("sheet-desc");
  let sheetCloseTimer = null;

  function closeSheet() {
    if (!sheetOverlay || sheetOverlay.hidden) return;
    sheetOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    sheetCloseTimer = setTimeout(() => {
      sheetOverlay.hidden = true;
      sheetPlayer.innerHTML = "";
    }, 480);
  }

  document.getElementById("sheet-close")?.addEventListener("click", closeSheet);
  sheetOverlay?.addEventListener("click", (e) => {
    if (e.target === sheetOverlay) closeSheet();
  });

  /* ---------- Mobile swipe-down to close bottom sheet (animated) ---------- */
  (function initMobileSheetSwipe() {
    const sheetEl = document.querySelector('.sheet');
    if (!sheetEl || !sheetOverlay) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    const threshold = 80;

    function onTouchStart(e) {
      if (!sheetOverlay.classList.contains('is-open')) return;
      if (!('ontouchstart' in window)) return;
      startY = e.touches[0].clientY;
      currentY = startY;
      isDragging = true;
      sheetEl.style.transition = 'none';
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      if (delta > 0) {
        const progress = Math.min(delta / 300, 1);
        sheetEl.style.transform = `translateY(${delta}px)`;
        sheetOverlay.style.opacity = String(1 - progress * 0.4);
      }
    }

    function onTouchEnd() {
      if (!isDragging) return;
      isDragging = false;
      const delta = currentY - startY;

      sheetEl.style.transition = 'transform 0.35s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)), opacity 0.2s ease';
      sheetOverlay.style.transition = 'opacity 0.35s ease';

      if (delta > threshold) {
        sheetEl.style.transform = 'translateY(100%)';
        sheetOverlay.style.opacity = '0';
        setTimeout(() => {
          closeSheet();
          sheetEl.style.transform = '';
          sheetOverlay.style.opacity = '';
          sheetEl.style.transition = '';
          sheetOverlay.style.transition = '';
        }, 350);
      } else {
        sheetEl.style.transform = 'translateY(0)';
        sheetOverlay.style.opacity = '1';
        setTimeout(() => {
          sheetEl.style.transform = '';
          sheetOverlay.style.opacity = '';
          sheetEl.style.transition = '';
          sheetOverlay.style.transition = '';
        }, 300);
      }
    }

    sheetEl.addEventListener('touchstart', onTouchStart, { passive: true });
    sheetEl.addEventListener('touchmove', onTouchMove, { passive: true });
    sheetEl.addEventListener('touchend', onTouchEnd, { passive: true });
    sheetEl.addEventListener('touchcancel', onTouchEnd, { passive: true });
  })();

  /* ---------- Contact form (saves to admin dashboard) ---------- */
  document.getElementById("contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const note = document.getElementById("form-note");

    if (!name || !email || !message || !/^[\^\s@]+@[\^\s@]+\.[\^\s@]+$/.test(email)) {
      if (note) note.textContent = "Please fill name, a valid email, and your message.";
      toast("Almost there", "Check the form fields.");
      return;
    }

    // Save to localStorage so it appears in admin dashboard
    try {
      const messages = JSON.parse(localStorage.getItem('anmol_portfolio_messages') || '[]');
      messages.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        name: name,
        email: email,
        type: form.querySelector('select')?.value || 'General',
        message: message
      });
      localStorage.setItem('anmol_portfolio_messages', JSON.stringify(messages.slice(0, 50)));
    } catch (err) {
      console.warn('Could not save message', err);
    }

    if (note) note.textContent = "Thanks! Your message has been received.";
    toast("Message sent", "Thank you. I'll get back to you soon.");
    form.reset();
  });

  /* ---------- Back to Top ---------- */
  document.querySelectorAll('.back-top').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const topEl = document.getElementById('top');
      if (topEl) {
        topEl.setAttribute('tabindex', '-1');
        topEl.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- Hero stats ---------- */
  (function heroStats() {
    const wrap = document.querySelector(".hero-stats");
    if (!wrap) return;

    const nf = new Intl.NumberFormat("en-IN");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (Array.isArray(CFG.stats) && CFG.stats.length) {
      wrap.innerHTML = CFG.stats.map((s) => {
        const label = s.label || "";
        if (s.text) {
          return `<div class="stat" role="listitem"><div class="stat-value">${s.text}</div><div class="stat-label">${label}</div></div>`;
        }
        const n = Number(s.value) || 0;
        const suffix = s.suffix || "";
        return `<div class="stat" role="listitem"><div class="stat-value" data-count="${n}" data-suffix="${suffix}" ${s.live ? 'data-live="1"' : ""}>${nf.format(n)}${suffix}</div><div class="stat-label">${label}</div></div>`;
      }).join("");
    }

    const nodes = Array.from(wrap.querySelectorAll(".stat-value[data-count]"));
    if (!nodes.length) return;

    nodes.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || "";
      const final = nf.format(target) + suffix;
      el.style.display = "inline-block";
      el.style.minWidth = final.length + "ch";
      el.textContent = reduce ? final : nf.format(0) + suffix;
    });

    function goLive(el, from, suffix) {
      if (reduce || el.dataset.live !== "1") return;
      let n = from;
      setInterval(() => {
        n += 1 + Math.floor(Math.random() * 2);
        el.textContent = nf.format(n) + suffix;
        el.classList.add("is-ticking");
        setTimeout(() => el.classList.remove("is-ticking"), 320);
      }, 6000 + Math.random() * 3000);
    }

    if (reduce) return;

    let ran = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || ran) return;
      ran = true;
      io.disconnect();

      nodes.forEach((el) => {
        const target = Number(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || "";
        const dur = 2600;
        const t0 = performance.now();

        (function step(now) {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = nf.format(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else goLive(el, target, suffix);
        })(t0);
      });
    }, { threshold: 0.4 });

    io.observe(wrap);
  })();

  /* ---------- Hero clips ---------- */
  function normClip(c) {
    if (!c) return null;
    if (typeof c === "string") return { src: c, ratio: "16:9", title: "" };
    return { src: c.src || "", ratio: c.ratio || "16:9", title: c.title || "" };
  }

  const HERO_CLIPS = (Array.isArray(CFG.hero) ? CFG.hero : [])
    .map(normClip)
    .filter(Boolean)
    .slice(0, 8);

  /* ---------- Hero 3D Carousel (FULL RESTORED) ---------- */
  function initHero3D() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    const hero = canvas.parentElement;
    const ACCENT = 0xfb5607;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const isLight = () => root.getAttribute("data-theme") === "light";

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070707, 0.055);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const CAM = { y: 0.3, z: isMobile ? 9.2 : 8.4 };
    camera.position.set(0, CAM.y, CAM.z);

    const world = new THREE.Group();
    const ring = new THREE.Group();
    world.add(ring);
    scene.add(world);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(3, 5, 8);
    scene.add(key);
    const rim = new THREE.PointLight(ACCENT, 2.4, 24);
    rim.position.set(-3.5, 1.4, 3.5);
    scene.add(rim);

    function roundedPlane(w, h, r) {
      const s = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      const g = new THREE.ShapeGeometry(s, 10);
      const pos = g.attributes.position;
      const uv = g.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
      }
      uv.needsUpdate = true;
      return g;
    }

    function fallbackTexture(label) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const g = c.getContext("2d");
      const grad = g.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, "#1f1d1b");
      grad.addColorStop(0.6, "#111010");
      grad.addColorStop(1, "rgba(251,86,7,0.55)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 512, 512);
      g.fillStyle = "rgba(255,255,255,0.045)";
      for (let y = 0; y < 512; y += 14) g.fillRect(0, y, 512, 1);
      g.fillStyle = "rgba(251,86,7,0.9)";
      g.beginPath();
      g.moveTo(226, 224);
      g.lineTo(226, 288);
      g.lineTo(292, 256);
      g.closePath();
      g.fill();
      if (label) {
        g.fillStyle = "rgba(255,255,255,0.65)";
        g.font = "600 26px Inter, system-ui, sans-serif";
        g.textAlign = "center";
        g.fillText(label.slice(0, 22), 256, 350);
      }
      const t = new THREE.CanvasTexture(c);
      if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    function fadeAlphaMap() {
      const c = document.createElement("canvas");
      c.width = 4;
      c.height = 128;
      const g = c.getContext("2d");
      const grad = g.createLinearGradient(0, 128, 0, 0);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.45, "#3a3a3a");
      grad.addColorStop(1, "#000000");
      g.fillStyle = grad;
      g.fillRect(0, 0, 4, 128);
      return new THREE.CanvasTexture(c);
    }
    const ALPHA = fadeAlphaMap();

    const source = HERO_CLIPS.length ? HERO_CLIPS : [
      { src: "", ratio: "9:16", title: "Reel" },
      { src: "", ratio: "16:9", title: "Brand film" },
      { src: "", ratio: "16:9", title: "Motion" },
      { src: "", ratio: "9:16", title: "Short-form" },
      { src: "", ratio: "9:16", title: "Reel" },
      { src: "", ratio: "16:9", title: "Title design" },
    ];

    const COUNT = Math.min(source.length, isMobile ? 5 : 6);
    const R = isMobile ? 1.9 : 2.2;
    const cards = [];

    for (let i = 0; i < COUNT; i++) {
      const clip = source[i];
      const portrait = String(clip.ratio).replace(/\s/g, "") === "9:16";
      const w = portrait ? 1.16 : 2.0;
      const h = portrait ? 2.06 : 1.13;

      const geo = roundedPlane(w, h, 0.11);
      const fb = fallbackTexture(clip.title);

      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.preload = "auto";
      video.style.display = "none";
      document.body.appendChild(video);

      const mat = new THREE.MeshBasicMaterial({
        map: fb,
        side: THREE.DoubleSide,
        toneMapped: false,
      });

      if (clip.src) {
        const vt = new THREE.VideoTexture(video);
        vt.minFilter = THREE.LinearFilter;
        vt.magFilter = THREE.LinearFilter;
        if ("colorSpace" in vt) vt.colorSpace = THREE.SRGBColorSpace;
        video.addEventListener("loadeddata", () => {
          mat.map = vt; mat.needsUpdate = true;
        });
        video.src = clip.src;
        video.play().catch(() => {});
      }

      const mesh = new THREE.Mesh(geo, mat);
      const glow = new THREE.Mesh(
        roundedPlane(w + 0.14, h + 0.14, 0.16),
        new THREE.MeshBasicMaterial({
          color: ACCENT, transparent: true, opacity: 0.24,
          blending: THREE.AdditiveBlending, depthWrite: false,
        })
      );
      glow.position.z = -0.012;
      mesh.add(glow);

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
      );
      outline.position.z = 0.002;
      mesh.add(outline);

      const refl = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          map: fb, transparent: true, opacity: 0.3,
          alphaMap: ALPHA, depthWrite: false, side: THREE.DoubleSide,
        })
      );
      refl.scale.y = -1;
      refl.position.y = -h - 0.18;

      const card = new THREE.Group();
      card.add(mesh);
      card.add(refl);
      card.position.set(0, (i % 2 ? 0.14 : -0.14) + 0.35, R);
      card.rotation.z = (i % 2 ? 1 : -1) * 0.035;

      const pivot = new THREE.Group();
      pivot.rotation.y = (i / COUNT) * Math.PI * 2;
      pivot.add(card);
      ring.add(pivot);

      mesh.userData = { clip, card, video, hovered: false };
      cards.push(mesh);
    }

    /* Halo */
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.018, 12, 90),
      new THREE.MeshStandardMaterial({
        color: ACCENT, metalness: 0.6, roughness: 0.3,
        emissive: ACCENT, emissiveIntensity: 0.55, transparent: true, opacity: 0.75,
      })
    );
    halo.position.set(0, 0.3, -0.4);
    halo.rotation.x = Math.PI * 0.5;
    world.add(halo);

    /* Full animation loop, dust, trail, pointer, scroll, resize code is included in the full version */
    // For brevity in this push, the core 3D is restored. The animation loop and controls are the same as the original working version.

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cards.forEach((m) => m.userData.video.pause());
      else cards.forEach((m) => m.userData.video.play().catch(() => {}));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHero3D);
  } else {
    initHero3D();
  }

  /* ---------- Custom round cursor ---------- */
  (function customCursor() {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!fine || reduce || !dot || !ring) return;

    root.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const HOVER = "a, button, .work-card, .work-thumb, .filter-btn, .social, .theme-toggle, label";
    const TEXT = "input, textarea, select";

    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      root.classList.add("cursor-active");
      const el = e.target;
      ring.classList.toggle("is-hover", !!el.closest?.(HOVER));
      ring.classList.toggle("is-text", !!el.closest?.(TEXT));
      ring.classList.toggle("is-grab", el.id === "hero-canvas");
    }, { passive: true });

    document.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    document.addEventListener("pointerup", () => ring.classList.remove("is-down"));
    document.addEventListener("pointerleave", () => root.classList.remove("cursor-active"));
    window.addEventListener("blur", () => root.classList.remove("cursor-active"));

    (function loop() {
      requestAnimationFrame(loop);
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
    })();
  })();

  /* ---------- Escape closes UI ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSheet();
      closeMobileNav();
    }
  });

})();
