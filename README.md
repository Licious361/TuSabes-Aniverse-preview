# Tu Sabes AniVerse — staged preview

**Source:** existing TuSabes AniVerse project. **State:** work branch only, NOT published. **Shopify:** deliberately excluded from this implementation pass.

The storefront preserves the original business intent: authentic premium collectible **affiliate discovery** once merchant relationships and tracked links are approved, followed by original **Red Signal** streetwear and future Midnight Manga Studio products. Until approved, collector links are editorial referrals only. No merchandise, samples or commissions are represented as ready or earned.

## Development and checks

Requires Node.js 22. No dependencies or credentials are needed to run the offline checks.

```bash
npm run preflight
```

This runs syntax validation, builds **only approved public assets** into `dist/`, then runs the server and client tests. Test files, internal launch notes, credentials and backend Function source stay OUT of the public static bundle.

## Nonproduction Cloudflare Pages preview

Use the **existing** authorized Pages account/project only. Do not repoint `tusabesaniverse.com`, move DNS, alter the production branch or replace prior preview data. Verify the current Pages project and whether a previously deployed response desk holds customer information before connecting this repository.

- **Repository:** `Licious361/TuSabes-Aniverse-preview`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** repository root
- **Preview branch:** `launch/affiliate-preview-gated-20261021`
- **Production:** leave existing setting UNCHANGED
- **Preview access:** restrict/share only after testing the data-handling setup

Pages Functions remain in source `functions/api/` for Cloudflare to compile separately. By design, `config.js` has `signupEnabled:false` and `analyticsEnabled:false`. Backend storage and event collection ALSO require `SIGNUP_ENABLED=true` or `EVENTS_ENABLED=true` with their real Cloudflare bindings; merely deploying the preview does **not** start collecting email or analytics.

Cloudflare official references:
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/functions/bindings/

## Review paths

- `index.html` — collector-first storefront preview with original brand departments.
- `catalog.json` — 3 real Sideshow editorial research links; affiliate status remains unapproved.
- `experience.html` — recovered v0.2 immersive Village Market at Dusk concept, preserved as a separate optional prototype.
- `functions/api/signup.js` — consented waitlist handler, disabled pending KV + anti-abuse + privacy + unsubscribe verification.
- `functions/api/event.js` — anonymous event intake, disabled pending analytics binding and QA.
- `LAUNCH_READINESS.md` — controlling implementation truth ledger, evidence, exclusions, and release gates.

No code here is a claim of operating production checkout, real customer orders, approved affiliate partnership, completed Yumi merchandise, or a verified public deployment. The previous pull request #1 was closed without merge; it is not being reopened. The feature branch has not been merged into `main`.
