# Product description word limit

## Request

Allow administrators to enter product descriptions up to 800 words and start the local project.

## Change

- Replaced the former 280-character product-description validation with an 800-word limit for English and Arabic descriptions.
- Added live word counters to both admin description fields.
- Kept the server-side Zod validation as the authoritative limit.
- Added explicit removal controls for existing optional Image 2 and Image 3 gallery entries.

## Verification

- Started the local Next.js development server in Webpack mode and verified the storefront homepage returns HTTP 200 at `http://localhost:3000`.
