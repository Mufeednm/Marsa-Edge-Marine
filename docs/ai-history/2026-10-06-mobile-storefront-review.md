# Mobile storefront improvements — 2026-10-06

## Request

Apply the customer-facing mobile fixes identified during the local storefront review: place the cart on the right, make product-page cart access consistent, improve pagination and horizontal rails, reduce fixed-element overlap, and address mobile image-loading concerns.

## Changes

- Right-align the phone cart control and add a matching cart drawer entry point to product-detail pages.
- Move the WhatsApp shortcut to the bottom-right on small screens and keep it clear of the main hero action area.
- Use concise mobile search placeholder text and show an expand/collapse chevron in the phone category menu.
- Make catalogue pagination compact on phones while preserving accessible labels.
- Recalculate horizontal rail controls after layout, image, and resize changes so users can use either the buttons or native swipe.
- Remove initial hero entrance delays, hide the secondary new-products panel on phones, and lazy-load product-card images below the initial view.

## Verification

- TypeScript check completed with no errors.
- Local storefront reviewed at phone and tablet viewport sizes: cart position, no horizontal overflow, product-detail cart access, pagination, and horizontal rail controls were checked.
