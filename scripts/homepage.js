(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const offlineStatus = document.querySelector("[data-offline-status]");
  const offlineLabel = document.querySelector("[data-offline-label]");
  const cacheStatus = document.querySelector("[data-cache-status]");
  const THEME_KEY = "southern-oregon-angler-theme";

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    if (themeIcon) themeIcon.textContent = isDark ? "☾" : "☀";
    if (themeLabel) themeLabel.textContent = `${isDark ? "Light" : "Dark"} mode`;
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === "dark" ? "dark" : "light");
  } catch (error) {
    console.warn("[homepage] Could not read the saved color theme:", error);
    applyTheme("light");
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      console.warn("[homepage] Could not save the color theme:", error);
    }
  });

  function updateOfflineStatus() {
    const indexedDbAvailable = "indexedDB" in window;
    const workerAvailable = "serviceWorker" in navigator && window.isSecureContext;
    const workerControlsPage = Boolean(navigator.serviceWorker?.controller);
    let state = "unavailable";
    let message;

    if (!indexedDbAvailable) {
      message = "Offline records are not supported by this browser";
    } else if (navigator.onLine === false) {
      state = workerControlsPage ? "ready" : "unavailable";
      message = workerControlsPage
        ? "Offline · cached pages and local records available"
        : "Offline · previously cached pages may be unavailable";
    } else if (workerControlsPage) {
      state = "ready";
      message = "Offline cache ready · IndexedDB available";
    } else if (workerAvailable) {
      message = "Offline setup in progress · IndexedDB available";
    } else {
      message = "Offline cache unavailable in this browser or context · IndexedDB available";
    }

    offlineStatus?.setAttribute("data-state", state);
    if (offlineLabel) offlineLabel.textContent = message;
    if (cacheStatus) {
      cacheStatus.textContent = workerControlsPage
        ? "Offline cache: active for this site."
        : workerAvailable
          ? "Offline cache: setting up; refresh after setup."
          : "Offline cache: unavailable in this browser or context.";
    }
  }

  updateOfflineStatus();
  window.addEventListener("online", updateOfflineStatus);
  window.addEventListener("offline", updateOfflineStatus);
  navigator.serviceWorker?.addEventListener("controllerchange", updateOfflineStatus);
  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.ready.then(updateOfflineStatus).catch((error) => {
      console.error("[homepage] Could not check offline support:", error);
    });
  }
})();
