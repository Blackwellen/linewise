# Linewise website

The sales site for the Linewise e-book **How to Make Viral Stickman Shorts** (£19.99). It runs on Next.js 16 (App Router) and deploys to Vercel. Payment goes through our own Stripe Checkout, and the PDFs are delivered from a private Cloudflare R2 bucket through short-lived presigned URLs.

> Status (18 November 2026): built and tested **locally only**. Stripe is in **TEST mode**. Nothing has been deployed or pushed.

## Pages

| Route | What it is | Rendering |
|---|---|---|
| `/` | Sales page: hero, film loop, problem and promise, research proof, chapters and page previews, who it's for and not for, free sample (optional email), pricing, FAQ, final CTA, and a sticky buy bar on phones | Static |
| `/checkout` | Our branded checkout. It has two required ticks: the terms, and the UK digital-content waiver (CCR 2013). It then hands off to Stripe Checkout | Dynamic (`noindex`) |
| `/success?session_id=` | Verifies the Stripe session is paid, then shows the download buttons | Dynamic (`noindex`, `no-store`) |
| `/download?t=` | Re-download page from the receipt email. Works for 30 days and up to 15 downloads | Dynamic (`noindex`, `no-store`) |
| `/advertise` | Media kit for brands. **The reach stats are marked as placeholders** | Static |
| `/terms`, `/refunds`, `/privacy`, `/cookies` | Terms of Sale, Refund policy, Privacy Policy (UK GDPR) and Cookie notice | Static |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image.jpg`, `/icon.png`, `/apple-icon.png`, `/favicon.ico` | SEO and app icons | Static |
| 404 | Branded "This step is missing" page | Static |

The API routes are `POST /api/checkout`, `POST /api/webhook`, `GET /api/download` and `POST /api/sample`.

The company details (Blackwellen Ltd, company number 16482166, registered office 61 Bridge Street, Kington HR5 3DJ, VAT GB 508480488) were copied exactly from the existing Gigvora legal pages. They live in `lib/site.ts`.

## How a sale works

1. `/checkout`: the buyer ticks both boxes. `POST /api/checkout` refuses the request unless both are true, and it only accepts same-origin requests.
2. The API creates a Stripe Checkout Session. It uses the £19.99 **tax-inclusive** price, **Stripe Tax** (`automatic_tax`), a required billing address (for VAT evidence), an invoice with the waiver in its footer, `en-GB` locale and Linewise branding. The consent wording, its version and the time it was given are stored in the session and PaymentIntent metadata. The submit text on Stripe's page repeats the waiver.
3. The buyer pays on Stripe and comes back to `/success?session_id=…`. The server fetches the session from Stripe. Download buttons only appear if the session is `paid`, the PaymentIntent has `succeeded`, the charge is neither refunded nor disputed, and the session belongs to this product.
4. Each download button calls `/api/download?t=<order token>&f=book|bonus`. The token is an HMAC (`DOWNLOAD_TOKEN_SECRET`) over the session id and an expiry 30 days out. On every click the route:
   - re-checks the order with Stripe;
   - enforces the 15-download limit;
   - **creates a fresh presigned R2 GET URL** (default 10 minutes, `DOWNLOAD_URL_TTL_SECONDS`);
   - counts the download on the PaymentIntent (`downloads_used`, `first_download_at`, which is the moment the cancellation waiver takes effect);
   - then redirects with a 303.
5. The webhook (`checkout.session.completed` / `async_payment_succeeded`) records the order on the PaymentIntent (`order_recorded_at`, `order_ref`). If Resend is configured it also emails the `/download?t=…` link. It is idempotent, so Stripe retries are safe.

**There is no database.** Stripe holds the order records, the consent record and the download counts, so the R2 key only needs **Object Read**.

## Run locally

Before installing dependencies, check that the C: drive has at least 2 GB free. The PC is low on memory, so run one build at a time.

```bash
npm install
cp .env.example .env.local        # then fill in TEST values (see Env vars)
node scripts/stripe-setup.mjs     # TEST mode: creates the product and £19.99 tax-inclusive price, checks Stripe Tax, writes STRIPE_PRICE_ID
npx next build && npx next start  # http://localhost:3000
stripe listen --api-key "$STRIPE_SECRET_KEY" --forward-to localhost:3000/api/webhook \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded,charge.dispute.created
# `stripe listen --print-secret` prints the whsec_ value to put in STRIPE_WEBHOOK_SECRET
```

The scripts are:

- `python scripts/build_assets.py`: rebuilds every web asset from the e-book design source. It produces:
  - subset WOFF2 fonts;
  - the logo lock-up, favicons and OG image;
  - the transparent 3D book render (headless Chrome rendering of `scripts/book-transparent.html`);
  - film stills, page previews and the free sample PDF;
  - the film loop (MP4 and WebM);
  - `private/`, which holds the paid PDFs for the R2 upload and is gitignored.

  Set `LINEWISE_SRC` to the `stickman` folder.
- `node scripts/e2e-checkout.mjs`: the full Stripe TEST checkout → webhook → success → download test. Results go to `screenshots/e2e/results.json`.
- `node scripts/screenshots.mjs` and `python scripts/overview.py`: per-page screenshots (desktop and phone) plus `screenshots/overview.jpg`.
- `bash scripts/lighthouse.sh`: Lighthouse on the main pages. Results go to `docs/lighthouse/`.

## Env vars (names only; set them in Vercel, never commit values)

| Name | Needed | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | The final domain, used for canonical, OG, sitemap and Stripe return URLs |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | Defaults to `info@blackwellen.com` |
| `STRIPE_SECRET_KEY` | yes | TEST key now. A live key is **refused** unless `STRIPE_ALLOW_LIVE=true` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | no | Not used by hosted Checkout; kept for the future |
| `STRIPE_WEBHOOK_SECRET` | yes | From the Stripe webhook endpoint (or `stripe listen` locally) |
| `STRIPE_PRICE_ID` | yes | From `scripts/stripe-setup.mjs` (lookup key `linewise_ebook_gbp_1999`) |
| `STRIPE_AUTOMATIC_TAX` | yes | `true` once Stripe Tax is active |
| `STRIPE_ALLOW_LIVE` | at go-live | `true` only when the owner approves live payments |
| `DOWNLOAD_TOKEN_SECRET` | yes | 32+ random characters |
| `DOWNLOAD_LINK_DAYS`, `DOWNLOAD_MAX`, `DOWNLOAD_URL_TTL_SECONDS` | no | Defaults are 30, 15 and 600 |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | yes | The bucket is `linewise-products`; the key has Object Read on that bucket only |
| `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_AUDIENCE_ID` | optional | Download email and free-sample list |

## Cloudflare R2 (private delivery)

- The bucket **`linewise-products`** (WEUR) was created through the Cloudflare API on 18 November 2026. It has no public access: r2.dev is disabled and there is no custom domain.
- These objects are uploaded:
  - `v1/linewise-how-to-make-viral-stickman-shorts.pdf` (4.1 MB)
  - `v1/linewise-bonus-pack-templates.pdf` (386 KB)
- Unsigned requests are denied. The S3 endpoint returns **HTTP 400** and the r2.dev URL returns **HTTP 401**.
- The paid PDFs are **never** in `public/`. Only the free 3-page sample is public.

### Owner action: create the S3 API key (not possible from here)

The ops Cloudflare token can manage buckets but **cannot create API tokens** (Cloudflare error 9109, "Unauthorized to access requested resource"). We did not work around this. To create the key:

1. Go to Cloudflare dashboard → **R2 Object Storage** → **Manage R2 API Tokens** (or "API tokens" on the R2 overview) → **Create API token**.
2. Fill it in:
   - Name: `linewise-products-delivery`.
   - Permissions: **Object Read only**.
   - **Specify bucket(s): `linewise-products` only**.
   - TTL: forever, or your rotation policy.
3. Choose **Create**. Copy the **Access Key ID** and **Secret Access Key** (they are shown once) into Vercel as `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`. Also set `R2_ACCOUNT_ID` (the Cloudflare account id) and `R2_BUCKET=linewise-products`. For a local test, add the same four values to `.env.local`.
4. Run `node scripts/e2e-checkout.mjs`. The download, unsigned-URL and tampered-URL checks will then run against R2.

## Deploy (when the owner says so; not done)

1. Create a Vercel project from this folder. The framework is auto-detected as Next.js and the Node runtime is used for the API routes.
2. Add the env vars above (Production plus Preview) and set the domain. Set `NEXT_PUBLIC_SITE_URL` to it.
3. In the Stripe dashboard, add a webhook endpoint `https://<domain>/api/webhook` with these events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded` and `charge.dispute.created`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Deploy, then run a TEST purchase on the preview URL.

### Go-live checklist (owner)

- **Stripe live:**
  - Set the live keys in Vercel and `STRIPE_ALLOW_LIVE=true`.
  - Run `STRIPE_ALLOW_LIVE=true node scripts/stripe-setup.mjs` with the live key to create the live product and price, then set `STRIPE_PRICE_ID`.
  - Add the live webhook endpoint.
  - Set the account's public business name and statement descriptor. The test account currently shows "Linewise sandbox".
- **Stripe Tax live:**
  - Add the head office and the GB registration.
  - Add the EU OSS (Ireland) registration so EU consumers are charged their VAT, the same as Gigvora.
  - Note: Stripe charges UK e-books at **0%** (zero-rated, tax code `txcd_10302000`). The test purchase showed tax = £0 for a UK address.
  - Please confirm with the accountant that the bonus templates PDF can ship under the e-book tax code.
- **Domain:** choose it, point it to Vercel and set `NEXT_PUBLIC_SITE_URL`.
- **R2:** create the S3 key (see above).
- **Resend (optional):**
  - Verify the sending domain.
  - Set `RESEND_API_KEY` and `RESEND_FROM` (for example `Linewise <books@domain>`).
  - Optionally create an audience for the free-sample list and set `RESEND_AUDIENCE_ID`.
  - Without Resend, buyers get Stripe's receipt and the success page, which tells them to bookmark it.
- **Review:**
  - The legal pages (they are written for this product).
  - The Advertise brand-safety list and packages.
  - The placeholder reach stats: replace them with real figures before outreach.

## Quality notes

- **Design:** uses the e-book design system: near-black `#07090d`, cyan `#3dd6ff`, Anton for display, Barlow for text, Barlow SC for kickers, cyan dash bullets, outlined chapter numbers, the real logo lock-up, real page renders and our own film stills and loop. For the research that drove the layout, see `docs/RESEARCH.md`.
- **SEO:**
  - Semantic HTML, a unique title, description and canonical on every page.
  - OG and Twitter cards.
  - JSON-LD for Organization, Product + Book with Offer, and FAQPage.
  - `sitemap.xml` and `robots.txt`; order pages are `noindex`.
- **Cookies:** none are set by the site and there are no analytics, so no consent banner is needed. See `/cookies`.
- **Security:**
  - HSTS, nosniff, frame DENY and a referrer policy.
  - Order pages are `no-store` and `no-referrer`.
  - Same-origin check on checkout, plus a webhook signature check.
  - Live keys are refused by default and secrets are never committed (`.env*` is gitignored).
- **Lighthouse:** see `docs/lighthouse/SUMMARY.txt`. `/checkout` scores lower on SEO because it is deliberately `noindex`.
