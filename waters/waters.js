(function () {
  function initMap(elementId, options) {
    var center = options.center || [43.8, -120.5];
    var zoom = options.zoom || 7;
    var map = L.map(elementId).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      maxZoom: 18
    }).addTo(map);
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
      .then(function (res) { return res.json(); })
      .then(function (points) {
        return fetch(points.properties.forecast, { headers: { "User-Agent": "SouthernOregonAnglerGuide (student project)" } })
          .then(function (res) { return res.json(); });
      });
  }

  function renderWeather(container, data) {
    var periods = data.properties.periods;
    if (!periods || periods.length === 0) {
      container.innerHTML = "<p>Weather forecast unavailable.</p>";
      return;
    }
    var current = periods[0];
    var html = '<div class="weather-current">';
    html += '<div class="weather-day"><strong>Now</strong><br>' + nwsIconToEmoji(current.shortForecast) + '<br>' + current.temperature + '°F<br>' + current.shortForecast + '<br>Wind ' + current.windSpeed + '<br></div>';
    for (var i = 1; i < 8 && i < periods.length; i++) {
      var p = periods[i];
      html += '<div class="weather-day"><strong>' + p.name + '</strong><br>' + nwsIconToEmoji(p.shortForecast) + '<br>' + p.temperature + '°F<br>' + p.shortForecast + '<br>Wind ' + p.windSpeed + '<br>Rain ' + (p.probabilityOfPrecipitation && p.probabilityOfPrecipitation.value !== null ? p.probabilityOfPrecipitation.value : 0) + '%</div>';
    }
    html += '</div>';
    container.innerHTML = html;
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
    var map = initMap("map", { center: [43.8, -120.5], zoom: 7 });
    options.markers.forEach(function (m) {
      var popup = "<strong>" + m.name + "</strong><br><em>" + m.water + "</em><br>" + m.fish + '<br><a href="./' + m.slug + '.html">View details & forecast</a>';
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(popup);
    });
  };

  window.initDetailMap = function (options) {
    var pins = options.pins;
    var first = pins[0];
    var map = initMap("map", { center: [first.lat, first.lng], zoom: 11 });
    pins.forEach(function (p) {
      L.marker([p.lat, p.lng]).addTo(map).bindPopup("<strong>" + p.name + "</strong>");
    });
    var weatherContainer = document.getElementById("weather");
    if (weatherContainer) {
      var lat = parseFloat(weatherContainer.dataset.lat);
      var lng = parseFloat(weatherContainer.dataset.lng);
      fetchNwsForecast(lat, lng).then(function (data) {
        renderWeather(weatherContainer, data);
      }).catch(function (err) {
        weatherContainer.innerHTML = "<p>Weather unavailable. Please try again later.</p>";
        console.error(err);
      });
    }
    var moonContainer = document.getElementById("moon");
    if (moonContainer) { renderMoon(moonContainer); }
  };
})();
