PRAGMA foreign_keys = ON;
CREATE TABLE pets (
 id TEXT PRIMARY KEY, source TEXT NOT NULL DEFAULT 'petstablished', external_pet_id TEXT NOT NULL,
 pet_name TEXT NOT NULL, adoption_date TEXT NOT NULL, adopter_name TEXT NOT NULL,
 adopter_email TEXT NOT NULL, verified INTEGER NOT NULL DEFAULT 0 CHECK(verified IN(0,1)),
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
 UNIQUE(source,external_pet_id)
);
CREATE TABLE suppressions(email TEXT PRIMARY KEY COLLATE NOCASE, reason TEXT NOT NULL);
CREATE TABLE anniversaries (
 id TEXT PRIMARY KEY, pet_id TEXT NOT NULL REFERENCES pets(id), anniversary_year INTEGER NOT NULL,
 anniversary_date TEXT NOT NULL, review_opens_on TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'needs_review' CHECK(status IN('needs_review','approved','ignored','removed','sent','failed')),
 subject TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', recipient TEXT NOT NULL DEFAULT '',
 approved_at TEXT, approved_by TEXT, sent_at TEXT, provider_message_id TEXT,
 revision INTEGER NOT NULL DEFAULT 0,
 UNIQUE(pet_id,anniversary_year),
 CHECK(status != 'sent' OR (sent_at IS NOT NULL AND provider_message_id IS NOT NULL))
);
CREATE TABLE audit_events (
 id INTEGER PRIMARY KEY, instance_id TEXT REFERENCES anniversaries(id), actor TEXT NOT NULL,
 action TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX anniversary_due ON anniversaries(status, anniversary_date);
