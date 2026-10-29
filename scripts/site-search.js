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

  function addFeedbackNavigation() {
    const navigation = document.querySelector(".site-nav");
    if (!navigation) return;
    const feedbackUrl = new URL(`${siteRoot}feedback.html`, window.location.href).href;
    if ([...navigation.querySelectorAll("a")].some((link) => link.href === feedbackUrl)) return;
    const link = document.createElement("a");
    link.href = `${siteRoot}feedback.html`;
    link.textContent = "Suggest a correction";
    navigation.append(link);
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
  addFeedbackNavigation();
  addGuideReviewNote();
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
