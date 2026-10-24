# Adoption Anniversary Manager: staging backend foundation

This is a **tested foundation, not a deployed or complete integration**. The existing public GitHub Pages prototype is unchanged. No adopter records, organization key, or credentials are included.

## Implemented
- Cloudflare Worker API and private D1 schema; fail-closed Cloudflare Access JWT verification with an explicit reviewer email allowlist.
- Three-day review preparation in America/New_York; stable per-pet/year IDs and unique constraints prevent duplicate instances, including repeated job runs.
- Save draft, approve exact subject/body/recipient, reopen, ignore current year, and remove future reminders. Drafts cannot change after approval without reopening; revision checks prevent overwrites.
- Transactional mutations and audit entries without message bodies or recipient addresses in audit logs.
- Suppression checks at review preparation and approval. A sent status requires provider evidence at the database level.
- February 29 records are held in non-leap years pending an explicit policy.

## Deliberately unavailable
Petstablished importing, provider delivery, review notification emails, unsubscribe/bounce webhook handling, template rendering, and frontend API wiring are **not implemented**. Their endpoints return a disabled response. Environment flags cannot turn on sending. Cron triggers are empty. Tests use fictional records in an in-memory database only.

The API currently lists at most 200 records; pagination must be added before importing a full history. Current routes are staging contracts, not a stable public API. No user roles beyond the explicitly allowed reviewer set are provided yet.

## Verify locally
Node 22.13+ is required; Node 24 was used for validation. No package install is required for these checks:

```
cd adoption-anniversary-manager/backend
npm test
npm run check
```

Tests exercise the SQL migration through Node SQLite using a small D1 adapter. They do not replace testing on Cloudflare's deployed D1/Workers runtime.

## Cloudflare deployment preparation (account access still required)
1. Create a **staging** D1 database named `tcc-adoption-manager-staging` and copy its actual ID into `wrangler.jsonc`. The placeholder intentionally prevents accidental deployment against a guessed database.
2. Using the official Wrangler CLI in an authenticated environment, apply migrations with `wrangler d1 migrations apply DB --remote` from this directory. Do not populate real records.
3. Configure a custom staging hostname and a Cloudflare Access application protecting every API path. Set an allow policy for the actual authorized TCC reviewers. Set Worker variables `ACCESS_ISSUER` (the team's HTTPS cloudflareaccess.com origin), `ACCESS_AUD` (the Access application audience), and `REVIEWER_EMAILS` (comma-separated exact reviewer addresses). Never use a bypass policy.
4. Deploy with `wrangler deploy`; configure the custom route on that Worker. `workers_dev` and preview URLs are disabled. No custom hostname or Access configuration is invented in this repo. `PREPARE_REVIEWS_ENABLED=false` and an empty cron list keep background work inactive.
5. Verify unauthorized traffic is denied; verify valid Access login and all review transitions against staging D1 with synthetic records. Configure the existing app for same-origin API access before UI integration. Cross-origin GitHub Pages requests are currently rejected.

Workers Builds can use this repository with root directory `adoption-anniversary-manager/backend`, but it cannot create the D1 database, choose the Access reviewers, or verify email ownership by itself. Account setup is still necessary; it is not just a one-click GitHub connection.

## Remaining activation gates
- Retrieve the actual PetCademy documentation and confirm field paths and pagination using an authorized, minimal test batch. Support has confirmed the adopted-pets endpoint, but this implementation has not called it or guessed adopter field mappings.
- Decide data retention, reviewer membership, and February 29 policy before importing real records.
- Implement the import adapter server-side; keep the organization key in a Worker secret, never in frontend code or public GitHub.
- Wire and test the existing UI without storing real records in localStorage.
- Select an email provider; verify TCC sender-domain ownership; build email previews, opt-outs, bounce suppression, review notifications, durable send claims and provider idempotency/reconciliation.
- Obtain approval for actual imports and controlled email tests, then explicit approval before enabling real scheduled delivery.

References: [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/), [Worker scheduled handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/), [Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).
