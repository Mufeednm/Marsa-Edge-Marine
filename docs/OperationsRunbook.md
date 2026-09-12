# Marsa Edge Marine — Website Access Sheet

Last reviewed: 12 September 2026

## Website

| Item | Detail |
| --- | --- |
| Website | Marsa Edge Marine |
| Live website | https://marsaedgemarine.ae |
| GitHub repository | https://github.com/Mufeednm/Thashreef-marine-uae |
| Live branch | `main` |

## Hostinger hosting

| Item | Detail |
| --- | --- |
| Panel | https://hpanel.hostinger.com |
| Plan | Business Web Hosting — 12 months |
| Hosting expires | 15 August 2028 |
| Current renewal quote | ₹9,189.84 total (shown 12 September 2026) |
| Included | 50 GB storage, 3 GB RAM, 2 CPU cores, unlimited bandwidth, daily backups |
| Login email | `marsaedgemarineadmin@gmail.com` |
| Password | Company password manager → `Marsa Edge Marine — Hostinger` |

## Domain

| Item | Detail |
| --- | --- |
| Domain | `marsaedgemarine.ae` |
| Status | Active; auto-renew enabled |
| Expires | 13 August 2027 |
| Current one-year renewal quote | ₹5,719 (shown 12 September 2026) |
| Nameservers | `lunar.dns-parking.com`, `solar.dns-parking.com` |

## Business email and OTP

| Item | Detail |
| --- | --- |
| Business mailbox | `sales@marsaedgemarine.ae` |
| Webmail | https://mail.hostinger.com/auth/login |
| Password | Company password manager → `Marsa Edge Marine — Sales SMTP` |
| Customer-facing sender name | Marsa Edge Marine |
| Used for | Customer sign-in OTPs, order emails, and Contact Us messages |

## Payments

| Item | Detail |
| --- | --- |
| Payment gateway | Stripe Checkout |
| Stripe dashboard | https://dashboard.stripe.com/acct_1U8xqLP6KblirbLO/test/dashboard |
| Testing | Stripe test mode; use Stripe test cards only |
| Successful test card | `4242 4242 4242 4242` — future expiry, any 3-digit CVC, valid postal code |
| Required Hostinger variables | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL` |
| Recommended variable | `STRIPE_WEBHOOK_SECRET` |
| N-Genius | Removed and inactive |

## Important environment variables

Set these only in **Hostinger → Environment variables** or the local `.env.local` file. Never put their values in GitHub or this document.

`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `AUTH_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`.

`NEXT_PUBLIC_APP_URL` for production: `https://marsaedgemarine.ae`

## Quick actions

- **Deploy an update:** Push the approved code to `main`, then confirm the deployment is **Completed** and **Current** in Hostinger.
- **Test Stripe locally:** keep Stripe test keys in `.env.local`; do not use real cards.
- **Go live with payments:** replace Stripe test keys with Stripe live keys and make a small real payment/refund test.
- **Security:** passwords, API keys, database credentials, and email passwords belong in the company password manager only. If a credential has been shared in chat, rotate it.
