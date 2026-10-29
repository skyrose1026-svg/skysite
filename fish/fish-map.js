document.querySelectorAll("[data-fish-map]").forEach((container) => {
  let locations;
  try {
    locations = JSON.parse(container.dataset.pins || "[]");
  } catch (error) {
    container.textContent = "The map locations could not be read. Use the location list on this page.";
    console.error("Could not read fish map locations.", error);
    return;
  }
  container.setAttribute("role", "region");
  container.setAttribute("tabindex", "0");
  if (!locations.length) {
    container.textContent = "Map locations are not available. Use the location list on this page.";
    console.error("Fish map has no location pins.");
    return;
  }
  if (typeof L === "undefined") {
    container.textContent = "The interactive map could not load. See the location list on this page.";
    console.error("Leaflet did not load; fish map is unavailable.");
    return;
  }

  container.setAttribute("aria-label", `Map of ${document.querySelector("h1")?.textContent || "fishing"} locations`);
  const map = L.map(container).setView([locations[0].lat, locations[0].lng], 8);
  const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  });
  tiles.once("tileerror", () => {
    if (container.nextElementSibling?.classList.contains("map-status")) return;
    const status = document.createElement("p");
    status.className = "map-status";
    status.setAttribute("role", "status");
    status.textContent = "Map imagery is unavailable. Use the location list on this page.";
    container.insertAdjacentElement("afterend", status);
  });
  tiles.addTo(map);

  locations.forEach((location) => {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong>`);
  });

  if (locations.length > 1) {
    map.fitBounds(locations.map(({ lat, lng }) => [lat, lng]), { padding: [24, 24] });
  }
});
