(() => {
  "use strict";

  const DATABASE_NAME = "southern-oregon-angler-field";
  const DATABASE_VERSION = 2;
  const STORE_NAMES = ["catches", "trips", "waypoints", "tackle", "groups", "conditions", "meta"];
  let databasePromise;

  function openDatabase() {
    if (!("indexedDB" in window)) {
      return Promise.reject(new Error("This browser does not support local offline storage."));
    }
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.addEventListener("upgradeneeded", () => {
        const database = request.result;
        for (const name of STORE_NAMES) {
          if (!database.objectStoreNames.contains(name)) {
            database.createObjectStore(name, { keyPath: "id" });
          }
        }
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => {
        databasePromise = null;
        reject(request.error || new Error("Could not open local field storage."));
      }, { once: true });
      request.addEventListener("blocked", () => {
        databasePromise = null;
        reject(new Error("Close other tabs using the field guide, then try again."));
      }, { once: true });
    });
    return databasePromise;
  }

  function validateStore(name) {
    if (!STORE_NAMES.includes(name) || name === "meta") {
      throw new Error(`Unknown field storage collection: ${name}`);
    }
  }

  async function getAll(name) {
    validateStore(name);
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(name, "readonly");
      const request = transaction.objectStore(name).getAll();
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not read local field data.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Reading local field data was interrupted.")), { once: true });
    });
  }

  async function put(name, value) {
    validateStore(name);
    if (!value || typeof value.id !== "string" || !value.id) {
      throw new Error("A local record must have a non-empty ID.");
    }
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(name, "readwrite");
      transaction.objectStore(name).put(value);
      transaction.addEventListener("complete", () => resolve(value), { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not save local field data.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Saving local field data was interrupted.")), { once: true });
    });
  }

  async function remove(name, id) {
    validateStore(name);
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(name, "readwrite");
      transaction.objectStore(name).delete(id);
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not delete local field data.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Deleting local field data was interrupted.")), { once: true });
    });
  }

  async function clear(name) {
    validateStore(name);
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(name, "readwrite");
      transaction.objectStore(name).clear();
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not clear local field data.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Clearing local field data was interrupted.")), { once: true });
    });
  }

  async function migrateLegacyLog() {
    const database = await openDatabase();
    const hasMigrated = await new Promise((resolve, reject) => {
      const transaction = database.transaction("meta", "readonly");
      const request = transaction.objectStore("meta").get("legacy-log-migrated");
      request.addEventListener("success", () => resolve(Boolean(request.result)), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not check the existing fishing log.")), { once: true });
    });
    if (hasMigrated) return 0;

    const legacyKey = "southern-oregon-angler-fishing-log-v1";
    const oldValue = localStorage.getItem(legacyKey);
    let legacyEntries = [];
    if (oldValue !== null) {
      legacyEntries = JSON.parse(oldValue);
      if (!Array.isArray(legacyEntries)) {
        throw new Error("The existing fishing log has an unexpected format; it was not changed.");
      }
    }

    const existing = new Set((await getAll("catches")).map((entry) => entry.id));
    const transaction = database.transaction(["catches", "meta"], "readwrite");
    const catches = transaction.objectStore("catches");
    let migrated = 0;
    for (const entry of legacyEntries) {
      if (!entry || typeof entry.id !== "string" || existing.has(entry.id)) continue;
      catches.put({
        ...entry,
        time: entry.time || "",
        weight: entry.weight || "",
        lineType: entry.lineType || "",
        depth: entry.depth || "",
        waterTemperature: entry.waterTemperature || "",
        barometricPressure: entry.barometricPressure || "",
        weather: entry.weather || "",
        moonPhase: entry.moonPhase || "",
        privacy: entry.privacy || "private",
        coordinates: null,
        photo: null,
        environment: entry.environment || null
      });
      migrated += 1;
    }
    transaction.objectStore("meta").put({ id: "legacy-log-migrated", completedAt: new Date().toISOString() });
    await new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not migrate the existing fishing log.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Migrating the existing fishing log was interrupted.")), { once: true });
    });
    return migrated;
  }

  async function exportAll() {
    const exported = {};
    for (const name of STORE_NAMES.filter((store) => store !== "meta")) {
      exported[name] = await getAll(name);
    }
    return { format: "southern-oregon-angler-field-v1", exportedAt: new Date().toISOString(), data: exported };
  }

  async function importAll(backup) {
    if (backup?.format !== "southern-oregon-angler-field-v1" || !backup.data || typeof backup.data !== "object") {
      throw new Error("This file is not a recognized angler field backup.");
    }
    const entries = Object.entries(backup.data);
    for (const [name, records] of entries) {
      validateStore(name);
      if (!Array.isArray(records) || records.some((record) => !record || typeof record.id !== "string")) {
        throw new Error(`The backup contains invalid ${name} records; nothing was imported.`);
      }
    }
    const database = await openDatabase();
    const names = entries.map(([name]) => name);
    const transaction = database.transaction(names, "readwrite");
    for (const [name, records] of entries) {
      for (const record of records) transaction.objectStore(name).put(record);
    }
    await new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not import the field backup.")), { once: true });
      transaction.addEventListener("abort", () => reject(transaction.error || new Error("Importing the field backup was interrupted.")), { once: true });
    });
    return entries.reduce((count, [, records]) => count + records.length, 0);
  }

  window.AnglerFieldStore = Object.freeze({ getAll, put, remove, clear, migrateLegacyLog, exportAll, importAll });
})();
