const setupForm = document.querySelector("[data-setup-form]");
const fishSelect = document.querySelector("#setup-fish");
const waterSelect = document.querySelector("#setup-water");
const methodSelect = document.querySelector("#setup-method");
const budgetSelect = document.querySelector("#setup-budget");
const setupStatus = document.querySelector("[data-setup-status]");
const setupSummary = document.querySelector("[data-setup-summary]");
const setupProducts = document.querySelector("[data-setup-products]");
const savedSetupsContainer = document.querySelector("[data-saved-setups]");
const saveSetupButton = document.querySelector("[data-save-setup]");
const addSetupButton = document.querySelector("[data-add-setup]");

let products = [];
let currentSetup = [];
let loaded = false;

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showSetupError(error) {
  setupStatus.textContent = error.message || "The setup could not be updated.";
  setupStatus.className = "form-status form-status--error";
}

function findOptionBySlug(selector, slug) {
  const requestedSlug = slug.replace(/\.html$/i, "");
  return [...selector.options].find((option) =>
    option.value.split("/").pop().replace(/\.html$/i, "") === requestedSlug
  );
}

async function loadOptions(path, selector, cssSelector, placeholder) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${placeholder.toLowerCase()} (${response.status}).`);
  const html = await response.text();
  const page = new DOMParser().parseFromString(html, "text/html");
  const links = [...page.querySelectorAll(cssSelector)];
  if (!links.length) throw new Error(`No ${placeholder.toLowerCase()} were found.`);
  selector.replaceChildren(new Option(`Choose ${placeholder.toLowerCase()}`, ""));
  const seen = new Set();
  for (const link of links) {
    const href = link.getAttribute("href");
    const optionValue = href ? new URL(href, new URL(path, window.location.href)).pathname : "";
    const label = link.querySelector("h3")?.textContent.trim() || link.textContent.trim();
    if (!optionValue || !label || seen.has(optionValue)) continue;
    seen.add(optionValue);
    selector.append(new Option(label, optionValue));
  }
}

async function loadWaterOptions() {
  const response = await fetch("./site-search-index.json");
  if (!response.ok) throw new Error(`Could not load the water list (${response.status}).`);
  const documents = await response.json();
  const waters = documents.filter((document) => /^waters\/[^/]+-river\.html$/.test(document.url));
  if (!waters.length) throw new Error("No waters are available in the guide.");
  waterSelect.replaceChildren(new Option("Choose a water", ""));
  for (const water of waters) {
    const name = water.title.replace(/\s+(?:\||-|–|—)\s+Southern Oregon Angler Guide\s*$/i, "");
    waterSelect.append(new Option(name, water.url));
  }
}

function targetTerms(fishName) {
  const normalized = fishName.toLowerCase();
  const slug = fishSelect.value.split("/").pop().replace(/\.html$/, "");
  const terms = [normalized];
  if (slug === "chinook-salmon") terms.push("chinook", "large salmon", "salmon");
  else if (slug === "coho-salmon") terms.push("coho", "salmon");
  else if (slug === "steelhead") terms.push("steelhead", "salmon");
  else if (slug === "kokanee") terms.push("kokanee");
  else if (/trout$/.test(slug) && !["lake-trout", "bull-trout"].includes(slug)) terms.push("trout");
  if (slug === "mountain-whitefish") terms.push("trout");
  if (/bass$/.test(slug)) terms.push("bass");
  if (/bluegill|crappie|yellow-perch/.test(slug)) terms.push("panfish");
  if (/catfish|bullhead/.test(slug)) terms.push("catfish");
  if (slug === "common-carp") terms.push("carp");
  if (slug === "northern-pikeminnow") terms.push("pikeminnow");
  if (slug === "white-sturgeon") terms.push("sturgeon");
  if (/halibut|lingcod|rockfish|cabezon|surfperch/.test(slug)) terms.push("saltwater");
  return [...new Set(terms)];
}

function productTargetScore(product, terms) {
  const target = (product.filters["Target fish"] || "").toLowerCase();
  if (!target) return 0;
  if (target.includes("all-around")) return product.category === "tackle" ? 1 : 0;
  if (target.includes(terms[0])) return 100;
  return terms.reduce((score, term, index) =>
    score + (target.includes(term) ? Math.max(1, 10 - index) : 0), 0);
}

function methodScore(product, method) {
  if (method === "Any") return 0;
  if (product.category === "line") {
    const material = (product.filters.Material || "").toLowerCase();
    const use = (product.filters.Use || "").toLowerCase();
    const isFlyLine = material.includes("fly") || /fly line/.test(product.name.toLowerCase());
    if (method === "Fly") return isFlyLine && !/backing|leader/.test(use) ? 5 : -100;
    const leaderOnly = /leader/.test(use) && !/main line/.test(use);
    return isFlyLine || leaderOnly || /backing/.test(use) ? -100 : 0;
  }
  if (product.category === "lures") {
    const isFly = (product.filters.Type || "").toLowerCase().includes("fly");
    if (method === "Fly") return isFly ? 5 : -100;
    return isFly ? -100 : 0;
  }
  if (!["rods", "reels"].includes(product.category)) return 0;
  const type = (product.filters.Type || "").toLowerCase();
  const compatible = {
    Spinning: ["spinning"],
    Baitcasting: ["casting", "baitcasting"],
    Fly: ["fly"]
  }[method];
  return compatible.some((value) => type.includes(value)) ? 5 : -100;
}

function waterScore(product, waterName) {
  const searchable = `${product.name} ${product.description} ${product.details}`.toLowerCase();
  const water = waterName.toLowerCase();
  if (water.includes("lake") || water.includes("reservoir")) {
    return /trolling|lake|kokanee/.test(searchable) ? 2 : 0;
  }
  return /river|steelhead|current/.test(searchable) ? 2 : 0;
}

function chooseProducts() {
  const fishName = fishSelect.selectedOptions[0]?.textContent || "";
  const waterName = waterSelect.selectedOptions[0]?.textContent || "";
  const method = methodSelect.value;
  const budget = Number(budgetSelect.value);
  const terms = targetTerms(fishName);
  const categories = ["rods", "reels", "line", "lures", "tackle"];
  const chosen = [];
  let spent = 0;

  for (const category of categories) {
    const compatible = products
      .filter((product) => product.category === category)
      .map((product) => ({
        product,
        targetScore: productTargetScore(product, terms),
        methodScore: methodScore(product, method),
        waterScore: waterScore(product, waterName)
      }))
      .filter(({ methodScore: score }) => score > -100);
    const ranked = compatible.sort((a, b) =>
      (b.targetScore * 10 + b.methodScore + b.waterScore) -
      (a.targetScore * 10 + a.methodScore + a.waterScore) ||
      a.product.price[0] - b.product.price[0]
    );
    const selection = ranked.find(({ product, targetScore }) =>
      targetScore > 0 && (budget === 0 || spent + product.price[0] <= budget)
    );
    if (!selection) continue;
    chosen.push(selection.product);
    spent += selection.product.price[0];
  }
  if (!chosen.some((product) => product.category === "rods") ||
      !chosen.some((product) => product.category === "reels")) {
    return [];
  }
  return chosen;
}

async function loadFishGearGuidance() {
  const response = await fetch(fishSelect.value);
  if (!response.ok) throw new Error(`Could not load the ${fishSelect.selectedOptions[0].textContent} gear guide (${response.status}).`);
  const page = new DOMParser().parseFromString(await response.text(), "text/html");
  const gearSection = [...page.querySelectorAll("section")].find((section) =>
    section.querySelector("h2")?.textContent.trim().toLowerCase() === "gear basics"
  );
  const items = [...(gearSection?.querySelectorAll("li") || [])]
    .map((item) => item.textContent.trim())
    .filter(Boolean);
  if (!items.length) throw new Error(`The ${fishSelect.selectedOptions[0].textContent} guide has no gear basics to show.`);
  const card = makeElement("article", "setup-product");
  card.append(makeElement("h3", "", `Fish-specific baseline guidance: ${fishSelect.selectedOptions[0].textContent}`));
  card.append(makeElement("p", "", "Use these species notes as a starting point; adapt them to your selected method, the water, and the rod and line ratings."));
  const list = document.createElement("ul");
  for (const item of items) list.append(makeElement("li", "", item));
  card.append(list);
  const link = makeElement("a", "setup-product__link", "Review the full fish guide");
  link.href = fishSelect.value;
  card.append(link);
  return card;
}

async function renderSetup() {
  currentSetup = chooseProducts();
  setupProducts.replaceChildren();
  setupProducts.append(await loadFishGearGuidance());
  const fishName = fishSelect.selectedOptions[0]?.textContent || "your target";
  const waterName = waterSelect.selectedOptions[0]?.textContent || "selected water";
  const budget = Number(budgetSelect.value);
  const low = currentSetup.reduce((total, product) => total + product.price[0], 0);
  const high = currentSetup.reduce((total, product) => total + product.price[1], 0);
  setupSummary.textContent = currentSetup.length
    ? `${currentSetup.length} catalog items tagged for ${fishName} at ${waterName}. Estimate: $${low}–$${high}; budget selection uses each item’s low estimate. Fish-specific gear guidance is shown below.`
    : `No catalog items tagged for ${fishName} match those preferences within the selected budget. Use the fish-specific gear guidance below, or try a higher budget or another method.`;

  for (const product of currentSetup) {
    const card = makeElement("article", "setup-product");
    const link = makeElement("a", "setup-product__link", product.name);
    link.href = `./gear/shop.html?category=${encodeURIComponent(product.category)}&product=${encodeURIComponent(product.id)}`;
    card.append(link, makeElement("p", "", product.description));
    const specifications = Object.entries(product.filters || {})
      .filter(([key]) => ["Length", "Power", "Size", "Strength", "Material", "Use"].includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
    if (specifications) card.append(makeElement("p", "", specifications));
    card.append(makeElement("p", "shop-product__price", `$${product.price[0]}–$${product.price[1]} · estimate`));
    setupProducts.append(card);
  }
  saveSetupButton.disabled = currentSetup.length === 0;
  addSetupButton.disabled = currentSetup.length === 0;
}

function renderSavedSetups() {
  savedSetupsContainer.replaceChildren();
  const setups = window.GearStore.getSavedSetups();
  if (!setups.length) {
    savedSetupsContainer.append(makeElement("p", "shop-empty", "No setups saved in this browser yet."));
    return;
  }
  for (const setup of setups) {
    const card = makeElement("article", "saved-setup");
    card.append(makeElement("h3", "", setup.name));
    card.append(makeElement("p", "", `${setup.fishName} · ${setup.waterName} · ${setup.method} · $${setup.budget || "No limit"}`));
    const actions = makeElement("div", "saved-setup__actions");
    const loadButton = makeElement("button", "shop-brand", "Load setup");
    loadButton.type = "button";
    loadButton.addEventListener("click", () => {
      try {
        const fishSlug = String(setup.fish).split("/").pop().replace(/\.html$/, "");
        const fishOption = findOptionBySlug(fishSelect, fishSlug);
        if (!fishOption) throw new Error(`Saved setup target "${setup.fishName}" is no longer in the fish guide.`);
        if (![...waterSelect.options].some((option) => option.value === setup.water)) {
          throw new Error(`Saved setup water "${setup.waterName}" is no longer in the water guide.`);
        }
        fishSelect.value = fishOption.value;
        waterSelect.value = setup.water;
        methodSelect.value = setup.method;
        budgetSelect.value = String(setup.budget);
        renderSetup().then(() => {
          setupStatus.textContent = `${setup.name} loaded.`;
          setupStatus.className = "form-status";
        }).catch(showSetupError);
      } catch (error) {
        showSetupError(error);
      }
    });
    const addSavedButton = makeElement("button", "shop-brand", "Add to cart");
    addSavedButton.type = "button";
    addSavedButton.addEventListener("click", () => {
      try {
        const missing = setup.productIds.find((productId) => !products.some((product) => product.id === productId));
        if (missing) throw new Error(`Saved setup item "${missing}" is no longer in the catalog.`);
        window.GearStore.addManyToCart(setup.productIds);
        setupStatus.textContent = `${setup.name} added to your browser-only cart.`;
        setupStatus.className = "form-status";
      } catch (error) {
        showSetupError(error);
      }
    });
    const deleteButton = makeElement("button", "shop-brand", "Delete");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
      try {
        window.GearStore.deleteSetup(setup.id);
        renderSavedSetups();
        setupStatus.textContent = `${setup.name} deleted from this browser.`;
        setupStatus.className = "form-status";
      } catch (error) {
        showSetupError(error);
      }
    });
    actions.append(loadButton, addSavedButton, deleteButton);
    card.append(actions);
    savedSetupsContainer.append(card);
  }
}

async function loadCatalog() {
  const responses = await Promise.all([
    fetch("./gear/products.json"),
    fetch("./gear/products-expanded.json")
  ]);
  for (const response of responses) {
    if (!response.ok) throw new Error(`Could not load gear suggestions (${response.status}).`);
  }
  const catalogs = await Promise.all(responses.map((response) => response.json()));
  products = catalogs.flat();
}

async function initializeSetupBuilder() {
  try {
    const params = new URLSearchParams(window.location.search);
    await Promise.all([
      loadOptions("./fish/fish.html", fishSelect, "a.fish-card", "target fish"),
      loadWaterOptions()
    ]);
    await loadCatalog();
    loaded = true;
    const fishHref = params.get("fish");
    const waterHref = params.get("water");
    const requestedFish = fishHref && findOptionBySlug(fishSelect, fishHref);
    const requestedWater = waterHref && findOptionBySlug(waterSelect, waterHref);
    if (requestedFish) fishSelect.value = requestedFish.value;
    if (requestedWater) waterSelect.value = requestedWater.value;
    try {
      renderSavedSetups();
    } catch (error) {
      showSetupError(error);
    }
    if (fishSelect.value && waterSelect.value) await renderSetup();
  } catch (error) {
    showSetupError(error);
    setupSummary.textContent = "The setup builder could not load its fish, water, or gear data. Please reload and try again.";
  }
}

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!loaded || !fishSelect.value || !waterSelect.value) {
    showSetupError(new Error("Choose a target fish and water before building a setup."));
    return;
  }
  renderSetup().then(() => {
    setupStatus.textContent = "Setup recommendations updated.";
    setupStatus.className = "form-status";
  }).catch(showSetupError);
});

saveSetupButton.addEventListener("click", () => {
  try {
    const fishName = fishSelect.selectedOptions[0].textContent;
    const waterName = waterSelect.selectedOptions[0].textContent;
    window.GearStore.saveSetup({
      name: `${fishName} at ${waterName}`,
      fish: fishSelect.value,
      fishName,
      water: waterSelect.value,
      waterName,
      method: methodSelect.value,
      budget: Number(budgetSelect.value),
      productIds: currentSetup.map((product) => product.id)
    });
    renderSavedSetups();
    setupStatus.textContent = "Setup saved in this browser.";
    setupStatus.className = "form-status";
  } catch (error) {
    showSetupError(error);
  }
});

addSetupButton.addEventListener("click", () => {
  try {
    window.GearStore.addManyToCart(currentSetup.map((product) => product.id));
    setupStatus.textContent = "Setup added to your browser-only cart.";
    setupStatus.className = "form-status";
  } catch (error) {
    showSetupError(error);
  }
});

initializeSetupBuilder();
