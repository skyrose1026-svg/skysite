(function () {
  "use strict";

  var STORAGE_KEY = "southern-oregon-angler-fishing-log-v1";
  var fields = ["date", "species", "water", "method", "gear", "bait", "length", "notes"];

  function isEntry(value) {
    return value && typeof value === "object" &&
      typeof value.id === "string" &&
      fields.every(function (field) { return typeof value[field] === "string"; });
  }

  function readEntries() {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];
    var parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isEntry)) {
      throw new Error("The saved fishing log has an unexpected format.");
    }
    return parsed;
  }

  function writeEntries(entries) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function makeTextElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function csvCell(value) {
    var text = String(value);
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function localDate() {
    var now = new Date();
    var offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }

  function initialize() {
    var form = document.querySelector("[data-log-form]");
    var status = document.querySelector("[data-log-status]");
    var list = document.querySelector("[data-log-entries]");
    var exportButton = document.querySelector("[data-log-export]");
    var clearButton = document.querySelector("[data-log-clear]");
    if (!form || !status || !list || !exportButton || !clearButton) return;

    var entries;
    try {
      entries = readEntries();
    } catch (error) {
      status.textContent = "Could not read the saved fishing log: " + error.message + " No saved data was changed.";
      form.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    var dateInput = form.querySelector('[name="date"]');
    dateInput.value = localDate();

    function render() {
      list.replaceChildren();
      var sorted = entries.slice().sort(function (a, b) {
        return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
      });

      if (!sorted.length) {
        list.appendChild(makeTextElement("p", "log-empty", "No entries yet. Add one above to start your personal log."));
      }

      sorted.forEach(function (entry) {
        var card = document.createElement("article");
        card.className = "log-entry";
        var heading = document.createElement("h3");
        heading.textContent = entry.species + " — " + entry.date;
        card.appendChild(heading);

        var details = document.createElement("dl");
        [
          ["Water or area", entry.water],
          ["Method", entry.method],
          ["Rod and reel", entry.gear],
          ["Lure, fly, or bait", entry.bait],
          ["Length (inches)", entry.length],
          ["Conditions or notes", entry.notes]
        ].forEach(function (pair) {
          if (!pair[1]) return;
          details.appendChild(makeTextElement("dt", "", pair[0]));
          details.appendChild(makeTextElement("dd", "", pair[1]));
        });
        if (details.children.length) card.appendChild(details);

        var removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "shop-reset";
        removeButton.dataset.logDelete = entry.id;
        removeButton.textContent = "Delete entry";
        card.appendChild(removeButton);
        list.appendChild(card);
      });

      exportButton.disabled = entries.length === 0;
      clearButton.disabled = entries.length === 0;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var formData = new FormData(form);
      var entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
      fields.forEach(function (field) {
        entry[field] = String(formData.get(field) || "").trim();
      });

      var updated = entries.concat(entry);
      try {
        writeEntries(updated);
      } catch (error) {
        status.textContent = "Could not save this entry in browser storage: " + error.message;
        return;
      }

      entries = updated;
      form.reset();
      dateInput.value = localDate();
      status.textContent = "Entry saved on this device.";
      render();
    });

    list.addEventListener("click", function (event) {
      var button = event.target.closest("[data-log-delete]");
      if (!button) return;
      var updated = entries.filter(function (entry) { return entry.id !== button.dataset.logDelete; });
      try {
        writeEntries(updated);
      } catch (error) {
        status.textContent = "Could not delete this entry from browser storage: " + error.message;
        return;
      }
      entries = updated;
      status.textContent = "Entry deleted.";
      render();
    });

    clearButton.addEventListener("click", function () {
      if (!window.confirm("Delete every entry in this browser's fishing log? This cannot be undone.")) return;
      try {
        writeEntries([]);
      } catch (error) {
        status.textContent = "Could not clear the fishing log from browser storage: " + error.message;
        return;
      }
      entries = [];
      status.textContent = "Fishing log cleared.";
      render();
    });

    exportButton.addEventListener("click", function () {
      var rows = [fields].concat(entries.map(function (entry) {
        return fields.map(function (field) { return entry[field]; });
      }));
      var csv = rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
      var url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
      var download = document.createElement("a");
      download.href = url;
      download.download = "fishing-log.csv";
      download.click();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      status.textContent = "CSV export created.";
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
