/* Anmol portfolio — theme, nav, 3D hero, interactions */

(function () {
  const root = document.documentElement;
  const THEME_KEY = "anmol-theme";

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

  /* ---------- Work filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      workCards.forEach((card) => {
        const cats = (card.dataset.cat || "").split(/\s+/);
        const show = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Preview modal ---------- */
  const modal = document.getElementById("preview-modal");
  const previewTitle = document.getElementById("preview-title");
  const previewDesc = document.getElementById("preview-desc");
  const previewVisual = document.getElementById("preview-visual");

  function openPreview(title, desc) {
    if (!modal) return;
    previewTitle.textContent = title;
    previewDesc.textContent = desc || "Demo preview — swap in your real video embed later.";
    previewVisual.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".work-card").forEach((card) => {
    const title = card.querySelector("h3")?.textContent || "Project";
    const desc = card.querySelector("p")?.textContent || "";
    card.querySelector(".work-play")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openPreview(title, desc);
    });
  });

  document.getElementById("preview-close")?.addEventListener("click", closePreview);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closePreview();
  });

  /* ---------- Contact form ---------- */
  document.getElementById("contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const note = document.getElementById("form-note");

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (note) note.textContent = "Please fill name, a valid email, and your message.";
      toast("Almost there", "Check the form fields.");
      return;
    }

    if (note) note.textContent = "Thanks — message captured in this demo.";
    toast("Message sent (demo)", "Connect Formspree or your email to go live.");
    form.reset();
  });

  /* ---------- Hero video playback (cards + bank) ---------- */
  const HERO_CLIPS = [
    "media/luxury.mp4",
    "media/stain-glass.mp4",
    "media/hero-anim.mp4",
    "media/animation.mp4",
    "media/knowledge.mp4",
  ];

  function allHeroVideos() {
    return [
      ...document.querySelectorAll(".film-video"),
      ...document.querySelectorAll("#hero-video-bank video"),
    ];
  }

  function playHeroVideos(muted = true) {
    allHeroVideos().forEach((v) => {
      v.muted = muted;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
  }

  // Ensure card videos start
  document.querySelectorAll(".film-video").forEach((v) => {
    v.muted = true;
    v.loop = true;
    const tryPlay = () => playHeroVideos(true);
    v.addEventListener("loadeddata", tryPlay, { once: true });
    tryPlay();
  });

  // First user gesture unlocks autoplay on mobile
  const unlockPlay = () => {
    playHeroVideos(document.getElementById("hero-audio-toggle")?.classList.contains("is-unmuted") ? false : true);
  };
  ["pointerdown", "touchstart", "click"].forEach((evt) => {
    window.addEventListener(evt, unlockPlay, { once: true, passive: true });
  });

  // Mute / unmute orb (only cards — 3D bank stays muted)
  const audioToggle = document.getElementById("hero-audio-toggle");
  audioToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const unmuted = audioToggle.classList.toggle("is-unmuted");
    document.querySelectorAll(".film-video").forEach((v) => {
      v.muted = !unmuted;
      if (unmuted) {
        // Only one card with audio to avoid chaos
        document.querySelectorAll(".film-video").forEach((other, i) => {
          other.muted = i !== 1; // brand card (stain glass) has audio when unmuted
        });
      }
      v.play().catch(() => {});
    });
    audioToggle.innerHTML = unmuted
      ? '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>';
    audioToggle.setAttribute("aria-label", unmuted ? "Mute hero previews" : "Unmute hero previews");
    audioToggle.title = unmuted ? "Mute" : "Unmute previews";
  });

  /* ---------- CSS 3D stage drag / tilt ---------- */
  const orbit = document.getElementById("stage-orbit");
  if (orbit) {
    let rotY = 0;
    let rotX = 8;
    let targetY = 0;
    let targetX = 8;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function applyOrbit() {
      if (reduce) return;
      rotY += (targetY - rotY) * 0.08;
      rotX += (targetX - rotX) * 0.08;
      orbit.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      requestAnimationFrame(applyOrbit);
    }
    if (!reduce) applyOrbit();

    function onPointerDown(e) {
      if (e.target.closest(".play-orb")) return;
      dragging = true;
      lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    }

    function onPointerMove(e) {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x == null) return;

      if (dragging) {
        const dx = x - lastX;
        const dy = y - lastY;
        targetY += dx * 0.35;
        targetX = Math.max(-20, Math.min(24, targetX - dy * 0.25));
        lastX = x;
        lastY = y;
      } else if (window.matchMedia("(pointer: fine)").matches) {
        const rect = orbit.getBoundingClientRect();
        const nx = (x - rect.left) / rect.width - 0.5;
        const ny = (y - rect.top) / rect.height - 0.5;
        targetY = nx * 28;
        targetX = 8 - ny * 16;
      }
    }

    function onPointerUp() {
      dragging = false;
    }

    orbit.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    orbit.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
  }

  /* ---------- Three.js hero background with YOUR video textures ---------- */
  function initHero3D() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    const hero = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0xfb5607, 2.2, 20);
    rim.position.set(-3, 1, 4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xff9a5c, 1.1, 18);
    fill.position.set(3, -2, 2);
    scene.add(fill);

    const accent = 0xfb5607;
    const isLight = () => root.getAttribute("data-theme") === "light";
    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    const planeGeo = new THREE.PlaneGeometry(1.7, 0.96, 1, 1);
    const planeGeoV = new THREE.PlaneGeometry(0.78, 1.38, 1, 1);

    const layouts = [
      { geo: planeGeoV, pos: [-2.15, 0.55, -0.4], rot: [0.12, 0.48, -0.08], src: HERO_CLIPS[0] },
      { geo: planeGeo, pos: [1.75, 0.25, 0.25], rot: [-0.1, -0.42, 0.05], src: HERO_CLIPS[1] },
      { geo: planeGeo, pos: [0.15, -1.05, -1.1], rot: [0.22, 0.18, 0.04], src: HERO_CLIPS[2] },
      { geo: planeGeoV, pos: [2.35, -0.75, -1.4], rot: [0.08, -0.28, 0.08], src: HERO_CLIPS[3] },
      { geo: planeGeo, pos: [-1.55, -0.85, -1.9], rot: [-0.18, 0.32, 0], src: HERO_CLIPS[4] },
    ];

    // On phones use fewer video planes for performance
    const activeLayouts = isMobile ? layouts.slice(0, 3) : layouts;
    const planes = [];
    const videoTextures = [];

    function createVideoEl(src) {
      const video = document.createElement("video");
      video.src = src;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.preload = "auto";
      video.style.display = "none";
      document.body.appendChild(video);
      return video;
    }

    activeLayouts.forEach((L, i) => {
      const video = createVideoEl(L.src);
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      if ("colorSpace" in texture) texture.colorSpace = THREE.SRGBColorSpace;
      else if ("encoding" in texture) texture.encoding = THREE.sRGBEncoding;

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false,
      });

      const mesh = new THREE.Mesh(L.geo, mat);
      mesh.position.set(...L.pos);
      mesh.rotation.set(...L.rot);
      mesh.userData.base = {
        x: L.pos[0],
        y: L.pos[1],
        z: L.pos[2],
      };
      mesh.userData.phase = i * 0.9;
      mesh.userData.video = video;
      group.add(mesh);
      planes.push(mesh);
      videoTextures.push(texture);

      const edges = new THREE.EdgesGeometry(L.geo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.7 })
      );
      mesh.add(line);

      const start = () => {
        video.play().catch(() => {});
      };
      video.addEventListener("loadeddata", start, { once: true });
      video.addEventListener("canplay", start, { once: true });
      start();
    });

    // Retry play on user gesture
    window.addEventListener(
      "pointerdown",
      () => {
        planes.forEach((m) => m.userData.video?.play().catch(() => {}));
      },
      { once: true, passive: true }
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.035, 16, 100),
      new THREE.MeshStandardMaterial({
        color: accent,
        metalness: 0.7,
        roughness: 0.25,
        emissive: accent,
        emissiveIntensity: 0.4,
      })
    );
    torus.position.set(0.4, 0.15, -0.2);
    torus.rotation.x = Math.PI * 0.5;
    group.add(torus);

    const count = isMobile ? 120 : 360;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: accent,
      size: 0.032,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.MeshStandardMaterial({
        color: accent,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    );
    ico.position.set(-0.8, 1.1, 0.5);
    group.add(ico);

    function resize() {
      const rect = hero.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => setTimeout(resize, 120));

    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    function onMove(e) {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x == null) return;
      const rect = hero.getBoundingClientRect();
      tx = ((x - rect.left) / rect.width - 0.5) * 2;
      ty = ((y - rect.top) / rect.height - 0.5) * 2;
    }
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("touchmove", onMove, { passive: true });

    function refreshMaterials() {
      const light = isLight();
      pMat.opacity = light ? 0.45 : 0.7;
      rim.intensity = light ? 1.4 : 2.2;
    }
    window.addEventListener("themechange", refreshMaterials);

    let t = 0;
    let raf;
    let running = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        planes.forEach((m) => {
          const v = m.userData.video;
          if (!v) return;
          if (running) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.05 }
    );
    io.observe(hero);

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      t += 0.01;

      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;

      group.rotation.y = px * 0.25;
      group.rotation.x = py * 0.12;
      group.position.x = px * 0.15;
      group.position.y = -py * 0.1;

      planes.forEach((mesh) => {
        const ph = mesh.userData.phase;
        mesh.position.y = mesh.userData.base.y + Math.sin(t + ph) * 0.12;
        mesh.rotation.z = Math.sin(t * 0.5 + ph) * 0.04;
        if (mesh.material.map) mesh.material.map.needsUpdate = true;
      });

      torus.rotation.z = t * 0.35;
      torus.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.4) * 0.15;
      ico.rotation.x = t * 0.4;
      ico.rotation.y = t * 0.55;
      points.rotation.y = t * 0.05;

      renderer.render(scene, camera);
    }
    tick();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        planes.forEach((m) => m.userData.video?.pause());
      } else {
        planes.forEach((m) => m.userData.video?.play().catch(() => {}));
        tick();
      }
    });
  }

  // Boot 3D after layout
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHero3D);
  } else {
    initHero3D();
  }

  /* ---------- Escape closes UI ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePreview();
      closeMobileNav();
    }
  });
})();
