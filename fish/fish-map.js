document.querySelectorAll("[data-fish-map]").forEach((container) => {
  const locations = JSON.parse(container.dataset.pins || "[]");
  if (!locations.length) {
    console.error("Fish map has no location pins.");
    return;
  }
  if (typeof L === "undefined") {
    container.textContent = "The interactive map could not load. See the location list on this page.";
    console.error("Leaflet did not load; fish map is unavailable.");
    return;
  }

  const map = L.map(container).setView([locations[0].lat, locations[0].lng], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  locations.forEach((location) => {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong>`);
  });

  if (locations.length > 1) {
    map.fitBounds(locations.map(({ lat, lng }) => [lat, lng]), { padding: [24, 24] });
  }
});
