# Feature Flags Guide

Enterprise-grade feature flags using Vercel Flags + Edge Config with SSR-first evaluation.

## Keys and Controls

- Decision order per request:
  1) NEXT_PUBLIC_FLAG_* env (no network)
  2) Edge Config key (if configured; never throws)
  3) Safe default

- Eval pattern:
  - Evaluate once on the server (layout, API, or server action)
  - Pass state down via props/context or `data-flag-*`

## Flags

| Flag | Edge Config Key | Env Var | Default | Purpose |
| --- | --- | --- | --- | --- |
| newNavigation | feature:new-navigation | NEXT_PUBLIC_FLAG_NEW_NAV | false | Enable new global navigation experiments |
| linkedinClone | feature:linkedin-clone | NEXT_PUBLIC_FLAG_LINKEDIN_CLONE | true | Expose the network (LinkedIn-style) area |
| jobsApp | feature:jobs-app | NEXT_PUBLIC_FLAG_JOBS_APP | true | Expose the jobs application and routes |
| affiliates | feature:affiliates | NEXT_PUBLIC_FLAG_AFFILIATES | true | Expose the affiliates marketing page |
| landingPages | feature:landing-pages | NEXT_PUBLIC_FLAG_LANDING_PAGES | true | Enable all marketing landing pages |
| businessCertification | feature:business-certification | NEXT_PUBLIC_FLAG_BUSINESS_CERTIFICATION | true | Expose Business Certification pages |
| investorRelations | feature:investor-relations | NEXT_PUBLIC_FLAG_INVESTOR_RELATIONS | true | Expose Investor Relations content |
| aboutUs | feature:about-us | NEXT_PUBLIC_FLAG_ABOUT_US | true | Expose About Us page |

## Example Edge Config JSON

```json
{
  "feature:new-navigation": false,
  "feature:linkedin-clone": true,
  "feature:jobs-app": true,
  "feature:affiliates": true,
  "feature:landing-pages": true,
  "feature:business-certification": true,
  "feature:investor-relations": true,
  "feature:about-us": true
}
```

## Example .env.local

```bash
NEXT_PUBLIC_FLAG_NEW_NAV=false
NEXT_PUBLIC_FLAG_LINKEDIN_CLONE=true
NEXT_PUBLIC_FLAG_JOBS_APP=true
NEXT_PUBLIC_FLAG_AFFILIATES=true
NEXT_PUBLIC_FLAG_LANDING_PAGES=true
NEXT_PUBLIC_FLAG_BUSINESS_CERTIFICATION=true
NEXT_PUBLIC_FLAG_INVESTOR_RELATIONS=true
NEXT_PUBLIC_FLAG_ABOUT_US=true
```

## Where Flags Are Used

- Server evaluation: `src/app/(site)/layout.js` (evaluates all flags once)
- Landing pages group guard: `src/app/(site)/(landing-pages)/layout.js`
- Section gates: LinkedIn clone, Jobs app, Affiliates, About, Investor Relations, Business Certification
- Developer view: `src/app/(site)/developers/env/page.js`

## Install (Bun)

```bash
bun add @vercel/flags @vercel/edge-config @vercel/toolbar
```

## Notes

- Use SSR-only evaluation; avoid client-side fetches for flags
- Prefer Edge Config for operational toggles; use env for local dev defaults
- Keep flags additive; do not remove features—gate visibility only
