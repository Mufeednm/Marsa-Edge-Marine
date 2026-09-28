# Customer catalogue pagination — 2026-09-28

## Request

Make every product in a category available locally instead of stopping after the first 15 cards.

## Implementation

- Kept the catalogue's compact 15-card grid but added customer-facing pagination beneath it.
- Added a clear “Showing X–Y of Z products” status, previous/next controls, and numbered pages that condense gracefully for larger catalogues.
- Added keyboard focus states, descriptive control labels, and the current-page state for assistive technology.
- Reset pagination to page one when a customer changes the category, search query, or sorting preference.

## Verification

- TypeScript type check completed successfully.
- The local storefront is tested with the imported 116-product catalogue, including category pagination and the next-page interaction.

## Follow-up: cart item state

- Replaced the “In cart (1) · Add another” state on product cards and product-detail pages with “Added to cart”.
- Disabled repeat product-add buttons once an item exists in the cart, including the hero product cards.
- Kept all quantity changes in the cart drawer and made the product-detail status point customers there.

## Follow-up: selected category visibility

- Narrowed the catalogue category controls to the selected main category and its available subcategories.
- Marked selected main categories and subcategories with the storefront blue in desktop navigation, mobile navigation, and catalogue controls.
- Reopen the mobile category menu with the relevant main category expanded when a subcategory is selected.

## Follow-up: product gallery navigation

- Added touch swipe gestures and visible previous/next controls for product pages with multiple uploaded images.
- Kept thumbnails and an accessible image-position status so image navigation is clear without relying on swipe alone.

## Follow-up: desktop category menu pointer travel

- Removed the visual/pointer gap between a main category and its portal-rendered submenu.
- Extended the submenu close grace period so a customer can move naturally into a subcategory without the menu disappearing.
