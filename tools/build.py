#!/usr/bin/env python3
"""EdFund.com static page builder.
Wraps every body partial in /src with the shared header, footer and SEO head.
Usage:  python3 tools/build.py      (outputs to repo root; GitHub Pages serves it as-is)
Partials start with a JSON front-matter line:  <!--{"title":"...","desc":"...","nav":"scholarships"}-->
"""
import json, os, re, glob, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
SITE = "https://edfund.com"
TODAY = datetime.date.today().isoformat()

LOGO = '''<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2451E6"/><stop offset="1" stop-color="#12A37F"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lg)"/><path d="M20 9 7 15l13 6 13-6-13-6Z" fill="#fff"/><path d="M12 18.5v5.2c0 2.2 3.6 4.3 8 4.3s8-2.1 8-4.3v-5.2L20 22l-8-3.5Z" fill="#fff" opacity=".85"/><circle cx="31" cy="27" r="5.5" fill="#F5B400"/><text x="31" y="30" font-size="8" font-weight="800" text-anchor="middle" fill="#1a1300" font-family="Arial">$</text></svg>'''

NAV = [("scholarships", "scholarships.html", "Scholarships"), ("loans", "student-loans.html", "Student Loans"),
       ("calculators", "calculators.html", "Calculators"), ("giveaway", "giveaway.html", "$1K Giveaway"),
       ("guides", "guides.html", "Guides"), ("videos", "videos.html", "Videos"), ("donate", "donate.html", "Donate")]


def head(p, r):
    url = SITE + "/" + p["out"].replace("index.html", "")
    schema = [{"@context": "https://schema.org", "@type": "Organization", "name": "EdFund", "url": SITE,
               "logo": SITE + "/assets/img/logo.svg", "sameAs": []},
              {"@context": "https://schema.org", "@type": "WebSite", "name": "EdFund", "url": SITE,
               "potentialAction": {"@type": "SearchAction", "target": SITE + "/scholarships.html?q={search_term_string}",
                                   "query-input": "required name=search_term_string"}}]
    if p.get("crumb"):
        schema.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": p["crumb"], "item": url}]})
    if p.get("article"):
        schema.append({"@context": "https://schema.org", "@type": "Article", "headline": p["title"],
                       "description": p["desc"], "dateModified": TODAY, "author": {"@type": "Organization", "name": "EdFund Editorial Team"},
                       "publisher": {"@type": "Organization", "name": "EdFund"}, "mainEntityOfPage": url})
    extra = "".join('<script type="application/ld+json">%s</script>\n' % json.dumps(s) for s in schema)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{p["title"]}</title>
<meta name="description" content="{p["desc"]}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0B1B3F">
<meta property="og:type" content="{'article' if p.get('article') else 'website'}">
<meta property="og:site_name" content="EdFund">
<meta property="og:title" content="{p["title"]}">
<meta property="og:description" content="{p["desc"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{r}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{r}assets/css/style.css">
<script>try{{var t=localStorage.getItem("edf_theme");if(t)document.documentElement.setAttribute("data-theme",JSON.parse(t))}}catch(e){{}}</script>
{extra}</head>'''


def header(p, r):
    cur = ' aria-current="page"'
    items = "".join(
        f'<li><a href="{r}{href}"{cur if p.get("nav") == key else ""}>{label}</a></li>'
        for key, href, label in NAV)
    return f'''<body{p.get("bodyattr","")}>
<a class="skip" href="#main">Skip to content</a>
<div class="domain-banner" role="note"><a href="https://web.works/contact" target="_blank" rel="noopener">Contact, if you are interested in this website/domain name</a></div>
<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="logo" href="{r}index.html" aria-label="EdFund home">{LOGO}<span>Ed<b>Fund</b></span></a>
    <ul class="nav-links" id="nav-links">{items}<li class="hide-desktop"><a href="{r}get-funded.html" style="color:var(--blue)">Get Matched Free →</a></li></ul>
    <div class="nav-cta">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <a class="btn btn-primary btn-sm" href="{r}get-funded.html">Get Matched Free</a>
      <button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    </div>
  </nav>
</header>
<div class="scrim"></div>
<main id="main">'''


def footer(p, r):
    return f'''</main>
<div class="ad-slot" data-slot="footer"></div>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="{r}index.html">{LOGO}<span>Ed<b style="color:#8FB0FF">Fund</b></span></a>
        <p class="small" style="margin-top:14px;max-width:340px">EdFund helps students and families find scholarships, grants, smart loans and savings strategies — free, in one place.</p>
        <form class="inline-form" data-form="Newsletter" data-success="You're subscribed! Watch your inbox for weekly scholarship drops.">
          <label class="sr-only" for="nl-f">Email</label><input id="nl-f" type="email" name="Email" placeholder="Weekly scholarship alerts" required>
          <input type="hidden" name="Form" value="Footer newsletter"><button class="btn btn-gold" type="submit">Subscribe</button>
        </form>
        <div class="social">
          <a data-social="youtube" href="#" aria-label="YouTube">▶</a><a data-social="instagram" href="#" aria-label="Instagram">◎</a>
          <a data-social="tiktok" href="#" aria-label="TikTok">♪</a><a data-social="x" href="#" aria-label="X">𝕏</a><a data-social="linkedin" href="#" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div><h4>Find money</h4><ul>
        <li><a href="{r}scholarships.html">Scholarship search</a></li><li><a href="{r}scholarships.html?cat=Government%20Grant">Grants</a></li>
        <li><a href="{r}scholarships.html?cat=Study%20Abroad">Study abroad funding</a></li><li><a href="{r}student-loans.html">Student loans</a></li>
        <li><a href="{r}giveaway.html">$1,000 giveaway</a></li></ul></div>
      <div><h4>Tools & learn</h4><ul>
        <li><a href="{r}calculators.html">Calculators</a></li><li><a href="{r}guides.html">Guides</a></li>
        <li><a href="{r}videos.html">Videos</a></li><li><a href="{r}faq.html">FAQ</a></li><li><a href="{r}get-funded.html">Get matched</a></li></ul></div>
      <div><h4>Get involved</h4><ul>
        <li><a href="{r}donate.html">Donate</a></li><li><a href="{r}sponsor.html">Sponsor a scholarship</a></li>
        <li><a href="{r}sponsor.html#advertise">Advertise</a></li><li><a href="{r}careers.html">Careers</a></li><li><a href="{r}careers.html#ambassadors">Ambassadors</a></li></ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="{r}about.html">About</a></li><li><a href="{r}contact.html">Contact</a></li>
        <li><a href="{r}privacy.html">Privacy</a></li><li><a href="{r}terms.html">Terms</a></li><li><a href="{r}disclosure.html">Advertiser disclosure</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year></span> EdFund.com · Information only — not financial or legal advice. Always confirm details with official providers.</span>
      <a href="https://web.works/contact" target="_blank" rel="noopener">This domain may be available — inquire</a>
    </div>
  </div>
</footer>
<div class="mobile-cta"><a class="btn btn-primary" href="{r}get-funded.html">Get matched</a><a class="btn btn-gold" href="{r}giveaway.html">Win $1,000</a></div>
<button class="icon-btn to-top" aria-label="Back to top">↑</button>
<div class="cookie" role="dialog" aria-label="Cookie notice"><p class="small mb0"><b>Cookies.</b> We use cookies for analytics and ads to keep EdFund free. See our <a href="{r}privacy.html">privacy policy</a>.</p>
  <div class="flex mt2"><button class="btn btn-primary btn-sm" data-cookie="all">Accept all</button><button class="btn btn-ghost btn-sm" data-cookie="essential">Essential only</button></div></div>
<div class="modal" id="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-h">
  <div class="modal-box">
    <button class="icon-btn modal-close" aria-label="Close">✕</button>
    <span class="eyebrow">Before you go</span>
    <h3 id="exit-h" style="font-size:1.6rem">Get free scholarship matches + a shot at $1,000</h3>
    <p class="muted">Join students who get new scholarships and deadlines sent to them every week. You'll also be entered in this month's no-essay drawing.</p>
    <form data-form="Exit-intent lead" data-success="You're in! Check your inbox for your first matches.">
      <div class="field"><label for="ex-n">First name</label><input id="ex-n" name="First name" required autocomplete="given-name"></div>
      <div class="field"><label for="ex-e">Email</label><input id="ex-e" type="email" name="Email" required autocomplete="email"></div>
      <div class="field"><label for="ex-l">I am a…</label><select id="ex-l" name="Level" required><option value="">Select</option><option>High school student</option><option>College student</option><option>Graduate student</option><option>Parent</option><option>International student</option></select></div>
      <label class="check"><input type="checkbox" name="Consent" value="Yes" required> I agree to receive emails from EdFund and accept the <a href="{r}giveaway.html#rules">official rules</a>.</label>
      <button class="btn btn-primary btn-block mt2" type="submit">Send my matches</button>
    </form>
  </div>
</div>
<script src="{r}assets/js/config.js"></script>
<script src="{r}assets/js/data.js"></script>
<script src="{r}assets/js/main.js" defer></script>
</body>
</html>
'''


def build():
    pages = []
    for path in sorted(glob.glob(os.path.join(SRC, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, SRC).replace(os.sep, "/")
        raw = open(path, encoding="utf-8").read()
        m = re.match(r"\s*<!--(\{.*?\})-->\s*", raw, re.S)
        meta = json.loads(m.group(1)); body = raw[m.end():]
        meta["out"] = rel
        r = "../" * rel.count("/")
        body = body.replace("{{r}}", r).replace("{{today}}", TODAY)
        h = head(meta, r)
        if rel == "404.html":
            h = h.replace("<head>", "<head>\n<script>var m=location.pathname.match(/^\\/edfund-com\\//i);document.write('<base href=\"'+(m?m[0]:'/')+'\">')</script>", 1)
        html = h + "\n" + header(meta, r) + "\n" + body + "\n" + footer(meta, r)
        out = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(html)
        if not meta.get("noindex"): pages.append((rel, meta.get("priority", "0.7")))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for rel, pr in pages:
        sm.append(f"  <url><loc>{SITE}/{rel.replace('index.html','')}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>")
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print("Built", len(pages), "pages")


if __name__ == "__main__":
    build()
