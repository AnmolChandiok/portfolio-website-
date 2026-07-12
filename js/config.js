/* ============================================================
   🎬 ANMOL — VIDEO DASHBOARD
   ------------------------------------------------------------
   This is the ONLY file you edit to manage videos on the site.
   Save → refresh → done. No other file needs touching.

   Every "src" accepts any ONE of these:
     1. A file in your media folder .... "media/luxury.mp4"
     2. A direct video URL ............. "https://cdn.example.com/reel.mp4"
     3. A YouTube link ................. "https://youtu.be/XXXXXXXX"
        (watch, shorts, and youtu.be links all work)
     4. A Vimeo link ................... "https://vimeo.com/123456789"

   Leave src as "" and the player shows a clean
   "link coming soon" card instead of a broken video.
   ============================================================ */

window.SITE_VIDEOS = {
  /* ---- HERO ----------------------------------------------
     Up to 5 clips. The first 3 also feed the draggable
     3D cards; all of them feed the floating background
     planes. Keep these as small, muted-friendly loops. */
  hero: [
    "media/luxury.mp4",      // card A · 9:16
    "media/stain-glass.mp4", // card B · 16:9
    "media/hero-anim.mp4",   // card C
    "media/animation.mp4",   // background plane
    "media/knowledge.mp4",   // background plane
  ],

  /* ---- WORK GRID -----------------------------------------
     Each key matches a card in index.html (data-video="...").
     Change title/meta here and the player picks them up. */
  work: {
    "luxury": {
      title: "Luxury Outdoor Living",
      meta: "Reel · Color · Pace edit",
      src: "media/luxury.mp4",
    },
    "stain-glass": {
      title: "Stain Glass House",
      meta: "Brand film · Cinematic grade",
      src: "media/stain-glass.mp4",
    },
    "nav-bharat": {
      title: "Nav Bharat Series",
      meta: "Social cutdowns · Hook-first",
      src: "", // e.g. "https://youtu.be/XXXXXXXX"
    },
    "sfs-logo": {
      title: "SFS Logo Animation",
      meta: "After Effects · Identity",
      src: "media/sfs-logo.mov",
    },
    "look-book": {
      title: "Look Book Reels",
      meta: "Fashion pace · Music-led",
      src: "",
    },
    "drywall": {
      title: "Drywall Solutions",
      meta: "Corporate film · Clean cuts",
      src: "",
    },
  },
};
