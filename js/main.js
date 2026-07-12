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

  /* ---------- Work filter, work-card previews, and the video sheet's
     open/close logic for the work grid all now live in js/site-work.js,
     which builds those cards from data/videos.json. The sheet element
     itself (#video-sheet) is shared — the hero carousel below also opens
     it via openSheetRaw(). ---------- */

  /* ---------- Preview modal ---------- */
  /* ---------- Preview modal (Improved for 9:16 + 16:9) ---------- */
const sheetOverlay = document.getElementById("video-sheet");
const sheetPlayer = document.getElementById("sheet-player");
const sheetTitle = document.getElementById("sheet-title");
const sheetDesc = document.getElementById("sheet-desc");
let sheetCloseTimer = null;

function toEmbed(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return "https://www.youtube-nocookie.com/embed/" + yt[1] + "?autoplay=1&rel=0&playsinline=1";
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return "https://player.vimeo.com/video/" + vm[1] + "?autoplay=1";
  return null;
}

function showSheetEmpty(title, msg) {
  sheetPlayer.innerHTML =
    '<div class="sheet-empty"><i class="fa-solid fa-clapperboard" aria-hidden="true"></i><strong>' +
    title +
    "</strong><span>" +
    msg +
    "</span></div>";
}

/* NEW: Creates a responsive wrapper based on video ratio */
function createPlayerWrapper(ratio = "9:16") {
  const wrapper = document.createElement("div");
  wrapper.className = "video-player-wrapper";
  wrapper.setAttribute("data-ratio", ratio);
  return wrapper;
}

function buildPlayer(src, ratio = "9:16") {
  sheetPlayer.innerHTML = "";

  const wrapper = createPlayerWrapper(ratio);
  sheetPlayer.appendChild(wrapper);

  if (!src) {
    showSheetEmpty("Link coming soon", "Paste this project’s video link in js/config.js and it plays here.");
    return;
  }

  const embed = toEmbed(src);

  if (embed) {
    const f = document.createElement("iframe");
    f.src = embed;
    f.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
    f.allowFullscreen = true;
    f.title = "Video player";
    wrapper.appendChild(f);
    return;
  }

  // Self-hosted video
  const v = document.createElement("video");
  v.src = src;
  v.controls = true;
  v.autoplay = true;
  v.playsInline = true;
  v.setAttribute("playsinline", "");

  v.addEventListener(
    "error",
    () => showSheetEmpty("Video not found", "Check this project’s file path or link in js/config.js."),
    { once: true }
  );

  wrapper.appendChild(v);
  v.play().catch(() => {});
}

function openSheetRaw(title, meta, src, ratio = "9:16") {
  if (!sheetOverlay) return;

  sheetTitle.textContent = title || "Project";
  sheetDesc.textContent = meta || "";

  buildPlayer(src || "", ratio);

  clearTimeout(sheetCloseTimer);
  sheetOverlay.hidden = false;

  requestAnimationFrame(() =>
    requestAnimationFrame(() => sheetOverlay.classList.add("is-open"))
  );

  document.body.style.overflow = "hidden";
  document.getElementById("sheet-close")?.focus({ preventScroll: true });
}

function closeSheet() {
  if (!sheetOverlay || sheetOverlay.hidden) return;
  sheetOverlay.classList.remove("is-open");
  document.body.style.overflow = "";

  sheetCloseTimer = setTimeout(() => {
    sheetOverlay.hidden = true;
    sheetPlayer.innerHTML = ""; // stops playback
  }, 480);
}

/* Work-card clicks are bound in js/site-work.js, per card, at the moment
   each card is built — this file's job ends at openSheetRaw/closeSheet,
   which the hero carousel below also calls into. */

document.getElementById("sheet-close")?.addEventListener("click", closeSheet);

sheetOverlay?.addEventListener("click", (e) => {
  if (e.target === sheetOverlay) closeSheet();
});

  /* ---------- Contact form ---------- */
  document.getElementById("contact-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const note = document.getElementById("form-note");
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (note) note.textContent = "Please fill name, a valid email, and your message.";
      toast("Almost there", "Check the form fields.");
      return;
    }

    const endpoint = window.CONTACT_FORM_ENDPOINT || "";
    if (!endpoint) {
      if (note) note.textContent = "Form isn\u2019t connected yet \u2014 add a Formspree endpoint in js/config.js.";
      toast("Not connected", "See CONTACT_FORM_ENDPOINT in config.js.");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (note) note.textContent = "Sending\u2026";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        if (note) note.textContent = "Thanks \u2014 message sent. I\u2019ll get back to you soon.";
        toast("Message sent", "Thanks for reaching out.");
        form.reset();
      } else {
        if (note) note.textContent = "Couldn\u2019t send that \u2014 try again, or email directly.";
        toast("Send failed", "Try again or use the email link below.");
      }
    } catch (err) {
      if (note) note.textContent = "Couldn\u2019t send that \u2014 check your connection, or email directly.";
      toast("Send failed", "Try again or use the email link below.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  /* ---------- Hero stats: count-up + live tick ---------- */
  (function heroStats() {
    const wrap = document.querySelector(".hero-stats");
    if (!wrap) return;

    const nf = new Intl.NumberFormat("en-IN"); // 2,00,000 grouping
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (Array.isArray(CFG.stats) && CFG.stats.length) {
      wrap.innerHTML = CFG.stats
        .map((s) => {
          const label = s.label || "";
          if (s.text) {
            return (
              '<div class="stat" role="listitem"><div class="stat-value">' +
              s.text +
              '</div><div class="stat-label">' +
              label +
              "</div></div>"
            );
          }
          const n = Number(s.value) || 0;
          const suffix = s.suffix || "";
          return (
            '<div class="stat" role="listitem"><div class="stat-value" data-count="' +
            n +
            '" data-suffix="' +
            suffix +
            '"' +
            (s.live ? ' data-live="1"' : "") +
            ">" +
            nf.format(n) +
            suffix +
            '</div><div class="stat-label">' +
            label +
            "</div></div>"
          );
        })
        .join("");
    }

    const nodes = Array.from(wrap.querySelectorAll(".stat-value[data-count]"));
    if (!nodes.length) return;

    // Reserve the final width so the layout never jumps mid-count
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
    const io = new IntersectionObserver(
      ([entry]) => {
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
            const eased = 1 - Math.pow(1 - p, 3); // fast, then eases into place
            el.textContent = nf.format(Math.round(target * eased)) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else goLive(el, target, suffix);
          })(t0);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(wrap);
  })();

  /* ---------- Hero clips: dashboard-featured clips first, js/config.js as
     fallback ---------------------------------------------------------------
     The 3D cards are WebGL textures, not <iframe>s — a YouTube/Vimeo embed
     physically cannot be drawn onto a spinning card, only a real video FILE
     can. So a video only qualifies for the hero if, in admin.html, it's
     both (a) marked Featured and (b) set to "Silent clip you host" with an
     actual file path (not a YouTube loop). Anything else in your dashboard
     is correctly skipped here — it still shows fine in the work grid below,
     just not on the spinning cards. */
  function normClip(c) {
    if (!c) return null;
    if (typeof c === "string") return { src: c, ratio: "16:9", title: "" };
    return { src: c.src || "", ratio: c.ratio || "16:9", title: c.title || "" };
  }

  let HERO_CLIPS = [];

  async function resolveHeroClips() {
    try {
      const res = await fetch("data/videos.json", { cache: "no-cache" });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.videos || [];
        const fromDashboard = list
          .filter((v) => v && v.featured && !v.hidden && v.previewMode === "clip" && v.preview)
          .map((v) => ({ src: v.preview, ratio: v.aspect || "16:9", title: v.title || "" }));
        if (fromDashboard.length) return fromDashboard.slice(0, 8);
      }
    } catch (e) {
      /* offline, or file not reachable yet — fall through to config.js */
    }
    return (Array.isArray(CFG.hero) ? CFG.hero : []).map(normClip).filter(Boolean).slice(0, 8);
  }

  /* ---------- Work grid previews now live in js/site-work.js ---------- */

  /* ---------- Hero: 3D reel carousel ---------- */
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

    const world = new THREE.Group(); // tilts on scroll
    const ring = new THREE.Group(); // spins
    world.add(ring);
    scene.add(world);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(3, 5, 8);
    scene.add(key);
    const rim = new THREE.PointLight(ACCENT, 2.4, 24);
    rim.position.set(-3.5, 1.4, 3.5);
    scene.add(rim);

    /* --- rounded-corner plane with correct UVs --- */
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

    /* --- branded still, used when a clip is missing --- */
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

    /* --- vertical fade mask for the reflections --- */
    function fadeAlphaMap() {
      const c = document.createElement("canvas");
      c.width = 4;
      c.height = 128;
      const g = c.getContext("2d");
      const grad = g.createLinearGradient(0, 128, 0, 0); // v=0 (nearest card) -> v=1
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.45, "#3a3a3a");
      grad.addColorStop(1, "#000000");
      g.fillStyle = grad;
      g.fillRect(0, 0, 4, 128);
      return new THREE.CanvasTexture(c);
    }
    const ALPHA = fadeAlphaMap();

    /* --- build the ring of cards --- */
    const source = HERO_CLIPS.length
      ? HERO_CLIPS
      : [
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
          mat.map = vt;
          mat.needsUpdate = true;
          refl.material.map = vt;
          refl.material.needsUpdate = true;
        });
        video.addEventListener("error", () => {}, { once: true });
        video.src = clip.src;
        video.play().catch(() => {});
      }

      const mesh = new THREE.Mesh(geo, mat);

      // glow slab behind the card = the "glass" edge
      const glow = new THREE.Mesh(
        roundedPlane(w + 0.14, h + 0.14, 0.16),
        new THREE.MeshBasicMaterial({
          color: ACCENT,
          transparent: true,
          opacity: 0.24,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      glow.position.z = -0.012;
      mesh.add(glow);

      // crisp accent outline
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
      );
      outline.position.z = 0.002;
      mesh.add(outline);

      // mirrored reflection under the card
      const refl = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          map: fb,
          transparent: true,
          opacity: 0.3,
          alphaMap: ALPHA,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
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

    /* --- centre halo --- */
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.018, 12, 90),
      new THREE.MeshStandardMaterial({
        color: ACCENT,
        metalness: 0.6,
        roughness: 0.3,
        emissive: ACCENT,
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.75,
      })
    );
    halo.position.set(0, 0.3, -0.4);
    halo.rotation.x = Math.PI * 0.5;
    world.add(halo);

    /* --- ambient dust --- */
    const DUST = isMobile ? 140 : 320;
    const dPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 15;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 11 - 1;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    const dMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dGeo, dMat);
    scene.add(dust);

    /* --- cursor light trail --- */
    const TRAIL = 56;
    const tPos = new Float32Array(TRAIL * 3);
    const tCol = new Float32Array(TRAIL * 3);
    const base = new THREE.Color(ACCENT);
    for (let i = 0; i < TRAIL; i++) {
      const f = Math.pow(1 - i / TRAIL, 2.2);
      tCol[i * 3] = base.r * f;
      tCol[i * 3 + 1] = base.g * f;
      tCol[i * 3 + 2] = base.b * f;
      tPos[i * 3 + 2] = -50; // parked off-screen until the cursor moves
    }
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    tGeo.setAttribute("color", new THREE.BufferAttribute(tCol, 3));
    const trail = new THREE.Points(
      tGeo,
      new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
    );
    scene.add(trail);

    /* --- pointer state --- */
    const ndc = new THREE.Vector2(0, 0);
    const ray = new THREE.Raycaster();
    const trailPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3.4);
    const hit = new THREE.Vector3();
    let pointerInside = false;
    let hovered = null;

    let spin = 0.0022; // idle drift
    let vel = 0;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    function setNDC(e) {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) {
        pointerInside = false;
        return false;
      }
      pointerInside = true;
      ndc.x = ((x - r.left) / r.width) * 2 - 1;
      ndc.y = -((y - r.top) / r.height) * 2 + 1;
      tx = ndc.x;
      ty = -ndc.y;
      return true;
    }

    canvas.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      canvas.classList.add("is-dragging");
      canvas.setPointerCapture?.(e.pointerId);
    });

    window.addEventListener("pointermove", (e) => {
      setNDC(e);
      if (dragging) {
        const dx = e.clientX - lastX;
        moved += Math.abs(dx);
        vel += dx * 0.00042;
        lastX = e.clientX;
      }
    });

    window.addEventListener("pointerup", (e) => {
      if (dragging && moved < 6 && pointerInside && hovered) {
        const c = hovered.userData.clip;
        openSheetRaw(c.title || "Hero clip", c.ratio || "", c.src || "");
      }
      dragging = false;
      canvas.classList.remove("is-dragging");
    });

    canvas.addEventListener("pointerleave", () => {
      pointerInside = false;
    });

    /* --- scroll-driven camera --- */
    let scrollP = 0;
    function onScroll() {
      const r = hero.getBoundingClientRect();
      scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* --- theme --- */
    function applyThemeToScene() {
      const light = isLight();
      scene.fog.color.setHex(light ? 0xfafaf9 : 0x070707);
      dMat.opacity = light ? 0.4 : 0.6;
      rim.intensity = light ? 1.5 : 2.4;
      halo.material.opacity = light ? 0.55 : 0.75;
    }
    applyThemeToScene();
    window.addEventListener("themechange", applyThemeToScene);

    let frontIdx = 0;

    // browsers need a gesture before video plays
    window.addEventListener(
      "pointerdown",
      () => cards.forEach((m) => m.userData.video.play().catch(() => {})),
      { once: true, passive: true }
    );

    /* --- resize --- */
    function resize() {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => setTimeout(resize, 150));

    /* --- run loop --- */
    let running = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        cards.forEach((m) => {
          const v = m.userData.video;
          running ? v.play().catch(() => {}) : v.pause();
        });
      },
      { threshold: 0.02 }
    );
    io.observe(hero);

    const tmp = new THREE.Vector3();
    let t = 0;
    let started = false;

    function tick() {
      requestAnimationFrame(tick);
      if (!running) return;
      t += 0.01;

      // spin + inertia
      vel *= 0.94;
      ring.rotation.y += spin + vel;

      // cursor parallax
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      world.rotation.y = px * 0.12;
      world.position.x = px * 0.22;

      // scroll: camera pulls back and lifts, the ring tips away
      camera.position.z = CAM.z + scrollP * 3.4;
      camera.position.y = CAM.y + scrollP * 1.9 + py * 0.18;
      world.rotation.x = scrollP * 0.4 + py * 0.06;
      world.position.y = -scrollP * 0.5;
      camera.lookAt(0, 0.3 - scrollP * 0.9, 0);

      // hover test + front card
      let bestZ = -Infinity;
      if (pointerInside && !dragging) {
        ray.setFromCamera(ndc, camera);
        const hits = ray.intersectObjects(cards, false);
        hovered = hits.length ? hits[0].object : null;
        canvas.style.cursor = hovered ? "pointer" : "";
      } else if (!dragging) {
        hovered = null;
      }

      cards.forEach((m, i) => {
        m.getWorldPosition(tmp);
        if (tmp.z > bestZ) {
          bestZ = tmp.z;
          frontIdx = i;
        }
        const target = m === hovered ? 1.07 : 1;
        m.scale.x += (target - m.scale.x) * 0.12;
        m.scale.y = m.scale.x;
        m.userData.card.position.y +=
          (((i % 2 ? 0.14 : -0.14) + 0.35 + Math.sin(t * 0.9 + i) * 0.06) - m.userData.card.position.y) * 0.1;
        if (m.material.map && m.material.map.isVideoTexture) m.material.map.needsUpdate = true;
      });

      // trail follows the cursor with lag
      if (pointerInside) {
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(trailPlane, hit)) {
          const p = tGeo.attributes.position.array;
          for (let i = TRAIL - 1; i > 0; i--) {
            p[i * 3] = p[(i - 1) * 3];
            p[i * 3 + 1] = p[(i - 1) * 3 + 1];
            p[i * 3 + 2] = p[(i - 1) * 3 + 2];
          }
          if (!started) {
            for (let i = 0; i < TRAIL; i++) {
              p[i * 3] = hit.x;
              p[i * 3 + 1] = hit.y;
              p[i * 3 + 2] = hit.z;
            }
            started = true;
          }
          p[0] = hit.x;
          p[1] = hit.y;
          p[2] = hit.z;
          tGeo.attributes.position.needsUpdate = true;
        }
      }

      halo.rotation.z = t * 0.3;
      halo.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.4) * 0.12;
      dust.rotation.y = t * 0.04;
      dust.position.x = -px * 0.4;
      dust.position.y = -py * 0.25;

      renderer.render(scene, camera);
    }
    tick();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cards.forEach((m) => m.userData.video.pause());
      else cards.forEach((m) => m.userData.video.play().catch(() => {}));
    });
  }

  resolveHeroClips().then(function (clips) {
    HERO_CLIPS = clips;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initHero3D);
    } else {
      initHero3D();
    }
  });

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

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        root.classList.add("cursor-active");
        const el = e.target;
        ring.classList.toggle("is-hover", !!el.closest?.(HOVER));
        ring.classList.toggle("is-text", !!el.closest?.(TEXT));
        ring.classList.toggle("is-grab", el.id === "hero-canvas");
      },
      { passive: true }
    );

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
