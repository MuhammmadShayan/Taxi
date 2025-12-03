# Scraping Process and Limitations

## Overview
Server-side scraping uses Puppeteer to fetch listing pages and Cheerio to parse DOM. Enrichment searches Cars.com per vehicle to fill missing fields and download images.

## Authentication
POST `/api/admin/scrape-cars` requires API key via body `apiKey` or header `x-api-key`.

## Connectivity & Retries
- Reachability is checked with HEAD → GET → DNS fallback.
- Navigation requests use exponential backoff retry (3 attempts).
- Non-blocking: connectivity issues are returned as warnings, scraping proceeds.

## Error Handling
- All endpoints return JSON with `success`, data, and `warnings` when applicable.
- Per-vehicle failures are collected and reported; the API does not crash.

## Timeouts
- Puppeteer `goto` timeout: 90s per page.
- Axios timeouts: 5–10s (reachability, image downloads).

## Volume & Limits
- Page limits per source are enforced (1–200).
- Deduplication avoids redundant inserts on make/model/year.

## Known Limitations
- Target platforms may change DOM structure; scrapers may need updates.
- Anti-bot measures may throttle scraping; retries mitigate but do not guarantee.
- Images may be blocked or require signed URLs; default image used when download fails.

