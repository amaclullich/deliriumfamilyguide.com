# Delirium Family Guide website

Static website for `deliriumfamilyguide.com`.

## Current state

- The informational site is live at `https://deliriumfamilyguide.com/` with HTTPS enforced.
- The free-preview section carries a sign-up form for the illustrated Chapter 1 (19 September 2026). It posts to the MailerLite form "Book Landing Page Form" (single opt-in); the welcome automation emails the PDF link. The form uses `signup.js`, loads no third-party script and sets no cookies. `privacy.html#email-updates` describes the email processing.
- Google Analytics is available only after a visitor explicitly accepts the analytics notice. The site does not load Google Analytics before that choice, and the footer settings control allows consent to be changed or withdrawn.
- The source cover files in the Fiverr delivery folder remain untouched. Optimised copies are stored in `assets/` for the site.
- `CNAME` activates the custom domain. `CNAME.pending` is retained as a record of the held-back cutover state.
- The footer provides visible authorship, verified professional profiles, medical-information wording and a link to the editorial policy.
- Search metadata and JSON-LD describe only visible content and verified author relationships. They do not establish indexing, ranking or inclusion in AI-generated answers.
- Machine-readable release records are stored in `.github/handover/` so they are retained with the repository rather than presented as public site content.
- Search Console is verified and the sitemap has been accepted. The GA4 tag is consent-based, and privacy behaviour is described in `privacy.html`.

## Audit and release, 20 September 2026

The public Chapter 1 form and its existing MailerLite destination are retained. The 19 September release records single opt-in. This audit does not change that setting or the welcome automation, and does not establish inbox delivery or unsubscribe behaviour.

The audit improves mobile navigation, button contrast, keyboard feedback, form failure handling, analytics storage resilience, print legibility and privacy wording. The existing urgent-help link is placed before the book introduction. Homepage and privacy sitemap modification dates reflect this release; medical review dates are preserved.

## Remaining operational verification

- Use an explicitly authorised test mailbox to verify signup, delivery, the current PDF and unsubscribe in MailerLite. Do not infer delivery from a successful form response.
- Check the October publication date and add verified purchase links when editions are available.
- Search Console's last recorded indexing check was 31 August 2026. The handover is historical evidence, not a current traffic or ranking report.
- Before any future mailing to the legacy list, review its original permission scope.
- Preserve the original PSD, PDF, JPG and mockup assets.

## Checks

Run `node .github/tests/behaviour.cjs` for isolated signup and analytics checks. These use simulated responses and make no external requests. Also check the public pages, keyboard use and mobile layouts after a release.
