# ocaisolutions.com

Static marketing site for **OCAI Solutions** — six productized AI automation services for Orange County small business.

## Services lineup

| # | Service | Setup | Retainer |
|---|---|---|---|
| ★ Flagship | Instant Lead Response | $750 | $99/mo |
| 2 | Voicemail Triage | $1,200 | $149/mo |
| 3 | Proposal Builder | $1,500 | $149/mo |
| 4 | Review Engine | $600 | $79/mo |
| 5 | Inbox Co-Pilot | $1,000 | $199/mo |
| 6 | Receipt Capture | $900 | $99/mo |

Bundle 2+ services → 15% off combined setup. Retainers stay separate.

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
| `index.html` | Landing — hero, 6 services grid, why-us, how setup works, FAQ, final CTA |
| `services.html` | Detail page per service with anchor links (`#lead-response`, `#voicemail`, etc.) |
| `about.html` | Company background |
| `contact.html` | Form (Formsubmit → ocaisolution@gmail.com) + dropdown for all 6 services |
| `thanks.html` | Post-form confirmation page (generic — no longer post-Stripe-payment) |
| `terms.html`, `privacy.html`, `refund.html` | Legal pages |
| `chatbot.js` | Guided FAQ widget (covers new 6-product lineup) |
| `styles.css` | Editorial design system (amber palette) |
| `CNAME`, `robots.txt`, `sitemap.xml`, `favicon.svg` | Supporting |

## Configuration touchpoints

- **Stripe Payment Links** — Each service has its own setup + retainer products. Currently NOT wired into public CTAs (all setups go through contact form first to gather intake info). Operator sends payment links manually after the 20-min discovery call.
- **Email** — `ocaisolution@gmail.com` referenced throughout.
- **Phone** — none listed by design.
- **Old AI Website Rescue product** — retired. The internal `audit_engine.py` codebase at `/Users/baboso/Documents/ai-website-rescue/` remains as a private operator tool for prospect research, not sold as a product.
