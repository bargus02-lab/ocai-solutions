# ocaisolutions.com

Static marketing site for **OCAI Solutions** — three productized AI automations for Orange County small business, plus two upsells.

## Marketing trio

| # | Service | Setup | Retainer | Role |
|---|---|---|---|---|
| ★ | Instant Lead Response | $750 | $99/mo | Capture leads in 30 sec |
| ★ | Instant Quote Widget | $600 | $79/mo | Qualify visitors with instant pricing |
| ★ | Review Engine | $600 | $79/mo | Auto-request reviews after every job |

Bundle all three → 15% off combined setup. Retainers stay separate.

## Add-ons (not headlined, available to anyone)

| Service | Setup | Retainer |
|---|---|---|
| Proposal Builder | $1,500 | $149/mo |
| Receipt Capture | $900 | $99/mo |

## Retired products (no longer sold)

- ~~AI Website Rescue~~ (replaced by automation lineup; audit scripts kept as private internal tool)
- ~~Voicemail Triage~~
- ~~Inbox Co-Pilot~~

## Stack

Pure static HTML + Tailwind via CDN. No build step.

## Local preview

```bash
cd /Users/baboso/Documents/ocai-solutions
python3 -m http.server 8000
# → open http://localhost:8000
```

## Deployment

Hosted on **GitHub Pages** at custom domain `ocaisolutions.com`.

Edit any `.html` or `.css` file → commit → push to `main`. Pages republishes within ~1 minute.

## File map

| File | Purpose |
|---|---|
| `index.html` | Landing — hero, 3-product trio grid, trust, how setup works, FAQ, final CTA |
| `services.html` | Three full product detail pages + 2 upsell cards + bundle CTA |
| `about.html` | Company background |
| `contact.html` | Form (Formsubmit → ocaisolution@gmail.com) + dropdown organized: trio first, upsells after |
| `thanks.html` | Post-form confirmation page |
| `terms.html`, `privacy.html`, `refund.html` | Legal pages (setup-fee + retainer model) |
| `chatbot.js` | Guided FAQ widget covering trio + upsells |
| `styles.css` | Editorial design system + trio-product-card styles |
| `CNAME`, `robots.txt`, `sitemap.xml`, `favicon.svg` | Supporting |

## Configuration touchpoints

- **Stripe Payment Links** — create per service as needed; the public site funnels all 5 services through the contact form (no public buy-now buttons). Operator sends payment links manually after the 20-min discovery call.
- **Email** — `ocaisolution@gmail.com` referenced throughout.
- **Phone** — none listed by design.
