# 2026-09-15 — Customer-facing order numbers

## Request

Replace customer-visible internal order IDs with one professional, stable format such as `Order #10019`, without changing internal order IDs.

## Changes

- Added `orders.customer_order_number` and a one-row MySQL sequence table.
- Backfilled existing orders to `10000 + id`, added a unique key, and safely initializes the next sequence value from the highest stored customer number.
- Allocated new customer order numbers under a row lock in the same transaction that creates the order.
- Kept internal IDs for relations, authorization, routes, and Stripe Checkout metadata.
- Updated checkout confirmations, customer account orders, administrator pages, status emails, parcel labels, and PDF order details to show the customer reference.

## Verification

- Run linting, TypeScript checking, and a production build after implementation.
- Confirm a newly created order receives one stable number across its confirmation, My Orders, Admin Orders, email, label, and PDF output.
