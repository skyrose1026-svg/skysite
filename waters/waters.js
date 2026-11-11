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

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var availableMonths = [];
    periods.forEach(function (p) {
      if (p.startTime) {
        var mIdx = new Date(p.startTime).getMonth();
        if (availableMonths.indexOf(mIdx) === -1) availableMonths.push(mIdx);
      }
    });

    var widget = document.createElement("div");
    widget.className = "apple-weather";

    // Header
    var header = document.createElement("div");
    header.className = "apple-weather__header";

    var summaryDiv = document.createElement("div");
    summaryDiv.className = "apple-weather__summary";
    var currentP = periods[0];
    var h3 = document.createElement("h3");
    h3.textContent = "Local Forecast";
    var tempNow = document.createElement("div");
    tempNow.className = "apple-weather__temp-now";
    tempNow.innerHTML = '<span>' + nwsIconToEmoji(currentP.shortForecast || "") + '</span><span>' + (currentP.temperature === undefined ? "--" : currentP.temperature + "°F") + '</span>';
    var condNow = document.createElement("p");
    condNow.className = "apple-weather__condition-now";
    condNow.textContent = (currentP.name || "Now") + ": " + (currentP.shortForecast || "Clear") + " · Wind " + (currentP.windSpeed || "");
    summaryDiv.append(h3, tempNow, condNow);

    // Filter controls
    var filtersDiv = document.createElement("div");
    filtersDiv.className = "apple-weather__filters";

    var filterLabel = document.createElement("label");
    filterLabel.className = "apple-weather__filter-label";
    filterLabel.textContent = "Filter:";

    var selectFilter = document.createElement("select");
    selectFilter.className = "apple-weather__select";
    selectFilter.setAttribute("aria-label", "Filter forecast by day or month");

    // "All 7 Days" option
    var optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "All 7 Days";
    selectFilter.appendChild(optAll);

    // Group by unique day dates (YYYY-MM-DD)
    var daysMap = {};
    periods.forEach(function (p) {
      var dKey = p.startTime ? p.startTime.slice(0, 10) : p.name;
      if (!daysMap[dKey]) {
        daysMap[dKey] = [];
      }
      daysMap[dKey].push(p);
    });

    // Add day options
    Object.keys(daysMap).forEach(function (dKey) {
      var opt = document.createElement("option");
      opt.value = "day:" + dKey;
      var label = daysMap[dKey][0].name || dKey;
      if (dKey.length === 10) {
        var dateObj = new Date(dKey + "T12:00:00");
        label = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      }
      opt.textContent = "Day: " + label;
      selectFilter.appendChild(opt);
    });

    // Add month options if available
    availableMonths.forEach(function (mIdx) {
      var opt = document.createElement("option");
      opt.value = "month:" + mIdx;
      opt.textContent = "Month: " + monthNames[mIdx];
      selectFilter.appendChild(opt);
    });

    filtersDiv.append(filterLabel, selectFilter);
    header.append(summaryDiv, filtersDiv);

    // List container
    var list = document.createElement("div");
    list.className = "apple-weather__list";

    function updateList() {
      list.replaceChildren();
      var filterValue = selectFilter.value;
      var filtered = periods;

      if (filterValue.startsWith("day:")) {
        var targetDay = filterValue.slice(4);
        filtered = periods.filter(function (p) {
          var dKey = p.startTime ? p.startTime.slice(0, 10) : p.name;
          return dKey === targetDay;
        });
      } else if (filterValue.startsWith("month:")) {
        var targetMonth = parseInt(filterValue.slice(6), 10);
        filtered = periods.filter(function (p) {
          return p.startTime && new Date(p.startTime).getMonth() === targetMonth;
        });
      }

      if (filtered.length === 0) {
        var empty = document.createElement("div");
        empty.className = "apple-weather__empty";
        empty.textContent = "No forecast data available for this filter.";
        list.appendChild(empty);
        return;
      }

      filtered.forEach(function (period) {
        var item = document.createElement("div");
        item.className = "apple-weather__item";

        var dayName = document.createElement("div");
        dayName.className = "apple-weather__day-name";
        dayName.textContent = period.name || "Forecast";

        var icon = document.createElement("div");
        icon.className = "apple-weather__icon";
        icon.textContent = nwsIconToEmoji(period.shortForecast || "");

        var details = document.createElement("div");
        details.className = "apple-weather__details";

        var cond = document.createElement("span");
        cond.className = "apple-weather__cond";
        cond.textContent = period.shortForecast || "Forecast unavailable";

        var meta = document.createElement("span");
        meta.className = "apple-weather__meta";
        var wind = "Wind " + (period.windSpeed || "calm");
        var rainChance = "";
        var chance = period.probabilityOfPrecipitation && period.probabilityOfPrecipitation.value;
        if (chance !== null && chance !== undefined) {
          rainChance = " · Rain " + chance + "%";
        }
        meta.textContent = wind + rainChance;
        details.append(cond, meta);

        var tempBar = document.createElement("div");
        tempBar.className = "apple-weather__temp-bar";
        tempBar.innerHTML = (period.temperature === undefined ? "--" : period.temperature + "°") + '<small>' + (period.temperatureUnit || "F") + '</small>';

        item.append(dayName, icon, details, tempBar);
        list.appendChild(item);
      });
    }

    selectFilter.addEventListener("change", updateList);
    updateList();

    widget.append(header, list);
    container.replaceChildren(widget);
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
    var mapId = options.containerId || "map";
    var markers = options.markers || [];
    var container = document.getElementById(mapId);
    var listedWaters = new Set();
    if (options.guideNavigation !== false && container) {
      var guideNavigation = document.createElement("nav");
      guideNavigation.className = "map-water-guide-list";
      guideNavigation.setAttribute("aria-labelledby", "map-water-guide-heading");
      var heading = document.createElement("h2");
      heading.id = "map-water-guide-heading";
      heading.textContent = "Browse water guides";
      guideNavigation.appendChild(heading);
      var guideList = document.createElement("ul");
      markers.forEach(function (marker) {
        if (!marker.slug || listedWaters.has(marker.slug)) return;
        listedWaters.add(marker.slug);
        var basePath = options.basePath !== undefined ? options.basePath : "./";
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = basePath + marker.slug + ".html";
        link.textContent = marker.water;
        item.appendChild(link);
        guideList.appendChild(item);
      });
      guideNavigation.appendChild(guideList);
      container.insertAdjacentElement("afterend", guideNavigation);
    }

    var map = initMap(mapId, {
      center: options.center || [43.8, -120.5],
      zoom: options.zoom || 7
    });
    if (!map) return;
    markers.forEach(function (m) {
      var popup = "<strong>" + m.name + "</strong>";
      if (m.water) popup += "<br><em>" + m.water + "</em>";
      if (m.fish) popup += "<br>" + m.fish;
      var basePath = options.basePath !== undefined ? options.basePath : "./";
      var href = m.href || (m.slug ? basePath + m.slug + ".html" : options.overviewHref);
      if (href) popup += '<br><a href="' + href + '">' + (m.linkText || "View water guide") + "</a>";
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(popup);
    });
    if (container) {
      container.setAttribute("aria-label", options.accessibleLabel || "Map of Oregon fishing waters and access areas");
    }
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
