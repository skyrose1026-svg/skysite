# Connecting hosted services

The site is static. It does not have a private server, database, payment processor, or secret store. Do not put API keys, private tokens, or credentials in JavaScript served to visitors.

## Newsletter signup

1. Create a hosted signup page with a mailing-list provider such as Mailchimp, Buttondown, or another provider you trust.
2. Copy the provider's **public HTTPS signup-page URL** (not an API key or private API endpoint).
3. Set `window.NEWSLETTER_SIGNUP_URL` in [newsletter-config.js](../config/newsletter-config.js).
4. Open [newsletter.html](./newsletter.html) and confirm its secure signup link appears and reaches the provider.

The page intentionally does not collect email addresses while this value is blank.

## Catch submissions

1. Create a hosted form with a provider such as Formspree or a configured Netlify Forms deployment.
2. Ensure the provider accepts HTTPS `multipart/form-data` and supports optional image uploads up to 8 MB.
3. Review its privacy, retention, spam-protection, and file-storage settings. Disable public file browsing if offered.
4. Set the provider's public HTTPS form endpoint in [catch-submission-config.js](../config/catch-submission-config.js). Never place a provider secret or API key in this file.
5. Test a submission using a non-sensitive sample and confirm the provider's confirmation and moderation workflow.

With the endpoint blank, the form stays hidden and the page explains that submissions are not collected. The page asks contributors to provide broad public areas only.

## Gear catalog and cart

The gear catalog and browser-only planning cart are not an online store. There is no checkout, live price, inventory, order collection, or payment processing. To sell products, integrate an established commerce platform with its own hosted checkout; do not make the current planning controls appear to accept payment.

## Local checks

Run `python3 tools/check-links.py` to check local references and link hygiene. Add `--external` to request a bounded online check of external links. The external check requires network access and can report temporary rate limits or provider outages.

Frontend diagnostics are written only to the browser console; they are not sent to an analytics or error-tracking service.
