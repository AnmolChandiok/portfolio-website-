
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
Styles · CSS
/* =========================================================
   Anmol Chandiok — Video Editor Portfolio
   Accent: #fb5607 · Light + Dark · Phone / PC / Portrait / Landscape
   ========================================================= */
 
:root {
  --accent: #fb5607;
  --accent-2: #ff7a33;
  --accent-deep: #c43f00;
  --accent-soft: rgba(251, 86, 7, 0.14);
  --accent-glow: rgba(251, 86, 7, 0.45);
 
  --bg: #070707;
  --bg-elevated: #111111;
  --bg-alt: #0c0c0c;
  --surface: #141414;
  --surface-2: #1a1a1a;
  --text: #f5f5f4;
  --text-2: #a8a29e;
  --mute: #78716c;
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.14);
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
  --header-bg: rgba(7, 7, 7, 0.72);
  --vignette: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.55) 100%);
  --hero-fade: linear-gradient(180deg, transparent 60%, var(--bg) 100%);
  --radius: 1.25rem;
  --radius-sm: 0.85rem;
  --pad: clamp(16px, 4vw, 48px);
  --max: 1180px;
  --header-h: 68px;
  --font: "Inter", system-ui, -apple-system, sans-serif;
  --display: "Syne", "Inter", system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: dark;
}
 
html[data-theme="light"] {
  --bg: #fafaf9;
  --bg-elevated: #ffffff;
  --bg-alt: #f5f5f4;
  --surface: #ffffff;
  --surface-2: #f5f5f4;
  --text: #0c0a09;
  --text-2: #57534e;
  --mute: #78716c;
  --line: rgba(12, 10, 9, 0.08);
  --line-strong: rgba(12, 10, 9, 0.14);
  --shadow: 0 24px 60px rgba(12, 10, 9, 0.1);
  --header-bg: rgba(250, 250, 249, 0.78);
  --vignette: radial-gradient(ellipse at center, transparent 40%, rgba(250, 250, 249, 0.5) 100%);
  --hero-fade: linear-gradient(180deg, transparent 55%, var(--bg) 100%);
  --accent-soft: rgba(251, 86, 7, 0.1);
  color-scheme: light;
}
 
/* ---------- reset ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
}
 
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
 
body {
  margin: 0;
  min-height: 100vh;
  min-height: 100dvh;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
 
img,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
}
 
a {
  color: inherit;
  text-decoration: none;
}
 
button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}
 
button {
  cursor: pointer;
  border: none;
  background: none;
}
 
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
 
.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  background: var(--accent);
  color: #fff;
  padding: 0.6rem 1rem;
  z-index: 999;
  border-radius: 0 0 0.5rem 0;
}
 
.skip-link:focus {
  left: 0;
}
 
.container {
  width: min(100% - var(--pad) * 2, var(--max));
  margin-inline: auto;
}
 
.accent {
  color: var(--accent);
}
 
.accent-text {
  color: var(--accent);
  background: linear-gradient(120deg, var(--accent) 0%, #ff9a5c 55%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
 
.muted {
  color: var(--text-2);
}
 
.small {
  font-size: 0.85rem;
}
 
/* ---------- ambient bg ---------- */
.bg-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 40% at 70% 10%, rgba(251, 86, 7, 0.18), transparent 55%),
    radial-gradient(ellipse 40% 35% at 10% 80%, rgba(251, 86, 7, 0.08), transparent 50%);
  transition: opacity 0.4s ease;
}
 
html[data-theme="light"] .bg-glow {
  background:
    radial-gradient(ellipse 60% 40% at 70% 10%, rgba(251, 86, 7, 0.12), transparent 55%),
    radial-gradient(ellipse 40% 35% at 10% 80%, rgba(251, 86, 7, 0.06), transparent 50%);
}
 
.bg-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
 
/* ---------- header ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid var(--line);
}
 
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: var(--header-h);
}
 
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  z-index: 2;
}
 
.logo-mark {
  width: 2rem;
  height: 2rem;
  border-radius: 0.65rem;
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  box-shadow: 0 0 0 0 rgba(251, 86, 7, 0.4);
  animation: logo-pulse 3s ease infinite;
}
 
.logo-mark.sm {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.6rem;
  animation: none;
}
 
@keyframes logo-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251, 86, 7, 0.35); }
  50% { box-shadow: 0 0 0 8px rgba(251, 86, 7, 0); }
}
 
.nav-desktop {
  display: none;
  align-items: center;
  gap: 1.6rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-2);
}
 
.nav-desktop a {
  position: relative;
  transition: color 0.2s ease;
}
 
.nav-desktop a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s var(--ease);
}
 
.nav-desktop a:hover,
.nav-desktop a:focus-visible {
  color: var(--text);
}
 
.nav-desktop a:hover::after,
.nav-desktop a:focus-visible::after {
  transform: scaleX(1);
}
 
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
 
.theme-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  display: grid;
  place-items: center;
  color: var(--text);
  transition: border-color 0.2s ease, background 0.2s ease;
}
 
.theme-toggle:hover {
  border-color: var(--accent);
}
 
html[data-theme="dark"] .theme-icon-dark,
html[data-theme="light"] .theme-icon-light {
  display: none;
}
 
.header-cta {
  display: none;
}
 
.nav-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
 
.nav-toggle span {
  display: block;
  width: 16px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.25s var(--ease), opacity 0.2s ease;
}
 
.nav-toggle[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
 
.nav-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}
 
.nav-toggle[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
 
.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem var(--pad) 1.25rem;
  border-top: 1px solid var(--line);
  background: var(--bg-elevated);
}
 
.mobile-nav:not([hidden]) {
  display: flex;
}
 
.mobile-nav a:not(.btn) {
  padding: 0.9rem 0.25rem;
  border-bottom: 1px solid var(--line);
  font-weight: 500;
  color: var(--text-2);
}
 
.mobile-nav a:not(.btn):hover {
  color: var(--accent);
}
 
.mobile-nav .btn {
  margin-top: 0.85rem;
}
 
@media (min-width: 900px) {
  .nav-desktop {
    display: flex;
  }
  .header-cta {
    display: inline-flex;
  }
  .nav-toggle {
    display: none;
  }
  .mobile-nav {
    display: none !important;
  }
}
 
/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.7rem 1.25rem;
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  border: 1px solid transparent;
}
 
.btn:active {
  transform: scale(0.98);
}
 
.btn-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 10px 30px rgba(251, 86, 7, 0.35);
}
 
.btn-primary:hover {
  background: var(--accent-2);
  box-shadow: 0 12px 36px rgba(251, 86, 7, 0.45);
}
 
.btn-ghost {
  background: transparent;
  border-color: var(--line-strong);
  color: var(--text);
}
 
.btn-ghost:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}
 
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}
 
.btn-lg {
  padding: 0.95rem 1.5rem;
  font-size: 0.95rem;
}
 
.btn-block {
  width: 100%;
}
 
/* ---------- hero ---------- */
.hero {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - var(--header-h));
  min-height: calc(100dvh - var(--header-h));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 4vh, 3rem) 0 0;
  overflow: hidden;
}
 
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  touch-action: none;
}
 
.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: var(--vignette), var(--hero-fade);
}
 
.hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  padding-bottom: 1rem;
}
 
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-2);
  margin: 0 0 1.1rem;
  padding: 0.4rem 0.85rem 0.4rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  backdrop-filter: blur(8px);
}
 
.pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent-glow);
  animation: pulse 1.8s ease infinite;
}
 
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-glow); }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
 
.hero-title {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.6rem, 10vw, 5.75rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
  margin: 0;
}
 
.hero-title .line {
  display: block;
}
 
.hero-title .word {
  display: inline-block;
  margin-right: 0.22em;
  opacity: 0;
  transform: translateY(1.1em) rotateX(-40deg);
  transform-origin: bottom;
  animation: word-in 0.9s var(--ease) forwards;
}
 
.hero-title .line:nth-child(1) .word:nth-child(1) { animation-delay: 0.05s; }
.hero-title .line:nth-child(1) .word:nth-child(2) { animation-delay: 0.12s; }
.hero-title .line:nth-child(1) .word:nth-child(3) { animation-delay: 0.2s; }
.hero-title .line:nth-child(2) .word:nth-child(1) { animation-delay: 0.28s; }
.hero-title .line:nth-child(2) .word:nth-child(2) { animation-delay: 0.36s; }
.hero-title .line:nth-child(2) .word:nth-child(3) { animation-delay: 0.44s; }
 
@keyframes word-in {
  to {
    opacity: 1;
    transform: none;
  }
}
 
.hero-sub {
  margin: 1.25rem 0 0;
  max-width: 34rem;
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  color: var(--text-2);
  opacity: 0;
  animation: fade-up 0.8s var(--ease) 0.55s forwards;
}
 
.hero-sub strong {
  color: var(--text);
  font-weight: 600;
}
 
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
 
.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
  opacity: 0;
  animation: fade-up 0.8s var(--ease) 0.7s forwards;
}
 
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 2rem;
  max-width: 28rem;
  opacity: 0;
  animation: fade-up 0.8s var(--ease) 0.85s forwards;
}
 
.stat {
  padding: 0.85rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  backdrop-filter: blur(10px);
}
 
.stat-value {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  color: var(--accent);
}
 
.stat-label {
  font-size: 0.72rem;
  color: var(--mute);
  margin-top: 0.15rem;
}
 
/* 3D stage */
.hero-stage {
  position: relative;
  min-height: min(48vh, 380px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  opacity: 0;
  animation: fade-up 1s var(--ease) 0.35s forwards;
}
 
.stage-orbit {
  position: relative;
  width: min(100%, 340px);
  height: min(48vh, 340px);
  transform-style: preserve-3d;
  transition: transform 0.12s linear;
  cursor: grab;
  touch-action: none;
}
 
.stage-orbit:active {
  cursor: grabbing;
}
 
.hero-video-bank {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  opacity: 0;
  pointer-events: none;
}
 
.film-card {
  position: absolute;
  border-radius: 1.15rem;
  border: 1px solid var(--line-strong);
  background: #0a0a0a;
  box-shadow: var(--shadow), 0 0 0 1px rgba(251, 86, 7, 0.12);
  transform-style: preserve-3d;
  overflow: hidden;
}
 
.film-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background: #111;
  transform: translateZ(0);
}
 
.film-card-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, transparent 35%, transparent 55%, rgba(0, 0, 0, 0.65) 100%),
    linear-gradient(160deg, rgba(251, 86, 7, 0.2), transparent 45%);
}
 
.film-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(160deg, rgba(251, 86, 7, 0.22), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08), transparent 40%);
}
 
.card-a {
  width: 58%;
  aspect-ratio: 9 / 16;
  left: 5%;
  top: 8%;
  transform: rotateY(-18deg) rotateX(8deg) translateZ(40px);
  animation: float-a 6s ease-in-out infinite;
}
 
.card-b {
  width: 72%;
  aspect-ratio: 16 / 9;
  right: 0;
  top: 28%;
  transform: rotateY(16deg) rotateX(-6deg) translateZ(80px);
  animation: float-b 7s ease-in-out infinite;
  z-index: 2;
}
 
.card-c {
  width: 48%;
  aspect-ratio: 1;
  left: 18%;
  bottom: 4%;
  transform: rotateY(-10deg) rotateX(12deg) translateZ(20px);
  animation: float-c 5.5s ease-in-out infinite;
}
 
@keyframes float-a {
  0%, 100% { transform: rotateY(-18deg) rotateX(8deg) translateZ(40px) translateY(0); }
  50% { transform: rotateY(-14deg) rotateX(10deg) translateZ(50px) translateY(-10px); }
}
 
@keyframes float-b {
  0%, 100% { transform: rotateY(16deg) rotateX(-6deg) translateZ(80px) translateY(0); }
  50% { transform: rotateY(12deg) rotateX(-4deg) translateZ(90px) translateY(-14px); }
}
 
@keyframes float-c {
  0%, 100% { transform: rotateY(-10deg) rotateX(12deg) translateZ(20px) translateY(0); }
  50% { transform: rotateY(-6deg) rotateX(8deg) translateZ(30px) translateY(-8px); }
}
 
.timecode {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: #ffb089;
  font-weight: 700;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
}
 
.card-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.75);
}
 
.card-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 36px;
}
 
.card-bars i {
  flex: 1;
  display: block;
  border-radius: 2px;
  background: var(--accent);
  opacity: 0.75;
  animation: bar 1.2s ease-in-out infinite;
}
 
.card-bars i:nth-child(1) { height: 40%; animation-delay: 0s; }
.card-bars i:nth-child(2) { height: 70%; animation-delay: 0.1s; }
.card-bars i:nth-child(3) { height: 50%; animation-delay: 0.2s; }
.card-bars i:nth-child(4) { height: 90%; animation-delay: 0.3s; }
.card-bars i:nth-child(5) { height: 60%; animation-delay: 0.4s; }
 
@keyframes bar {
  0%, 100% { transform: scaleY(0.7); opacity: 0.55; }
  50% { transform: scaleY(1); opacity: 1; }
}
 
.card-glow {
  position: absolute;
  inset: auto 10% 12% 10%;
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
}
 
.play-orb {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 4.25rem;
  height: 4.25rem;
  margin: -2.125rem 0 0 -2.125rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 1.05rem;
  z-index: 5;
  box-shadow: 0 12px 40px rgba(251, 86, 7, 0.55), 0 0 0 12px rgba(251, 86, 7, 0.12);
  transform: translateZ(120px);
  animation: orb-pulse 2.4s ease infinite;
  border: none;
  cursor: pointer;
  pointer-events: auto;
}
 
.play-orb:hover {
  background: var(--accent-2);
}
 
.play-orb.is-unmuted {
  background: #16a34a;
  box-shadow: 0 12px 40px rgba(22, 163, 74, 0.45), 0 0 0 12px rgba(22, 163, 74, 0.12);
}
 
@keyframes orb-pulse {
  0%, 100% { box-shadow: 0 12px 40px rgba(251, 86, 7, 0.55), 0 0 0 10px rgba(251, 86, 7, 0.12); }
  50% { box-shadow: 0 16px 50px rgba(251, 86, 7, 0.7), 0 0 0 18px rgba(251, 86, 7, 0.08); }
}
 
.stage-hint {
  margin: 0.75rem 0 0;
  font-size: 0.72rem;
  color: var(--mute);
  letter-spacing: 0.04em;
}
 
.hero-marquee {
  position: relative;
  z-index: 2;
  margin-top: clamp(1.5rem, 4vh, 2.5rem);
  border-block: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
 
.marquee-track {
  display: flex;
  gap: 1.25rem;
  width: max-content;
  padding: 0.85rem 0;
  font-family: var(--display);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mute);
  animation: marquee 28s linear infinite;
}
 
.marquee-track span:nth-child(odd) {
  color: var(--text-2);
}
 
@keyframes marquee {
  to { transform: translateX(-50%); }
}
 
/* Landscape phones / short height */
@media (orientation: landscape) and (max-height: 500px) {
  .hero {
    min-height: auto;
    padding-top: 1rem;
  }
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1rem;
    align-items: center;
  }
  .hero-title {
    font-size: clamp(1.8rem, 6vw, 2.6rem);
  }
  .hero-sub {
    font-size: 0.9rem;
    margin-top: 0.6rem;
  }
  .hero-stats {
    margin-top: 0.85rem;
  }
  .stat {
    padding: 0.45rem 0.5rem;
  }
  .stat-value {
    font-size: 1rem;
  }
  .hero-stage {
    min-height: 200px;
  }
  .stage-orbit {
    height: 200px;
    width: 220px;
  }
  .stage-hint,
  .hero-marquee {
    display: none;
  }
  .hero-cta .btn-lg {
    padding: 0.65rem 1rem;
    font-size: 0.8rem;
  }
}
 
/* Tablet / desktop hero */
@media (min-width: 900px) {
  .hero-grid {
    grid-template-columns: 1.05fr 0.95fr;
    gap: 2rem;
  }
  .hero-stage {
    min-height: 460px;
  }
  .stage-orbit {
    width: 400px;
    height: 400px;
  }
}
 
@media (min-width: 1100px) {
  .hero-title {
    font-size: clamp(4rem, 6.5vw, 5.9rem);
  }
}
 
/* Portrait phone: stack stage under copy, keep stage visible but not huge */
@media (orientation: portrait) and (max-width: 700px) {
  .hero-stage {
    min-height: 300px;
    order: -1;
  }
  .hero-grid {
    gap: 0.5rem;
  }
  .stage-orbit {
    width: min(88vw, 300px);
    height: min(42vh, 300px);
  }
}
 
/* ---------- sections ---------- */
.section {
  position: relative;
  z-index: 1;
  padding: clamp(3.5rem, 8vw, 6.5rem) 0;
}
 
.section-alt {
  background: var(--bg-alt);
  border-block: 1px solid var(--line);
}
 
.section-head {
  max-width: 40rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
}
 
.section-eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
 
.section-title {
  margin: 0;
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(1.85rem, 4.5vw, 3rem);
  letter-spacing: -0.035em;
  line-height: 1.08;
}
 
.section-sub {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 1.05rem;
}
 
/* ---------- work ---------- */
.work-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
 
.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--text-2);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
 
.filter-btn:hover,
.filter-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
 
.work-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.15rem;
}
 
@media (min-width: 640px) {
  .work-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .work-card.featured {
    grid-column: span 2;
  }
}
 
@media (min-width: 1024px) {
  .work-grid {
    grid-template-columns: repeat(12, 1fr);
    gap: 1.25rem;
  }
  .work-card {
    grid-column: span 4;
  }
  .work-card.featured {
    grid-column: span 8;
  }
  .work-card:nth-child(3) {
    grid-column: span 4;
  }
  .work-card:nth-child(4) {
    grid-column: span 6;
  }
  .work-card:nth-child(5) {
    grid-column: span 3;
  }
  .work-card:nth-child(6) {
    grid-column: span 3;
  }
}
 
.work-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-up 0.7s var(--ease) forwards;
  animation-delay: calc(var(--i, 0) * 0.08s);
}
 
.work-card.is-hidden {
  display: none;
}
 
.work-thumb {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--surface);
}
 
.ratio-9-16 {
  aspect-ratio: 9 / 16;
  max-height: 420px;
}
 
.ratio-16-9 {
  aspect-ratio: 16 / 9;
}
 
.work-card.featured .ratio-16-9 {
  min-height: 240px;
}
 
.thumb-gradient {
  position: absolute;
  inset: 0;
  transition: transform 0.6s var(--ease);
}
 
.work-card:hover .thumb-gradient {
  transform: scale(1.06);
}
 
.g1 { background: linear-gradient(145deg, #1a0f0a, #fb5607 45%, #3d1a08); }
.g2 { background: linear-gradient(120deg, #0f172a, #fb5607 40%, #1c1917 90%); }
.g3 { background: linear-gradient(160deg, #292524, #ea580c, #0c0a09); }
.g4 { background: linear-gradient(135deg, #431407, #fb5607, #78716c); }
.g5 { background: linear-gradient(150deg, #1c1917, #c2410c 50%, #fbbf24); }
.g6 { background: linear-gradient(130deg, #0c0a09, #9a3412, #fb5607); }
 
.work-badge {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  z-index: 2;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
 
.work-play {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.25s ease;
  color: #fff;
  font-size: 1.25rem;
}
 
.work-play i {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  background: var(--accent);
  display: grid;
  place-items: center;
  margin-left: 0;
  padding-left: 3px;
  box-shadow: 0 10px 30px rgba(251, 86, 7, 0.45);
}
 
.work-card:hover .work-play,
.work-play:focus-visible {
  opacity: 1;
}
 
.work-meta {
  padding: 0.85rem 0.15rem 0;
}
 
.work-meta h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
 
.work-meta p {
  margin: 0.25rem 0 0;
  color: var(--text-2);
  font-size: 0.875rem;
}
 
/* Landscape: shorter vertical cards */
@media (orientation: landscape) and (max-height: 500px) {
  .ratio-9-16 {
    max-height: 220px;
  }
}
 
/* ---------- services ---------- */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
 
@media (min-width: 640px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
 
@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
 
.service-card {
  padding: 1.4rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  transition: transform 0.25s var(--ease), border-color 0.25s ease, box-shadow 0.25s ease;
}
 
.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(251, 86, 7, 0.45);
  box-shadow: 0 16px 40px rgba(251, 86, 7, 0.1);
}
 
.service-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
  font-size: 1.05rem;
}
 
.service-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}
 
.service-card p {
  margin: 0;
  color: var(--text-2);
  font-size: 0.92rem;
}
 
/* ---------- about ---------- */
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
 
@media (min-width: 860px) {
  .about-grid {
    grid-template-columns: 0.9fr 1.1fr;
    gap: 3.5rem;
  }
}
 
.about-frame {
  position: relative;
  max-width: 360px;
  margin-inline: auto;
  aspect-ratio: 4 / 5;
}
 
.about-photo {
  width: 100%;
  height: 100%;
  border-radius: 1.75rem;
  border: 1px solid var(--line-strong);
  background:
    radial-gradient(circle at 30% 20%, rgba(251, 86, 7, 0.45), transparent 45%),
    linear-gradient(160deg, #1c1917, #0c0a09);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow);
  overflow: hidden;
}
 
.about-initials {
  font-family: var(--display);
  font-size: clamp(4rem, 12vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #fff 10%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
 
.about-float {
  position: absolute;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  font-size: 0.78rem;
  font-weight: 700;
  box-shadow: var(--shadow);
  animation: float-label 4s ease-in-out infinite;
}
 
.about-float.f1 { top: 12%; right: -6%; color: var(--accent); }
.about-float.f2 { bottom: 28%; left: -8%; animation-delay: 0.6s; }
.about-float.f3 { bottom: 8%; right: 4%; animation-delay: 1.1s; }
 
@keyframes float-label {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
 
.about-copy p {
  color: var(--text-2);
}
 
.about-list {
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}
 
.about-list li {
  position: relative;
  padding-left: 1.4rem;
  color: var(--text);
  font-weight: 500;
  font-size: 0.95rem;
}
 
.about-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--accent);
}
 
/* ---------- process ---------- */
.process-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  counter-reset: none;
}
 
@media (min-width: 700px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
 
@media (min-width: 1024px) {
  .process-steps {
    grid-template-columns: repeat(4, 1fr);
  }
}
 
.process-steps li {
  padding: 1.35rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  position: relative;
  overflow: hidden;
}
 
.process-steps li::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent);
  opacity: 0.85;
}
 
.step-num {
  font-family: var(--display);
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--accent);
  letter-spacing: -0.03em;
}
 
.process-steps h3 {
  margin: 0.5rem 0 0.4rem;
  font-size: 1.1rem;
}
 
.process-steps p {
  margin: 0;
  color: var(--text-2);
  font-size: 0.9rem;
}
 
/* ---------- contact ---------- */
.contact-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
 
@media (min-width: 900px) {
  .contact-wrap {
    grid-template-columns: 1.4fr 0.8fr;
    gap: 1.75rem;
    align-items: start;
  }
}
 
.contact-card {
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: calc(var(--radius) + 0.25rem);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow);
}
 
.contact-form {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}
 
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
 
@media (min-width: 560px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
 
.field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 0.4rem;
}
 
.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--line-strong);
  background: var(--bg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
 
.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
 
.field textarea {
  resize: vertical;
  min-height: 120px;
}
 
.form-note {
  margin: 0;
  min-height: 1.25rem;
  font-size: 0.85rem;
  color: var(--accent);
}
 
.contact-aside {
  display: grid;
  gap: 1rem;
}
 
.aside-block {
  padding: 1.25rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
}
 
.aside-block h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}
 
.aside-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--accent);
}
 
.aside-link:hover {
  text-decoration: underline;
}
 
.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
 
.social {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  display: grid;
  place-items: center;
  color: var(--text-2);
  transition: all 0.2s ease;
}
 
.social:hover {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}
 
.accent-panel {
  background: linear-gradient(135deg, rgba(251, 86, 7, 0.95), #c2410c);
  border: none;
  color: #fff;
}
 
.accent-panel-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
  font-weight: 700;
}
 
.accent-panel-text {
  margin: 0.4rem 0 0;
  font-family: var(--display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
 
/* ---------- footer ---------- */
.site-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--line);
  padding: 1.5rem 0 2rem;
}
 
.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}
 
@media (min-width: 700px) {
  .footer-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
 
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
  font-size: 0.9rem;
}
 
.back-top {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-2);
}
 
.back-top:hover {
  color: var(--accent);
}
 
/* ---------- toast ---------- */
.toast-stack {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(22rem, calc(100vw - 2rem));
  pointer-events: none;
}
 
.toast {
  pointer-events: auto;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow);
  font-size: 0.875rem;
  animation: fade-up 0.25s var(--ease);
}
 
.toast strong {
  display: block;
  margin-bottom: 0.15rem;
  color: var(--accent);
}
 
/* ---------- modal ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(6px);
}
 
.modal-overlay[hidden] {
  display: none !important;
}
 
.modal {
  position: relative;
  width: min(100%, 520px);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 1.35rem;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}
 
.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--bg);
  display: grid;
  place-items: center;
  z-index: 2;
}
 
.modal-preview {
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  margin-bottom: 1rem;
  border: 1px solid var(--line);
}
 
.modal-preview-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1c1917, var(--accent));
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 2rem;
}
 
.modal h3 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}
 
.modal p {
  margin: 0;
}
 
/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .hero-title .word {
    opacity: 1;
    transform: none;
  }
  .hero-sub,
  .hero-cta,
  .hero-stats,
  .hero-stage,
  .work-card {
    opacity: 1;
    transform: none;
  }
}
 
/* Safe areas (notched phones) */
@supports (padding: max(0px)) {
  .site-header {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
 
/* =========================================================
   v2 additions — hero clearance, fallbacks, bottom sheet
   ========================================================= */
 
/* Hero: confine the 3D canvas to the stage side so it never
   sits behind the copy. Same arrangement, just clear of text. */
@media (min-width: 900px) {
  .hero-canvas {
    left: 42%;
    width: 58%;
  }
}
@media (orientation: landscape) and (max-height: 500px) {
  .hero-canvas {
    left: 46%;
    width: 54%;
  }
}
@media (orientation: portrait) and (max-width: 700px) {
  .hero-canvas {
    height: 48%;
  }
}
 
/* Hero cards without a source show a branded still, not black */
.film-card.no-src .film-video {
  opacity: 0;
}
.film-card.no-src::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(160deg, rgba(251, 86, 7, 0.35), transparent 55%),
    linear-gradient(200deg, #1c1917, #0c0c0c 70%);
}
 
/* Work thumbs open the player */
.work-thumb {
  cursor: pointer;
}
 
/* ---------- Bottom-sheet video player ---------- */
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.sheet-overlay.is-open {
  opacity: 1;
}
.sheet-overlay[hidden] {
  display: none !important;
}
 
.sheet {
  position: relative;
  width: 100%;
  max-width: 1100px;
  height: 91vh;
  height: 91dvh; /* top ~9% of the page stays visible */
  background: var(--bg-elevated);
  border: 1px solid var(--line-strong);
  border-bottom: none;
  border-radius: 1.6rem 1.6rem 0 0;
  box-shadow: 0 -30px 90px rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  padding: 0.75rem clamp(0.85rem, 3vw, 1.5rem) calc(0.9rem + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.45s var(--ease);
}
.sheet-overlay.is-open .sheet {
  transform: translateY(0);
}
.sheet.is-dragging {
  transition: none;
}
 
.sheet-handle {
  flex: none;
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: var(--line-strong);
  margin: 0.15rem auto 0.75rem;
}
 
@media (max-width: 760px) {
  .sheet-handle {
    width: 56px;
    height: 6px;
    cursor: grab;
  }
  .sheet-handle:active {
    cursor: grabbing;
    background: var(--accent);
  }
}
 
.sheet-close {
  position: absolute;
  top: 0.8rem;
  right: 0.9rem;
  z-index: 3;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--text);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.sheet-close:hover {
  border-color: var(--accent);
  transform: rotate(90deg);
}
 
.sheet-bezel {
  flex: 1;
  min-height: 0;
  border-radius: 1.15rem;
  border: 1px solid var(--line-strong);
  background: #000;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 0 0 1px rgba(251, 86, 7, 0.1);
  padding: clamp(6px, 1vw, 12px);
  overflow: hidden;
  display: grid;
  place-items: center;
}
 
.sheet-player {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 0.7rem;
}
.sheet-player video {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  width: auto;
  object-fit: contain;
  background: #000;
  border-radius: 0.7rem;
}
.sheet-player iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: #000;
  border-radius: 0.7rem;
}
 
.sheet-empty {
  display: grid;
  gap: 0.5rem;
  justify-items: center;
  text-align: center;
  color: var(--text-2);
  padding: 2rem;
  max-width: 34ch;
}
.sheet-empty i {
  font-size: 2rem;
  color: var(--accent);
}
.sheet-empty strong {
  color: var(--text);
  font-size: 1.05rem;
}
 
.sheet-meta {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 0.35rem 0.9rem;
  flex-wrap: wrap;
  padding: 0.8rem 0.25rem 0;
}
.sheet-meta h3 {
  margin: 0;
  font-family: var(--display);
  font-size: 1.1rem;
  letter-spacing: 0.01em;
}
.sheet-meta p {
  margin: 0;
  color: var(--text-2);
  font-size: 0.9rem;
}
 
.sheet-description {
  flex: 1 0 100%;
  margin: 0.35rem 0.25rem 0;
  padding-top: 0.6rem;
  border-top: 1px solid var(--line-strong);
  color: var(--text-2);
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 68ch;
}
 
.sheet-links {
  flex: 1 0 100%;
  display: flex;
  gap: 1.1rem;
  margin: 0.5rem 0.25rem 0;
}
.sheet-links a {
  font-size: 0.85rem;
  color: var(--text-2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.sheet-links a:hover {
  color: var(--accent);
  border-color: var(--accent);
}
 
/* =========================================================
   v3 — 3D reel carousel hero + masonry work grid
   ========================================================= */
 
/* The canvas IS the stage now: it takes the right half on desktop
   and the top band on phones, so it never sits behind the copy. */
.hero-canvas {
  cursor: grab;
}
.hero-canvas.is-dragging {
  cursor: grabbing;
}
 
/* Let pointer events reach the canvas everywhere except the copy */
.hero-grid {
  pointer-events: none;
}
.hero-copy,
.hero-copy a,
.hero-copy button {
  pointer-events: auto;
}
 
/* Stage layer = carousel controls only */
.hero-stage {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem;
  min-height: min(58vh, 440px);
  padding-bottom: 0.35rem;
  pointer-events: none;
  opacity: 0;
  animation: fade-up 1s var(--ease) 0.45s forwards;
}
 
.play-orb {
  position: relative;
  inset: auto;
  right: auto;
  bottom: auto;
  top: auto;
  left: auto;
  margin: 0;
  pointer-events: auto;
}
 
.stage-hint {
  margin: 0;
  pointer-events: auto;
  text-align: center;
}
 
@media (min-width: 900px) {
  .hero-stage {
    min-height: 480px;
  }
}
@media (orientation: portrait) and (max-width: 700px) {
  .hero-stage {
    min-height: 320px;
    justify-content: flex-end;
  }
}
@media (orientation: landscape) and (max-height: 500px) {
  .hero-stage {
    min-height: 220px;
  }
}
 
/* ---------- Work grid: true masonry ---------- */
.work-grid {
  display: block;
  columns: 2;
  column-gap: clamp(0.7rem, 1.6vw, 1.15rem);
}
@media (min-width: 900px) {
  .work-grid {
    columns: 3;
  }
}
@media (min-width: 1240px) {
  .work-grid {
    columns: 4;
  }
}
 
.work-card {
  display: inline-block;
  width: 100%;
  margin: 0 0 clamp(0.7rem, 1.6vw, 1.15rem);
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
}
 
/* Let the cards keep their true shape — that's the point of masonry */
.ratio-9-16 {
  max-height: none;
}
.work-card.featured .ratio-16-9 {
  min-height: 0;
}
 
.work-thumb {
  transition: transform 0.35s var(--ease), box-shadow 0.35s ease, border-color 0.25s ease;
}
.work-card:hover .work-thumb {
  transform: translateY(-5px);
  border-color: var(--line-strong);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
}
 
/* Hover preview video + optional poster still */
.work-poster,
.work-preview {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
.work-preview {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.work-card.is-previewing .work-preview {
  opacity: 1;
}
 
/* Featured card earns a mark instead of a column span */
.work-card.featured .work-thumb {
  border-color: rgba(251, 86, 7, 0.42);
  box-shadow: 0 0 0 1px rgba(251, 86, 7, 0.16);
}
.work-card.featured .work-thumb::after {
  content: "Featured";
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 3;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
 
@media (prefers-reduced-motion: reduce) {
  .work-preview {
    display: none;
  }
}
 
/* =========================================================
   v4 — no orb, custom cursor, button refinement, contact
   ========================================================= */
 
/* Orb removed; a soft glow sits where it used to, behind the ring */
.play-orb { display: none !important; }
 
.stage-glow {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 15rem;
  height: 15rem;
  margin: -7.5rem 0 0 -7.5rem;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, var(--accent-soft), transparent 68%);
  opacity: 0.7;
}
 
/* ---------- Custom round cursor ---------- */
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
  border-radius: 999px;
  opacity: 0;
  will-change: transform;
}
 
.cursor-dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  transition: opacity 0.2s ease, width 0.2s var(--ease), height 0.2s var(--ease);
}
 
.cursor-ring {
  width: 34px;
  height: 34px;
  border: 1.5px solid var(--accent);
  background: rgba(251, 86, 7, 0.06);
  backdrop-filter: invert(6%);
  -webkit-backdrop-filter: invert(6%);
  transition:
    width 0.28s var(--ease),
    height 0.28s var(--ease),
    background 0.28s ease,
    border-color 0.28s ease,
    opacity 0.2s ease;
}
 
html.cursor-active .cursor-dot,
html.cursor-active .cursor-ring {
  opacity: 1;
}
 
/* Grows and fills over anything clickable */
.cursor-ring.is-hover {
  width: 58px;
  height: 58px;
  background: rgba(251, 86, 7, 0.16);
  border-color: var(--accent-2);
}
.cursor-ring.is-grab {
  width: 46px;
  height: 46px;
  border-style: dashed;
}
.cursor-ring.is-down {
  width: 26px;
  height: 26px;
  background: rgba(251, 86, 7, 0.3);
}
.cursor-ring.is-text {
  width: 2px;
  height: 26px;
  border-radius: 2px;
  background: var(--accent);
}
 
/* Hide the native pointer only where we've replaced it */
html.has-custom-cursor,
html.has-custom-cursor a,
html.has-custom-cursor button,
html.has-custom-cursor .work-card,
html.has-custom-cursor .hero-canvas,
html.has-custom-cursor .hero-canvas.is-dragging {
  cursor: none;
}
html.has-custom-cursor input,
html.has-custom-cursor textarea,
html.has-custom-cursor select {
  cursor: text;
}
 
/* ---------- Buttons: fill sweeps up, arrow slides ---------- */
.btn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  letter-spacing: 0.01em;
}
 
.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  transform: translateY(101%);
  transition: transform 0.45s var(--ease);
}
 
.btn:hover::before {
  transform: translateY(0);
}
 
.btn i {
  transition: transform 0.35s var(--ease);
}
.btn:hover i {
  transform: translateX(3px);
}
.btn:hover .fa-arrow-down {
  transform: translateY(3px);
}
 
.btn-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 10px 30px rgba(251, 86, 7, 0.28);
}
.btn-primary::before {
  background: #ffffff;
}
.btn-primary:hover {
  color: var(--accent-deep);
  background: var(--accent);
  box-shadow: 0 16px 44px rgba(251, 86, 7, 0.4);
}
 
.btn-ghost {
  background: transparent;
  border-color: var(--line-strong);
  color: var(--text);
}
.btn-ghost::before {
  background: var(--accent);
}
.btn-ghost:hover {
  color: #fff;
  border-color: var(--accent);
  background: transparent;
}
 
/* ---------- Contact aside ---------- */
.aside-block .aside-link + .aside-link {
  margin-top: 0.55rem;
}
 
/* ---------- v5: live counter ---------- */
.stat-value {
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}
.stat-value.is-ticking {
  color: var(--accent-2);
}
/* ==================== VIDEO MODAL - DESKTOP OPTIMIZATION ==================== */
.video-player-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;           /* Good size for 9:16 on desktop */
  margin: 0 auto;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px -15px rgb(0 0 0 / 0.5);
}
 
.video-player-wrapper[data-ratio="9:16"] {
  aspect-ratio: 9 / 16;
  max-height: 78vh;
}
 
.video-player-wrapper[data-ratio="16:9"] {
  aspect-ratio: 16 / 9;
  max-width: 960px;
}
 
.video-player-wrapper iframe,
.video-player-wrapper video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
 
/* Mobile: Let vertical videos take more space */
@media (max-width: 768px) {
  .video-player-wrapper {
    max-width: 100%;
  }
  .video-player-wrapper[data-ratio="9:16"] {
    max-height: 85vh;
  }
}
 





