# HSC email templates

Master HTML template for Head Start Coding newsletters sent through MailerLite.

## Files

| File | Purpose |
| --- | --- |
| `hsc-master-template.html` | The master template. Copy it, swap the content, paste into MailerLite. |

## How to send a new email

1. Copy the whole of `hsc-master-template.html`.
2. In MailerLite: **Campaigns → Create campaign → Regular**, then choose the
   **Custom HTML** editor (not drag-and-drop) and paste.
3. Replace the content in the zones marked with `<!-- ===== EDITABLE: ... ===== -->`.
4. Set the recipient group, subject and preview text.
5. **Send a test to yourself before sending to the list.**

Alternatively, in MailerLite open the last campaign that used this template and
choose **Copy**. That carries the design over and you just edit the text.

## Brand tokens

Kept in sync with `css/style.css` in this repo. If the site palette changes,
change it here too.

| Token | Hex | Used for |
| --- | --- | --- |
| `--primary` | `#6222CC` | Header band, footer, stat figures, eyebrow labels |
| `--secondary` | `#FBA504` | Top rule, section underline, CTA button |
| `--light` | `#F6F4F9` | Page background, stat tiles |
| `--dark` | `#04000B` | Headings, terminal card, CTA button text |
| Body text | `#515856` | Paragraph copy |
| Muted text | `#726D7B` | Card copy, mono labels |
| Tile border | `#E6DEF5` | Stat and course tile borders |
| Terminal green | `#4ade80` | The `>` prompt line |

Note: emails sent before October 2026 used `#622CCC`, which is a transposed
typo of the real brand purple `#6222CC`. Use `#6222CC`.

## Fonts

Jost for headings, Heebo for body, matching the website. Loaded from Google
Fonts via `@import`, which works in Apple Mail and iOS Mail. Outlook and Gmail
fall back to Segoe UI / Tahoma, which is expected and fine.

## Layout notes

- 640px container, stacking to full width below 640px via the `.col` and
  `.gutter` classes in the `<style>` block.
- The CTA button has a VML fallback so it still renders as a pill in Outlook.
  The VML carries its own `xmlns` declarations inline, because MailerLite strips
  the namespace attributes from the `<html>` tag on paste.
- The dark "terminal card" is the one tech flourish. One per email is plenty.

## Personalisation

`{$name|default('there')}` is MailerLite's documented syntax for a fallback when
a subscriber has no name. It renders as "Hello there".
See https://www.mailerlite.com/help/how-to-use-variables-in-mailerlite

## Gotchas

- MailerLite reformats the HTML on paste: it rewrites the `<html>` tag, collapses
  whitespace and adds `builder-link-id` attributes to links. That is normal. Keep
  the clean version in this repo as the source of truth.
- `{$url}` (view in browser) and `{$unsubscribe}` are MailerLite variables and
  must stay in place.
- Preview text lives in the hidden `<div>` at the top of `<body>`. MailerLite
  also has its own preview-text field; filling both is safest.
