const tripForm = document.querySelector("[data-trip-form]");
const tripWater = document.querySelector("#trip-water");
const tripDate = document.querySelector("#trip-date");
const tripStatus = document.querySelector("[data-trip-status]");
const tripResults = document.querySelector("[data-trip-results]");

function tripElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function tripError(error) {
  tripStatus.textContent = error.message || "Trip details could not be loaded.";
  tripStatus.className = "form-status form-status--error";
}

function findWaterOption(slug) {
  const requestedSlug = slug.replace(/\.html$/i, "");
  return [...tripWater.options].find((option) =>
    option.value.split("/").pop().replace(/\.html$/i, "") === requestedSlug
  );
}

async function loadWaterOptions() {
  const response = await fetch("./site-search-index.json");
  if (!response.ok) throw new Error(`Could not load the water guide list (${response.status}).`);
  const documents = await response.json();
  const waters = documents.filter((document) => /^waters\/[^/]+-river\.html$/.test(document.url));
  if (!waters.length) throw new Error("No waters are available in the guide.");
  tripWater.replaceChildren(new Option("Choose a water", ""));
  for (const water of waters) {
    const name = water.title.replace(/\s+(?:\||-|–|—)\s+Southern Oregon Angler Guide\s*$/i, "");
    tripWater.append(new Option(name, water.url));
  }
}

async function loadWaterPage() {
  const url = new URL(tripWater.value, window.location.href);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load this water guide (${response.status}).`);
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

function renderSeasonNotes(page) {
  const detailsSection = [...page.querySelectorAll("section")].find((section) =>
    section.querySelector("h2")?.textContent.toLowerCase().includes("details")
  );
  const rows = [...(detailsSection?.querySelectorAll("tr") || [])];
  const relevantRows = rows.filter((row) => {
    const topic = row.querySelector("td")?.textContent.trim().toLowerCase() || "";
    return /season|best water|hazard|access/.test(topic);
  });
  const section = tripElement("section", "trip-card");
  section.append(tripElement("h2", "", "Water and seasonal notes"));
  if (relevantRows.length) {
    const list = document.createElement("dl");
    for (const row of relevantRows) {
      const cells = [...row.querySelectorAll("td")];
      if (cells.length < 2) continue;
      list.append(tripElement("dt", "", cells[0].textContent.trim()));
      list.append(tripElement("dd", "", cells[1].textContent.trim()));
    }
    section.append(list);
  } else {
    section.append(tripElement("p", "", "See the water guide for species, access, and timing notes."));
  }
  const guideLink = tripElement("a", "", "Open the full water guide");
  guideLink.href = new URL(tripWater.value, window.location.href).href;
  section.append(guideLink);
  return section;
}

function renderLodging(waterName) {
  const section = tripElement("section", "trip-card trip-lodging");
  section.append(tripElement("h2", "", `Places to stay near ${waterName}`));
  section.append(tripElement("p", "", "Browse nearby options for your trip. Listings, access, and seasonal availability can change; confirm details and reservations directly."));

  const options = [
    ["Campgrounds & state parks", "campgrounds and state parks"],
    ["Hotels & motels", "hotels and motels"],
    ["RV parks", "RV parks"],
    ["Cabins & vacation rentals", "cabins and vacation rentals"]
  ];
  const cards = tripElement("div", "trip-lodging__options");
  for (const [label, searchTerm] of options) {
    const link = tripElement("a", "trip-lodging__option", label);
    const searchUrl = new URL("https://www.google.com/maps/search/");
    searchUrl.searchParams.set("api", "1");
    searchUrl.searchParams.set("query", `${searchTerm} near ${waterName}, Oregon`);
    link.href = searchUrl.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Search Google Maps for ${searchTerm} near ${waterName}, Oregon`);
    cards.append(link);
  }
  section.append(cards);
  return section;
}

async function getForecast(lat, lng, dateValue) {
  const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lng}`, {
    headers: { Accept: "application/geo+json" }
  });
  if (!pointResponse.ok) throw new Error(`National Weather Service location lookup failed (${pointResponse.status}).`);
  const pointData = await pointResponse.json();
  const forecastUrl = pointData.properties?.forecast;
  if (!forecastUrl) throw new Error("The National Weather Service did not provide a forecast link for this location.");
  const forecastResponse = await fetch(forecastUrl, { headers: { Accept: "application/geo+json" } });
  if (!forecastResponse.ok) throw new Error(`National Weather Service forecast request failed (${forecastResponse.status}).`);
  const forecast = await forecastResponse.json();
  const periods = forecast.properties?.periods || [];
  const tripDay = dateValue;
  const match = periods.find((period) => period.startTime?.slice(0, 10) === tripDay) ||
    periods.find((period) => period.endTime?.slice(0, 10) === tripDay);
  const section = tripElement("section", "trip-card");
  section.append(tripElement("h2", "", `Forecast for ${new Date(`${tripDay}T12:00:00`).toLocaleDateString()}`));
  if (!match) {
    section.append(tripElement("p", "", "A date-specific forecast is not available in the current 7-day forecast window. Check again closer to your trip."));
    return section;
  }
  section.append(tripElement("p", "trip-forecast__summary", `${match.name}: ${match.shortForecast}, ${match.temperature}°${match.temperatureUnit}`));
  section.append(tripElement("p", "", `Wind: ${match.windSpeed} ${match.windDirection || ""}`.trim()));
  const precipitation = match.probabilityOfPrecipitation?.value;
  if (precipitation !== null && precipitation !== undefined) {
    section.append(tripElement("p", "", `Precipitation chance: ${precipitation}%`));
  }
  if (match.detailedForecast) section.append(tripElement("p", "", match.detailedForecast));
  return section;
}

async function renderTrip() {
  if (!tripWater.value || !tripDate.value) {
    tripError(new Error("Choose a water and planned date."));
    return;
  }
  tripResults.replaceChildren();
  tripStatus.textContent = "Loading water notes and forecast…";
  tripStatus.className = "form-status";
  const page = await loadWaterPage();
  const waterName = page.querySelector("h1")?.textContent.trim() || tripWater.selectedOptions[0].textContent;
  const weather = page.querySelector("#weather");
  const details = tripElement("section", "trip-card");
  details.append(tripElement("h2", "", waterName));
  const fishLinks = [...page.querySelectorAll("a.badge--fish")];
  const fish = fishLinks.map((link) => link.textContent.trim());
  if (fish.length) details.append(tripElement("p", "", `Species listed in the guide: ${fish.join(", ")}`));
  if (fishLinks.length) {
    const fishSlug = fishLinks[0].getAttribute("href").split("/").pop().replace(/\.html$/, "");
    const waterSlug = tripWater.value.split("/").pop().replace(/\.html$/, "");
    const setupLink = tripElement("a", "", `Build a ${fish[0]} setup for this trip`);
    setupLink.href = `./setup-builder.html?fish=${encodeURIComponent(fishSlug)}&water=${encodeURIComponent(waterSlug)}`;
    details.append(setupLink);
  }
  tripResults.append(details, renderSeasonNotes(page), renderLodging(waterName));

  if (!weather?.dataset.lat || !weather?.dataset.lng) {
    throw new Error("This water guide does not include coordinates for a forecast lookup.");
  }
  tripResults.append(await getForecast(weather.dataset.lat, weather.dataset.lng, tripDate.value));
  tripStatus.textContent = "Trip details loaded. Confirm current conditions and official regulations before departure.";
  tripStatus.className = "form-status";
}

tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderTrip().catch(tripError);
});

async function initializeTripPlanner() {
  try {
    const now = new Date();
    tripDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    tripDate.min = tripDate.value;
    const params = new URLSearchParams(window.location.search);
    await loadWaterOptions();
    const requestedWater = params.get("water");
    if (requestedWater) {
      const option = findWaterOption(requestedWater);
      if (option) tripWater.value = option.value;
    }
    if (tripWater.value) await renderTrip();
  } catch (error) {
    tripError(error);
  }
}

initializeTripPlanner();
