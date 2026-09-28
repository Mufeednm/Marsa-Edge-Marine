# Hostinger Webpack build fallback — 2026-09-28

## Issue

Hostinger's deployment of commit `a6a30af` failed while running `next build` through Turbopack. The log reported a Turbopack internal error while processing `src/app/globals.css`; its worker process exited before it could connect.

## Resolution

The production `build` script now uses `next build --webpack`. The same command had already compiled the application successfully in local production verification, and it avoids the Hostinger-specific Turbopack process failure.

## Data safety

This is a build-command-only release. It does not run a migration, import, seed, truncate, or upload operation.
