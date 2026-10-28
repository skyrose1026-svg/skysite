const saltwaterLocations = [
  { name: "Brookings Harbor", lat: 42.052, lng: -124.282 },
  { name: "Port Orford", lat: 42.744, lng: -124.498 },
  { name: "Gold Beach / Rogue estuary", lat: 42.417, lng: -124.421 },
  { name: "Bandon", lat: 43.119, lng: -124.414 },
  { name: "Charleston / Coos Bay", lat: 43.345, lng: -124.322 }
];

function initializeSaltwaterMap() {
  const container = document.querySelector("#map-saltwater");
  if (!container) return;
  if (typeof L === "undefined") {
    container.textContent = "The coastal map could not load. Use the access list above.";
    console.error("Leaflet did not load; saltwater access map is unavailable.");
    return;
  }

  const map = L.map(container).setView([43.1, -124.4], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  saltwaterLocations.forEach((location) => {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong><br>Coastal access region, not an exact fishing spot.`);
  });

  map.fitBounds(saltwaterLocations.map(({ lat, lng }) => [lat, lng]), { padding: [24, 24] });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSaltwaterMap);
} else {
  initializeSaltwaterMap();
}
