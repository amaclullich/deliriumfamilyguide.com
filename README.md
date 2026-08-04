# Delirium Family Guide website

Static website for `deliriumfamilyguide.com`.

## Current state

- The informational site is complete and ready for local review.
- The free-preview section is intentionally inactive until Chapters 1 and 2, the consent wording, the confirmation email and the download route are final.
- No analytics, cookies or email signup code is active.
- The source cover files in the Fiverr delivery folder remain untouched. Optimised copies are stored in `assets/` for the site.
- `CNAME.pending` preserves the intended custom domain. It must be renamed to `CNAME` only when the Porkbun DNS cutover is being made; until then, the GitHub Pages address remains available for review.

## Publication sequence

1. Review the page copy and final preview wording.
2. Add the final two-chapter PDF to a stable controlled location.
3. Preserve a MailerLite export and suppression record.
4. Prepare explicit signup wording, double opt-in and a group-based automation.
5. Add the tested form to the preview section and update `privacy.html`.
6. Review the site at its temporary GitHub Pages address.
7. Verify the custom domain in GitHub, rename `CNAME.pending` to `CNAME`, then replace the Porkbun temporary redirect with the exact GitHub Pages DNS records.
8. Enforce HTTPS and test the apex and `www` addresses on desktop and phone.
9. Add the live book-site route to the 4AT site and the quiet Delirium Support panel.

## Safety gates

- Do not publish the MailerLite form until double opt-in, delivery and unsubscribe have been tested.
- Do not add a campaign to the legacy list without reviewing its original permission scope.
- Do not delete or overwrite the original PSD, PDF, JPG or mockup assets.
