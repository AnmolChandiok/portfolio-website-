/* ============================================================
   🎬 ANMOL — VIDEO DASHBOARD
   ------------------------------------------------------------
   This is the ONLY file you edit to manage videos on the site.
   Save → refresh → done.

   Every "src" accepts any ONE of these:
     1. A file in your media folder .... "media/luxury.mp4"
     2. A direct video URL ............. "https://cdn.example.com/reel.mp4"
     3. A YouTube link ................. "https://youtu.be/XXXXXXXX"
     4. A Vimeo link ................... "https://vimeo.com/123456789"

   Leave src as "" and the player shows a clean
   "link coming soon" card instead of a broken video.
   ============================================================ */

window.SITE_VIDEOS = {
  /* ---- HERO STATS -----------------------------------------
     Numbers climb from zero the first time they scroll into view.
     Indian formatting (2,00,000) is applied automatically.
     live: true  → keeps ticking up slowly while the page is open.
     text: "..." → a fixed label instead of a number. */
  stats: [
    { value: 50, suffix: "+", label: "Projects edited" },
    { value: 200000, suffix: "+", label: "Videos delivered", live: true },
    { text: "\u221E", label: "Frame obsession" },
  ],

  /* ---- HERO CAROUSEL --------------------------------------
     These become the 3D cards spinning in the hero.
     ratio: "9:16" (portrait) or "16:9" (landscape).
     Clicking a card opens it in the full player.
     Use short, light loops here — 720p is plenty.
     Tip: YouTube/Vimeo links can't texture onto 3D cards,
     so hero clips must be real files or direct .mp4 URLs. */
  hero: [
    { src: "https://www.instagram.com/reel/DaSmFTcPdIA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",      ratio: "9:16", title: "Luxury Outdoor Living" },
    { src: "media/stain-glass.mp4", ratio: "16:9", title: "Stain Glass House" },
    { src: "media/hero-anim.mp4",   ratio: "16:9", title: "Hero Animation" },
    { src: "media/animation.mp4",   ratio: "9:16", title: "Motion Study" },
    { src: "media/knowledge.mp4",   ratio: "9:16", title: "Knowledge Centre" },
    { src: "media/sfs-logo.mov",    ratio: "16:9", title: "SFS Logo Animation" },
  ],

  /* ---------- WORK GRID ------------------------------------------
     The work grid is no longer configured here. It's driven by
     data/videos.json, which you edit through admin.html — paste a
     YouTube link, publish, done. See README.md. */
};
