(function () {
  const cartKey = "southern-oregon-angler-cart-v1";
  const setupsKey = "southern-oregon-angler-setups-v1";

  function readList(key, label) {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return [];
    let value;
    try {
      value = JSON.parse(stored);
    } catch (error) {
      throw new Error(`Saved ${label} data is unreadable. Clear browser storage to start fresh.`, { cause: error });
    }
    if (!Array.isArray(value)) throw new Error(`Saved ${label} data is invalid. Clear browser storage to start fresh.`);
    return value;
  }

  function writeList(key, value, label) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Could not save ${label} in this browser. Check storage availability and try again.`, { cause: error });
    }
  }

  function getCart() {
    const items = readList(cartKey, "cart");
    if (items.some((item) => !item || typeof item.productId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      throw new Error("Saved cart data is invalid. Clear browser storage to start fresh.");
    }
    return items;
  }

  function addToCart(productId, quantity = 1) {
    if (typeof productId !== "string" || !productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Choose a valid product and quantity.");
    }
    const items = getCart();
    const existing = items.find((item) => item.productId === productId);
    if (existing) existing.quantity += quantity;
    else items.push({ productId, quantity });
    writeList(cartKey, items, "cart");
    return items;
  }

  function addManyToCart(productIds) {
    if (!Array.isArray(productIds) || productIds.length === 0 || productIds.some((id) => typeof id !== "string" || !id)) {
      throw new Error("Choose at least one valid product.");
    }
    const items = getCart();
    for (const productId of productIds) {
      const existing = items.find((item) => item.productId === productId);
      if (existing) existing.quantity += 1;
      else items.push({ productId, quantity: 1 });
    }
    writeList(cartKey, items, "cart");
    return items;
  }

  function setQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Quantity must be at least one.");
    const items = getCart();
    const item = items.find((entry) => entry.productId === productId);
    if (!item) throw new Error("That item is no longer in the cart.");
    item.quantity = quantity;
    writeList(cartKey, items, "cart");
    return items;
  }

  function removeFromCart(productId) {
    const items = getCart().filter((item) => item.productId !== productId);
    writeList(cartKey, items, "cart");
    return items;
  }

  function clearCart() {
    writeList(cartKey, [], "cart");
  }

  function getSavedSetups() {
    const setups = readList(setupsKey, "saved setup");
    if (setups.some((setup) => !setup || typeof setup.id !== "string" || !Array.isArray(setup.productIds))) {
      throw new Error("Saved setup data is invalid. Clear browser storage to start fresh.");
    }
    return setups;
  }

  function saveSetup(setup) {
    if (!setup || !Array.isArray(setup.productIds) || setup.productIds.length === 0) {
      throw new Error("Build a setup before saving it.");
    }
    const setups = getSavedSetups();
    const saved = { ...setup, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() };
    setups.unshift(saved);
    writeList(setupsKey, setups, "saved setup");
    return setups;
  }

  function deleteSetup(setupId) {
    const setups = getSavedSetups().filter((setup) => setup.id !== setupId);
    writeList(setupsKey, setups, "saved setup");
    return setups;
  }

  window.GearStore = { getCart, addToCart, addManyToCart, setQuantity, removeFromCart, clearCart, getSavedSetups, saveSetup, deleteSetup };
})();
