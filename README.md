# ocaisolutions.com

Static marketing site for **OCAI Solutions** — AI-powered websites, outreach, and automation for Orange County small businesses.

## Stack

Pure static HTML + Tailwind CSS via CDN. No build step. Works offline locally.

## Local preview

```bash
cd /Users/baboso/Documents/ocai-solutions
python3 -m http.server 8000
# → open http://localhost:8000
```

## Deployment

Hosted on **GitHub Pages** at the custom domain `ocaisolutions.com`.

### How it's wired

1. This repo is `bargus02/ocai-solutions` on GitHub.
2. GitHub Pages serves `main` branch from the repo root (`/`).
3. The `CNAME` file in the repo root tells GitHub Pages to expect requests at `ocaisolutions.com`.
4. DNS at Porkbun points `ocaisolutions.com` to GitHub Pages servers (4 A records + a CNAME for `www`).

### Updating the site

Edit any `.html` or `.css` file → commit → push to `main`. GitHub Pages republishes within ~1 minute.

```bash
git add -A
git commit -m "Update: ..."
git push
```

## File map

| File | Purpose |
|---|---|
| `index.html` | Landing — hero, three services, why-us, how-it-works, CTA, footer |
| `services.html` | Detail page for each of 3 services with anchor links (`#website-rescue`, `#outreach`, `#automation`) |
| `about.html` | Company background and operator philosophy |
| `contact.html` | Email contact + service-specific mailto links |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy (CCPA-aware) |
| `refund.html` | Refund Policy + money-back guarantee |
| `styles.css` | Small overrides on top of Tailwind CDN |
| `CNAME` | GitHub Pages custom domain config |
| `robots.txt` | Search engine crawl directive |
| `sitemap.xml` | Sitemap pointing to all 7 pages |

## Configuration touchpoints

Things that may need updating later:

- **`[FULL LEGAL NAME]`** in `terms.html`, `privacy.html`, `refund.html` — replace with the operator's full legal name when the business is set up.
- **Email address** — `ocaisolution@gmail.com` is referenced throughout. Email forwarding from this address to `bargus02@gmail.com` should be configured in the Porkbun email-forwarding panel before launch.
- **Stripe payment link** — once Stripe is approved, add the payment URL to the AI Website Rescue CTAs (currently they go to `contact.html?service=website-rescue`).
- **Phone number** — none listed by design. If you add one, update `contact.html` and the legal pages.
