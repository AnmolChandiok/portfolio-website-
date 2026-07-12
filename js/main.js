
Claude finished the response
Give me admin password

Your admin password is Pluseshot-2026

That's the default I set. If you changed it using the Password button in the dashboard since then, I don't have access to what you changed it to — I can only see the hash that gets stored in the file, and hashes only go one direction (you can't reverse them back into the password).

If you need to know your current password: you'd have to reset it by opening admin.html in a text editor, finding this line near the top of the <script> section:

js
var PW_HASH = '...';
And replacing the hash with a new one (generate one using the console method I showed you earlier, then paste it in). That's the only way to recover from a forgotten password on a static site.

But if you haven't changed it since I set it up, just use Pluseshot-2026 — and after you paste the new admin.html, that'll still be your password.

Now I want you to add a section in my admin panel or dashboard panel where, if anyone sends message enquiries, it should display me right there and few other things, just like if I have given a video, use that video in the above revolving three d section to play some videos. And if anybody selects the video, the bottom option should be opening regarding that video. And the ratios of the video for landscape and for the vertical reels are not there. They are not right. And you need to add b enhanced adobe's... b enhanced portfolio website support in the dashboard as well. And I need all on autoplay. Same goes for the Instagram as well. Keep in mind the ratios, how they look in the preview.


Reconciled technical constraints with feature feasibility decisions
Reconciled technical constraints with feature feasibility decisions
This is a big set of asks — let me work through what's genuinely buildable, and flag the two pieces that run into real technical/cost walls rather than quietly building something shaky.


Architected dual-source system for separate texture and playback rendering
Architected dual-source system for separate texture and playback rendering
Now implementing three real fixes together: the actual video-distortion bug (a proper "cover crop" instead of stretch), making hero clicks open the full video instead of the silent preview loop, and confirming autoplay:


Adding proper cover-crop UV math so a video's real dimensions never get stretched to fit the card, using actual video metadata instead of blindly trusting the declared ratio
Adding proper cover-crop UV math so a video's real dimensions never get stretched to fit the card, using actual video metadata instead of blindly trusting the declared ratio
Now fixing the click handler so it opens the full video, not the silent texture clip:


Making the hero card click open the full video (YouTube) instead of the short silent texture clip
Making the hero card click open the full video (YouTube) instead of the short silent texture clip
Now let's give clips both a texture source and a full-playback source:


Assessed video autoplay implementation and catalogued dashboard integration requirements
Assessed video autoplay implementation and catalogued dashboard integration requirements
Good — autoplay for the hero cards was already firing (video.play() right after setting the source), so that part just needed the ratio/click fixes above. Now let's build the social links management you asked for — I read "b enhanced" as Behance, since that icon's sitting unlinked on your site right now:


Architected dynamic social link system with JSON configuration and JavaScript integration
Architected dynamic social link system with JSON configuration and JavaScript integration
Now the data file and the site-side script to apply it:


Created a file, viewed a file, edited a file
Created a file, viewed a file, edited a file
Now let's add the editor for these links in admin.html — a small "Links" panel next to Password/Messages:


Adding a Links button to the header
Adding a Links button to the header
Now the modal:


Adding the Links modal after the messages modal
Adding the Links modal after the messages modal
Now the JS wiring — reusing the same getRemote/gh/filePath helpers already built for the password feature:


Orchestrated metadata links and conditional URL rendering for enhanced sheet display
Orchestrated metadata links and conditional URL rendering for enhanced sheet display
Now adding the Instagram support you asked about — being upfront about the real constraint: Instagram doesn't offer a public way to embed a reel that autoplays inline like YouTube does, so true in-place playback isn't something I can build safely. What I can do, which is the same pattern real portfolio sites use: a "View on Instagram" link next to the player, same as a YouTube link:


Edited 2 files
Edited 2 files
Now let's render both links on the site's player sheet:


Adding a YouTube link and optional Instagram link to the sheet meta, built dynamically per video
Adding a YouTube link and optional Instagram link to the sheet meta, built dynamically per video
Now the CSS for .sheet-links:


Resolved sheet handler inconsistency by clearing stale elements strategically
Resolved sheet handler inconsistency by clearing stale elements strategically
One consistency fix needed — if someone opens a work-grid video (with its description/links) and then a hero video, the old description would stay stuck on screen. Fixing that:


Reconciled field distinctions for metadata versus descriptive content
Reconciled field distinctions for metadata versus descriptive content
Now let's validate everything across all touched files:


Full validation pass across every edited file
Full validation pass across every edited file
All clean. Now the messages/inbox piece — here's where I need to level with you rather than build something shaky:


Ran a command, read a file
Ran a command, read a file
What I actually built this round
The ratio bug — root cause found and fixed for real this time. The hero cards were stretching video textures onto a fixed-shape mesh regardless of the video file's actual dimensions. Now it reads the real width/height off the video itself and crops (not stretches) it to fit — same principle as CSS object-fit: cover, just done properly in WebGL.

Clicking a hero card now plays the full video, not the silent 5-second loop that textures the spinning card. Those were quietly using the same file before, which meant clicking a card only ever showed you a few muted seconds on repeat.

Social links — Instagram, YouTube, LinkedIn, Behance are all editable now from the Links button in the dashboard, publish straight to the site, and any left blank just hide their icon instead of sitting there as a dead link.

Instagram videos — added an optional link field per video that shows a "View on Instagram ↗" next to the player.

Where I pushed back rather than build something weak
Messages appearing live inside admin.html — I looked this up properly rather than guess. Formspree's submissions API (GET /api/0/forms/.../submissions) does exist, but it's gated to their Professional plan at $30/month. Their free plan only lets you view submissions by logging into formspree.io directly — which is exactly what the Messages button I already built points you to. I didn't want to build a feature that either silently costs you $30/month or silently doesn't work — so it stays as a clear link to their dashboard for now. If you want the fully-embedded version badly enough to pay for it, tell me and I'll wire up the API call.

Instagram videos playing inline like YouTube — genuinely not possible. Instagram has no public embed that autoplays a reel the way a YouTube iframe does, and it definitely can't be drawn as a WebGL texture for the hero carousel — the "View on Instagram" link is the honest version of this feature.

One thing worth knowing about the hero carousel
It only pulls videos that are both marked Featured and set to "Silent clip you host" with a real file — a YouTube link alone can't become a spinning 3D card, only an actual video file can. Nothing breaks if none qualify yet; it just falls back to the placeholder cards until you set one up.

Same drag-in-the-zip, drag-to-GitHub process as before.


Portfolio website clean
ZIP 
give divide files


Identified modified files for individual presentation
Identified modified files for individual presentation
Here are the individual files that changed this round — same as before, open each existing file on GitHub, replace its content:


Presented 6 files
Presented 6 files
Where each one goes:

File I gave you	Replace this path on GitHub	Or, if it doesn't exist yet
index.html	index.html	—
styles.css	css/styles.css	—
main.js	js/main.js	—
site-work.js	js/site-work.js	—
admin.html	admin.html	—
social.json	data/social.json	New file — create it at that path
Unchanged this round, leave as-is: js/config.js, README.md, css/work-integration.css, data/videos.json.

One reminder from last time still applies: if you've changed your admin password since I set it up, this fresh admin.html resets it back to Pluseshot-2026 — redo the password change afterward if needed, or tell me your current hash first and I'll bake it back in before you paste.


Index
Code · HTML 

Styles
Code · CSS 

Main
JS 

Site work
JS 

Admin
Code · HTML 

Social
Code · JSON 
Give me a list in order I need to change the things you, uh, or update the code in GitHub. I need the names. and only names of those file in which I have to make changes, and I will be needing the complete code just like before. I will be copy... pasting complete code.

Here's the order to update them in — do them in this sequence so nothing references a file that isn't there yet:

js/config.js (unchanged — skip, already correct)
data/social.json (new file — create this one first)
css/styles.css
js/site-work.js
js/main.js
index.html
admin.html
Since you'll be pasting complete code for each, here they are again, ready to copy:


Presented 6 files
Presented 6 files
Quick recap of where each one lands on GitHub:

#	File	GitHub path
1	social.json	data/social.json (new — create it)
2	styles.css	css/styles.css
3	site-work.js	js/site-work.js
4	main.js	js/main.js
5	index.html	index.html
6	admin.html	admin.html
For each existing file: open it on GitHub → pencil icon (Edit) → select all → paste → commit. For social.json, use Add file → Create new file, type the path data/social.json, paste the content, commit.

Same password reminder as before: pasting this admin.html resets your password to Pluseshot-2026 unless you tell me your current hash first.


Social
Code · JSON 

Styles
Code · CSS 

Site work
JS 

Main
JS 

Index
Code · HTML 

Admin
Code · HTML 






Claude is AI and can make mistakes. Please double-check responses.
Main · JS
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
 
  const descEl = document.getElementById("sheet-description");
  if (descEl) { descEl.textContent = ""; descEl.hidden = true; }
  const oldLinks = sheetOverlay.querySelector(".sheet-links");
  if (oldLinks) oldLinks.remove();
 
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
    if (typeof c === "string") return { src: c, playSrc: c, ratio: "16:9", title: "", description: "" };
    return {
      src: c.src || "",
      playSrc: c.src || "",       // config.js clips only ever had one file — reuse it
      ratio: c.ratio || "16:9",
      title: c.title || "",
      description: "",
    };
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
          .map((v) => ({
            src: v.preview,                                        // WebGL card texture — must be a real file
            playSrc: "https://www.youtube.com/watch?v=" + v.id,     // what opens when clicked — the full video
            ratio: v.aspect || "16:9",
            title: v.title || "",
            description: v.description || "",
          }));
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
        vt.wrapS = THREE.ClampToEdgeWrapping;
        vt.wrapT = THREE.ClampToEdgeWrapping;
        if ("colorSpace" in vt) vt.colorSpace = THREE.SRGBColorSpace;
 
        // Crop the texture to the card's real shape instead of stretching it.
        // The dashboard's declared ratio (9:16 / 16:9) only decides how big
        // the card mesh is — the actual pixels always come from the file's
        // real width/height, which this reads directly off the video once
        // it's known, the same way `object-fit: cover` works in CSS.
        const fitTextureToCard = () => {
          if (!video.videoWidth || !video.videoHeight) return;
          const cardAspect = w / h;
          const videoAspect = video.videoWidth / video.videoHeight;
          if (videoAspect > cardAspect) {
            vt.repeat.set(cardAspect / videoAspect, 1);
            vt.offset.set((1 - vt.repeat.x) / 2, 0);
          } else {
            vt.repeat.set(1, videoAspect / cardAspect);
            vt.offset.set(0, (1 - vt.repeat.y) / 2);
          }
          vt.needsUpdate = true;
        };
 
        video.addEventListener("loadedmetadata", fitTextureToCard);
        video.addEventListener("loadeddata", () => {
          fitTextureToCard();
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
        openSheetRaw(c.title || "Hero clip", c.description || "", c.playSrc || c.src || "", c.ratio || "9:16");
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
 





