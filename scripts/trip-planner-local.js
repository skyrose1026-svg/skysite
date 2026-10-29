(() => {
  "use strict";

  const form = document.querySelector("[data-trip-local-form]");
  if (!form) return;

  const list = document.querySelector("[data-local-trip-list]");
  const status = document.querySelector("[data-trip-local-status]");
  const store = window.AnglerFieldStore;
  const defaultChecklist = [
    ["Safety", "Life jackets / PFDs"],
    ["Safety", "First-aid kit"],
    ["Safety", "Phone, power bank, and emergency contact"],
    ["Fishing", "Fishing license and tags"],
    ["Fishing", "Rods, reels, and terminal tackle"],
    ["Fishing", "Bait, lures, and tools"],
    ["Provisions", "Water and food"],
    ["Provisions", "Sun and weather protection"],
    ["Access", "Check current access and regulations"]
  ];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? "form-status form-status--error" : "form-status";
  }

  function makeChecklist() {
    return defaultChecklist.map(([category, label]) => ({
      id: crypto.randomUUID(),
      category,
      label,
      checked: false
    }));
  }

  async function render() {
    const trips = await store.getAll("trips");
    list.replaceChildren();
    if (!trips.length) {
      list.append(element("p", "No local trip plans yet.", "log-empty"));
      return;
    }

    trips.sort((left, right) => (right.date || "").localeCompare(left.date || ""));
    for (const trip of trips) {
      const card = element("article", undefined, "local-trip-card");
      const header = element("div", undefined, "section-header");
      const title = element("div");
      title.append(element("h3", trip.name));
      const summary = [trip.date, trip.water, trip.group ? `Group: ${trip.group}` : ""].filter(Boolean).join(" · ");
      title.append(element("p", summary || "Date and water not set."));
      if (trip.members?.length) title.append(element("p", `Participants: ${trip.members.join(", ")}`));
      header.append(title);
      const remove = element("button", "Delete trip", "shop-reset");
      remove.type = "button";
      remove.dataset.tripDelete = trip.id;
      header.append(remove);
      card.append(header);

      const checklist = element("div", undefined, "local-trip-checklist");
      for (const item of trip.checklist || []) {
        const label = element("label", undefined, "field-checkbox");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(item.checked);
        checkbox.dataset.tripId = trip.id;
        checkbox.dataset.itemId = item.id;
        label.append(checkbox, element("span", `${item.category}: ${item.label}`));
        checklist.append(label);
      }
      card.append(checklist);

      const addForm = element("form", undefined, "local-trip-add-item");
      addForm.dataset.tripItemForm = trip.id;
      const itemInput = document.createElement("input");
      itemInput.type = "text";
      itemInput.name = "item";
      itemInput.maxLength = 100;
      itemInput.required = true;
      itemInput.placeholder = "Add a packing item";
      itemInput.setAttribute("aria-label", `Add a packing item to ${trip.name}`);
      const addButton = element("button", "Add item", "shop-reset");
      addButton.type = "submit";
      addForm.append(itemInput, addButton);
      card.append(addForm);
      list.append(card);
    }
  }

  async function saveTripsAfterChange(tripId, change) {
    const trips = await store.getAll("trips");
    const trip = trips.find((candidate) => candidate.id === tripId);
    if (!trip) throw new Error("That trip no longer exists.");
    change(trip);
    await store.put("trips", trip);
    await render();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const trip = {
      id: crypto.randomUUID(),
      name: String(values.name || "").trim(),
      water: String(values.water || "").trim(),
      date: String(values.date || ""),
      group: String(values.group || "").trim(),
      members: String(values.members || "").split(",").map((name) => name.trim()).filter(Boolean),
      checklist: makeChecklist(),
      createdAt: new Date().toISOString()
    };
    try {
      await store.put("trips", trip);
      form.reset();
      setStatus("Trip plan saved on this device. Use the logbook's full backup to move it to another browser.");
      await render();
    } catch (error) {
      setStatus(`Could not save this trip: ${error.message}`, true);
    }
  });

  list.addEventListener("change", async (event) => {
    const checkbox = event.target.closest("[data-item-id]");
    if (!checkbox) return;
    try {
      await saveTripsAfterChange(checkbox.dataset.tripId, (trip) => {
        const item = trip.checklist.find((candidate) => candidate.id === checkbox.dataset.itemId);
        if (!item) throw new Error("That checklist item no longer exists.");
        item.checked = checkbox.checked;
      });
      setStatus("Checklist updated locally.");
    } catch (error) {
      setStatus(`Could not update the checklist: ${error.message}`, true);
    }
  });

  list.addEventListener("submit", async (event) => {
    const itemForm = event.target.closest("[data-trip-item-form]");
    if (!itemForm) return;
    event.preventDefault();
    if (!itemForm.reportValidity()) return;
    const label = String(new FormData(itemForm).get("item") || "").trim();
    try {
      await saveTripsAfterChange(itemForm.dataset.tripItemForm, (trip) => {
        trip.checklist.push({ id: crypto.randomUUID(), category: "Custom", label, checked: false });
      });
      setStatus("Packing item added.");
    } catch (error) {
      setStatus(`Could not add that item: ${error.message}`, true);
    }
  });

  list.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-trip-delete]");
    if (!button) return;
    try {
      await store.remove("trips", button.dataset.tripDelete);
      setStatus("Trip plan deleted from this device.");
      await render();
    } catch (error) {
      setStatus(`Could not delete the trip: ${error.message}`, true);
    }
  });

  store.getAll("trips").then(render).catch((error) => {
    setStatus(`Could not load local trip plans: ${error.message}`, true);
  });
})();
