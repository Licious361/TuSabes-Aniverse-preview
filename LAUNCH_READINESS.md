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
| Collector discovery | `catalog.json` with **three Sideshow editorial links** | Source pages verified against official seller pages; **no tracked affiliate IDs or commissions** |
| Red Signal | Two concept preview cards; detail/specs unverified | **Not offered for sale** |
| Yumi | Development-only studio section | No master-image / product manufacturing approval established |
| Interactive world | `experience.html` (~931KB archive-preserved v0.2) | Optional **prototype**, not live orders |
| Consent-based waitlist | Cloudflare Pages `functions/api/signup.js`, KV `WAITLIST` support | `config.js signupEnabled:false`; server `SIGNUP_ENABLED` default OFF; **no demonstrated accepted signups** |
| Anonymous analytics | `functions/api/event.js`, Cloudflare Analytics Engine binding support | `config.js analyticsEnabled:false`; server `EVENTS_ENABLED` default OFF; **no real captured events** |
| Routes/headers | `_routes.json`, `_headers`, `robots.txt` | Staged preview is **noindex**; deployed header behavior unverified. Remove this only after public release approval. |
| Regression tests | `tests/preview.test.mjs`, `.github/workflows/preview-qa.yml` | Tests committed; **no GitHub Actions run/result observed** |
| Existing PR #1 | Earlier draft pull request | **Closed without merging**. Preserve closure; no replacement/reopen performed. |
| Production `main` | Default branch | **Unchanged by these staged changes** |

## 3. Collector listings: avoid affiliate-revenue confusion
The current three Sideshow source pages are:
1. Taro Sakamoto — Iron Studios: https://www.sideshow.com/collectibles/sakamoto-days-taro-sakamoto-iron-studios-914821
2. Tanjiro & Nezuko — Prime 1 Studio: https://www.sideshow.com/collectibles/demon-slayer-kamado-tanjiro-kamado-nezuko-prime-1-studio-914976
3. My Hero Academia Villain Trinity — Prime 1 Studio: https://www.sideshow.com/collectibles/my-hero-academia-tomura-shigaraki-dabi-and-himiko-toga-prime-1-studio-914317?var=9143172

All are **editorial research links**, not affiliate links, and no fixed seller prices are promised.
The client renders `status:"affiliate"` only after a verified official merchant product URL plus `source_verified:true`, `partner_verified:true`, `rights_verified:true`, `link_verified:true` and an HTTPS tracked link pass an exact hostname allowlist. Supported seller host mappings: Sideshow, Hot Topic, BoxLunch, CDJapan, Playasia. CJ redirect examples are allowed only for Hot Topic/BoxLunch when `tracking_network:"CJ"` and `tracking_host_verified:true` additionally pass; no account enrollment is inferred. The link must accurately disclose the partner, external merchant checkout and potential commission relationship.

The existing September 28 affiliate brief prioritized Hot Topic, BoxLunch, CDJapan and Playasia for first-stage applications, Sideshow after collector-audience evidence. Those priority choices are **not changed** by showing three editorial Sideshow items in the prototype.

## 4. Tests and evidence, distinguished
- **Passed:** 16/16 structural checks on the staged branch snapshot (file presence, product claims, catalog statuses, affiliate gates, disabled services and retention controls).
- **Passed:** 11/11 backend behavior checks against fetched GitHub source in isolated V8 with mocked Cloudflare Response, crypto digest, origin and KV/Analytics Engine bindings (consent, bad input, size, storage, honeypot, default-off analytics and event filtering). This is **not** a live Cloudflare proof.
- **Passed:** 4/4 client behavior checks against fetched GitHub source with a mocked DOM/catalog network: three accurate editorial links rendered; editorial links had no sponsored tag; malicious/unauthorized links filtered; a fully gated illustrative CJ link rendered. This is **not** rendered-page or merchant-commission proof.
- **Staged, unverified by GitHub CI:** built-in Node.js tests in `tests/preview.test.mjs` and `tests/collector-client.test.mjs`; no GitHub Actions run was observed and this cannot be counted as passing Node CI.
- **Passed on separate ARCHIVED v0.2:** Chromium desktop (1440×900) and mobile (390×844) visual rendering, no horizontal overflow, hero SVG asset loaded, no page JavaScript errors. This test **does not certify the current GitHub branch**.
- **Not observed:** GitHub Actions test result, local Node test suite result, Pages build/deployment, HTTPS custom-domain health, a real signup + unsubscribe cycle, anti-abuse/rate-limit effectiveness, analytics ingest/denominator accuracy, partner affiliate enrollment, affiliate attributed sale, physical garment samples, purchase checkout or financial contribution.
- No user/customer emails, payment records or authenticated affiliate program credentials were accessed.
- **Closed unmerged PR #1** will not be silently reopened or replaced.

## 5. Exact release gates — remaining work, not a new strategy
**G0 — Protect prior data and host:** With authorized access, inspect whether the prior AniVerse preview and response desk hold any records. Verify current DNS, Cloudflare Pages project and custom-domain owner; preserve existing records before any redirect or deployment.

**G1 — Cloudflare preview only:** In the EXISTING Cloudflare Pages project if accessible, use preview branch controls to allow only `launch/affiliate-preview-gated-20261021` as a custom preview branch; leave production branch, domain and DNS untouched. Verify actual Pages project before creating or replacing anything. Build and load both mobile and desktop; validate `index.html`, `experience.html`, `_routes.json`, staged `X-Robots-Tag` and robots rules, legal/contact, keyboard controls and rights of source art. Cloudflare documentation: https://developers.cloudflare.com/pages/configuration/git-integration/ and https://developers.cloudflare.com/pages/configuration/branch-build-controls/ .

**G2 — Consented signup:** Confirm an active monitored business contact, approved privacy retention/deletion terms and email delivery provider; bind Cloudflare KV `WAITLIST` in PREVIEW only, protect route with robust rate limiting/bot controls, test invalid, valid, duplicate, unsubscribe and deletion requests on test records, and confirm actual stored receipt. Official reference: https://developers.cloudflare.com/pages/functions/bindings/ . Only then set the Cloudflare `SIGNUP_ENABLED` and client `signupEnabled` switches. Without those controls, leave DISABLED.

**G3 — Measurement:** Decide privacy/cookie policy, bind Analytics Engine in preview and test anonymous event receipts. The current `page_view` event counts **impressions, not unique visitors**. Determine any independently verified unique-visitor denominator and acquisition source before making unique visitor/conversion claims. Normalize multiword partner IDs (e.g. `Hot Topic` to `hot-topic`). Track outbound merchant clicks separately from partner-reported commissioned purchases. Enable `EVENTS_ENABLED` and client `analyticsEnabled` only after anti-abuse and consent review. Reference: https://developers.cloudflare.com/pages/functions/bindings/ .

**G4 — Affiliate pilot:** Obtain real application approval and terms from the existing prioritized partner list, current authenticated products, approval to use imagery, verified tracked links and clear FTC disclosure. Add 3 allowed affiliate products and complete the pre-existing 14-day content/traffic experiment. Do not presume program approval, customer data or sales.

**G5 — Only later sales:** Merchandise production/rights QC, actual sample, true landed costs/fees/margins, payment processing, sales tax, shipping, returns and a completed test order. This is **not** a precondition for a truthful preview and collector editorial discovery, but is required before selling owned products.

## 6. Next executable external dependency
**The next operational dependency is authorized Cloudflare Pages access and a safe nonproduction preview deployment.** No Cloudflare account deployment action is available in this chat. The code is staged and guarded; feature branch is reviewable at:
https://github.com/Licious361/TuSabes-Aniverse-preview/tree/launch/affiliate-preview-gated-20261021

Do not recommend purchasing a new domain or rebuilding on an unrelated platform. The founder should only need to authorize the existing Cloudflare preview access/connection when available.

## 7. Change control and integrity
This file supersedes the outdated October 21 feature-branch readiness text that said `catalog.json` was empty and the Pages backend had not been staged. Nothing in the business strategy was redefined. This is a factual reconciliation of **what code exists versus what service is operational**, not a new source-of-truth hierarchy or modification of parent-company canon.
