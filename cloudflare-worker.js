/* ==========================================================================
   contact-to-github-worker.js
   ------------------------------------------------------------------------
   This is NOT part of your GitHub Pages site — it doesn't go in the repo.
   It deploys separately, on Cloudflare's free tier, and does one job: take
   a contact-form submission from your public site and write it into
   data/messages.json in your repo, using a GitHub token that stays private
   on Cloudflare's servers and is never sent to anyone's browser.

   SETUP (about 5 minutes, free, no credit card required):

   1. Go to https://workers.cloudflare.com → sign up free → "Create Worker"
   2. Delete the sample code it shows you, paste this whole file in instead
   3. Click Deploy
   4. Go to Settings → Variables → add these (as "Secret" where noted):
        GH_OWNER       = AnmolChandiok
        GH_REPO        = portfolio-website-
        GH_BRANCH      = main
        GH_PATH        = data/messages.json
        GITHUB_TOKEN   = (Secret) a fine-grained PAT, Contents: Read and
                          write, scoped to just this repo — same kind of
                          token you already made for admin.html
   5. Copy the Worker's URL — looks like:
        https://contact-to-github-worker.YOURNAME.workers.dev
     Paste that into js/config.js as CONTACT_FORM_ENDPOINT.

   That's it — messages now land in your repo, and admin.html's Messages
   panel reads them straight from there, same as it reads your videos.
   ========================================================================== */

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid submission" }, 400);
    }

    const name = String(body.name || "").trim().slice(0, 200);
    const email = String(body.email || "").trim().slice(0, 200);
    const message = String(body.message || "").trim().slice(0, 5000);
    const project = String(body.project || "").trim().slice(0, 100);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Missing or invalid fields" }, 400);
    }

    const OWNER = env.GH_OWNER;
    const REPO = env.GH_REPO;
    const BRANCH = env.GH_BRANCH || "main";
    const PATH = env.GH_PATH || "data/messages.json";
    const TOKEN = env.GITHUB_TOKEN;

    if (!OWNER || !REPO || !TOKEN) {
      return json({ error: "Worker isn't configured yet — missing repo settings" }, 500);
    }

    const apiBase = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "contact-form-worker",
    };

    // Read the current inbox (or start a fresh one if it doesn't exist yet).
    let sha = null;
    let messages = [];
    const getRes = await fetch(`${apiBase}?ref=${BRANCH}`, { headers });
    if (getRes.status === 200) {
      const data = await getRes.json();
      sha = data.sha;
      try {
        const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
        messages = JSON.parse(decoded).messages || [];
      } catch (e) {
        messages = [];
      }
    } else if (getRes.status !== 404) {
      return json({ error: "Could not reach the repo" }, 502);
    }

    messages.unshift({
      id: crypto.randomUUID(),
      name,
      email,
      project,
      message,
      date: new Date().toISOString(),
      read: false,
    });

    messages = messages.slice(0, 300); // keep the file from growing forever

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ messages }, null, 2))));

    const putBody = {
      message: `New enquiry from ${name}`,
      content: encoded,
      branch: BRANCH,
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      return json({ error: "Could not save the message" }, 502);
    }

    return json({ ok: true });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
