# EdFund.com: The Education Funding Hub

A modern, responsive static website for finding **scholarships, grants, student loans and college savings**. It's built to earn money from AdSense, affiliate/lead generation, sponsorships, YouTube and donations, and it runs free on **GitHub Pages**.

> **Domain inquiries:** https://web.works/contact

## What's inside

| Page | Purpose |
|---|---|
| `index.html` | Conversion hub with a 3-step Funding Finder quiz, stats, audience paths, featured scholarships, giveaway, videos, FAQ |
| `get-funded.html` | **Main lead-generation page**: a 5-step Funding Match wizard for students, parents, graduates, international students, schools and sponsors |
| `scholarships.html` | Scholarship and grant search you can filter, with a saved list (43 real programs; add more in `assets/js/data.js`) |
| `student-loans.html` | Official 2026–27 federal rates, federal vs private comparison, 4-step rate-check lead form |
| `calculators.html` | Loan payment, 529 savings, funding gap, payoff accelerator, affordability |
| `giveaway.html` | $1,000 monthly no-essay drawing, countdown, referral bonus entries, creative contests, official rules |
| `donate.html` | One-time or monthly donations, impact per amount, where the money goes, and a pledge form as a fallback |
| `sponsor.html` | Named scholarship packages, advertising formats, media-kit request |
| `careers.html` | Open roles, campus ambassadors, application form |
| `guides/*` | 5 SEO guides (FAFSA, scholarships, loans, 529, study abroad) with Article schema |
| `videos.html` | YouTube library you can filter; videos only load when clicked |
| `about`, `faq`, `contact`, `privacy`, `terms`, `disclosure`, `404` | Trust and legal pages |

## How to turn on revenue (edit `assets/js/config.js`)

1. **AdSense.** Set `adsenseClient: "ca-pub-…"`, and optionally the slot IDs. Uncomment the line in `ads.txt`. Until then, labelled ad placeholders appear on the site.
2. **Donations.** Paste Stripe Payment Links, a PayPal donate link, Buy Me a Coffee or GitHub Sponsors URLs into `donate`. If these are empty, donors get a pledge form that emails you.
3. **Affiliates.** Add student loan, refinance or 529 partner links under `affiliates`.
4. **Analytics.** Set `ga4: "G-XXXX"`.
5. **YouTube and social.** Update the `social` URLs.

## Forms and the private inbox

Every form sends to one inbox through **FormSubmit** (free, no backend). The address is stored encoded in `config.js` and only decoded in the browser when someone submits. It never appears in the HTML.

**The first form submission sends an activation email to the inbox. Click "Activate" once**, and every form after that is delivered.

## Editing pages

Page bodies live in `/src`. Shared header, footer and SEO tags come from `tools/build.py`:

```bash
python3 tools/build.py   # rebuilds all .html files in the repo root + sitemap.xml
```

## Hosting (GitHub Pages, free)

Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
Custom domain: add a `CNAME` file containing `edfund.com`, then point DNS at GitHub Pages (A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and `www` CNAME → `webworksa1.github.io`).

## Docs
- `docs/BUILD-PROMPT.md`: the phase-by-phase build prompt and business model
- `docs/RESEARCH.md`: competitive research on 27 education-funding websites
