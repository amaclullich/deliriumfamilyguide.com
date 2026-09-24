# Delirium Family Guide website

Static website for `deliriumfamilyguide.com`, published by GitHub Pages from the root of `main`. There is no build step: each page is a complete HTML file.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: the cover, about the book, four questions families ask, the first page, why the book was written, three quotations, the Chapter 1 sign-up, contents, authors, publication details, newsletter |
| `chapter-1/index.html` | The opening pages of Chapter 1, exactly as in the book, with the sign-up form |
| `voices/index.html` | In their words: 25 quotations from patients and families, each linked to its published source |
| `editorial.html` | Medical and editorial policy, including sources for the figures on the site |
| `privacy.html` | Privacy notice (analytics, MailerLite sign-up, Substack links, hosting) |
| `404.html` | Page not found |
| `llms.txt` | Plain-text summary of the book and site for AI systems |

## Design

Redesigned 25 September 2026. The home page opens with the book cover set in live type over a teal gradient with the cover's light, so that the page looks like the cover, then the back cover, then the first page. Colours come from the cover (see `design-tokens.json`). Type is EB Garamond for book text and headings and Source Sans 3 for the interface, both self-hosted in `assets/fonts/` (SIL Open Font Licence, subset to Latin with small caps and old-style figures). Images are in `assets/img/`; social sharing images are in `assets/og/`.

## Things that must stay exact

- Excerpts from Chapter 1 are copied from the final Chapter 1 PDF (19 September 2026). If the chapter text changes, update both `index.html` (the first page) and `chapter-1/index.html`.
- Quotations on `voices/index.html` and the three on the home page are copied character for character from their sources. The check record, with the method used for each, is `.github/handover/voices-sources.json`. Never edit inside a quotation.
- The Chapter 1 form posts to the MailerLite form "Book Landing Page Form". `signup.js` and `analytics-consent.js` are unchanged by the redesign; `node .github/tests/behaviour.cjs` tests both.

## Newsletter posts

`.github/workflows/substack-posts.yml` runs daily. It reads the Substack feed and rewrites the "Recent posts" list on the home page between the `substack-posts` markers. It commits only when the list changes. If the feed cannot be read, the page is left as it is. GitHub pauses scheduled workflows after 60 days without a commit; re-enable it from the Actions tab if that happens.

## When the book is published

1. Add the Amazon link to the hero (`cover-actions`), the publication details table and the details line on `voices/index.html`.
2. Change "Planned for the end of October 2026" to the publication date, and add `datePublished` to the Kindle edition in the home page JSON-LD.
3. Update `llms.txt` and the `lastmod` dates in `sitemap.xml`.

## Checks

Run `node .github/tests/behaviour.cjs` for the sign-up and analytics behaviour. After a release, check the public pages at phone and desktop widths, keyboard use, and that the form reaches MailerLite.
