# EdFund.com — Phase-Wise Build Prompt

> Master prompt used to build EdFund.com. Each phase can be pasted into an AI builder on its own, or run in order. Everything must stay a **static site** so it runs free on **GitHub Pages**.

---

## The Winning Concept

**EdFund.com = "The Education Funding Hub."** One destination that answers the single most expensive question in education: *"How do I pay for it?"*

It combines, under one brand:

1. **Scholarship & grant finder** — searchable database (US + Canada + international), matching quiz, deadline tracker.
2. **Student loan center** — federal rates (official), private-loan rate-check lead form, refinance.
3. **Calculators** — loan payment, 529 savings goal, funding-gap, payoff accelerator, affordability.
4. **EdFund's own monthly no-essay scholarship** — the #1 list-building engine (Niche, Appily, College Raptor, Unigo all use it).
5. **Sponsor-a-scholarship / advertise** — companies pay to fund named scholarships and reach students.
6. **Donations** — support free tools, prizes, marketing, and hiring.
7. **Video + guides hub** — SEO and YouTube watch-time.

### Why this beats the alternatives (numbers, not vibes)

| Revenue stream | Mechanism | Typical industry value* |
|---|---|---|
| AdSense on finance/education content | Student-loan & refinance keywords sit in the highest CPC tier | Education/finance RPMs are among the top AdSense verticals; loan keywords commonly $10–$50+ CPC |
| Student-loan lead generation | Rate-check form → lender/marketplace affiliate (per lead or per funded loan) | Per-lead and per-funded-loan payouts are the core model of Credible, NerdWallet, Edvisors, Juno |
| College enrollment leads | Scholarship-contest entrants who opt in to hear from schools | Core model of Niche, Unigo, College Raptor, Appily |
| Sponsored scholarships | Brands fund a named award + pay a platform/marketing fee | Bold.org, Scholarship America model |
| Donations | One-time + monthly, impact-based | DonorsChoose, Khan Academy, UNCF model |
| YouTube | Embedded videos → channel growth → YPP revenue | Watch-time compounding |

*Ranges are directional industry benchmarks, not guarantees. Verify with live affiliate networks before projecting revenue.

**Domain advantage:** "EdFund" is 6 letters, a literal description (Education + Fund), a .com, and brandable for both a for-profit hub and a foundation.

---

## Global Rules (apply to every phase)

- Static HTML + CSS + vanilla JS only. No server, no build step required to deploy. Must run free on **GitHub Pages**.
- At the very top of **every page**: a banner reading **"Contact, if you are interested in this website/domain name"** linking to `https://web.works/contact`.
- **One email only, never visible:** every form and contact action routes to the site owner's single inbox. The address must be **encoded in JS** (never plain text in HTML, never in a `mailto:` in markup) and decoded only at submit time. Forms post via a free form relay (FormSubmit AJAX).
- Mobile-first, responsive, accessible (WCAG AA contrast, keyboard nav, labels, `prefers-reduced-motion`), light + dark mode.
- SEO: unique `<title>`/meta description per page, Open Graph, JSON-LD (Organization, WebSite+SearchAction, FAQPage, Article, BreadcrumbList), `sitemap.xml`, `robots.txt`, canonical URLs.
- Monetization slots in every template: AdSense (config-driven, loads only when a publisher ID is set), affiliate CTAs, YouTube embeds (lite, click-to-load), donation CTA, lead CTA.
- Compliance: advertiser disclosure, privacy, terms, official contest rules, cookie consent, "not financial advice" note.
- Everything configurable from one file: `assets/js/config.js`.

---

## Phase 1 — Foundation & Design System

**Prompt:**
"Create the project skeleton for EdFund.com as a static site: `index.html`, `/assets/css/style.css`, `/assets/js/{config,main,data}.js`, `/guides/`, `/docs/`, `.nojekyll`, `404.html`, `robots.txt`, `sitemap.xml`, `ads.txt`, `site.webmanifest`, SVG favicon/logo. Design tokens: navy `#0B1B3F`, primary blue `#2451E6`, emerald `#12A37F`, gold `#F5B400`, Plus Jakarta Sans + Inter. Build a shared header (logo, mega-nav: Scholarships, Loans, Calculators, Giveaway, Guides, Videos, Donate; CTA 'Get Matched Free'), the domain-interest banner on top, a 4-column footer with newsletter, trust badges and legal links, dark-mode toggle, mobile drawer nav, sticky mobile CTA bar, cookie banner, back-to-top."

**Acceptance:** Lighthouse ≥ 90 on mobile; banner on every page; no email string in any file.

## Phase 2 — Home Page (conversion hub)

**Prompt:**
"Build the home page: hero with the value proposition 'Find the money for your education — scholarships, grants, loans & savings in one place', an inline 3-question Funding Finder quiz (who are you / level / country) that routes to a personalized result and lead form; animated stat counters (official data only); 'Pick your path' audience cards (Student, Parent, Graduate/Refinance, International, School/Sponsor); featured scholarships pulled from the data file; calculators teaser; monthly giveaway card with live countdown; video carousel (lite YouTube); guides grid; donation strip; FAQ accordion with FAQPage schema; newsletter; AdSense slots between sections."

## Phase 3 — Scholarship Database

**Prompt:**
"Build `scholarships.html`: a client-side searchable, filterable database from `data.js` (name, provider, amount, level, country, category, typical deadline month, no-essay flag, official URL). Filters: keyword, country, level, category, no-essay only, min amount; sort by amount/deadline/A–Z; 'Save' to a personal list (localStorage with try/catch); deadline badges; each card links to the official site (`rel=nofollow noopener`). Gate the 'Email me new matches' feature behind a short lead form. Insert an in-feed ad every 6 cards. Category landing blocks for SEO."

## Phase 4 — Student Loan Center + Dedicated Lead Generation

**Prompt:**
"Build `student-loans.html` with the official 2026–27 federal rates table (sourced, dated), federal vs private comparison, and a 4-step rate-check form (loan type → school & amount → credit/cosigner → contact + consent). Show 'Checking rates here does not affect your credit score' and an advertiser disclosure.
Then build `get-funded.html` — the flagship lead page: a 5-step 'Funding Match' wizard with progress bar, conditional questions per audience (student/parent/graduate/international/school), TCPA-style consent checkbox, hidden fields (source page, UTM, referrer), instant thank-you screen with next steps and a share-to-earn-entries link. Add exit-intent modal and sticky CTA on all pages pointing here."

## Phase 5 — Calculators

**Prompt:**
"Build `calculators.html` with tabbed, instant-updating calculators: (1) Loan payment & total interest, (2) College savings / 529 goal with monthly contribution needed, (3) Funding-gap (cost of attendance – aid – savings), (4) Payoff accelerator (extra monthly payment → months & interest saved), (5) Borrowing affordability (debt ≤ expected first-year salary rule). Each result shows a CTA to the matching lead form and 'Email me this result'."

## Phase 6 — Giveaway / Contests

**Prompt:**
"Build `giveaway.html`: EdFund's monthly $1,000 No-Essay Scholarship. Live countdown to month end, 30-second entry form (name, email, grad year, country, level, optional consent for partner offers), unique referral link with +5 bonus entries per friend, bonus-entry checklist (follow YouTube, newsletter, complete profile), official rules section (no purchase necessary, eligibility, odds, void where prohibited, sponsor, winner selection and notification), winners wall (empty until real winners), plus a 'Creative Contests' block for essay/video contests with prizes."

## Phase 7 — Donations, Sponsors, Careers

**Prompt:**
"Build `donate.html`: preset amounts ($10/$25/$50/$100/$250/custom), one-time vs monthly toggle (default monthly), impact line per amount, allocation bars (Scholarship prizes, Free tools & operations, Promotion & marketing, Hiring talent, Contests), payment buttons from config (Stripe Payment Link / PayPal / Buy Me a Coffee / GitHub Sponsors) with a pledge-form fallback, donor wall (opt-in), FAQ.
Build `sponsor.html`: create-a-named-scholarship packages, advertising & partnership tiers, media-kit request form.
Build `careers.html`: open roles (content writers, video creators, scholarship researchers, growth marketers, campus ambassadors), application form with portfolio link."

## Phase 8 — Content, Video & SEO Engine

**Prompt:**
"Build `guides.html` hub + long-form guides (FAFSA, how to win scholarships, federal vs private loans, 529 plans, study abroad funding) with TOC, author box, updated date, Article + FAQ schema, in-content ads, related-tools CTAs. Build `videos.html` with categorized lite-YouTube embeds and a 'Subscribe' CTA. Generate sitemap and internal links."

## Phase 9 — Trust, Legal, Contact

**Prompt:**
"Build `about.html`, `contact.html` (multi-purpose form: general, partnership, advertising, press, domain inquiry — all routed to the single hidden inbox), `privacy.html`, `terms.html`, `disclosure.html`. Add trust elements: data-source citations, editorial standards, 'Is EdFund legit?' FAQ, security note."

## Phase 10 — Launch, Hosting & Growth

**Prompt:**
"Push to GitHub repo `edfund-com`, enable GitHub Pages (branch `main`, root). Test all forms (first submission activates the form relay), verify no email appears in page source, validate schema, submit sitemap to Google Search Console, apply for AdSense (set publisher ID in `config.js`, update `ads.txt`), join student-loan affiliate programs and paste links into `config.js`, create payment links for donations, point EdFund.com DNS to GitHub Pages and add a `CNAME` file."

### Growth roadmap (post-launch)
- Weekly: 2 guides + 1 YouTube video + 10 new scholarships.
- Monthly: giveaway winner announcement → email blast → social proof.
- Quarter 2: state-by-state and major-by-major scholarship landing pages (programmatic SEO).
- Quarter 3: user accounts (Supabase/Firebase free tier) + deadline reminders by email.
- Quarter 4: sell sponsored scholarships to brands; add a school directory with paid featured listings.
