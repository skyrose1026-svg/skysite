# Southern Oregon Angler Guide

This is a fishing guide for exploring fish species, Southern Oregon waters, gear, and trip-planning tools. It is designed to feel like a practical regional field guide: direct, outdoors-focused, easy to scan, and useful on a phone as well as a desktop.

Start at [index.html](./index.html). The responsive header puts whole-site search beside a **Menu** dropdown. Menu has exactly six top-level expandable categories: **Explore**, **Gear & Equipment**, **Plan a Trip**, **Field Tools**, **Community**, and **Regulations**. Expand a category to reveal its subcategories; expand a subcategory to see its more specific page links. Fish species and waters are further grouped by fish family or region. The Home link is under Explore → Start here. On smaller screens the tree stacks vertically. Field Tools links jump to distinct sections on the existing Field Tools page; they are not separate pages.

## What the site looks and feels like

- **Palette:** warm off-white page backgrounds, deep pine-green headings and controls, softer river and forest greens, muted river blue, and restrained clay accents.
- **Typography:** serif headings paired with a readable system sans-serif for body text and controls.
- **Layout:** responsive page widths, clear section headings, simple cards, tables, badges, and generous spacing. Layouts adapt to narrower screens and touch controls.
- **Content style:** practical fishing information and links, with reminders to confirm current regulations, access, and conditions. Fish and water pages use photographs, maps, tables, and short scannable sections where available.

The shared visual system lives in [styles/styles.css](./styles/styles.css). It uses CSS variables for colors, spacing, typography, and radii; no front-end framework is required.

## What visitors can do

### Explore fish and waters

- **Fish guide:** browse freshwater and saltwater fish profiles. Profiles cover identification, typical waters and seasons, suggested bait or lures, gear basics, and regulation links. Species pages may include maps showing broad regions, not guaranteed or exact fishing locations.
- **Waters guide:** browse river and lake pages with location and access notes, fish species, nearby waters, and general regulation information. Forecast and map elements may use external services.
- **Whole-site search:** search the generated site index for pages and catalog items. Select a result to open the corresponding page.

### Choose and plan gear

- **Gear Guide:** overview of rods, reels, line, lures and flies, tackle, and essentials. The individual category pages remain separate for focused reference.
- **Shop & Brands:** browse catalog entries, brands, filters, and example products. Some listings are placeholders or illustrative product examples; there are no live prices or availability.
- **Setup Builder:** get a suggested fishing setup based on a target species and navigate to related gear.
- **Gear Checklist:** collect gear ideas in browser storage for planning. It is not a checkout: the site does not process orders, payments, or live inventory.

### Plan a fishing day

- **Fishing Calendar:** move between calendar months and view typical fish-activity windows and peak periods. These are broad planning estimates, not precise run forecasts, biological dormancy dates, or open seasons. A selected location can show an NWS forecast for roughly the next seven days.
- **Trip Planning:** choose a water and date to review guide notes and a weather forecast. A separate local trip checklist can store trip names, dates, group labels, participant names, and packing/planning information in the browser.
- **Fishing Log:** record catches, tackle, measurements, notes, optional photos, and optionally captured conditions. Export entries as CSV or make a full backup. Exact GPS is stored only when the visitor opts in.

### Use Field Tools

The Field Tools page brings together:

- USGS streamflow/gauge readings and National Weather Service forecasts and alerts when online. Successfully loaded gauge and weather readings can be saved locally for later reference.
- A local moon-phase and conditions-based activity indicator. It is a heuristic, not a fishing prediction.
- Personal waypoints and tackle inventory stored in the browser.
- Knot and rigging instructions.
- A private image preview to compare against the fish guide. There is no AI identification model connected.

The grouped menu links jump to the relevant section on this page. The map uses online map tiles when available; saved waypoint details remain local, but topographic, bathymetric, and land-access layers are not bundled. When live conditions cannot be loaded, some tools display clearly labeled sample readings. Samples are illustrative only and must not be used for fishing, navigation, or safety decisions.

### Join the forum

The forum has categories for general fishing, reports and catches, gear, techniques, and waters/regulations. Visitors can search and sort discussions, publish a topic, and reply using a public nickname.

Unlike the other local-first tools, shared forum posts require the included Python server. The server stores topics and replies in a local SQLite database. The nickname is not verified; posts are public and there are no moderation, login, or post-removal tools in this version. Follow the [forum setup and safety notes](./docs/SERVICE-SETUP.md#shared-forum) before running it.

### Newsletter, catch submissions, and corrections

- **Field Notes:** previews the planned newsletter topics—seasonal runs, local stories, useful gear, and regulations. It does not collect email addresses until a public signup link is configured.
- **Share Your Catch:** provides a submission page, but submissions are not collected until a hosted form endpoint is configured.
- **Suggest a Correction:** prepares a GitHub issue for the visitor to review and submit. Posting the issue requires a GitHub account; this site does not send it automatically.

See [service setup](./docs/SERVICE-SETUP.md) for what must be configured. Public browser code must not contain private API keys or secrets.

The [Community hub](./community.html) gathers the forum, Field Notes, catch submission, and correction links in one place. Their individual pages remain separate because they have different tasks and service requirements.

### Regulations

The [Regulation & Access Checklist](./regulations.html) is a quick reminder of details to verify for the exact water and date, with a direct link to current ODFW regulations. It is not a legal summary; official rules and land-manager access decisions take precedence.

## How the site operates

The guide pages are static HTML, styled with one shared stylesheet and enhanced with browser JavaScript. No cloud account is required for browsing. Search uses the generated `data/site-search-index.json`.

The fishing log, trip checklist, waypoints, tackle inventory, and saved environmental snapshots use IndexedDB in the visitor's browser. The gear checklist uses browser storage as well. These tools stay on that browser and device; they do not sync to friends or other devices. Clearing browser data can remove them, so use the available export/backup features to preserve records. For the fishing log, CSV export omits photos and exact GPS; a full backup may include photos and any exact GPS you chose to save.

The service worker can cache the app shell and selected same-origin assets for offline use when the site is served on HTTPS or localhost in a supporting browser. Previously visited same-origin resources may also be cached. Offline mode does **not** provide live weather or gauge data, map tiles, hosted form submissions, or forum discussions/replies. Saved local records and cached pages may remain available; external images and other third-party content are not guaranteed offline.

### Local server

To browse the static site without the shared forum, use any static file server. To use the forum locally, start the included server from the project root:

```bash
python3 tools/forum-server.py
```

Then open `http://localhost:8000/`. This serves both the site and forum API on the same origin; the forum page is at `http://localhost:8000/forum.html`. By default, the server listens only on the current computer (`127.0.0.1`); LAN access options and limitations are documented in [SERVICE-SETUP.md](./docs/SERVICE-SETUP.md#shared-forum). The forum is not ready to expose directly to the public internet.

## Accuracy and safety

Site content is informational and may be incomplete or out of date. Forecasts and gauge readings may be delayed or unavailable. Confirm the exact water, date, species rules, access permissions, closures, and emergency conditions with the appropriate official sources—especially [current Oregon fishing regulations](https://myodfw.com/fishing/regulations)—before fishing. Maps and sample readings are not navigation or safety tools.

## Project maintenance

- `python3 tools/build-search-index.py` — regenerate the search index and offline asset manifest.
- `python3 tools/check-links.py` — check local references.
- `python3 tools/check-links.py --external` — also check external links (requires network access).
- `python3 tools/forum-server.py` — run the local site and shared forum.

The HTML pages preserve the site's existing URLs. Page scripts are in [scripts/](./scripts/), images and illustrations in [assets/](./assets/), product data in [gear/](./gear/), and build/validation utilities in [tools/](./tools/).

## Navigation and page-structure rule

Keep the main dropdown at exactly these six top-level categories: **Explore**, **Gear & Equipment**, **Plan a Trip**, **Field Tools**, **Community**, and **Regulations**. Do not add a seventh category. Use nested subcategories to make large collections, such as fish species and individual water guides, easier to browse. Place each new page or tool under the one existing category that best matches its primary visitor task; do not list one destination under multiple categories.

Keep standalone pages standalone. For example, Fish and Waters remain separate directory pages, as do the individual gear references, trip planner, calendar, fishing log, community pages, and forum. Field Tools currently contains several focused utilities on one page; the menu links to each utility's section. Add a dedicated page only when the feature needs its own focused experience, and then place its link under one of the same six categories.

When adding or changing a page or feature, review the grouped navigation in [site-search.js](./scripts/site-search.js), the generated-page navigation in [build-site.ps1](./tools/build-site.ps1), this README, and the search/offline indexes. Keep page content concise and scannable, preserve existing URLs unless a route change is necessary, and run the local link check after updates.
