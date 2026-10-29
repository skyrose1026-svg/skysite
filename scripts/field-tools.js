(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const store = window.AnglerFieldStore;
  const gaugeResults = $("[data-gauge-results]");
  const weatherResults = $("[data-weather-results]");
  const conditionStatus = $("[data-conditions-status]");
  const waypointList = $("[data-waypoint-list]");
  const waypointStatus = $("[data-waypoint-status]");
  const tackleList = $("[data-tackle-list]");
  const tackleStatus = $("[data-tackle-status]");
  const mapStatus = $("[data-map-status]");
  const gaugeInput = $("#gauge-site");
  const areaInput = $("#field-area");
  let map;
  let waypointLayer;
  let selectedWeather = null;
  let selectedGauge = null;
  let priorPhotoUrl = null;

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function status(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.classList?.toggle("form-status--error", isError);
    if (!element.classList) element.className = isError ? "form-status form-status--error" : "form-status";
  }

  async function getJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/geo+json, application/json" } });
    if (!response.ok) throw new Error(`Request failed (${response.status}).`);
    return response.json();
  }

  function valueCard(title, value, note = "") {
    const card = node("article", undefined, "field-card");
    card.append(node("p", title, "eyebrow"), node("strong", value, "field-card__value"));
    if (note) card.append(node("p", note, "field-help"));
    return card;
  }

  function parseGaugeReading(series) {
    const readings = series?.values?.[0]?.value || [];
    const valid = readings.filter((reading) => Number.isFinite(Number(reading.value)) && Number(reading.value) > -999000);
    return valid.length ? { latest: valid[valid.length - 1], first: valid[0] } : null;
  }

  function sampleGauge(siteNumber) {
    return {
      siteName: `Illustrative sample for requested site ${siteNumber}`,
      siteNumber,
      flow: "1,650 ft³/s",
      height: "1.21 ft",
      waterTemperature: "9.5 °C",
      turbidity: "3.2 FNU",
      readingAt: "Illustrative sample only",
      flowTrend: 35,
      sample: true
    };
  }

  async function loadGauge() {
    const site = gaugeInput.value.trim();
    if (!/^\d{8}$/.test(site)) throw new Error("Enter an 8-digit USGS monitoring-site number.");
    const endpoint = new URL("https://waterservices.usgs.gov/nwis/iv/");
    endpoint.search = new URLSearchParams({
      format: "json",
      sites: site,
      parameterCd: "00060,00065,00010,63680",
      period: "P1D",
      siteStatus: "all"
    });
    const response = await getJson(endpoint);
    const series = response.value?.timeSeries || [];
    if (!series.length) throw new Error("USGS returned no readings for that site.");
    const first = series[0].sourceInfo;
    const readings = {};
    for (const item of series) {
      const code = item.variable?.variableCode?.[0]?.value;
      const parsed = parseGaugeReading(item);
      if (code && parsed) readings[code] = { ...parsed, unit: item.variable?.unit?.unitCode || "" };
    }
    const latestAt = Object.values(readings).map((reading) => reading.latest.dateTime).sort().at(-1) || "";
    return {
      siteName: first?.siteName || `USGS site ${site}`,
      siteNumber: site,
      flow: readings["00060"] ? `${Number(readings["00060"].latest.value).toLocaleString()} ${readings["00060"].unit}` : "No flow reading",
      height: readings["00065"] ? `${Number(readings["00065"].latest.value).toFixed(2)} ${readings["00065"].unit}` : "No height reading",
      waterTemperature: readings["00010"] ? `${Number(readings["00010"].latest.value).toFixed(1)} °C` : "No water-temperature reading",
      turbidity: readings["63680"] ? `${Number(readings["63680"].latest.value).toFixed(1)} ${readings["63680"].unit}` : "No turbidity reading",
      readingAt: latestAt ? new Date(latestAt).toLocaleString() : "Timestamp unavailable",
      flowTrend: readings["00060"] ? Number(readings["00060"].latest.value) - Number(readings["00060"].first.value) : null,
      sample: false,
      source: "USGS",
      readings
    };
  }

  function renderGauge(gauge) {
    selectedGauge = gauge;
    gaugeResults.replaceChildren(
      valueCard("Monitoring site", gauge.siteName, `USGS ${gauge.siteNumber}`),
      valueCard("Streamflow", gauge.flow, gauge.flowTrend === null || gauge.flowTrend === undefined ? "" : `24-hour change: ${gauge.flowTrend > 0 ? "+" : ""}${gauge.flowTrend.toFixed(1)}`),
      valueCard("Gauge height", gauge.height),
      valueCard("Water temperature", gauge.waterTemperature),
      valueCard("Turbidity", gauge.turbidity || "No USGS turbidity reading")
    );
    const labelText = gauge.sample
      ? "SAMPLE DATA — not a live reading. Connect to USGS and refresh before using gauge information."
      : gauge.cached
        ? `Saved USGS snapshot from ${gauge.readingAt}; it may be stale. Refresh before using gauge information.`
        : `Live USGS data; readings may be provisional. Updated ${gauge.readingAt}.`;
    const label = node("p", labelText);
    label.className = gauge.sample ? "sample-data-banner" : "field-help";
    gaugeResults.prepend(label);
  }

  function phaseFor(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const adjustedYear = month < 3 ? year - 1 : year;
    const adjustedMonth = month < 3 ? month + 12 : month;
    const century = Math.floor(adjustedYear / 100);
    const julianDay = Math.floor(365.25 * (adjustedYear + 4716)) +
      Math.floor(30.6001 * (adjustedMonth + 1)) + day +
      (2 - century + Math.floor(century / 4)) - 1524.5;
    return ((julianDay - 2451549.5) / 29.53059 % 1 + 1) % 1;
  }

  function phaseName(phase) {
    if (phase < 0.035 || phase > 0.965) return "New Moon";
    if (phase < 0.22) return "Waxing Crescent";
    if (phase < 0.28) return "First Quarter";
    if (phase < 0.47) return "Waxing Gibbous";
    if (phase < 0.53) return "Full Moon";
    if (phase < 0.72) return "Waning Gibbous";
    if (phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  }

  function weatherSample() {
    return {
      area: areaInput.selectedOptions[0].textContent,
      airTemperature: "59°F",
      conditions: "Partly cloudy",
      wind: "6 mph NW",
      precipitation: "10%",
      pressure: "29.92 inHg",
      pressureTrend: "Unavailable",
      uvIndex: "Unavailable",
      observedAt: "Illustrative sample only",
      sample: true,
      windMph: 6,
      pressureDelta: null
    };
  }

  async function loadWeather() {
    const [latitude, longitude] = areaInput.value.split(",");
    const point = await getJson(`https://api.weather.gov/points/${latitude},${longitude}`);
    const properties = point.properties || {};
    if (!properties.forecastHourly) throw new Error("NWS did not provide an hourly forecast for this location.");
    const hourly = await getJson(properties.forecastHourly);
    const currentPeriod = hourly.properties?.periods?.[0];
    if (!currentPeriod) throw new Error("NWS returned no hourly forecast periods.");
    const result = {
      area: areaInput.selectedOptions[0].textContent,
      airTemperature: currentPeriod.temperature === undefined ? "Unavailable" : `${currentPeriod.temperature}°${currentPeriod.temperatureUnit}`,
      conditions: currentPeriod.shortForecast || "Unavailable",
      wind: [currentPeriod.windSpeed, currentPeriod.windDirection].filter(Boolean).join(" ") || "Unavailable",
      precipitation: currentPeriod.probabilityOfPrecipitation?.value == null ? "Unavailable" : `${currentPeriod.probabilityOfPrecipitation.value}%`,
      pressure: "Unavailable",
      pressureTrend: "Unavailable",
      uvIndex: "Unavailable",
      observedAt: new Date().toLocaleString(),
      sample: false,
      windMph: Number.parseFloat(currentPeriod.windSpeed) || 0,
      pressureDelta: null
    };

    if (properties.forecastGridData) {
      const grid = await getJson(properties.forecastGridData);
      const uv = grid.properties?.uvIndex?.values?.[0]?.value;
      if (Number.isFinite(uv)) result.uvIndex = String(Math.round(uv));
    }

    if (properties.observationStations) {
      const stations = await getJson(properties.observationStations);
      const station = stations.features?.[0]?.id;
      if (station) {
        const now = new Date();
        const start = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
        const observationsUrl = new URL(`${station.replace(/\/$/, "")}/observations`);
        observationsUrl.search = new URLSearchParams({ start, limit: "50" });
        const observations = await getJson(observationsUrl);
        const values = (observations.features || []).map((feature) => feature.properties)
          .filter((item) => Number.isFinite(item.barometricPressure?.value))
          .sort((left, right) => String(left.timestamp).localeCompare(String(right.timestamp)));
          .sort((left, right) => (left.timestamp || "").localeCompare(right.timestamp || ""));
        if (values.length) {
          const first = values[0].barometricPressure.value;
          const latest = values[values.length - 1].barometricPressure.value;
          result.pressure = `${(latest * 0.0002953).toFixed(2)} inHg`;
          result.pressureDelta = latest - first;
          result.pressureTrend = Math.abs(result.pressureDelta) < 33.86 ? "Steady over recent observations" :
            result.pressureDelta > 0 ? "Rising over recent observations" : "Falling over recent observations";
          result.observedAt = values[values.length - 1].timestamp || result.observedAt;
        }
      }
    }
    return result;
  }

  async function loadAlerts() {
    const [latitude, longitude] = areaInput.value.split(",");
    const response = await getJson(`https://api.weather.gov/alerts/active?point=${latitude},${longitude}`);
    return (response.features || []).filter((feature) => feature.properties).map((feature) => ({
      properties: feature.properties,
      url: feature.id
    }));
  }

  function renderWeather(weather) {
    selectedWeather = weather;
    weatherResults.replaceChildren(
      valueCard("Forecast area", weather.area, weather.observedAt),
      valueCard("Air & conditions", `${weather.airTemperature} · ${weather.conditions}`),
      valueCard("Wind", weather.wind),
      valueCard("Barometric pressure", weather.pressure, weather.pressureTrend),
      valueCard("Precipitation / UV", `${weather.precipitation} · UV ${weather.uvIndex}`)
    );
    const labelText = weather.sample
      ? "SAMPLE DATA — not a live forecast or weather observation."
      : weather.cached
        ? `Saved NWS snapshot from ${weather.observedAt}; it may be stale.`
        : "National Weather Service forecast; pressure and UV shown only when station/grid observations are available.";
    const label = node("p", labelText);
    label.className = weather.sample ? "sample-data-banner" : "field-help";
    weatherResults.prepend(label);
    renderPlanner(weather);
  }

  function renderPlanner(weather) {
    const container = $("[data-bite-planner]");
    if (!container) return;
    const phase = phaseName(phaseFor(new Date()));
    let score = 50;
    if (/new moon|full moon/i.test(phase)) score += 8;
    if (weather.pressureDelta !== null) {
      if (Math.abs(weather.pressureDelta) < 33.86) score += 8;
      else if (weather.pressureDelta < 0) score += 4;
    }
    if (Number.isFinite(weather.windMph) && weather.windMph <= 10) score += 5;
    if (weather.sample) score = Math.min(score, 50);
    score = Math.max(20, Math.min(75, score));
    container.replaceChildren(
      valueCard("Moon phase", phase, "Calculated on this device"),
      valueCard("Conditions planning indicator", `${score}/100`, weather.sample ? "Sample conditions; not live" : "Heuristic based on moon, wind, and available pressure trend")
    );
  }

  async function refreshConditions() {
    const button = $("[data-refresh-conditions]");
    button.disabled = true;
    status(conditionStatus, "Requesting live USGS and National Weather Service data…");
    try {
      try {
        renderGauge(await loadGauge());
      } catch (error) {
        renderGauge(sampleGauge(gaugeInput.value.trim()));
        status(conditionStatus, `USGS live data unavailable: ${error.message} Showing clearly labeled sample data instead.`, true);
      }
      try {
        const weather = await loadWeather();
        renderWeather(weather);
        try {
          const alerts = await loadAlerts();
          renderAlerts(alerts);
        } catch (error) {
          renderAlerts(null);
          const alertStatus = $("[data-weather-alerts]");
          alertStatus.replaceChildren(node("strong", `Could not load live weather alerts: ${error.message}. Check weather.gov directly.`));
          alertStatus.classList.add("form-status--error");
        }
        if (!conditionStatus.classList.contains("form-status--error")) {
          status(conditionStatus, "Official readings refreshed. Data can be delayed or provisional.");
        }
      } catch (error) {
        renderWeather(weatherSample());
        renderAlerts(null);
        status(conditionStatus, `Live weather unavailable: ${error.message} Sample fallback shown; verify conditions with NWS before travel.`, true);
      }
      await saveConditionSnapshot();
    } finally {
      button.disabled = false;
    }
  }

  function renderAlerts(alerts) {
    const container = $("[data-weather-alerts]");
    container.replaceChildren();
    if (alerts === null) {
      container.hidden = false;
      container.append(node("strong", "Live alert status unavailable. Check the National Weather Service before departure."));
      return;
    }
    if (!alerts.length) {
      container.hidden = false;
      container.append(node("p", "No active NWS alerts were returned for this forecast point. This does not guarantee safe conditions."));
      return;
    }
    container.hidden = false;
    container.append(node("strong", "Active National Weather Service alerts"));
    for (const { properties, url } of alerts.slice(0, 5)) {
      const item = node("p", `${properties.event || "Weather alert"}: ${properties.headline || properties.description || "Review the official alert."}`);
      if (typeof url === "string" && url.startsWith("https://api.weather.gov/alerts/")) {
        const link = node("a", " Official alert details");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        item.append(link);
      }
      container.append(item);
    }
  }

  async function saveConditionSnapshot() {
    if (!selectedGauge || !selectedWeather || selectedGauge.sample || selectedWeather.sample) return;
    try {
      await store.put("conditions", {
        id: `snapshot-${selectedGauge.siteNumber}`,
        capturedAt: new Date().toISOString(),
        gaugeSite: selectedGauge.siteNumber,
        gaugeName: selectedGauge.siteName,
        flow: selectedGauge.flow,
        gaugeHeight: selectedGauge.height,
        waterTemperature: selectedGauge.waterTemperature,
        turbidity: selectedGauge.turbidity || "",
        flowTrend: selectedGauge.flowTrend,
        area: selectedWeather.area,
        airTemperature: selectedWeather.airTemperature,
        conditions: selectedWeather.conditions,
        wind: selectedWeather.wind,
        windMph: selectedWeather.windMph,
        precipitation: selectedWeather.precipitation,
        pressure: selectedWeather.pressure,
        pressureDelta: selectedWeather.pressureDelta,
        pressureTrend: selectedWeather.pressureTrend,
        uvIndex: selectedWeather.uvIndex,
        source: "USGS/NWS"
      });
    } catch (error) {
      status(conditionStatus, `Readings displayed, but the local snapshot could not be saved: ${error.message}`, true);
    }
  }

  async function renderCachedConditions() {
    const snapshots = await store.getAll("conditions");
    snapshots.sort((left, right) => (right.capturedAt || "").localeCompare(left.capturedAt || ""));
    const snapshot = snapshots[0];
    if (!snapshot) return;

    const savedAt = snapshot.capturedAt ? new Date(snapshot.capturedAt).toLocaleString() : "time unavailable";
    renderGauge({
      siteName: snapshot.gaugeName || `USGS site ${snapshot.gaugeSite || ""}`,
      siteNumber: snapshot.gaugeSite || "Unknown",
      flow: snapshot.flow || "Unavailable",
      height: snapshot.gaugeHeight || "Unavailable",
      waterTemperature: snapshot.waterTemperature || "Unavailable",
      turbidity: snapshot.turbidity || "No USGS turbidity reading",
      flowTrend: snapshot.flowTrend,
      readingAt: savedAt,
      cached: true,
      sample: false
    });
    renderWeather({
      area: snapshot.area || "Saved forecast area",
      airTemperature: snapshot.airTemperature || "Unavailable",
      conditions: snapshot.conditions || "Unavailable",
      wind: snapshot.wind || "Unavailable",
      precipitation: snapshot.precipitation || "Unavailable",
      pressure: snapshot.pressure || "Unavailable",
      pressureTrend: snapshot.pressureTrend || "Unavailable",
      uvIndex: snapshot.uvIndex || "Unavailable",
      observedAt: savedAt,
      windMph: snapshot.windMph,
      pressureDelta: snapshot.pressureDelta,
      cached: true,
      sample: false
    });
    status(conditionStatus, `Showing the latest saved local USGS/NWS snapshot from ${savedAt}. Refresh for live readings.`);
  }

  function initializeMap() {
    const container = $("#field-map");
    if (!container || typeof L === "undefined") {
      status(mapStatus, "Interactive map library is not available. Your saved waypoint list and official map links remain usable.", true);
      return;
    }
    try {
      container.replaceChildren();
      map = L.map(container).setView([42.4, -123.3], 8);
      waypointLayer = L.layerGroup().addTo(map);
      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);
      tiles.once("tileerror", () => status(mapStatus, "Map tiles could not be loaded. Saved waypoints remain available below and the basemap is not stored for offline use.", true));
      status(mapStatus, "OpenStreetMap tiles require a connection. Waypoint records remain stored on this device.");
    } catch (error) {
      status(mapStatus, `Could not initialize the map: ${error.message}`, true);
    }
  }

  async function renderWaypoints() {
    const waypoints = await store.getAll("waypoints");
    waypointList.replaceChildren();
    waypointLayer?.clearLayers();
    if (!waypoints.length) {
      waypointList.append(node("p", "No waypoints saved. Add broad, lawful public access information only.", "log-empty"));
      return;
    }
    for (const waypoint of waypoints) {
      const card = node("article", undefined, "field-card");
      card.append(node("h3", waypoint.name), node("p", waypoint.type, "eyebrow"));
      if (waypoint.notes) card.append(node("p", waypoint.notes));
      card.append(node("p", `${Number(waypoint.latitude).toFixed(5)}, ${Number(waypoint.longitude).toFixed(5)}`, "field-help"));
      const link = node("a", "Open coordinates in OpenStreetMap");
      link.href = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(waypoint.latitude)}&mlon=${encodeURIComponent(waypoint.longitude)}#map=15/${encodeURIComponent(waypoint.latitude)}/${encodeURIComponent(waypoint.longitude)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.append(link);
      const remove = node("button", "Delete waypoint", "shop-reset");
      remove.type = "button";
      remove.dataset.waypointDelete = waypoint.id;
      card.append(remove);
      waypointList.append(card);
      if (map && waypointLayer) {
        L.marker([waypoint.latitude, waypoint.longitude]).bindPopup(
          `<strong>${escapeHtml(waypoint.name)}</strong><br>${escapeHtml(waypoint.type)}`
        ).addTo(waypointLayer);
      }
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  async function renderTackle() {
    const inventory = await store.getAll("tackle");
    tackleList.replaceChildren();
    if (!inventory.length) {
      tackleList.append(node("p", "Your local tackle box is empty.", "log-empty"));
      return;
    }
    inventory.sort((left, right) => left.type.localeCompare(right.type) || left.name.localeCompare(right.name));
    for (const item of inventory) {
      const card = node("article", undefined, "field-card");
      card.append(node("p", item.type, "eyebrow"), node("h3", item.name));
      const detail = [`Quantity: ${item.quantity}`, item.lineDate ? `Line changed: ${item.lineDate}` : "", item.notes || ""].filter(Boolean).join(" · ");
      card.append(node("p", detail));
      const remove = node("button", "Remove", "shop-reset");
      remove.type = "button";
      remove.dataset.tackleDelete = item.id;
      card.append(remove);
      tackleList.append(card);
    }
  }

  $("[data-waypoint-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    try {
      await store.put("waypoints", {
        id: crypto.randomUUID(),
        name: String(values.name).trim(),
        type: String(values.type),
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        notes: String(values.notes || "").trim(),
        savedAt: new Date().toISOString()
      });
      form.reset();
      status(waypointStatus, "Waypoint saved in this browser only.");
      await renderWaypoints();
    } catch (error) {
      status(waypointStatus, `Could not save waypoint: ${error.message}`, true);
    }
  });

  waypointList?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-waypoint-delete]");
    if (!button) return;
    try {
      await store.remove("waypoints", button.dataset.waypointDelete);
      status(waypointStatus, "Waypoint deleted.");
      await renderWaypoints();
    } catch (error) {
      status(waypointStatus, `Could not delete waypoint: ${error.message}`, true);
    }
  });

  $("[data-tackle-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    try {
      await store.put("tackle", {
        id: crypto.randomUUID(),
        type: String(values.type),
        name: String(values.name).trim(),
        lineDate: String(values.lineDate || ""),
        quantity: Number(values.quantity),
        notes: String(values.notes || "").trim(),
        addedAt: new Date().toISOString()
      });
      form.reset();
      form.elements.namedItem("quantity").value = "1";
      status(tackleStatus, "Item added to your local inventory.");
      await renderTackle();
    } catch (error) {
      status(tackleStatus, `Could not save inventory item: ${error.message}`, true);
    }
  });

  tackleList?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-tackle-delete]");
    if (!button) return;
    try {
      await store.remove("tackle", button.dataset.tackleDelete);
      status(tackleStatus, "Inventory item removed.");
      await renderTackle();
    } catch (error) {
      status(tackleStatus, `Could not remove inventory item: ${error.message}`, true);
    }
  });

  $("[data-refresh-conditions]")?.addEventListener("click", refreshConditions);
  gaugeInput?.addEventListener("change", () => {
    selectedGauge = null;
  });
  areaInput?.addEventListener("change", () => {
    selectedWeather = null;
  });

  $("[data-knot-search]")?.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;
    for (const knot of document.querySelectorAll("[data-knot]")) {
      const match = knot.dataset.knot.toLowerCase().includes(query);
      knot.hidden = !match;
      if (match) visible += 1;
    }
    $("[data-knot-empty]").hidden = visible > 0;
  });

  $("[data-species-photo]")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    const preview = $("[data-species-preview]");
    if (priorPhotoUrl) URL.revokeObjectURL(priorPhotoUrl);
    priorPhotoUrl = null;
    preview.hidden = true;
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      status($("[data-species-photo-status]"), "Choose an image up to 8 MB. The photo stays in this browser and is not sent to an AI service.", true);
      event.target.value = "";
      return;
    }
    priorPhotoUrl = URL.createObjectURL(file);
    preview.src = priorPhotoUrl;
    preview.hidden = false;
    status($("[data-species-photo-status]"), "Private photo preview only. No automated species identification model is installed.");
  });

  if (!store) {
    status(conditionStatus, "Local field storage did not load. Reload before saving waypoints or tackle.", true);
    return;
  }

  initializeMap();
  Promise.all([renderWaypoints(), renderTackle(), renderCachedConditions()]).catch((error) => {
    status(conditionStatus, `Could not read local field data: ${error.message}`, true);
  });
})();
