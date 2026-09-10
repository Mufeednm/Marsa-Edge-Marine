# Local development setup

Read this guide before starting the application locally. It records the project-specific setup that is not stored in source control.

## Required software

- Node.js 22 LTS or a supported LTS release
- MySQL 8 with phpMyAdmin (or another MySQL client)

## Database

The existing local database is named `akbar_ecommerce`. The current local MySQL setup uses:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=akbar_ecommerce
DB_USER=root
DB_PASSWORD=
DB_SSL=false
```

The empty password is intentional for this local root-account setup. Use a dedicated least-privilege account in production.

## Environment file

1. Copy `.env.example` to `.env.local`.
2. Keep `.env.local` private; it is ignored by Git.
3. Enter SMTP values if you need customer registration, customer sign-in, order emails, or Contact Us email delivery.

Customer authentication uses a six-digit code sent by email. Therefore, leaving SMTP unset makes registration and customer sign-in fail with “We could not send the verification email.” This is expected, not a database issue.

Required SMTP variables:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-mailbox@example.com
SMTP_PASSWORD=your-mailbox-password-or-app-password
SMTP_FROM=your-mailbox@example.com
```

Never commit or paste real SMTP credentials into source code, documentation, or chat.

## Stripe test payments

Card checkout uses Stripe Checkout. Add a Stripe **test-mode** secret key to your private `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_private_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

For production, create a Stripe webhook for `checkout.session.completed` and `checkout.session.async_payment_succeeded` at `https://your-public-domain/api/payments/stripe/webhook`, then put its signing secret in the deployment secret manager. The local server is not publicly reachable, so use the Stripe CLI to forward test webhooks locally when needed. The success page independently verifies the Checkout Session; the webhook ensures a paid order is updated even if the customer closes the Stripe page.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`.

If the page says `Invalid server environment`, verify the database variables above. If registration shows an email-delivery error, verify all five SMTP variables and your provider’s host, port, and password requirements.

## Local media

The database may reference uploaded product, brand, and category images that are not present in a new worktree. Those requests can return 404 locally; the storefront now shows the marine fallback image for product images instead of a broken image.
