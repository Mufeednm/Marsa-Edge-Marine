# UAE delivery fee update — 2026-10-23

## Request

Increase the charge for delivery below the free-delivery threshold from AED 20 to AED 30.

## Change

- Retained free UAE delivery for orders of AED 700 or more.
- Changed the fee below AED 700 to AED 30.
- Added a single domain pricing function and used it in checkout, the Cash on Delivery order route, and the Stripe Checkout route.
- Corrected the outdated AED 500 free-delivery message in the administrator dashboard.

## Verification

- TypeScript, targeted lint, and formatting checks completed successfully.
- The production build was attempted with Webpack but is blocked in this environment because `next/font` cannot resolve `fonts.googleapis.com`; this is unrelated to the delivery-fee change.
