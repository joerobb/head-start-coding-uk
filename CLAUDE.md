# Head Start Coding website

Static site (HTML + Bootstrap + jQuery) deployed on Netlify from `main`. No build step: edit the HTML files directly.
Online coding lessons for children aged 8-16, so privacy and safeguarding matter. See `privacy-policy.html`.

## Adding a blog post

1. Copy `blog/_template.html` to `blog/YYYY/MM/your-post-slug.html`, replace every `{{PLACEHOLDER}}` and delete the template's header comment.
2. Images go in `img/blog-images/`. Add a `.webp` version beside each `.png`/`.jpg` and a 1200x675 `.webp` card image for listings and `og:image`.
3. `blog.html`: add a card at the top and a matching `blogPost` entry in its JSON-LD.
4. `index.html`: update "From Our Blog" so it shows the latest three posts.
5. `sitemap.xml`: add the clean URL (no `.html`).
6. `_redirects`: add `/blog/YYYY/MM/slug.html /blog/YYYY/MM/slug 301`.

## Privacy and cookies rules (UK GDPR / PECR). Every page must:

- Load `js/cookie-consent.js?v=N` (relative path) at the top of `<head>`, **before** the inline `gtag(...)` and Meta Pixel snippets. Google Analytics and the Meta Pixel are loaded by that script only after the visitor opts in.
- Never include the raw `<script async src="https://www.googletagmanager.com/gtag/js?...">` tag.
- Never include the Meta Pixel `<noscript><img src="https://www.facebook.com/tr?...">` fallback.
- Keep the footer links to the Privacy Policy and `<a href="#" data-cookie-settings>Cookie Settings</a>`.
- `/js/*` is cached for a year (`_headers`): after editing `js/cookie-consent.js`, bump `?v=N` on **every** page.
- Adding a new tracker or third-party tool: add it to `js/cookie-consent.js` (and bump `CONSENT_VERSION` to ask everyone again) **and** to the cookie table and supplier list in `privacy-policy.html`.

## Forms

- No "accept the privacy policy" pop-ups or tick boxes. Show a short notice with a link to the Privacy Policy instead.
- Marketing emails need an **optional, unticked** opt-in checkbox. Send `marketingConsent` (true/false), the wording shown, the date and `privacyPolicyVersion` with the submission. Zapier must only add people to MailerLite marketing groups when `marketingConsent` is true.
- If the privacy policy changes, update its "Last updated" date and the `privacyPolicyVersion` value in the forms.
