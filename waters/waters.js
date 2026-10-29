(function () {
  function showMapFallback(element, message) {
    if (!element) return;
    element.setAttribute("role", "region");
    element.setAttribute("tabindex", "0");
    element.textContent = message;
  }

  function showMapStatus(element, message) {
    if (!element || element.nextElementSibling?.classList.contains("map-status")) return;
    var status = document.createElement("p");
    status.className = "map-status";
    status.setAttribute("role", "status");
    status.textContent = message;
    element.insertAdjacentElement("afterend", status);
  }

  function initMap(elementId, options) {
    var element = document.getElementById(elementId);
    if (!element) {
      console.error("Could not initialize map: missing map container", elementId);
      return null;
    }
    element.setAttribute("role", "region");
    element.setAttribute("tabindex", "0");
    element.setAttribute(
      "aria-label",
      "Map of " + (document.querySelector("h1")?.textContent || "fishing waters")
    );
    if (typeof L === "undefined") {
      showMapFallback(element, "The interactive map is unavailable. Use the water and access information on this page.");
      console.error("Leaflet did not load; map is unavailable.", elementId);
      return null;
    }
    var center = options.center || [43.8, -120.5];
    var zoom = options.zoom || 7;
    var map = L.map(element).setView(center, zoom);
    var tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      maxZoom: 18
    });
    tiles.once("tileerror", function () {
      showMapStatus(element, "Map imagery is unavailable. The written location and access notes remain available on this page.");
    });
    tiles.addTo(map);
    return map;
  }

  function nwsIconToEmoji(forecast) {
    var f = forecast.toLowerCase();
    if (f.indexOf("sunny") !== -1 || f.indexOf("clear") !== -1) return "☀️";
    if (f.indexOf("mostly cloudy") !== -1) return "☁️";
    if (f.indexOf("partly cloudy") !== -1) return "⛅";
    if (f.indexOf("cloudy") !== -1) return "☁️";
    if (f.indexOf("rain") !== -1 || f.indexOf("showers") !== -1) return "🌧️";
    if (f.indexOf("thunder") !== -1 || f.indexOf("storm") !== -1) return "⛈️";
    if (f.indexOf("snow") !== -1 || f.indexOf("flurries") !== -1) return "🌨️";
    if (f.indexOf("fog") !== -1 || f.indexOf("mist") !== -1) return "🌫️";
    return "🌡️";
  }

  function fetchNwsForecast(lat, lng) {
    var pointsUrl = "https://api.weather.gov/points/" + lat + "," + lng;
    return fetch(pointsUrl, { headers: { "User-Agent": "SouthernOregonAnglerGuide (student project)" } })
      .then(function (res) {
        if (!res.ok) throw new Error("National Weather Service location lookup failed (" + res.status + ").");
        return res.json();
      })
      .then(function (points) {
        var forecastUrl = points.properties && points.properties.forecast;
        if (!forecastUrl) throw new Error("National Weather Service did not provide a forecast for this location.");
        return fetch(forecastUrl, { headers: { "User-Agent": "SouthernOregonAnglerGuide (student project)" } })
          .then(function (res) {
            if (!res.ok) throw new Error("National Weather Service forecast request failed (" + res.status + ").");
            return res.json();
          });
      });
  }

  function renderWeather(container, data) {
    var periods = data.properties && data.properties.periods;
    if (!periods || periods.length === 0) {
      container.textContent = "Weather forecast unavailable.";
      return;
    }
    var forecast = document.createElement("div");
    forecast.className = "weather-current";
    periods.slice(0, 8).forEach(function (period, index) {
      var day = document.createElement("div");
      day.className = "weather-day";
      var heading = document.createElement("strong");
      heading.textContent = period.name || (index === 0 ? "Current forecast" : "Forecast");
      var summary = document.createElement("p");
      summary.textContent = nwsIconToEmoji(period.shortForecast || "") + " " + (period.temperature === undefined ? "Temperature unavailable" : period.temperature + "°F");
      var conditions = document.createElement("p");
      conditions.textContent = period.shortForecast || "Forecast unavailable";
      var wind = document.createElement("p");
      wind.textContent = "Wind " + (period.windSpeed || "unavailable");
      day.append(heading, summary, conditions, wind);
      if (index > 0) {
        var chance = period.probabilityOfPrecipitation && period.probabilityOfPrecipitation.value;
        var rain = document.createElement("p");
        rain.textContent = "Rain " + (chance === null || chance === undefined ? "unavailable" : chance + "%");
        day.append(rain);
      }
      forecast.append(day);
    });
    container.replaceChildren(forecast);
  }

  function moonPhase(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 3) { year -= 1; month += 12; }
    var a = Math.floor(year / 100);
    var b = 2 - a + Math.floor(a / 4);
    var jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
    var daysSinceNew = jd - 2451549.5;
    var newMoons = daysSinceNew / 29.53;
    var phase = newMoons - Math.floor(newMoons);
    return phase;
  }

  function moonPhaseName(phase) {
    if (phase < 0.02 || phase > 0.98) return "New Moon";
    if (phase < 0.24) return "Waxing Crescent";
    if (phase < 0.26) return "First Quarter";
    if (phase < 0.49) return "Waxing Gibbous";
    if (phase < 0.51) return "Full Moon";
    if (phase < 0.74) return "Waning Gibbous";
    if (phase < 0.76) return "Last Quarter";
    return "Waning Crescent";
  }

  function moonPhaseIcon(phase) {
    if (phase < 0.02 || phase > 0.98) return "🌑";
    if (phase < 0.24) return "🌒";
    if (phase < 0.26) return "🌓";
    if (phase < 0.49) return "🌔";
    if (phase < 0.51) return "🌕";
    if (phase < 0.74) return "🌖";
    if (phase < 0.76) return "🌗";
    return "🌘";
  }

  function renderMoon(container) {
    var now = new Date();
    var phase = moonPhase(now);
    container.innerHTML = '<div class="moon-phase"><span class="moon-icon">' + moonPhaseIcon(phase) + '</span><span>' + moonPhaseName(phase) + '</span></div>';
  }

  window.initWatersMap = function (options) {
    var container = document.getElementById("map");
    var listedWaters = new Set();
    var guideNavigation = document.createElement("nav");
    guideNavigation.className = "map-water-guide-list";
    guideNavigation.setAttribute("aria-labelledby", "map-water-guide-heading");
    var heading = document.createElement("h2");
    heading.id = "map-water-guide-heading";
    heading.textContent = "Browse water guides";
    guideNavigation.appendChild(heading);
    var guideList = document.createElement("ul");
    options.markers.forEach(function (marker) {
      if (!marker.slug || listedWaters.has(marker.slug)) return;
      listedWaters.add(marker.slug);
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "./" + marker.slug + ".html";
      link.textContent = marker.water;
      item.appendChild(link);
      guideList.appendChild(item);
    });
    guideNavigation.appendChild(guideList);
    if (container) container.insertAdjacentElement("afterend", guideNavigation);

    var map = initMap("map", { center: [43.8, -120.5], zoom: 7 });
    if (!map) return;
    options.markers.forEach(function (m) {
      var popup = "<strong>" + m.name + "</strong><br><em>" + m.water + "</em><br>" + m.fish + '<br><a href="./' + m.slug + '.html">View details & forecast</a>';
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(popup);
    });
    if (container) container.setAttribute("aria-label", "Map of Oregon fishing waters and access areas");
  };

  window.initDetailMap = function (options) {
    var pins = options.pins || [];
    var first = pins[0];
    var mapContainer = document.getElementById("map");
    if (!pins.length) {
      showMapFallback(mapContainer, "Map locations are not available. See the written access notes on this page.");
      console.error("Water map has no locations.");
    } else {
      var map = initMap("map", { center: [first.lat, first.lng], zoom: 11 });
      if (map) {
        pins.forEach(function (p) {
          L.marker([p.lat, p.lng]).addTo(map).bindPopup("<strong>" + p.name + "</strong>");
        });
        if (mapContainer) mapContainer.setAttribute("aria-label", "Map of " + (document.querySelector("h1")?.textContent || "water") + " access areas");
      }
    }
    var weatherContainer = document.getElementById("weather");
    if (weatherContainer) {
      var lat = parseFloat(weatherContainer.dataset.lat);
      var lng = parseFloat(weatherContainer.dataset.lng);
      fetchNwsForecast(lat, lng).then(function (data) {
        renderWeather(weatherContainer, data);
      }).catch(function (err) {
        var message = document.createElement("p");
        message.append("The forecast is unavailable right now. Check the ");
        var forecastLink = document.createElement("a");
        forecastLink.href = "https://www.weather.gov/";
        forecastLink.target = "_blank";
        forecastLink.rel = "noopener noreferrer";
        forecastLink.textContent = "National Weather Service";
        message.append(forecastLink, " directly or try again later.");
        weatherContainer.replaceChildren(message);
        console.error(err);
      });
    }
    var moonContainer = document.getElementById("moon");
    if (moonContainer) { renderMoon(moonContainer); }
  };
})();
