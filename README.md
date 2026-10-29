# Southern Oregon Angler Guide

A static fishing guide for Southern Oregon. Start with [index.html](./index.html).

## Project folders

- `fish/` — fish profiles and species map code
- `waters/` — waterway guides, maps, and related code
- `gear/` — gear catalog, product data, and planning cart
- `assets/` — shared photos and illustrations
- `styles/` — shared stylesheet
- `scripts/` — shared search and page interactions
- `config/` — public frontend endpoint settings; never put secrets here
- `data/` — generated site search index
- `tools/` — build and validation utilities
- `docs/` — service setup and integration instructions

The root-level HTML pages are intentional: keeping them in place preserves the site's existing public URLs. Feature scripts and supporting resources live in the folders above.

## Useful commands

- `python3 tools/build-search-index.py` — regenerate `data/site-search-index.json`
- `python3 tools/check-links.py` — verify local page references
- `python3 tools/check-links.py --external` — also check external links (requires network access)

See [service setup](./docs/SERVICE-SETUP.md) before connecting newsletter or catch-submission providers.
