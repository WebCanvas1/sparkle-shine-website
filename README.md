# Sparkle Cleaning Services

Premium marketing site for Sparkle Cleaning Services — a fully static React SPA
built with Vite, TanStack Router, Tailwind CSS v4 and shadcn/ui, deployed to
**Cloudflare Pages** straight from GitHub.

## Stack

| Concern      | Choice                                        |
| ------------ | --------------------------------------------- |
| Build        | Vite (SPA, output `dist/`)                    |
| Routing      | TanStack Router (file-based, client-side)     |
| Styling      | Tailwind CSS v4 + design tokens in `src/styles.css` |
| Content      | Static, typed constants in `src/lib/content.ts` |
| Contact form | Cloudflare Pages Function → Resend            |
| Spam         | Cloudflare Turnstile (optional)               |

There is no database and no server rendering. Every page is client-rendered
from the static bundle, so the whole site is served from Cloudflare's edge.

## Local development

```bash
npm install
cp .env.example .env      # set VITE_SITE_URL at minimum
npm run dev               # http://localhost:8080
```

To exercise the contact form locally you need the Pages runtime, not the Vite
dev server:

```bash
cp .env.example .dev.vars # fill in RESEND_API_KEY, CONTACT_* etc.
npm run cf:dev            # builds, then serves dist/ + functions/ via Wrangler
```

## Scripts

| Script              | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Vite dev server                             |
| `npm run build`     | Production build into `dist/`               |
| `npm run preview`   | Preview the built bundle                    |
| `npm run lint`      | ESLint + Prettier check                     |
| `npm run format`    | Prettier write                              |
| `npm run cf:dev`    | Build + local Cloudflare Pages runtime      |
| `npm run cf:deploy` | Build + `wrangler pages deploy dist`        |

## Deploying to Cloudflare Pages from GitHub

1. Push this repository to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**
   and pick the repository.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20` or newer (set `NODE_VERSION=20` if needed)
4. Add the environment variables below, then deploy. Every push to the
   production branch redeploys automatically; other branches get previews.

### Environment variables

Build-time (plain text — these are baked into the public bundle):

| Name                      | Example                        | Notes                                   |
| ------------------------- | ------------------------------ | --------------------------------------- |
| `VITE_SITE_URL`           | `https://sparklecleaning.com.au` | Drives canonical + Open Graph URLs. No trailing slash. |
| `VITE_TURNSTILE_SITE_KEY` | `0x4AAA...`                    | Optional. Omit to hide the spam widget. |

Runtime secrets (mark as **encrypted** in Cloudflare — never committed):

| Name                      | Notes                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `RESEND_API_KEY`          | Required for the contact form to send mail.                   |
| `CONTACT_RECIPIENT_EMAIL` | Inbox that receives enquiries.                                |
| `CONTACT_FROM_EMAIL`      | Sender address on a domain verified in Resend.                |
| `TURNSTILE_SECRET_KEY`    | Optional. When set, the API rejects unverified submissions.   |

If the Resend variables are missing the form fails gracefully: visitors get a
"please call us instead" message and the phone/email CTAs still work.

## Contact API

`POST /api/contact` (`functions/api/contact.ts`) validates and sanitises the
payload, caps the body at 16 KB, verifies Turnstile when configured, and relays
the enquiry through Resend. It returns `{ ok: true }` or `{ error }` with an
appropriate status. Secrets stay on the edge runtime.

## SEO

- Per-route `<title>`, description and Open Graph tags via TanStack Router `head()`.
- Canonical + `og:url` derived from `VITE_SITE_URL` (`src/lib/seo.ts`).
- `LocalBusiness` JSON-LD in `src/routes/__root.tsx`.
- `public/robots.txt`, `public/sitemap.xml` and `public/images/og-image.jpg`.

After picking a domain, replace `REPLACE-WITH-DOMAIN` in `public/sitemap.xml`
and `public/robots.txt`.

## Editing content

All copy, services, gallery items, testimonials and FAQs live in
`src/lib/content.ts` as typed constants. Change them, commit, and Cloudflare
rebuilds the site.
