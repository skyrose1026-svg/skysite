(() => {
  const searchRoot = document.querySelector("[data-site-search]");
  const siteRoot = searchRoot?.dataset.root || "./";

  function installDiagnostics() {
    window.addEventListener("error", (event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        console.error("[site-monitor] Image failed to load:", target.currentSrc || target.src);
        if (!target.dataset.fallbackApplied) {
          target.dataset.fallbackApplied = "true";
          target.src = `${siteRoot}assets/fishing-scene-fallback.svg`;
          target.alt = "Illustrative river scene; the original image did not load.";
        }
        return;
      }

      if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement) {
        console.error("[site-monitor] Page resource failed to load:", target.href || target.src);
        return;
      }

      console.error("[site-monitor] Uncaught page error:", event.error || event.message);
    }, true);

    window.addEventListener("unhandledrejection", (event) => {
      console.error("[site-monitor] Unhandled asynchronous error:", event.reason);
    });

    if (typeof window.fetch !== "function" || window.fetch.siteMonitored) return;
    const originalFetch = window.fetch.bind(window);
    const monitoredFetch = async (input, ...options) => {
      const requestUrl = typeof input === "string" ? input : input.url;
      let safeUrl = requestUrl;
      try {
        const parsedUrl = new URL(requestUrl, window.location.href);
        safeUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
      } catch (error) {
        console.warn("[site-monitor] Could not normalize a request URL:", error);
      }
      try {
        const response = await originalFetch(input, ...options);
        if (!response.ok) {
          console.error(`[site-monitor] Request failed (${response.status}):`, safeUrl);
        }
        return response;
      } catch (error) {
        console.error("[site-monitor] Request could not be completed:", safeUrl, error);
        throw error;
      }
    };
    monitoredFetch.siteMonitored = true;
    window.fetch = monitoredFetch;
  }

  function installGroupedNavigation() {
    const navigation = document.querySelector(".site-nav");
    const menu = navigation?.closest(".site-nav-menu");
    if (!navigation || !menu) return;

    const groups = [
      {
        title: "Explore",
        children: [
          {
            title: "Start here",
            pages: [["Angler Guide Home", "index.html"]]
          },
          {
            title: "Fish & species guides",
            pages: [["Fish directory", "fish/fish.html"]],
            children: [
              {
                title: "Freshwater fish",
                children: [
                  {
                    title: "Salmon, trout & whitefish",
                    pages: [
                      ["Chinook Salmon", "fish/chinook-salmon.html"],
                      ["Coho Salmon", "fish/coho-salmon.html"],
                      ["Coastal Cutthroat Trout", "fish/coastal-cutthroat-trout.html"],
                      ["Kokanee", "fish/kokanee.html"],
                      ["Mountain Whitefish", "fish/mountain-whitefish.html"],
                      ["Rainbow Trout", "fish/rainbow-trout.html"],
                      ["Steelhead", "fish/steelhead.html"]
                    ]
                  },
                  {
                    title: "Char",
                    pages: [
                      ["Brook Trout", "fish/brook-trout.html"],
                      ["Bull Trout", "fish/bull-trout.html"],
                      ["Lake Trout", "fish/lake-trout.html"]
                    ]
                  },
                  {
                    title: "Bass, sunfish & perch",
                    pages: [
                      ["Bluegill", "fish/bluegill.html"],
                      ["Black Crappie", "fish/black-crappie.html"],
                      ["Largemouth Bass", "fish/largemouth-bass.html"],
                      ["Smallmouth Bass", "fish/smallmouth-bass.html"],
                      ["White Crappie", "fish/white-crappie.html"],
                      ["Yellow Perch", "fish/yellow-perch.html"]
                    ]
                  },
                  {
                    title: "Catfish, carp & minnows",
                    pages: [
                      ["Brown Bullhead", "fish/brown-bullhead.html"],
                      ["Channel Catfish", "fish/channel-catfish.html"],
                      ["Common Carp", "fish/common-carp.html"],
                      ["Northern Pikeminnow", "fish/northern-pikeminnow.html"]
                    ]
                  },
                  {
                    title: "Sturgeon",
                    pages: [["White Sturgeon", "fish/white-sturgeon.html"]]
                  }
                ]
              },
              {
                title: "Coastal & saltwater fish",
                pages: [
                  ["Black Rockfish", "fish/black-rockfish.html"],
                  ["Cabezon", "fish/cabezon.html"],
                  ["Lingcod", "fish/lingcod.html"],
                  ["Pacific Halibut", "fish/pacific-halibut.html"],
                  ["Surfperch", "fish/surfperch.html"]
                ]
              }
            ]
          },
          {
            title: "Waters & locations",
            children: [
              {
                title: "All waters",
                pages: [["Water directory & maps", "waters/waters.html"]]
              },
              {
                title: "Rogue River basin",
                pages: [
                  ["Applegate River", "waters/applegate-river.html"],
                  ["Illinois River", "waters/illinois-river.html"],
                  ["Rogue River", "waters/rogue-river.html"]
                ]
              },
              {
                title: "South Coast",
                pages: [
                  ["Chetco River", "waters/chetco-river.html"],
                  ["Elk River", "waters/elk-river.html"],
                  ["Pistol River", "waters/pistol-river.html"],
                  ["Sixes River", "waters/sixes-river.html"],
                  ["Winchuck River", "waters/winchuck-river.html"]
                ]
              },
              {
                title: "Coos & Umpqua",
                pages: [
                  ["Coos River", "waters/coos-river.html"],
                  ["Coquille River", "waters/coquille-river.html"],
                  ["Umpqua River", "waters/umpqua-river.html"]
                ]
              },
              {
                title: "North Coast & Willamette Valley",
                pages: [
                  ["Alsea River", "waters/alsea-river.html"],
                  ["Clackamas River", "waters/clackamas-river.html"],
                  ["Nehalem River", "waters/nehalem-river.html"],
                  ["Nestucca River", "waters/nestucca-river.html"],
                  ["Sandy River", "waters/sandy-river.html"],
                  ["Siletz River", "waters/siletz-river.html"],
                  ["Siuslaw River", "waters/siuslaw-river.html"],
                  ["Trask River", "waters/trask-river.html"],
                  ["Willamette River", "waters/willamette-river.html"],
                  ["Wilson River", "waters/wilson-river.html"]
                ]
              },
              {
                title: "Central Oregon & Cascades",
                pages: [
                  ["Crooked River", "waters/crooked-river.html"],
                  ["Deschutes River", "waters/deschutes-river.html"],
                  ["Fall River", "waters/fall-river.html"],
                  ["McKenzie River", "waters/mckenzie-river.html"],
                  ["Metolius River", "waters/metolius-river.html"],
                  ["Santiam River", "waters/santiam-river.html"],
                  ["Williamson River", "waters/williamson-river.html"],
                  ["Wood River", "waters/wood-river.html"]
                ]
              },
              {
                title: "Eastern & northeastern Oregon",
                pages: [
                  ["Grande Ronde River", "waters/grande-ronde-river.html"],
                  ["Imnaha River", "waters/imnaha-river.html"],
                  ["John Day River", "waters/john-day-river.html"],
                  ["Malheur River", "waters/malheur-river.html"],
                  ["Owyhee River", "waters/owyhee-river.html"],
                  ["Powder River", "waters/powder-river.html"],
                  ["Snake River", "waters/snake-river.html"],
                  ["Wallowa River", "waters/wallowa-river.html"]
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Gear & Equipment",
        children: [
          {
            title: "Gear references",
            pages: [
              ["Gear Guide", "gear/gear.html"],
              ["Rods", "gear/rods.html"],
              ["Reels", "gear/reels.html"],
              ["Line", "gear/line.html"],
              ["Lures & Flies", "gear/lures.html"],
              ["Tackle", "gear/tackle.html"],
              ["Essentials", "gear/essentials.html"]
            ]
          },
          {
            title: "Choose & plan gear",
            pages: [
              ["Setup Builder", "setup-builder.html"],
              ["Shop & Brands", "gear/shop.html"],
              ["Gear Checklist", "gear/cart.html"]
            ]
          }
        ]
      },
      {
        title: "Plan a Trip",
        children: [
          {
            title: "Season & conditions planning",
            pages: [["Fishing Calendar", "fishing-calendar.html"]]
          },
          {
            title: "Itinerary & group checklist",
            pages: [["Trip Planner", "trip-planning.html"]]
          },
          {
            title: "Catch records",
            pages: [["Fishing Log", "fishing-log.html"]]
          }
        ]
      },
      {
        title: "Field Tools",
        children: [
          {
            title: "Water & weather",
            pages: [
              ["USGS Gauges & Water Conditions", "field-tools.html#conditions-heading"],
              ["NWS Forecast & Alerts", "field-tools.html#weather-results"],
              ["Moon & Activity Planner", "field-tools.html#solunar-heading"]
            ]
          },
          {
            title: "Personal equipment & locations",
            pages: [
              ["Map & Waypoints", "field-tools.html#waypoints-heading"],
              ["Saved Waypoints", "field-tools.html#waypoint-form"],
              ["Personal Tackle Box", "field-tools.html#tackle-heading"]
            ]
          },
          {
            title: "Identification & learning",
            pages: [
              ["Knots & Rigs", "field-tools.html#knots-heading"],
              ["Fish Photo Preview", "field-tools.html#identify-heading"]
            ]
          }
        ]
      },
      {
        title: "Community",
        children: [
          {
            title: "Discussions",
            pages: [["Fishing Forum", "forum.html"]]
          },
          {
            title: "Stories & newsletter",
            pages: [
              ["Community Hub", "community.html"],
              ["Field Notes", "newsletter.html"]
            ]
          },
          {
            title: "Contribute to the guide",
            pages: [
              ["Share Your Catch", "catch-submission.html"],
              ["Suggest a Correction", "feedback.html"]
            ]
          }
        ]
      },
      {
        title: "Regulations",
        children: [
          {
            title: "Oregon fishing rules",
            pages: [
              ["Regulation & Access Checklist", "regulations.html"],
              ["Current ODFW Regulations", "https://myodfw.com/fishing/regulations"]
            ]
          }
        ]
      }
    ];
    const currentPath = window.location.pathname.replace(/\/+$/, "");
    const fragment = document.createDocumentFragment();
    function renderNode(node, { topLevel = false } = {}) {
      const section = document.createElement("details");
      section.className = topLevel ? "site-nav__group" : "site-nav__subgroup";
      const heading = document.createElement("summary");
      heading.className = topLevel ? "site-nav__heading" : "site-nav__subheading";
      heading.textContent = node.title;
      const list = document.createElement("ul");
      list.className = topLevel ? "site-nav__items" : "site-nav__subitems";
      let containsCurrentPage = false;
      for (const [label, href] of node.pages || []) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = href.startsWith("https://") ? href : `${siteRoot}${href}`;
        link.textContent = label;
        if (href.startsWith("https://")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        const target = new URL(link.href, window.location.href);
        if (
          target.pathname.replace(/\/+$/, "") === currentPath &&
          (!target.hash || target.hash === window.location.hash)
        ) {
          link.setAttribute("aria-current", target.hash ? "location" : "page");
          containsCurrentPage = true;
        }
        item.append(link);
        list.append(item);
      }
      for (const child of node.children || []) {
        const childNode = renderNode(child);
        containsCurrentPage = containsCurrentPage || childNode.containsCurrentPage;
        const item = document.createElement("li");
        item.append(childNode.element);
        list.append(item);
      }
      section.open = containsCurrentPage;
      section.append(heading, list);
      return { element: section, containsCurrentPage };
    }

    for (const group of groups) {
      fragment.append(renderNode(group, { topLevel: true }).element);
    }
    navigation.replaceChildren(fragment);
    navigation.dataset.grouped = "true";
    const summary = menu.querySelector(":scope > summary");
    summary?.setAttribute("aria-controls", "site-navigation-panel");
    navigation.id = "site-navigation-panel";

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.open = false;
        summary?.focus();
      }
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) menu.open = false;
    });
  }

  function installOfflineSupport() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const appRoot = new URL(siteRoot, window.location.href);
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = new URL("manifest.webmanifest", appRoot).href;
    if (!document.querySelector('link[rel="manifest"]')) document.head.append(manifest);
    navigator.serviceWorker.register(new URL("service-worker.js", appRoot), { scope: appRoot.pathname })
      .catch((error) => console.error("[offline] Could not register offline support:", error));
  }

  function addGuideReviewNote() {
    const rootPath = new URL(siteRoot, window.location.href).pathname;
    const relativePath = window.location.pathname.slice(rootPath.length).replace(/^\/+/, "");
    const isGuideDetail = /^(?:fish|waters)\/(?!fish\.html$|waters\.html$)[^/]+\.html$/i.test(relativePath);
    const main = document.querySelector("main");
    const heading = main?.querySelector("h1");
    if (!isGuideDetail || !main || !heading) return;

    const note = document.createElement("aside");
    note.className = "guide-review-note";
    note.setAttribute("aria-label", "Guide review and official fishing regulations");
    const review = document.createElement("p");
    review.innerHTML = "<strong>Last reviewed: October 28, 2026</strong> — page structure, local references, and official-source links. Species, access, stocking, seasonal, and legal details have not been independently verified for this date.";
    const regulations = document.createElement("p");
    regulations.append("Fishing rules and closures can change. Confirm the exact water and date with ");
    const link = document.createElement("a");
    link.href = "https://myodfw.com/fishing/regulations";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "current ODFW regulations";
    regulations.append(link, " before fishing.");
    note.append(review, regulations);
    heading.insertAdjacentElement("afterend", note);
  }

  installDiagnostics();
  installGroupedNavigation();
  addGuideReviewNote();
  installOfflineSupport();
})();

const searchRoot = document.querySelector('[data-site-search]');

if (searchRoot) {
  const searchForm = searchRoot;
  const searchInput = searchRoot.querySelector('input[type="search"]');
  const results = searchRoot.querySelector('[data-search-results]');
  let searchDocuments;
  let searchError = '';

  function showMessage(message) {
    results.replaceChildren();
    const paragraph = document.createElement('p');
    paragraph.className = 'site-search__message';
    paragraph.textContent = message;
    results.append(paragraph);
  }

  function findMatches(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return searchDocuments
      .map((document) => {
        const title = document.title.toLowerCase();
        const description = document.description.toLowerCase();
        const searchable = `${title} ${description} ${document.content}`.toLowerCase();
        const score = terms.reduce((total, term) => {
          if (title.includes(term)) return total + 12;
          if (description.includes(term)) return total + 5;
          if (searchable.includes(term)) return total + 1;
          return total;
        }, 0);
        return score > 0 ? { document, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
      .slice(0, 6);
  }

  function renderMatches(query) {
    results.replaceChildren();
    if (query.length < 2) return;
    if (!searchDocuments) {
      showMessage(searchError || 'Loading site search…');
      return;
    }
    const matches = findMatches(query);
    if (matches.length === 0) {
      showMessage('No matching pages found. Try a different search.');
      return;
    }

    const related = document.createElement('div');
    related.className = 'site-search__suggestions';
    const relatedLabel = document.createElement('strong');
    relatedLabel.textContent = 'Related searches';
    related.append(relatedLabel);
    for (const { document: resultDocument } of matches.slice(0, 3)) {
      const suggestion = document.createElement('button');
      suggestion.className = 'site-search__suggestion';
      suggestion.type = 'button';
      suggestion.textContent = resultDocument.title;
      suggestion.addEventListener('click', () => {
        searchInput.value = resultDocument.title;
        renderMatches(searchInput.value.trim());
        searchInput.focus();
      });
      related.append(suggestion);
    }
    results.append(related);

    const pageResults = document.createElement('div');
    pageResults.className = 'site-search__pages';
    for (const { document: resultDocument } of matches) {
      const link = document.createElement('a');
      link.className = 'site-search__result';
      link.href = `${searchRoot.dataset.root}${resultDocument.url}`;
      const title = document.createElement('strong');
      title.textContent = resultDocument.title;
      const description = document.createElement('span');
      description.textContent = resultDocument.description || resultDocument.content.slice(0, 150);
      link.append(title, description);
      pageResults.append(link);
    }
    results.append(pageResults);
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query.length < 2) {
      showMessage('Type at least two characters to search.');
      searchInput.focus();
      return;
    }
    if (!searchDocuments) {
      showMessage(searchError || 'Search is still loading. Please try again in a moment.');
      return;
    }
    const firstMatch = findMatches(query)[0];
    if (!firstMatch) {
      renderMatches(query);
      return;
    }
    window.location.href = `${searchRoot.dataset.root}${firstMatch.document.url}`;
  });
  searchInput.addEventListener('input', () => renderMatches(searchInput.value.trim()));
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') results.replaceChildren();
  });
  document.addEventListener('click', (event) => {
    if (!searchRoot.contains(event.target)) results.replaceChildren();
  });

  const indexUrl = searchRoot.dataset.index;
  fetch(indexUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Search index request failed (${response.status}).`);
      return response.json();
    })
    .then((documents) => {
      searchDocuments = documents;
      if (searchInput.value.trim().length >= 2) renderMatches(searchInput.value.trim());
    })
    .catch((error) => {
      console.error(error);
      searchError = 'Site search is unavailable right now. Please try again later.';
      showMessage(searchError);
    });
}
