# Adoption Anniversary Manager — backend implementation contract

Status: implementation plan, not a deployed backend. The existing GitHub Pages UI remains a demonstration; its browser-local data is not shared, and it does not send email.

## Confirmed requirements
- TCC sender and reply-to: adopt@thecatconnection.org (verify sending-domain ownership before activation).
- Adoption manager reviews each anniversary 3 days before the anniversary date.
- Reviewer may personalize subject, body, and note; approve “Send on Anniversary”; ignore this year; or remove future reminders.
- Approved message is immutable for sending unless explicitly reopened; approval is not delivery.
- Petstablished is the source for pet ID, pet name, adoption date, adopter contact ID/name/email. The working V2 pets and contact reports endpoints do not yet establish the pet-to-adopter relationship. Do not guess or join by name.
- API key and adopter PII must not be committed to this public GitHub Pages repository.

## Proposed data model (server-side, private)
**pets**: source='petstablished', external_pet_id (unique with source), pet_name, adoption_date (date, nullable until verified), adopter_external_id (nullable), adopter_name, adopter_email, source_updated_at, imported_at, active.

**anniversary_instances**: id, pet_id, anniversary_year, anniversary_date, review_opens_on, status (needs_review | approved | ignored | sent | failed | removed), approved_subject, approved_body, approved_to, approved_at, approved_by, sent_at, provider_message_id, error, created_at, updated_at. UNIQUE(pet_id, anniversary_year).

**audit_events**: id, anniversary_instance_id, actor, action, timestamp, metadata (no full email body in logs).

**settings**: sender, reply_to, default_subject, default_body, review_lead_days=3, timezone='America/New_York', sending_enabled=false.

Use foreign keys, encrypted storage, and role-based access. Define retention and deletion policy before importing real adopter data.

## State transitions
- Import/upsert pets by (source, external_pet_id), never by name; preserve existing approved messages and prior anniversary history.
- Create one anniversary instance per eligible pet per calendar anniversary year. Handle Feb 29 adoptions by an explicitly chosen TCC policy before enabling automation.
- Eligible: verified adoption date, verified adopter linkage and email, active pet, not permanently removed. No automatic sending if any field is missing.
- At review_lead_days before anniversary: needs_review. Deliver one review notification to the adoption manager via the backend; retry notification safely without duplicates.
- Reviewer approval: save *exact* rendered subject, HTML/text body and recipient in the instance, status=approved. An approval after the anniversary date must not trigger an automatic late send; require manual resolution.
- Ignore: suppress only the current year's instance; next year can be created normally.
- Remove: mark pet inactive for all future anniversary reminders, preserving audit history.
- At anniversary date in America/New_York: backend scheduler sends only approved, unsent, eligible instances. Use an atomic claim/lock and idempotency key based on anniversary instance ID; prevent duplicate sends on retries.
- Email provider acceptance => mark sent and store provider ID; rejected/failed => failed with retry policy and alert. Never display “Sent” merely because a reviewer clicked Approve.
- Unsubscribe/opt-out and bounce suppression must override approval and prevent sending. Provide clear opt-out mechanism in email.

## Proposed private API (authenticated)
GET /api/anniversaries?status=needs_review
GET /api/anniversaries/:id
PATCH /api/anniversaries/:id/draft
POST /api/anniversaries/:id/approve
POST /api/anniversaries/:id/ignore
POST /api/pets/:id/remove
POST /api/anniversaries/:id/reopen
GET /api/settings
PATCH /api/settings
POST /api/email/test (restricted; enabled only after sender verification)
POST /api/import/petstablished (server-side only; no secrets in browser)
POST /internal/jobs/prepare-reviews
POST /internal/jobs/send-approved (scheduler authenticated)

## Email template
Brand with approved TCC logo, red/black styling, accessible HTML and plain-text alternative. Escape all imported fields in HTML. Include adopter first name, cat name, adoption date, anniversary date, and optional personal note. Test both with sample data and verify mobile rendering. No live sends until TCC approves final copy and domain setup.

## Next implementation gates
1. Choose backend/database and email service; establish private hosting and access permissions.
2. Build authenticated API, durable database, jobs, audit log, and email previews with *synthetic data*.
3. Verify sender domain and configure deliverability, unsubscribe and bounce handling.
4. Get Petstablished's verified relationship/date endpoint; import a small authorized test batch; check data quality and duplicate prevention.
5. Run end-to-end tests with a controlled recipient, then explicitly enable sending.

## Safety rules
No real adopter emails, API keys, or private adoption records in GitHub Pages, localStorage, screenshots, or the public repo. GitHub Pages alone cannot run a private scheduler or protect credentials. Prototype status labels must clearly distinguish “Approved (demo)” from “Sent by provider.”
