# SAARTHI / UdyamSetu — SIH26092

AI-driven scheme-matching platform connecting SC beneficiaries (family income ≤ ₹5.00 Lakh) with NSFDC concessional loans via Channel Partners (SCAs / PSBs / RRBs / NBFC-MFIs).

## Quick start

```bash
npm install
npm run server        # Express API on http://localhost:5001 (serves dist/ too)
npm run dev           # Vite frontend on http://localhost:3000 (proxies /api -> :5001)
```

## The /api/v2 data pipeline: ingest → geocode → promote

Nothing on the live map or in the recommender is published automatically. Every
number flows through a zero-hallucination pipeline with a human gate:

```
OFFICIAL SOURCES            EXTRACTION                 HUMAN GATE            LIVE
┌─────────────────┐   ┌────────────────────┐   ┌──────────────────┐   ┌─────────────┐
│ NSFDC PDF       │   │ 1 FETCH (+fixture) │   │                  │   │ schemes     │
│ MoSJE pages     │──▶│ 2 HASH  sha256     │──▶│ Nodal Officer    │──▶│ partners    │
│ SCA directory   │   │ 3 EXTRACT parsers  │   │ reviews diff +   │   │ recommender │
└─────────────────┘   │ 4 GATE  conf≥0.75  │   │ verbatim quotes  │   └─────────────┘
                      │    + quote required│   │ APPROVE/REJECT   │
                      └────────────────────┘   └──────────────────┘
```

Three lanes run through this pipeline:

| Lane | What flows | Staging table | Published to |
|---|---|---|---|
| **Policy ingest** | Scheme parameters (rates, caps, tenures) | `policy_reviews` | `schemes` (+ immutable `scheme_versions`) |
| **Directory ingest** | SCA/RRB/PSB partner rows | `scraped_partners` | `channel_partners` (the live map) |
| **Passports** | Saved beneficiary journeys | — | `beneficiary_passports` |

### Lane 1 — Policy ingest

```bash
npm run ingest            # live fetch with fixture fallback
npm run ingest:offline    # fixtures only (demo-safe)
```

Per source: fetch (30s timeout, polite UA) → sha256 of *normalized extracted
text* (byte-stable) → skip if unchanged → extract with quote-anchored parsers →
zero-hallucination gate (field dropped unless confidence ≥ 0.75 **and** a
verbatim quote exists) → diff vs live policy → `PENDING` row in
`policy_reviews`. Publication happens **only** when an officer clicks Approve
(Admin Studio, Module 4), which bumps `policy_version` to `NSFDC-2026.02` and
writes an immutable snapshot to `scheme_versions`.

### Lane 2 — Directory ingest (geocode → promote)

```bash
npm run ingest:offline    # scrape directory into scraped_partners staging
npm run geocode           # Nominatim, max 1 req/s (politeness policy)
npm run geocode:offline   # deterministic jitter around Lucknow (demo-safe)
```

Staging row lifecycle: `PENDING_GEOCODE → GEOCODED | GEOCODED_OFFLINE |
LOW_CONFIDENCE | MANUAL_REVIEW → PROMOTED`. Promotion is a HITL action — from
the Admin Studio "Directory Ingest" panel (one-by-one Promote/Discard buttons)
or in bulk:

```bash
# single
curl -X POST localhost:5001/api/v2/admin/scraped-partners/51/promote \
  -H "Content-Type: application/json" -d '{"officerName":"JS Desk"}'

# batch — by ids or filters
curl -X POST localhost:5001/api/v2/admin/scraped-partners/batch-promote \
  -H "Content-Type: application/json" \
  -d '{"filters":{"section":"SCA","state":"Uttar Pradesh","minConfidence":0.3}}'
```

Promoted rows enter `channel_partners` with directory facts verbatim from the
MoSJE list, geocoder coordinates, and **neutral-safe placeholder telemetry
flagged `health_data_source='SIMULATED_DEMO'`** — per-branch NPA is not
regulatorily published, and the UI says so (Honest Map disclaimers).

### In-process pipeline triggers (single-writer rule)

sql.js keeps the whole database in memory **per process** and flushes to disk
every 30s. If you run `npm run ingest` / `npm run geocode` while the API server
is running, the server's next flush silently overwrites the script's writes.
Therefore: **either stop the server before using the CLIs, or trigger the same
logic in-process:**

```bash
curl -X POST localhost:5001/api/v2/admin/ingest/run      -H "Content-Type: application/json" -d '{"offline":true}'
curl -X POST localhost:5001/api/v2/admin/ingest/geocode  -H "Content-Type: application/json" -d '{"offline":true}'
curl localhost:5001/api/v2/admin/ingest/run              # poll job status
```

The Admin Studio exposes these as one-click buttons (Re-scrape Directory /
Geocode Offline / Geocode Live OSM).

## REST surface (/api/v2)

| Method | Path | Purpose |
|---|---|---|
| POST | `/recommender/match` | Explainable scheme match (score + rationale + provenance) |
| POST | `/calculator/financials` | EMI, moratorium interest, commercial comparison |
| POST | `/router/channel-partners` | NPA/overdue/fund-gated partner routing |
| GET | `/schemes` | Live catalog + per-scheme source quotes |
| GET | `/sources` | Source registry with hash state |
| GET/POST | `/admin/policy-reviews[/:id/adjudicate]` | HITL policy queue |
| GET/POST | `/admin/scraped-partners[/:id/promote|/:id/discard|/batch-promote]` | Directory staging HITL |
| GET/POST | `/admin/ingest/run`, `/admin/ingest/geocode` | In-process pipeline triggers |
| GET | `/admin/ingest-runs` | Audit trail of scraper runs |
| POST/GET | `/passports` | Save/list beneficiary journeys |
| GET/PATCH | `/passports/:id[/status]` | Officer workflow (DRAFT→SUBMITTED→UNDER_REVIEW→SANCTIONED/REJECTED) |

## Environment flags

| Variable | Default | Effect |
|---|---|---|
| `PORT` | `5001` | Express port |
| `INGEST_ENABLED` | `false` | Enables the periodic re-verification scheduler in `server/index.js`. Off by default so the demo never stalls on network hiccups. |
| `INGEST_INTERVAL_HOURS` | `24` | Scheduler cadence when enabled |
| `INGEST_OFFLINE` | `true`* | When `true`, scheduled/API ingest runs use bundled fixtures only. Also the default for the geocode endpoint when unset. |
| `NOMINATIM_URL` | `https://nominatim.openstreetmap.org/search` | Override for self-hosted Nominatim |

Example (production-ish):

```bash
INGEST_ENABLED=true INGEST_INTERVAL_HOURS=12 INGEST_OFFLINE=false npm run server
```

## Dataset & provenance

- `server/data/seedSchemes.js` — 7 NSFDC schemes + 5 partners + 1 seeded HITL
  review, every number carrying a verbatim quote from an official source
  (fetched & verified 2026-09-30). The demo never depends on live gov sites.
- `server/ingest/fixtures/` — offline snapshots of the four sources.
- `/api/health` reports both the v1 engine dataset and `v2Dataset` counts
  (schemes, partners, pending reviews, staged rows).

### Operational notes

- **Windows**: multiple node processes can bind port 5001 silently. Kill
  stragglers with:
  `powershell "Get-CimInstance Win32_Process -Filter \"name='node.exe'\" | Where-Object { $_.CommandLine -like '*server/index.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"`
- `better-sqlite3` was removed due to native-build segfaults — do not
  reintroduce; the sql.js wrapper in `server/db/database.js` must keep its
  better-sqlite3-compatible API.
