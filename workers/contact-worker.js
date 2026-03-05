/**
 * Cloudflare Worker contact endpoint for static sites.
 * Keeps destination email in server-side env vars (never exposed in frontend).
 *
 * Required env vars:
 * - RESEND_API_KEY
 * - CONTACT_TO_EMAIL
 * - CONTACT_FROM_EMAIL
 * - ALLOWED_ORIGIN   (e.g. https://rampod.co)
 */

const MIN_MESSAGE_LENGTH = 12;
const MAX_MESSAGE_LENGTH = 4000;
const MIN_ELAPSED_MS = 1200;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "";

    if (request.method === "OPTIONS") {
      if (!allowedOrigin || origin !== allowedOrigin) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    if (!allowedOrigin || origin !== allowedOrigin) {
      return json({ ok: false, error: "Origin not allowed" }, 403);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, corsHeaders(allowedOrigin));
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const companyWebsite = String(body.companyWebsite || "").trim(); // honeypot
    const elapsedMs = Number(body.elapsedMs || 0);
    const page = String(body.page || "").slice(0, 300);

    if (companyWebsite) {
      // Honeypot hit: act like success to avoid tuning bots.
      return json({ ok: true }, 200, corsHeaders(allowedOrigin));
    }

    if (elapsedMs > 0 && elapsedMs < MIN_ELAPSED_MS) {
      return json({ ok: false, error: "Too fast" }, 429, corsHeaders(allowedOrigin));
    }

    if (!name || !email || !message) {
      return json({ ok: false, error: "Missing fields" }, 400, corsHeaders(allowedOrigin));
    }

    if (!isValidEmail(email)) {
      return json({ ok: false, error: "Invalid email" }, 400, corsHeaders(allowedOrigin));
    }

    if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return json({ ok: false, error: "Message length invalid" }, 400, corsHeaders(allowedOrigin));
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
      return json({ ok: false, error: "Server not configured" }, 500, corsHeaders(allowedOrigin));
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const ua = request.headers.get("User-Agent") || "unknown";

    const text = [
      "New contact submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Page: ${page || "unknown"}`,
      `IP: ${ip}`,
      `User-Agent: ${ua}`,
      "",
      "Message:",
      message
    ].join("\n");

    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Rampod contact: ${name}`,
        text
      })
    });

    if (!sendRes.ok) {
      const errBody = await sendRes.text();
      return json(
        { ok: false, error: "Email provider error", provider: errBody.slice(0, 300) },
        502,
        corsHeaders(allowedOrigin)
      );
    }

    return json({ ok: true }, 200, corsHeaders(allowedOrigin));
  }
};
