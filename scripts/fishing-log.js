(() => {
  "use strict";

  const LEGACY_FIELDS = ["date", "species", "water", "method", "gear", "bait", "length", "notes"];
  const CSV_FIELDS = [
    "date", "time", "species", "water", "method", "gear", "bait", "lineType",
    "depth", "weight", "length", "waterTemperature", "barometricPressure", "pressureTrend", "weather",
    "moonPhase", "privacy", "notes"
  ];

  function makeTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function localDateTime() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    return { date: local.slice(0, 10), time: local.slice(11, 16) };
  }

  function csvCell(value) {
    let text = String(value ?? "");
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadFile(filename, contents, type) {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/geo+json, application/json" } });
    if (!response.ok) throw new Error(`Request failed (${response.status}).`);
    return response.json();
  }

  function getCurrentPosition() {
    if (!navigator.geolocation) {
      return Promise.reject(new Error("This browser does not provide location access."));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(new Error(error.code === 1 ? "Location permission was denied." : "Could not read your current location.")),
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
      );
    });
  }

  function moonPhaseName(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const adjustedYear = month < 3 ? year - 1 : year;
    const adjustedMonth = month < 3 ? month + 12 : month;
    const century = Math.floor(adjustedYear / 100);
    const correction = 2 - century + Math.floor(century / 4);
    const julianDay = Math.floor(365.25 * (adjustedYear + 4716)) +
      Math.floor(30.6001 * (adjustedMonth + 1)) + day + correction - 1524.5;
    const phase = ((julianDay - 2451549.5) / 29.53059 % 1 + 1) % 1;
    if (phase < 0.035 || phase > 0.965) return "New Moon";
    if (phase < 0.22) return "Waxing Crescent";
    if (phase < 0.28) return "First Quarter";
    if (phase < 0.47) return "Waxing Gibbous";
    if (phase < 0.53) return "Full Moon";
    if (phase < 0.72) return "Waning Gibbous";
    if (phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  }

  function sampleEnvironment(coords, gaugeNumber, catchDate) {
    const seed = Math.abs(Math.round(coords.latitude * 31 + coords.longitude * 17 + new Date().getDate()));
    const airTemperatureF = 48 + (seed % 29);
    const barometricPressureInHg = Math.round((29.65 + (seed % 55) / 100) * 100) / 100;
    const conditions = ["Partly cloudy", "Light showers", "Cloudy", "Mostly sunny"][seed % 4];
    return {
      capturedAt: new Date().toISOString(),
      source: "Generated sample — not a live observation",
      sample: true,
      broadArea: "",
      airTemperatureF,
      conditions,
      wind: `${3 + (seed % 9)} mph`,
      precipitationChance: seed % 4 === 1 ? 40 : 10,
      barometricPressureInHg,
      pressureTrend: ["Steady (sample)", "Rising (sample)", "Falling (sample)"][seed % 3],
      gaugeSite: gaugeNumber || "Illustrative local sample",
      gaugeReadingAt: "Not a live reading",
      waterTemperatureF: Math.round((45 + (seed % 31)) * 10) / 10,
      waterTemperatureC: Math.round((45 + (seed % 31) - 32) * 5 / 9 * 10) / 10,
      moonPhase: moonPhaseName(catchDate)
    };
  }

  async function captureEnvironment(coords, gaugeNumber, catchDate) {
    const point = await fetchJson(`https://api.weather.gov/points/${coords.latitude},${coords.longitude}`);
    const properties = point.properties || {};
    const location = properties.relativeLocation?.properties;
    const environment = {
      capturedAt: new Date().toISOString(),
      source: `National Weather Service${gaugeNumber ? " and USGS when available" : ""}`,
      broadArea: location ? [location.city, location.state].filter(Boolean).join(", ") : "",
      moonPhase: moonPhaseName(catchDate)
    };

    if (properties.forecastHourly) {
      const forecast = await fetchJson(properties.forecastHourly);
      const current = forecast.properties?.periods?.[0];
      if (current) {
        environment.airTemperatureF = current.temperature;
        environment.conditions = current.shortForecast || "";
        environment.wind = [current.windSpeed, current.windDirection].filter(Boolean).join(" ");
        environment.precipitationChance = current.probabilityOfPrecipitation?.value ?? null;
      }
    }

    if (properties.observationStations) {
      const stations = await fetchJson(properties.observationStations);
      const stationUrl = stations.features?.[0]?.id;
      if (stationUrl) {
        const observation = await fetchJson(`${stationUrl.replace(/\/$/, "")}/observations/latest`);
        const current = observation.properties || {};
        const airTemperature = current.temperature?.value;
        const pressure = current.barometricPressure?.value;
        if (typeof airTemperature === "number") {
          environment.airTemperatureF = Math.round((airTemperature * 9 / 5 + 32) * 10) / 10;
        }
        if (typeof pressure === "number") {
          environment.barometricPressureInHg = Math.round(pressure * 0.0002953 * 100) / 100;
        }
        environment.observationAt = current.timestamp || "";
        try {
          const start = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
          const observationsUrl = new URL(`${stationUrl.replace(/\/$/, "")}/observations`);
          observationsUrl.search = new URLSearchParams({ start, limit: "50" });
          const observations = await fetchJson(observationsUrl);
          const pressureReadings = (observations.features || [])
            .map((feature) => ({
              timestamp: feature.properties?.timestamp || "",
              value: feature.properties?.barometricPressure?.value
            }))
            .filter((reading) => Number.isFinite(reading.value))
            .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
          if (pressureReadings.length > 1) {
            const changeInHg = (pressureReadings.at(-1).value - pressureReadings[0].value) * 0.0002953;
            environment.pressureTrend = Math.abs(changeInHg) < 0.01 ? "Steady over recent observations" :
              changeInHg > 0 ? "Rising over recent observations" : "Falling over recent observations";
          } else {
            environment.pressureTrend = "Not enough recent observations";
          }
        } catch (error) {
          environment.pressureTrend = `Unavailable: ${error.message}`;
        }
      }
    }

    if (gaugeNumber) {
      try {
        const url = new URL("https://waterservices.usgs.gov/nwis/iv/");
        url.search = new URLSearchParams({
          format: "json",
          sites: gaugeNumber,
          parameterCd: "00010",
          siteStatus: "all"
        });
        const gauge = await fetchJson(url);
        const series = gauge.value?.timeSeries?.find((item) => item.variable?.variableCode?.[0]?.value === "00010");
        const reading = series?.values?.[0]?.value?.at(-1);
        if (reading && Number(reading.value) > -999000) {
          environment.waterTemperatureC = Number(reading.value);
          environment.waterTemperatureF = Math.round((Number(reading.value) * 9 / 5 + 32) * 10) / 10;
          environment.gaugeSite = series.sourceInfo?.siteName || gaugeNumber;
          environment.gaugeReadingAt = reading.dateTime;
        }
      } catch (error) {
        environment.gaugeError = error.message;
      }
    }
    return environment;
  }

  async function blobToDataUrl(blob) {
    if (!blob) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), { once: true });
      reader.addEventListener("error", () => reject(new Error("Could not read a catch photo for export.")), { once: true });
      reader.readAsDataURL(blob);
    });
  }

  function dataUrlToBlob(dataUrl) {
    if (!dataUrl) return null;
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      throw new Error("The backup contains an unsupported photo format.");
    }
    const [metadata, encoded] = dataUrl.split(",");
    const mimeType = metadata.match(/^data:([^;]+)/)?.[1];
    if (!mimeType || !mimeType.startsWith("image/")) throw new Error("The backup contains an invalid photo.");
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mimeType });
  }

  async function makePortableBackup() {
    const backup = await window.AnglerFieldStore.exportAll();
    backup.data.catches = await Promise.all(backup.data.catches.map(async (entry) => {
      const photoDataUrl = await blobToDataUrl(entry.photo);
      const { photo, ...portableEntry } = entry;
      return { ...portableEntry, photoDataUrl };
    }));
    return backup;
  }

  function setStatus(element, message, isError) {
    element.textContent = message;
    element.className = isError ? "form-status form-status--error" : "form-status";
  }

  function initialize() {
    const form = document.querySelector("[data-log-form]");
    const status = document.querySelector("[data-log-status]");
    const list = document.querySelector("[data-log-entries]");
    const exportButton = document.querySelector("[data-log-export]");
    const shareExportButton = document.querySelector("[data-log-share-export]");
    const backupButton = document.querySelector("[data-log-backup]");
    const importInput = document.querySelector("[data-log-import]");
    const clearButton = document.querySelector("[data-log-clear]");
    const captureButton = document.querySelector("[data-capture-weather]");
    const environmentStatus = document.querySelector("[data-environment-status]");
    const gaugeStatus = document.querySelector("[data-log-gauge-status]");
    if (!form || !status || !list || !exportButton || !shareExportButton || !backupButton || !importInput || !clearButton) return;

    const store = window.AnglerFieldStore;
    if (!store) {
      setStatus(status, "Local field storage could not be loaded. Reload the page before entering a catch.", true);
      form.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    let entries = [];
    let capturedEnvironment = null;
    let capturedCoordinates = null;
    let displayedPhotoUrls = [];
    const dateInput = form.querySelector('[name="date"]');
    const timeInput = form.querySelector('[name="time"]');
    const dateTime = localDateTime();
    dateInput.value = dateTime.date;
    timeInput.value = dateTime.time;

    function render() {
      for (const url of displayedPhotoUrls) URL.revokeObjectURL(url);
      displayedPhotoUrls = [];
      list.replaceChildren();
      const sorted = entries.slice().sort((left, right) =>
        (right.date + right.time).localeCompare(left.date + left.time)
      );
      if (!sorted.length) {
        list.append(makeTextElement("p", "log-empty", "No catches yet. Add one above to start your personal log."));
      }

      for (const entry of sorted) {
        const card = document.createElement("article");
        card.className = "log-entry";
        const timeLabel = entry.time ? ` · ${entry.time}` : "";
        card.append(makeTextElement("p", "eyebrow", entry.privacy === "fuzzy" ? "Fuzzy location" : entry.privacy === "friends" ? "Friends only · device only" : "Private · device only"));
        card.append(makeTextElement("h3", "", `${entry.species} — ${entry.date}${timeLabel}`));

        const details = document.createElement("dl");
        const rows = [
          ["Water or area", entry.water],
          ["Method", entry.method],
          ["Rod and reel", entry.gear],
          ["Lure or bait", entry.bait],
          ["Line", entry.lineType],
          ["Depth (ft)", entry.depth],
          ["Weight (lb)", entry.weight],
          ["Length (in)", entry.length],
          ["Water temperature (°F)", entry.waterTemperature || entry.environment?.waterTemperatureF],
          ["Barometric pressure (inHg)", entry.barometricPressure || entry.environment?.barometricPressureInHg],
          ["Pressure trend", entry.environment?.pressureTrend],
          ["Weather", entry.weather || entry.environment?.conditions],
          ["Moon", entry.moonPhase || entry.environment?.moonPhase],
          ["Environmental reading", entry.environment?.capturedAt ? `${entry.environment.source || "Source"} · ${new Date(entry.environment.capturedAt).toLocaleString()}` : ""],
          ["Exact GPS", entry.coordinates ? `${entry.coordinates.latitude.toFixed(5)}, ${entry.coordinates.longitude.toFixed(5)}` : ""],
          ["Notes", entry.notes]
        ];
        for (const [label, value] of rows) {
          if (value === "" || value === null || value === undefined) continue;
          details.append(makeTextElement("dt", "", label), makeTextElement("dd", "", String(value)));
        }
        card.append(details);
        if (entry.photo instanceof Blob) {
          const image = document.createElement("img");
          image.className = "log-entry__photo";
          image.src = URL.createObjectURL(entry.photo);
          displayedPhotoUrls.push(image.src);
          image.alt = `Catch photo for ${entry.species}`;
          card.append(image);
        }
        const removeButton = makeTextElement("button", "shop-reset", "Delete entry");
        removeButton.type = "button";
        removeButton.dataset.logDelete = entry.id;
        card.append(removeButton);
        list.append(card);
      }
      exportButton.disabled = entries.length === 0;
      shareExportButton.disabled = !entries.some((entry) => entry.privacy === "friends" || entry.privacy === "fuzzy");
      clearButton.disabled = entries.length === 0;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const formData = new FormData(form);
      const photo = formData.get("photo");
      if (photo instanceof File && photo.size > 8 * 1024 * 1024) {
        setStatus(status, "The catch photo must be 8 MB or smaller.", true);
        return;
      }
      if (photo instanceof File && photo.size && !photo.type.startsWith("image/")) {
        setStatus(status, "Choose an image file for the catch photo.", true);
        return;
      }

      const fields = Object.fromEntries(CSV_FIELDS.map((field) => [field, String(formData.get(field) || "").trim()]));
      const entry = {
        ...fields,
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        coordinates: formData.get("saveCoordinates") === "on" ? capturedCoordinates : null,
        environment: capturedEnvironment,
        photo: photo instanceof File && photo.size ? photo.slice(0, photo.size, photo.type) : null
      };
      try {
        await store.put("catches", entry);
        entries.push(entry);
        form.reset();
        const current = localDateTime();
        dateInput.value = current.date;
        timeInput.value = current.time;
        capturedEnvironment = null;
        capturedCoordinates = null;
        setStatus(status, "Catch saved in this browser on this device.");
        if (environmentStatus) setStatus(environmentStatus, "Location and weather capture reset for the next entry.");
        render();
      } catch (error) {
        setStatus(status, `Could not save this entry locally: ${error.message}`, true);
      }
    });

    captureButton?.addEventListener("click", async () => {
      captureButton.disabled = true;
      setStatus(environmentStatus, "Requesting your location and current official conditions…");
      setStatus(gaugeStatus, "");
      let coords;
      try {
        if (!dateInput.value) throw new Error("Enter the catch date before capturing conditions.");
        coords = await getCurrentPosition();
        const gaugeNumber = String(new FormData(form).get("gauge") || "").trim();
        const catchDate = new Date(`${dateInput.value}T${timeInput.value || "12:00"}`);
        if (Number.isNaN(catchDate.getTime())) throw new Error("Enter a valid catch date and time.");
        let environment;
        try {
          environment = await captureEnvironment(coords, gaugeNumber, catchDate);
        } catch (error) {
          environment = sampleEnvironment(coords, gaugeNumber, catchDate);
          environment.sampleError = error.message;
        }
        capturedEnvironment = environment;
        capturedCoordinates = { latitude: coords.latitude, longitude: coords.longitude };
        const locationLabel = environment.broadArea ? ` near ${environment.broadArea}` : "";
        setStatus(
          environmentStatus,
          environment.sample
            ? `Live conditions were unavailable (${environment.sampleError}). Clearly labeled sample values were generated; they are not observations. ${environment.moonPhase} was calculated on this device. Exact GPS is saved only if you separately opt in.`
            : `Conditions captured${locationLabel}. ${environment.airTemperatureF !== undefined ? `${environment.airTemperatureF}°F air` : "Air temperature unavailable"}; ${environment.conditions || "forecast unavailable"}; ${environment.moonPhase}. Exact GPS will only be saved if you separately opt in.${environment.gaugeError ? ` USGS gauge data unavailable: ${environment.gaugeError}` : ""}`
        );
        if (gaugeNumber) {
          const gaugeMessage = environment.gaugeError
            ? `Could not load USGS gauge data: ${environment.gaugeError}. NWS conditions were retained.`
            : environment.waterTemperatureF !== undefined
              ? `${environment.gaugeSite}: ${environment.waterTemperatureF}°F water, reading ${environment.gaugeReadingAt || "time unavailable"}.`
              : "The selected USGS site did not return a current water-temperature reading.";
          setStatus(gaugeStatus, gaugeMessage, Boolean(environment.gaugeError));
        }
      } catch (error) {
        capturedEnvironment = null;
        capturedCoordinates = null;
        setStatus(environmentStatus, `Could not capture current conditions: ${error.message} You can still enter the catch and add conditions manually.`, true);
      } finally {
        captureButton.disabled = false;
      }
    });

    list.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-log-delete]");
      if (!button) return;
      try {
        await store.remove("catches", button.dataset.logDelete);
        entries = entries.filter((entry) => entry.id !== button.dataset.logDelete);
        setStatus(status, "Catch deleted from this device.");
        render();
      } catch (error) {
        setStatus(status, `Could not delete the catch: ${error.message}`, true);
      }
    });

    clearButton.addEventListener("click", async () => {
      if (!window.confirm("Delete every catch in this browser's fishing log? This cannot be undone.")) return;
      try {
        await store.clear("catches");
        entries = [];
        setStatus(status, "Fishing log cleared from this device.");
        render();
      } catch (error) {
        setStatus(status, `Could not clear the fishing log: ${error.message}`, true);
      }
    });

    exportButton.addEventListener("click", () => {
      const rows = [CSV_FIELDS].concat(entries.map((entry) => CSV_FIELDS.map((field) => {
        if (field === "waterTemperature" && !entry.waterTemperature) return entry.environment?.waterTemperatureF || "";
        if (field === "barometricPressure" && !entry.barometricPressure) return entry.environment?.barometricPressureInHg || "";
        if (field === "pressureTrend") return entry.environment?.pressureTrend || "";
        if (field === "weather" && !entry.weather) return entry.environment?.conditions || "";
        if (field === "moonPhase" && !entry.moonPhase) return entry.environment?.moonPhase || "";
        return entry[field] || "";
      })));
      downloadFile("fishing-log.csv", "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
      setStatus(status, "CSV export created. Photos and exact coordinates are not included.");
    });

    shareExportButton.addEventListener("click", () => {
      const reports = entries
        .filter((entry) => entry.privacy === "friends" || entry.privacy === "fuzzy")
        .map((entry) => ({
          species: entry.species,
          date: entry.date,
          time: entry.time,
          broadWater: entry.water,
          method: entry.method,
          gear: entry.gear,
          bait: entry.bait,
          lineType: entry.lineType,
          depth: entry.depth,
          weight: entry.weight,
          length: entry.length,
          privacy: entry.privacy,
          environmentalSummary: entry.environment ? {
            airTemperatureF: entry.environment.airTemperatureF,
            waterTemperatureF: entry.environment.waterTemperatureF,
            barometricPressureInHg: entry.environment.barometricPressureInHg,
            conditions: entry.environment.conditions,
            moonPhase: entry.environment.moonPhase,
            capturedAt: entry.environment.capturedAt
          } : null
        }));
      if (!reports.length) {
        setStatus(status, "There are no Friends-only or Fuzzy entries to export.", true);
        return;
      }
      downloadFile(
        "angler-share-ready-reports.json",
        JSON.stringify({ format: "angler-share-ready-v1", exportedAt: new Date().toISOString(), reports }, null, 2),
        "application/json"
      );
      setStatus(status, "Share-ready file created. It omits Private entries, photos, exact GPS, pressure, and catch notes. Check broad-water text before sharing.");
    });

    backupButton.addEventListener("click", async () => {
      try {
        const backup = await makePortableBackup();
        downloadFile("angler-field-backup.json", JSON.stringify(backup), "application/json");
        setStatus(status, "Full backup created. It can contain photos and exact GPS; keep the file private.");
      } catch (error) {
        setStatus(status, `Could not create a full backup: ${error.message}`, true);
      }
    });

    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const backup = JSON.parse(await file.text());
        backup.data.catches = backup.data.catches.map((entry) => {
          const { photoDataUrl, ...record } = entry;
          return { ...record, photo: dataUrlToBlob(photoDataUrl) };
        });
        const count = await store.importAll(backup);
        entries = await store.getAll("catches");
        setStatus(status, `Imported ${count} local field records. Matching record IDs were updated.`);
        render();
      } catch (error) {
        setStatus(status, `Could not import this backup: ${error.message}`, true);
      } finally {
        importInput.value = "";
      }
    });

    async function loadEntries() {
      try {
        const migrated = await store.migrateLegacyLog();
        entries = await store.getAll("catches");
        setStatus(status, migrated ? `Moved ${migrated} existing catch record(s) into the new local log. The old browser data was preserved.` : "");
        render();
      } catch (error) {
        setStatus(status, `Could not open the saved fishing log: ${error.message} No saved data was intentionally deleted.`, true);
        form.querySelector('button[type="submit"]').disabled = true;
      }
    }

    loadEntries();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
