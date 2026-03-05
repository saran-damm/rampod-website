# Contact Form Backend (for GitHub Pages)

GitHub Pages cannot run server-side code. Use this Cloudflare Worker as your contact API.

## Why this is secure
- Your destination email is stored in Worker env vars, not in website source.
- Browser network calls only show the Worker endpoint (`https://api.rampod.co/contact`), not your inbox address.
- Includes origin check + honeypot + simple time-based bot filter.

## 1) Prerequisites
- Cloudflare account
- A subdomain for API (recommended): `api.rampod.co`
- Resend account/API key

## 2) Create Worker

1. Create a Worker named `rampod-contact`.
2. Use `contact-worker.js` as Worker code.
3. Set Worker secrets/vars:
   - `RESEND_API_KEY` (secret)
   - `CONTACT_TO_EMAIL` (var) ex: `you@rampod.co`
   - `CONTACT_FROM_EMAIL` (var) ex: `Rampod Contact <noreply@rampod.co>`
   - `ALLOWED_ORIGIN` (var) ex: `https://rampod.co`

## 3) Route
Map a route to your Worker:
- `api.rampod.co/contact`

## 4) Frontend config
In `index.html`, contact form has:
- `data-endpoint="https://api.rampod.co/contact"`

If your endpoint differs, update this attribute.

## 5) Optional hardening
- Add Cloudflare Turnstile and verify token in Worker.
- Add rate limiting with Cloudflare WAF rules.
- Add email/domain blocklist checks.
