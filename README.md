# Delirium Family Guide website

Static website for `deliriumfamilyguide.com`.

## Current state

- The informational site is live at `https://deliriumfamilyguide.com/` with HTTPS enforced.
- The free-preview section is intentionally inactive until Chapters 1 and 2, the consent wording, the confirmation email and the download route are final.
- No analytics, cookies or email signup code is active.
- The source cover files in the Fiverr delivery folder remain untouched. Optimised copies are stored in `assets/` for the site.
- `CNAME` activates the custom domain. `CNAME.pending` is retained as a record of the held-back cutover state.
- The footer provides visible authorship, verified professional profiles, medical-information wording and a link to the editorial policy.
- Search metadata and JSON-LD describe only visible content and verified author relationships. They do not establish indexing, ranking or inclusion in AI-generated answers.
- The machine-readable release record is stored at `.github/handover/seo-ai-discoverability.json` so it is retained with the repository rather than presented as public site content.

## Publication sequence

1. Complete and typeset Chapters 1 and 2.
2. Add the final two-chapter PDF to a stable controlled location.
3. Preserve a MailerLite export and suppression record.
4. Prepare explicit signup wording, double opt-in and a group-based automation.
5. Add the tested form to the preview section and update `privacy.html`.
6. Add the live book-site route to the 4AT site and the quiet Delirium Support panel.

## Safety gates

- Do not publish the MailerLite form until double opt-in, delivery and unsubscribe have been tested.
- Do not add a campaign to the legacy list without reviewing its original permission scope.
- Do not delete or overwrite the original PSD, PDF, JPG or mockup assets.
