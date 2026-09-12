# Marsa Edge Marine — Website Operations Runbook

Last reviewed: 12 September 2026

This is the day-to-day handover document for the Marsa Edge Marine e-commerce website. It deliberately contains no passwords, API keys, database passwords, SMTP passwords, or webhook secrets. Keep those only in the company's password manager and in Hostinger's encrypted environment-variable screen.

## 1. Website at a glance

| Item | Value |
| --- | --- |
| Business / website name | Marsa Edge Marine |
| Public website | https://marsaedgemarine.ae |
| Hosting provider | Hostinger Web Apps (Next.js, Node.js 22) |
| Source control | GitHub |
| Repository | https://github.com/Mufeednm/Thashreef-marine-uae |
| Live branch | `main` |
| Application framework | Next.js 16, React 19, TypeScript |
| Database | MySQL via Sequelize |
| Card payments | Stripe Checkout |
| Customer sign-in | Six-digit email OTP |

## 2. Hosting plan and domain registration

Both the web application hosting and the `marsaedgemarine.ae` domain are managed in the Hostinger account. Keep the hosting renewal and the domain renewal as separate calendar reminders because they expire on different dates.

### Web application hosting

| Item | Current detail |
| --- | --- |
| Product | Hostinger Business Web Hosting |
| Renewal term selected | 12 months |
| Current hosting expiry shown by Hostinger | 15 August 2028 |
| Renewal quote shown on 12 September 2026 | ₹649.00/month (discounted; advertised rate ₹699.00/month) |
| Renewal subtotal | ₹7,788.00 |
| Taxes and fees shown | ₹1,401.84 |
| Renewal total shown | ₹9,189.84 |
| Storage | 50 GB |
| RAM | 3,072 MB |
| CPU cores | 2 |
| Bandwidth | Unlimited |
| Backups | Daily |
| Server | `server1128`, Asia (India) |

The amounts above are the renewal quote visible on 12 September 2026. They can change with Hostinger pricing, tax, coupon, or selected add-ons. Check the renewal invoice before paying. Do not select optional add-ons unless they are intentionally required.

### Domain registration and DNS

| Item | Current detail |
| --- | --- |
| Domain | `marsaedgemarine.ae` |
| Registrar | Hostinger |
| Status | Active |
| Current domain expiry shown by Hostinger | 13 August 2027 |
| Auto-renewal | Enabled |
| Current one-year renewal quote shown on 12 September 2026 | ₹5,719.00/year |
| Nameserver 1 | `lunar.dns-parking.com` |
| Nameserver 2 | `solar.dns-parking.com` |
| Website IP | `193.203.185.189` |

Before changing nameservers or DNS records, take a screenshot/export of the existing DNS zone. DNS changes can interrupt the website, business email, Stripe return links, and OTP delivery.

### Renewal reminders

- Review the **domain** renewal at least 30 days before **13 July 2027**.
- Review the **hosting** renewal at least 30 days before **15 July 2028**.
- Confirm that the Hostinger card/payment method is valid before the renewal dates.
- After any renewal, update the dates and quoted amounts in this document.

## 3. Access and credentials

Do **not** place passwords in this file, GitHub issues, email, WhatsApp, or source code. Record them in the company password manager under the labels below.

| System | Sign-in page | Store this in the password manager |
| --- | --- | --- |
| Hostinger | https://hpanel.hostinger.com | Hostinger account email and password |
| GitHub | https://github.com/Mufeednm/Thashreef-marine-uae | GitHub account and any personal access token |
| Stripe test dashboard | https://dashboard.stripe.com/acct_1U8xqLP6KblirbLO/test/dashboard | Stripe dashboard account and test secret key |
| Business mailbox | Hostinger Email / webmail | Sales mailbox password or app password |

Recommended password-manager record names:

- `Marsa Edge Marine — Hostinger`
- `Marsa Edge Marine — GitHub deployment`
- `Marsa Edge Marine — Stripe test`
- `Marsa Edge Marine — Sales SMTP`

If a password has ever been sent in chat, change it and update the password-manager entry.

## 4. Hosting and deployment

Hostinger is connected to the GitHub repository and deploys pushes to `main`.

1. Work on a branch and run checks locally.
2. Push the approved commit to `main`.
3. In Hostinger, open **Websites → marsaedgemarine.ae → Deployments**.
4. Confirm the newest commit is marked **Completed** and **Current**.
5. Open the public website and test the changed customer journey.

The persistent catalogue upload directory must remain outside the application deployment directory. `CATALOG_UPLOADS_DIRECTORY` can override its location. This prevents product, brand, and category uploads from disappearing after a Git deployment.

## 5. Email and customer OTP

Customer registration and sign-in use a six-digit OTP emailed from the sales mailbox. Order emails and Contact Us enquiries use the same SMTP configuration.

Customers see the branded sender name:

```text
Marsa Edge Marine <sales mailbox>
```

The actual sales mailbox is still the SMTP-authenticated sending address and receives Contact Us messages.

Required production variables:

```env
SMTP_HOST=<mail server hostname>
SMTP_PORT=587
SMTP_USER=<sales mailbox address>
SMTP_PASSWORD=<mailbox password or app password>
SMTP_FROM=<same verified sales mailbox address>
```

If OTP delivery fails, verify all five variables together, then check the mailbox provider's SMTP/app-password policy, SPF, and DKIM setup. Never use a personal mailbox for production sending.

## 6. Stripe payment gateway

The active gateway is **Stripe Checkout**. N-Genius has been removed from the active application and Hostinger environment.

### Required live test-mode variables

```env
STRIPE_SECRET_KEY=sk_test_<private key from Stripe test mode>
NEXT_PUBLIC_APP_URL=https://marsaedgemarine.ae
```

For reliable payment completion when a customer closes Stripe before returning, configure a Stripe webhook:

```env
STRIPE_WEBHOOK_SECRET=whsec_<private signing secret>
```

Create the webhook in Stripe test mode for:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Webhook endpoint:

```text
https://marsaedgemarine.ae/api/payments/stripe/webhook
```

Use Stripe test cards only while `STRIPE_SECRET_KEY` starts with `sk_test_`. A common successful test card is `4242 4242 4242 4242`, with a future expiry date, any three-digit CVC, and a valid postal code. Do not use real cards in test mode.

Before accepting real customer payments, replace the test secret key and webhook secret with Stripe **live-mode** values and perform a small real payment/refund test.

## 7. Complete environment-variable reference

Set production values in **Hostinger → Websites → marsaedgemarine.ae → Environment variables**. Do not commit them to Git.

| Variable | Required | Purpose | Production guidance |
| --- | --- | --- | --- |
| `DB_HOST` | Yes | MySQL server hostname | Hostinger database host |
| `DB_PORT` | Yes | MySQL port | Usually `3306` |
| `DB_NAME` | Yes | MySQL database name | Use the production database |
| `DB_USER` | Yes | MySQL username | Dedicated least-privilege account preferred |
| `DB_PASSWORD` | Yes | MySQL password | Store only in Hostinger and password manager |
| `DB_SSL` | Yes | Enables MySQL TLS | Use `true` only when the database requires SSL; otherwise `false` |
| `NEXT_PUBLIC_APP_URL` | Strongly recommended | Public base URL, metadata, Stripe return URL | `https://marsaedgemarine.ae` |
| `AUTH_SECRET` | Yes in production | Signs customer session cookies | Long, unique random secret |
| `SMTP_HOST` | Yes for email | SMTP host | Mail provider hostname |
| `SMTP_PORT` | Yes for email | SMTP port | Usually `587`; use `465` only when required |
| `SMTP_USER` | Yes for email | SMTP login | Verified sales mailbox |
| `SMTP_PASSWORD` | Yes for email | SMTP credential | Use an app password where available |
| `SMTP_FROM` | Yes for email | From mailbox address | Same verified sales mailbox |
| `STRIPE_SECRET_KEY` | Yes for card checkout | Server-side Stripe API key | `sk_test_...` during testing, `sk_live_...` at launch |
| `STRIPE_WEBHOOK_SECRET` | Recommended | Verifies Stripe webhook signatures | `whsec_...` from the matching Stripe webhook |
| `CATALOG_UPLOADS_DIRECTORY` | Optional | Persistent product/brand/category image directory | A directory outside the deployment folder |
| `SEED_DEMO_DATA` | Optional | Seeds demo data | Keep `false` or unset in production |

## 8. Local development

The private local environment file is:

```text
.env.local
```

It is ignored by Git. Start from `.env.example`, then use the local MySQL convention documented in [LocalDevelopment.md](LocalDevelopment.md).

Commands:

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Open http://127.0.0.1:3000 locally. Keep `NEXT_PUBLIC_APP_URL` on the same host used for local Stripe return testing.

## 9. Routine verification checklist

After a deployment, verify:

- Home and product pages load.
- A new customer can request and receive an email OTP.
- Add to cart and checkout work.
- Cash on Delivery creates an order.
- Stripe test checkout opens when Stripe test credentials are configured.
- A successful Stripe payment returns to the public success page and the order becomes paid.
- Admin Orders clearly distinguishes `Paid`, `Pending`, `Failed`, and `Not required`.
- Admin acceptance/rejection sends the correct order-status email.
- Product images still load after deployment.

## 10. Incident quick guide

| Symptom | First checks |
| --- | --- |
| OTP email not sent | All SMTP variables, mailbox app password, SMTP port, SPF/DKIM |
| Card checkout will not start | `STRIPE_SECRET_KEY`, deployment status, Stripe dashboard test/live mode |
| Stripe return goes to wrong address | `NEXT_PUBLIC_APP_URL` must be the public HTTPS domain |
| Paid order remains pending | Stripe webhook endpoint/events/secret, then server runtime logs |
| Product images are missing after deploy | `CATALOG_UPLOADS_DIRECTORY` and persistent storage path |
| Website deployment fails | Hostinger deployment logs, Node 22 setting, database environment variables |

## 11. Security rules

- Never commit `.env.local`, passwords, Stripe keys, webhook secrets, database passwords, or SMTP passwords.
- Do not expose secrets in screenshots, chat, support tickets, or documentation.
- Rotate any credential that has been shared outside the password manager.
- Use separate Stripe test and live keys; never test with a live key.
- Change `AUTH_SECRET` only with a planned session reset, because existing customer sessions will be invalidated.
