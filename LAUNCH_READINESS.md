# Tu Sabes AniVerse — Soft Launch Execution Ledger
**Scope:** Existing AniVerse preview repository / branch only — Shopify excluded from this iteration.
**Review date:** October 21, 2026
**Project:** Licious361/TuSabes-Aniverse-preview
**Working branch:** `launch/affiliate-preview-gated-20261021`
**Release decision:** **BUILT / NOT LIVE · HOLD PUBLIC LAUNCH**

## 1. Preserved founder decisions
- **TuSabes Industries** is the parent identity; **Tu Sabes AniVerse** is the single consumer-facing curated storefront.
- **High-dollar authenticated, licensed anime figures/statues** drive discovery and customer acquisition through approved merchant affiliate links *when granted*. No obligation to manufacture protected franchise imagery or carry stock; no implied license or affiliate status from ordinary retailer links.
- **Red Signal** original streetwear is in development: Afterglow washed charcoal, Stone Frame stone, proposed deep-crimson direction (not plum). Only concept previews, no prices, samples, availability or false scarcity.
- **Midnight Manga Studio / Yumiko “Yumi” Solís** remains original IP, not production-approved merchandise. Books, art, stickers, prints and accessories are prospective extensions, not items currently for sale.
- **Village Market at Dusk** immersive prototype remains intact in a separate optional archived page. Do not substitute it for an untested commerce funnel.
- Soft launch and measured discovery first. Public limited-drop grand opening later, with actual rights/sample/economics and order-fulfilment gates.
- Do not merge, repoint the custom domain, publish, spend, accept contracts, send messages, or activate storage without founder authority and evidence.

## 2. Verified existing branch contents
| Area | Implementation | Current truth |
| --- | --- | --- |
| Customer-facing preview | `index.html`, `style.css`, `script.js`, `privacy.html` | Committed to feature branch, **not verified deployed** |
| Collector discovery | `catalog.json` with **three Sideshow editorial links** | Source pages exist; **no tracked affiliate IDs or commissions** |
| Red Signal | Two concept preview cards; detail/specs unverified | **Not offered for sale** |
| Yumi | Development-only studio section | No master-image / product manufacturing approval established |
| Interactive world | `experience.html` (~931KB archive-preserved v0.2) | Optional **prototype**, not live orders |
| Consent-based waitlist | Cloudflare Pages `functions/api/signup.js`, KV `WAITLIST` support | `config.js signupEnabled:false`; server `SIGNUP_ENABLED` default OFF; **no demonstrated accepted signups** |
| Anonymous analytics | `functions/api/event.js`, Cloudflare Analytics Engine binding support | `config.js analyticsEnabled:false`; server `EVENTS_ENABLED` default OFF; **no real captured events** |
| Routes/headers | `_routes.json`, `_headers` | Source committed, deployed behavior unverified |
| Regression tests | `tests/preview.test.mjs`, `.github/workflows/preview-qa.yml` | Tests committed; **no GitHub Actions run/result observed** |
| Existing PR #1 | Earlier draft pull request | **Closed without merging**. Preserve closure; no replacement/reopen performed. |
| Production `main` | Default branch | **Unchanged by these staged changes** |

## 3. Collector listings: avoid affiliate-revenue confusion
The current three Sideshow source pages are:
1. Taro Sakamoto — Iron Studios: https://www.sideshow.com/collectibles/sakamoto-days-taro-sakamoto-iron-studios-914821
2. Tanjiro & Nezuko — Prime 1 Studio: https://www.sideshow.com/collectibles/demon-slayer-kamado-tanjiro-kamado-nezuko-prime-1-studio-914976
3. My Hero Academia Villain Trinity — Prime 1 Studio: https://www.sideshow.com/collectibles/my-hero-academia-tomura-shigaraki-dabi-and-himiko-toga-prime-1-studio-914317?var=9143172

All are **editorial research links**, not affiliate links, and no fixed seller prices are promised.
The client renders `status:"affiliate"` only after `partner_verified:true`, `rights_verified:true`, `link_verified:true` and an HTTPS tracked link pass the allowlist. It must also accurately disclose the partner, merchant checkout and commission relationship.

The existing September 28 affiliate brief prioritized Hot Topic, BoxLunch, CDJapan and Playasia for first-stage applications, Sideshow after collector-audience evidence. Those priority choices are **not changed** by showing three editorial Sideshow items in the prototype.

## 4. Tests and evidence, distinguished
- **Passed:** 16/16 static checks against the retrieved staged branch files (file presence, label/availability claims, catalog statuses, affiliate gates, disabled services, minimal schema and retention controls). Static passing is not a deployed or end-to-end functional pass.
- **Passed on separate ARCHIVED v0.2:** Chromium desktop (1440×900) and mobile (390×844) visual rendering, no horizontal overflow, hero SVG asset loaded, no page JavaScript errors. This test **does not certify the current GitHub branch**.
- **Not observed:** GitHub Actions test result, local Node test suite result, Pages build/deployment, HTTPS custom-domain health, a real signup + unsubscribe cycle, anti-abuse/rate-limit effectiveness, analytics ingest/denominator accuracy, partner affiliate enrollment, affiliate attributed sale, physical garment samples, purchase checkout or financial contribution.
- No user/customer emails, payment records or authenticated affiliate program credentials were accessed.
- **Closed unmerged PR #1** will not be silently reopened or replaced.

## 5. Exact release gates — remaining work, not a new strategy
**G0 — Protect prior data and host:** With authorized access, inspect whether the prior AniVerse preview and response desk hold any records. Verify current DNS, Cloudflare Pages project and custom-domain owner; preserve existing records before any redirect or deployment.

**G1 — Cloudflare preview only:** Connect the existing repo feature branch to a nonproduction Pages preview. Build and load both mobile and desktop; validate `index.html`, `experience.html`, `_routes.json`, correct security headers, legal/contact information, accessible forms and source/rights of imagery.

**G2 — Consented signup:** Confirm an active monitored business contact, approved privacy retention/deletion terms and email delivery provider; bind Cloudflare KV `WAITLIST`, protect route with robust rate limiting/bot controls, test invalid, valid, duplicate, unsubscribe and deletion requests on test records, and confirm actual stored receipt. Only then set the Cloudflare `SIGNUP_ENABLED` and client `signupEnabled` switches. Without those controls, leave DISABLED.

**G3 — Measurement:** Decide consent/cookie policy, bind Analytics Engine and test anonymous event receipts; verify unique visitor denominators and attribution/source before enabling `EVENTS_ENABLED` and client `analyticsEnabled`. Track referral clicks separately from partner-reported commissioned purchases.

**G4 — Affiliate pilot:** Obtain real application approval and terms from the existing prioritized partner list, current authenticated products, approval to use imagery, verified tracked links and clear FTC disclosure. Add 3 allowed affiliate products and complete the pre-existing 14-day content/traffic experiment. Do not presume program approval, customer data or sales.

**G5 — Only later sales:** Merchandise production/rights QC, actual sample, true landed costs/fees/margins, payment processing, sales tax, shipping, returns and a completed test order. This is **not** a precondition for a truthful preview and collector editorial discovery, but is required before selling owned products.

## 6. Next executable external dependency
**The next operational dependency is authorized Cloudflare Pages access and a safe nonproduction preview deployment.** No Cloudflare account deployment action is available in this chat. The code is staged and guarded; feature branch is reviewable at:
https://github.com/Licious361/TuSabes-Aniverse-preview/tree/launch/affiliate-preview-gated-20261021

Do not recommend purchasing a new domain or rebuilding on an unrelated platform. The founder should only need to authorize the existing Cloudflare preview access/connection when available.

## 7. Change control and integrity
This file supersedes the outdated October 21 feature-branch readiness text that said `catalog.json` was empty and the Pages backend had not been staged. Nothing in the business strategy was redefined. This is a factual reconciliation of **what code exists versus what service is operational**, not a new source-of-truth hierarchy or modification of parent-company canon.
