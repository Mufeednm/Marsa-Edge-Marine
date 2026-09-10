# 2026-09-10 — Restore Stripe Checkout

## Request

Replace N-Genius with the historical Stripe payment gateway implementation.

## Changes

- Restored Stripe Checkout session creation, verified return handling, and signed webhook completion from the earlier Stripe implementation in Git history.
- Preserved current checkout validation, customer order emails, and the updated customer interface while changing the active card method to Stripe.
- Added a safe MySQL schema migration for `stripe_checkout_session_id`; legacy N-Genius data is retained but no active N-Genius route or environment setting remains.
- Replaced N-Genius environment documentation with Stripe test-key and webhook instructions. No credentials were committed.

## Verification

- Installed the Stripe SDK.
- Passed ESLint and strict TypeScript checks with Node.js 22.
- Passed the webpack production build with Node.js 22.
- Restarted the local Next.js app at `http://127.0.0.1:3000` and confirmed the storefront returns HTTP 200.
