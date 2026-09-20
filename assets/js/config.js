/* ==========================================================
   EdFund.com — SITE CONFIG (edit this one file to monetize)
   ========================================================== */
window.EDFUND_CONFIG = {
  siteName: "EdFund",
  siteUrl: "https://edfund.com",
  domainContactUrl: "https://web.works/contact",

  /* Contact inbox is encoded — never written in plain text anywhere on the site. */
  _k: [97,99,127,32,102,101,125,97,123,82,45,125,111,103,108,99,107,124,121,107],

  /* Google AdSense — paste your publisher ID (e.g. "ca-pub-1234567890123456").
     Leave empty to show labelled placeholders. Also update /ads.txt. */
  adsenseClient: "",
  adSlots: { header: "", inContent: "", inFeed: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement ID (e.g. "G-XXXXXXX"). Optional. */
  ga4: "",

  /* YouTube channel for the Subscribe buttons */
  youtubeChannel: "https://www.youtube.com/results?search_query=edfund+scholarships",

  /* Donation payment links. Leave empty -> donors see a pledge form that emails you. */
  donate: {
    stripeOneTime: "",   // e.g. https://buy.stripe.com/xxxx
    stripeMonthly: "",   // e.g. https://buy.stripe.com/yyyy (recurring price)
    paypal: "",          // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    buyMeACoffee: "",    // e.g. https://buymeacoffee.com/edfund
    githubSponsors: ""   // e.g. https://github.com/sponsors/webworksa1
  },

  /* Affiliate / partner links (student loans, refinance, 529). Leave empty -> leads come to your inbox. */
  affiliates: {
    studentLoans: "",
    refinance: "",
    savings529: "",
    testPrep: ""
  },

  giveaway: { amount: 1000, bonusPerReferral: 5 },

  social: {
    youtube: "https://www.youtube.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/"
  }
};
