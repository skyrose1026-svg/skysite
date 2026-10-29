(function () {
  "use strict";

  var runs = [
    { name: "Rainbow Trout", slug: "rainbow-trout", area: "Freshwater", start: "01-01", peakStart: "04-01", peakEnd: "05-31", end: "06-30", note: "Lower-elevation rivers and stocked waters; stocking and access vary." },
    { name: "Rainbow Trout", slug: "rainbow-trout", area: "Freshwater", start: "09-01", peakStart: "10-01", peakEnd: "11-15", end: "12-31", note: "Fall and winter opportunities depend on water temperature and local access." },
    { name: "Winter-run Steelhead", slug: "steelhead", area: "Freshwater", start: "11-01", peakStart: "12-01", peakEnd: "03-31", end: "04-30", note: "Coastal and Rogue-basin timing varies; confirm river closures and wild-fish rules." },
    { name: "Summer-run Steelhead", slug: "steelhead", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "09-30", end: "10-31", note: "Run strength and timing vary by river; check current regulations before fishing." },
    { name: "Coastal Cutthroat Trout", slug: "coastal-cutthroat-trout", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Small coastal streams and estuaries; access and retention rules differ." },
    { name: "Kokanee", slug: "kokanee", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "09-30", note: "Reservoir timing varies; fish depth and water temperature affect the bite." },
    { name: "Spring Chinook Salmon", slug: "chinook-salmon", area: "Freshwater", start: "03-01", peakStart: "04-01", peakEnd: "05-31", end: "06-30", note: "Spring run timing and open fisheries are river-specific and may change in-season." },
    { name: "Fall Chinook Salmon", slug: "chinook-salmon", area: "Freshwater", start: "08-01", peakStart: "09-01", peakEnd: "10-31", end: "11-30", note: "Run timing, access, and retention opportunities vary by basin and current rules." },
    { name: "Coho Salmon", slug: "coho-salmon", area: "Freshwater", start: "09-01", peakStart: "10-01", peakEnd: "11-30", end: "12-31", note: "Fall and early-winter opportunities differ by coastal basin and year." },
    { name: "Mountain Whitefish", slug: "mountain-whitefish", area: "Freshwater", start: "10-01", peakStart: "11-01", peakEnd: "02-28", end: "04-30", note: "A cold-season river opportunity; use light presentations and check local rules." },
    { name: "Brook Trout", slug: "brook-trout", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "10-31", note: "Higher-elevation waters become accessible as snow recedes." },
    { name: "Lake Trout (Mackinaw)", slug: "lake-trout", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Deep-water tactics can be productive as surface water warms." },
    { name: "Smallmouth Bass", slug: "smallmouth-bass", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Warming water brings fish to rocky banks, current seams, and structure." },
    { name: "Largemouth Bass", slug: "largemouth-bass", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Look around warmer cover and weed edges; avoid disturbing spawning fish." },
    { name: "Channel Catfish", slug: "channel-catfish", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "09-30", note: "Warm evenings can be productive in lakes and slower water." },
    { name: "Brown Bullhead", slug: "brown-bullhead", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "09-30", note: "Try warm, quiet water with bait near the bottom; check local limits." },
    { name: "Bluegill", slug: "bluegill", area: "Freshwater", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "09-30", note: "Warm-weather fishing around shallow cover and weed edges." },
    { name: "Black Crappie", slug: "black-crappie", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "07-31", end: "09-30", note: "Spring and summer can bring fish near docks, brush, and structure." },
    { name: "White Crappie", slug: "white-crappie", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "07-31", end: "09-30", note: "Look around submerged cover and schools; local water conditions shape the bite." },
    { name: "Yellow Perch", slug: "yellow-perch", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Try lakes and reservoirs around schools and submerged structure." },
    { name: "Common Carp", slug: "common-carp", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "10-31", note: "Warmer shallows can make sight-fishing and bait presentations rewarding." },
    { name: "Northern Pikeminnow", slug: "northern-pikeminnow", area: "Freshwater", start: "04-01", peakStart: "05-01", peakEnd: "08-31", end: "09-30", note: "Warm-season activity varies by water; verify any reward-program dates separately." },
    { name: "Surfperch", slug: "surfperch", area: "Coast", start: "01-01", peakStart: "03-01", peakEnd: "08-31", end: "12-31", note: "Can be targeted year-round when surf conditions are safe; watch tides and advisories." },
    { name: "Black Rockfish", slug: "black-rockfish", area: "Coast", start: "05-01", peakStart: "06-01", peakEnd: "09-30", end: "10-31", note: "Nearshore trips depend on ocean conditions, access, and current season rules." },
    { name: "Lingcod", slug: "lingcod", area: "Coast", start: "05-01", peakStart: "06-01", peakEnd: "09-30", end: "10-31", note: "Rocky habitat can be productive when the fishery is open and conditions allow." },
    { name: "Cabezon", slug: "cabezon", area: "Coast", start: "05-01", peakStart: "06-01", peakEnd: "09-30", end: "10-31", note: "Has distinct size, season, and retention rules; verify current regulations." },
    { name: "Pacific Halibut", slug: "pacific-halibut", area: "Coast", start: "05-01", peakStart: "06-01", peakEnd: "08-31", end: "09-30", note: "Illustrative planning window only: annual open dates, quotas, and areas are set separately and may not include these dates." },
    { name: "White Sturgeon", slug: "white-sturgeon", area: "Freshwater", start: "01-01", peakStart: "04-01", peakEnd: "09-30", end: "12-31", note: "Rules are highly location-specific and retention is often prohibited; verify where targeting is legal." }
  ];

  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var weatherByDate = {};
  var selectedDate = null;
  var weatherRequestId = 0;

  function makeElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function dateFromKey(year, key) {
    var parts = key.split("-");
    return new Date(year, Number(parts[0]) - 1, Number(parts[1]));
  }

  function getWindow(run, startYear) {
    var start = dateFromKey(startYear, run.start);
    var endYear = run.start.slice(0, 2) > run.end.slice(0, 2) ? startYear + 1 : startYear;
    var end = dateFromKey(endYear, run.end);
    var peakStartYear = run.start.slice(0, 2) > run.peakStart.slice(0, 2) ? startYear + 1 : startYear;
    var peakEndYear = run.start.slice(0, 2) > run.peakEnd.slice(0, 2) ? startYear + 1 : startYear;
    return {
      start: start,
      peakStart: dateFromKey(peakStartYear, run.peakStart),
      peakEnd: dateFromKey(peakEndYear, run.peakEnd),
      end: end
    };
  }

  function sameDay(left, right) {
    return left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate();
  }

  function localDateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }

  function stageFor(run, date) {
    for (var startYear = date.getFullYear() - 1; startYear <= date.getFullYear(); startYear += 1) {
      var period = getWindow(run, startYear);
      if (date < period.start || date > period.end) continue;
      if (sameDay(date, period.start)) return "Typical activity starts";
      if (sameDay(date, period.peakStart)) return "Peak activity starts";
      if (sameDay(date, period.peakEnd)) return "Peak activity ends";
      if (sameDay(date, period.end)) return "Typical activity ends";
      if (date >= period.peakStart && date <= period.peakEnd) return "Peak activity";
      return "Typical activity window";
    }
    return "";
  }

  function runsForMonth(year, month) {
    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 0);
    return runs.map(function (run) {
      var match = null;
      for (var startYear = year - 1; startYear <= year; startYear += 1) {
        var period = getWindow(run, startYear);
        if (period.start <= monthEnd && period.end >= monthStart) {
          match = { run: run, period: period };
          break;
        }
      }
      return match;
    }).filter(Boolean);
  }

  function formatDate(date) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function renderSelectedDate(date) {
    var container = document.querySelector("[data-calendar-selected]");
    if (!container) return;
    container.replaceChildren();
    var heading = makeElement("h3", "", date.toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }));
    container.appendChild(heading);

    var active = runs.map(function (run) {
      var stage = stageFor(run, date);
      return stage ? { run: run, stage: stage } : null;
    }).filter(Boolean);

    if (!active.length) {
      container.appendChild(makeElement("p", "", "No typical activity window is listed for this date. Fish activity can still occur outside these broad seasonal patterns."));
    } else {
      active.forEach(function (item) {
        var row = makeElement("p", "calendar-selected__item");
        var link = makeElement("a", "", item.run.name);
        link.href = "./fish/" + item.run.slug + ".html";
        row.append(link, document.createTextNode(" — " + item.stage + ". " + item.run.note));
        container.appendChild(row);
      });
    }

    var forecastPeriods = weatherByDate[localDateKey(date)];
    var forecast = forecastPeriods && (forecastPeriods.day || forecastPeriods.night);
    if (forecast) {
      var probability = forecast.probabilityOfPrecipitation && forecast.probabilityOfPrecipitation.value;
      var weather = makeElement("p", "calendar-selected__weather",
        "Forecast: " + forecast.shortForecast + ", " + forecast.temperature + "°" + forecast.temperatureUnit +
        (probability !== null && probability !== undefined ? ", precipitation chance " + probability + "%" : ""));
      container.appendChild(weather);
    } else {
      container.appendChild(makeElement("p", "calendar-selected__weather", "No 7-day forecast is available for this calendar date."));
    }
  }

  function renderPeriods(year, month) {
    var container = document.querySelector("[data-calendar-periods]");
    if (!container) return;
    container.replaceChildren();
    var monthPeriods = runsForMonth(year, month);
    if (!monthPeriods.length) {
      container.appendChild(makeElement("p", "", "No typical seasonal periods are listed for this month."));
      return;
    }
    monthPeriods.forEach(function (entry) {
      var card = makeElement("article", "calendar-period");
      var heading = makeElement("h3");
      var link = makeElement("a", "", entry.run.name);
      link.href = "./fish/" + entry.run.slug + ".html";
      heading.appendChild(link);
      var range = makeElement("p", "calendar-period__range",
        "Typical window: " + formatDate(entry.period.start) + " – " + formatDate(entry.period.end));
      var peak = makeElement("p", "", "Typical peak: " + formatDate(entry.period.peakStart) + " – " + formatDate(entry.period.peakEnd));
      var note = makeElement("p", "", entry.run.note);
      card.append(heading, range, peak, note);
      container.appendChild(card);
    });
  }

  function renderCalendar(year, month) {
    var grid = document.querySelector("[data-calendar-grid]");
    var heading = document.querySelector("[data-calendar-heading]");
    var caption = document.querySelector("[data-calendar-caption]");
    var status = document.querySelector("[data-calendar-status]");
    if (!grid || !heading || !caption || !status) return;

    if (!selectedDate || selectedDate.getFullYear() !== year || selectedDate.getMonth() !== month) {
      selectedDate = new Date(year, month, 1);
    }
    heading.textContent = monthNames[month] + " " + year;
    caption.textContent = "Typical seasonal fishing periods in " + monthNames[month] + " " + year + ". Weather cells show only an available National Weather Service short-range forecast.";
    grid.replaceChildren();

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date();
    var day = 1;
    for (var week = 0; week < 6 && day <= daysInMonth; week += 1) {
      var row = document.createElement("tr");
      for (var weekday = 0; weekday < 7; weekday += 1) {
        var cell = document.createElement("td");
        if ((week > 0 || weekday >= firstDay) && day <= daysInMonth) {
          var date = new Date(year, month, day);
          var dateKey = localDateKey(date);
          var activeRuns = runs.map(function (run) {
            var stage = stageFor(run, date);
            return stage ? { run: run, stage: stage } : null;
          }).filter(Boolean);
          var weather = weatherByDate[dateKey];
          var cellClass = "calendar-day";
          if (sameDay(date, today)) cellClass += " calendar-day--today";
          if (sameDay(date, selectedDate)) cellClass += " calendar-day--selected";
          var article = makeElement("article", cellClass);
          var button = makeElement("button", "calendar-day__select");
          button.type = "button";
          button.dataset.calendarDate = dateKey;
          button.setAttribute("aria-pressed", String(sameDay(date, selectedDate)));
          button.setAttribute("aria-label", date.toLocaleDateString(undefined, {
            weekday: "long", month: "long", day: "numeric", year: "numeric"
          }) + (activeRuns.length ? ", " + activeRuns.length + " typical activity windows" : ", no typical seasonal window listed"));
          button.appendChild(makeElement("span", "calendar-day__number", String(day)));

          if (weather) {
            var weatherPeriod = weather.day || weather.night;
            var weatherText = weatherPeriod.shortForecast + ", " + weatherPeriod.temperature + "°" + weatherPeriod.temperatureUnit;
            button.appendChild(makeElement("span", "calendar-day__weather", weatherText));
          }

          var eventList = makeElement("span", "calendar-day__events");
          activeRuns.slice(0, 2).forEach(function (item) {
            var eventClass = "calendar-day__event";
            if (item.stage.indexOf("Peak") === 0) eventClass += " calendar-day__event--peak";
            if (item.stage === "Typical activity starts" || item.stage === "Typical activity ends") eventClass += " calendar-day__event--turn";
            eventList.appendChild(makeElement("span", eventClass, item.run.name));
          });
          if (activeRuns.length > 2) {
            eventList.appendChild(makeElement("span", "calendar-day__more", "+" + (activeRuns.length - 2) + " more"));
          }
          button.appendChild(eventList);
          article.appendChild(button);
          cell.appendChild(article);
          day += 1;
        }
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }

    var monthPeriods = runsForMonth(year, month);
    status.textContent = monthPeriods.length
      ? monthPeriods.length + " typical activity windows overlap " + monthNames[month] + ". Select a date to see its run stages and forecast when available."
      : "No typical activity windows are listed for " + monthNames[month] + ".";
    renderPeriods(year, month);
    renderSelectedDate(selectedDate);
  }

  function renderWeather(data) {
    var container = document.querySelector("[data-weather-results]");
    if (!container) return;
    var periods = data.properties && data.properties.periods;
    if (!periods || !periods.length) throw new Error("The National Weather Service returned no forecast periods.");

    weatherByDate = {};
    periods.forEach(function (period) {
      var key = period.startTime && period.startTime.slice(0, 10);
      if (!key) return;
      if (!weatherByDate[key]) weatherByDate[key] = {};
      if (period.isDaytime) weatherByDate[key].day = period;
      else weatherByDate[key].night = period;
    });

    container.replaceChildren();
    var keys = Object.keys(weatherByDate).sort().slice(0, 7);
    keys.forEach(function (key) {
      var item = weatherByDate[key].day || weatherByDate[key].night;
      var card = makeElement("article", "calendar-weather__day");
      var date = makeElement("h3", "", item.name || key);
      var summary = makeElement("p", "calendar-weather__summary",
        item.shortForecast + ", " + item.temperature + "°" + item.temperatureUnit);
      var details = makeElement("p", "", "Wind " + (item.windSpeed || "unavailable") + " " + (item.windDirection || ""));
      var probability = item.probabilityOfPrecipitation && item.probabilityOfPrecipitation.value;
      var rain = makeElement("p", "", "Precipitation chance: " +
        (probability === null || probability === undefined ? "unavailable" : probability + "%"));
      card.append(date, summary, details, rain);
      container.appendChild(card);
    });
  }

  async function loadWeather() {
    var location = document.querySelector("[data-calendar-location]");
    var container = document.querySelector("[data-weather-results]");
    var status = document.querySelector("[data-weather-status]");
    if (!location || !container || !status) return;

    status.className = "form-status";
    status.textContent = "Loading the National Weather Service forecast…";
    container.replaceChildren();
    weatherByDate = {};
    var requestId = ++weatherRequestId;
    try {
      var coordinates = location.value.split(",");
      var pointResponse = await fetch("https://api.weather.gov/points/" + coordinates[0] + "," + coordinates[1], {
        headers: { Accept: "application/geo+json" }
      });
      if (!pointResponse.ok) throw new Error("NWS location lookup failed (" + pointResponse.status + ").");
      var pointData = await pointResponse.json();
      var forecastUrl = pointData.properties && pointData.properties.forecast;
      if (!forecastUrl) throw new Error("NWS did not provide a forecast for this location.");

      var forecastResponse = await fetch(forecastUrl, { headers: { Accept: "application/geo+json" } });
      if (!forecastResponse.ok) throw new Error("NWS forecast request failed (" + forecastResponse.status + ").");
      var forecast = await forecastResponse.json();
      if (requestId !== weatherRequestId) return;
      renderWeather(forecast);
      status.textContent = "National Weather Service forecast for " + location.options[location.selectedIndex].text + ". Forecasts cover the next several days and can change.";
      status.className = "form-status";
    } catch (error) {
      if (requestId !== weatherRequestId) return;
      status.textContent = "Weather forecast unavailable: " + error.message;
      status.className = "form-status form-status--error";
      container.replaceChildren();
    }
    var heading = document.querySelector("[data-calendar-heading]");
    if (heading) {
      var parts = heading.textContent.match(/^(.+) (\d{4})$/);
      if (parts) renderCalendar(Number(parts[2]), monthNames.indexOf(parts[1]));
    }
  }

  function initialize() {
    var previous = document.querySelector("[data-month-previous]");
    var next = document.querySelector("[data-month-next]");
    var grid = document.querySelector("[data-calendar-grid]");
    var location = document.querySelector("[data-calendar-location]");
    if (!previous || !next || !grid || !location) return;

    var current = new Date();
    var year = current.getFullYear();
    var month = current.getMonth();
    selectedDate = new Date(year, month, current.getDate());

    previous.addEventListener("click", function () {
      month -= 1;
      if (month < 0) { month = 11; year -= 1; }
      renderCalendar(year, month);
    });
    next.addEventListener("click", function () {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
      renderCalendar(year, month);
    });
    grid.addEventListener("click", function (event) {
      var button = event.target.closest("[data-calendar-date]");
      if (!button) return;
      var parts = button.dataset.calendarDate.split("-").map(Number);
      selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
      renderCalendar(year, month);
    });
    location.addEventListener("change", loadWeather);
    renderCalendar(year, month);
    loadWeather();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
