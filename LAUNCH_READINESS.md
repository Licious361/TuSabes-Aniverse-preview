# Tu Sabes AniVerse — existing preview repository launch candidate
**Branch:** launch/affiliate-preview-gated-20261021 · **Status:** draft/NOT LIVE · **Source:** previously approved brand/affiliate plans and 2026-10-21 repository inspection.

## What stays unchanged
- TuSabes Industries umbrella; Tu Sabes AniVerse one consumer-facing storefront; Midnight Manga Studio original IP.
- Village Market at Dusk spatial zones: Collector's Corner, Front Stalls, Inner Aisles.
- High-value authenticated affiliate collectibles as customer-acquisition lane; original Red Signal product concepts; original Yumi system pending character QC.
- Deep crimson replaces plum in proposed Red Signal previews. No stock, pricing, fabrication or delivery claims.
- One later limited-drop grand opening only after samples, rights, checkout, shipping, margins and approvals.

## What changed on this branch (not on main)
- Replaced false placeholder inventory statements (“Restocked”, “Drop 01”, unspecified heavy hoodie) with truthful preview states.
- Added premium collector discovery zone first, two Red Signal preview cards, and original-IP studio overview.
- Added a config-gated email signup form with unchecked consent and a privacy placeholder that honestly states no signup currently occurs.
- Added config-gated JSON affiliate catalog and outbound click event hooks, with no fake referral URLs.
- Added semantic navigation, responsive CSS, focus states, reduced-motion handling and mobile-friendly layout.

## Do not merge this branch until the following are checked
1. **Domain/host:** verify this repo actually serves the intended preview domain; CNAME file alone is not DNS/HTTPS proof. Opening the site and certificate must pass on a phone.
2. **Signup:** configure a real secure HTTPS signup endpoint in config.js only after provider, recipient, privacy notice, confirmation email and unsubscribe have been tested. Do not store secrets in this public repo. Provider must accept JSON with CORS; adapt adapter if not.
3. **Retail partner:** obtain affiliate publisher approvals and actual tracked URLs. catalog.json is intentionally empty. Only add documented genuine products with status approved, partner_verified true, rights_verified true. Follow permitted image usage, never scrape imagery.
4. **Analytics:** the client queues dataLayer events, which by itself does NOT mean analytics are collected. Configure an approved GA4/GTM or comparable account with consent and verify event receipts. Partner-side completed purchases require reconciliation with each affiliate reporting portal.
5. **Original design:** replace geometric concept placeholders with founder-approved production/concept images only after artwork rights and fidelity are validated.
6. **Contact:** provide a working, monitored business contact method and complete privacy/terms before publishing.
7. **Commercial launch:** verify seller identification, tax/checkout, genuine suppliers, margins, returns, sizes, samples and test order before activating sales.

## Affiliate catalog example (example ONLY; do not copy as an actual listing)
```json
[{"id":"approved-partner-sku","title":"Accurate product title","partner":"Approved retailer name","category":"premium-figure","description":"Accurate sourced description","affiliate_url":"https://PARTNER-AFFILIATE-URL","status":"approved","partner_verified":true,"rights_verified":true}]
```
All product data, partner approvals, images and links require independent evidence. Never use a generic external URL as a fake commission link.

## Events (adapter ready, not live telemetry)
- site_navigation {action}
- design_interest {design}
- affiliate_outbound_click {sku,partner,category}
- signup_accepted {interest_count}
- signup_error {stage}

## Readiness assessment (2026-10-21)
GitHub repo READABLE; Shopify Admin get-shop-info/search-products/search-collections all return retryable service errors; live domain and GitHub Pages could not be verified from available public reads. No merchant mutation, purchase, sending, signup activation or publication was performed. This pull request is a reviewable candidate, not a live launch or proof of affiliate enrollment.
