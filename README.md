# IDSA 2026 MDRGNB Interactive Bedside Guide

A clinician-oriented web reformatting of the IDSA 2026 Guidance on antimicrobial-resistant Gram-negative infections.

## Scope

The guide organizes recommendations for ESBL-E, AmpC-E, CRE, DTR *P. aeruginosa*, CRAB, and *Stenotrophomonas maltophilia* into bedside, pathogen, drug, syndrome, dosing, breakpoint, and QA views.

## Important notice

This is an unofficial educational clinical reference and is not affiliated with or endorsed by IDSA. It does not replace the original guideline, local antimicrobial stewardship policy, microbiology/AST interpretation, or patient-specific clinical judgment.

Drug names, organism names, and key medical terminology are intentionally retained in English.

## Source

Infectious Diseases Society of America 2026 Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections. Evidence current through March 1, 2026.

## Website deployment

This repository is prepared for GitHub Pages deployment from the `main` branch using GitHub Actions.

Expected project Pages URL after Pages is enabled:

`https://fre637781.github.io/IDSA-2026-MDRGNB-Guide/`

Deployment workflow: `.github/workflows/deploy-pages.yml`

The workflow validates the required static assets and then deploys the repository root as a static site. `.nojekyll` is included so GitHub Pages serves the files without Jekyll processing.

### GitHub Pages setting

In GitHub, open:

`Settings → Pages → Build and deployment → Source`

Select **GitHub Actions**.

If GitHub Pages is unavailable while the repository is private, either use a GitHub plan that supports Pages for private repositories or change the repository visibility to public before enabling Pages.

## Project structure

- `index.html` — main clinical guide and application logic
- `mobile.css` — mobile responsive presentation layer
- `mobile.js` — mobile navigation and interaction layer
- `.nojekyll` — disables Jekyll processing
- `.github/workflows/deploy-pages.yml` — GitHub Pages validation and deployment
- `.github/workflows/mobile-integrate.yml` — ensures mobile assets are referenced by `index.html`

## Release checklist

Before publishing a clinical-content update:

1. Confirm the official source wording and links.
2. Confirm treatment recommendations and dose tables were not unintentionally altered by UI work.
3. Check desktop and mobile navigation.
4. Check wide tables on a narrow viewport.
5. Confirm the Pages deployment workflow succeeds.
