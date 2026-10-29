(() => {
  "use strict";

  if (typeof window.initWatersMap !== "function") {
    console.error("[home-map] Water map utility is unavailable.");
    return;
  }

  window.initWatersMap({
    containerId: "home-water-map",
    guideNavigation: false,
    center: [42.4, -123.05],
    zoom: 7.5,
    accessibleLabel: "Map of Southern Oregon rivers, lakes, and ponds",
    overviewHref: "./waters/waters.html#stillwater",
    markers: [
      { name: "Rogue River", water: "Rogue River", fish: "Salmon, steelhead, trout, and bass", slug: "rogue-river", lat: 42.44, lng: -123.33 },
      { name: "Applegate Lake", water: "Applegate Lake", fish: "Trout and kokanee", href: "./waters/waters.html#stillwater", lat: 42.1, lng: -123.35 },
      { name: "Lost Creek Reservoir", water: "Lost Creek Reservoir", fish: "Rainbow trout", href: "./waters/waters.html#stillwater", lat: 42.735, lng: -122.545 },
      { name: "Howard Prairie Reservoir", water: "Howard Prairie Reservoir", fish: "Rainbow trout", href: "./waters/waters.html#stillwater", lat: 42.083, lng: -122.336 },
      { name: "Lake of the Woods", water: "Lake of the Woods", fish: "Trout and perch", href: "./waters/waters.html#stillwater", lat: 42.096, lng: -122.113 },
      { name: "Emigrant Reservoir", water: "Emigrant Reservoir", fish: "Bass and panfish", href: "./waters/waters.html#stillwater", lat: 42.18, lng: -122.66 },
      { name: "Agate Lake", water: "Agate Lake", fish: "Bass and panfish", href: "./waters/waters.html#stillwater", lat: 42.44, lng: -122.83 },
      { name: "Lake Selmac", water: "Lake Selmac", fish: "Bass, bluegill, and crappie", href: "./waters/waters.html#stillwater", lat: 42.18, lng: -123.68 },
      { name: "Expo Pond", water: "Expo Pond", fish: "Trout and warmwater fish", href: "./waters/waters.html#stillwater", lat: 42.335, lng: -122.873 }
    ]
  });
})();
