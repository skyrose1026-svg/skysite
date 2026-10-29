const categories = [
  { id: 'all', label: 'All gear' },
  { id: 'rods', label: 'Rods' },
  { id: 'reels', label: 'Reels' },
  { id: 'line', label: 'Line' },
  { id: 'lures', label: 'Lures & flies' },
  { id: 'tackle', label: 'Tackle' },
  { id: 'essentials', label: 'Essentials' }
];

const categoryImages = {
  rods: 'images/rods.svg',
  reels: 'images/reels.svg',
  line: 'images/line.svg',
  lures: 'images/lures.svg',
  tackle: 'images/tackle.svg',
  essentials: 'images/essentials.svg'
};

const categoryTitles = Object.fromEntries(categories.map(({ id, label }) => [id, label]));
const categoryNavigation = document.querySelector('[data-shop-categories]');
const brandContainer = document.querySelector('[data-shop-brands]');
const categoryTitle = document.querySelector('[data-category-title]');
const filterContainer = document.querySelector('[data-shop-filters]');
const productGrid = document.querySelector('[data-product-grid]');
const productSearch = document.querySelector('#product-search');
const summary = document.querySelector('[data-shop-summary]');
const resetButton = document.querySelector('[data-shop-reset]');
const cartCount = document.querySelector('[data-cart-count]');

let products = [];
let brands = [];
let selectedCategory = 'rods';
let selectedBrand = '';
let activeFilters = {};

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function updateAddress() {
  const params = new URLSearchParams(window.location.search);
  params.set('category', selectedCategory);
  const search = productSearch.value.trim();
  if (search) params.set('q', search);
  else params.delete('q');
  if (selectedBrand) params.set('brand', selectedBrand);
  else params.delete('brand');
  params.delete('product');
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
}

function renderCategories() {
  categoryNavigation.replaceChildren();
  for (const category of categories) {
    const button = createElement('button', 'shop-category', category.label);
    button.type = 'button';
    button.dataset.category = category.id;
    button.setAttribute('aria-pressed', String(category.id === selectedCategory));
    button.addEventListener('click', () => selectCategory(category.id));
    categoryNavigation.append(button);
  }
}

function selectCategory(categoryId) {
  if (!categoryTitles[categoryId]) return;
  selectedCategory = categoryId;
  selectedBrand = '';
  activeFilters = {};
  categoryTitle.textContent = categoryTitles[categoryId];
  renderCategories();
  renderBrands();
  renderFilters();
  renderProducts();
  updateAddress();
}

function renderBrands() {
  brandContainer.replaceChildren();
  const allBrands = createElement('button', 'shop-brand', 'All brands');
  allBrands.type = 'button';
  allBrands.setAttribute('aria-pressed', String(!selectedBrand));
  allBrands.addEventListener('click', () => selectBrand(''));
  brandContainer.append(allBrands);

  for (const brand of brands) {
    const count = products.filter((product) => product.brand === brand.name).length;
    if (!count) continue;
    const card = createElement('article', 'shop-brand-card');
    const select = createElement('button', 'shop-brand__select', brand.name);
    select.type = 'button';
    select.setAttribute('aria-pressed', String(selectedBrand === brand.name));
    select.addEventListener('click', () => selectBrand(brand.name));
    card.append(select);
    card.append(createElement('p', 'shop-brand__description', brand.description));
    const visit = createElement('a', 'shop-brand__link', 'Visit official site');
    visit.href = brand.url;
    visit.target = '_blank';
    visit.rel = 'noopener noreferrer';
    card.append(visit, createElement('span', 'shop-brand__count', `${count} example ${count === 1 ? 'item' : 'items'}`));
    brandContainer.append(card);
  }
}

function selectBrand(brandName) {
  selectedBrand = brandName;
  selectedCategory = 'all';
  activeFilters = {};
  categoryTitle.textContent = brandName ? `${brandName} examples` : 'All gear';
  renderCategories();
  renderBrands();
  renderFilters();
  renderProducts();
  updateAddress();
}

function renderFilters() {
  filterContainer.replaceChildren();
  const categoryProducts = products.filter((product) =>
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (!selectedBrand || product.brand === selectedBrand)
  );
  const fields = [...new Set(categoryProducts.flatMap((product) => Object.keys(product.filters)))];

  for (const field of fields) {
    const wrapper = createElement('div', 'shop-field');
    const id = `shop-filter-${field.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const label = createElement('label', '', field);
    label.htmlFor = id;
    const select = document.createElement('select');
    select.id = id;
    select.dataset.filter = field;
    select.append(new Option(`Any ${field.toLowerCase()}`, ''));
    const values = [...new Set(categoryProducts.map((product) => product.filters[field]).filter(Boolean))].sort();
    for (const value of values) select.append(new Option(value, value));
    select.value = activeFilters[field] || '';
    select.addEventListener('change', () => {
      activeFilters[field] = select.value;
      renderProducts();
      updateAddress();
    });
    wrapper.append(label, select);
    filterContainer.append(wrapper);
  }
}

function productSearchText(product) {
  return [
    product.name,
    product.brand || '',
    product.description,
    product.details,
    ...Object.entries(product.filters).flat()
  ].join(' ').toLowerCase();
}

function renderProduct(product) {
  const card = createElement('article', 'shop-product');
  card.id = `product-${product.id}`;
  const imageFrame = createElement('div', 'shop-product__image');
  const image = document.createElement('img');
  image.src = `./${product.image || categoryImages[product.category]}`;
  image.alt = product.alt;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.src = `./${categoryImages[product.category]}`;
  }, { once: true });
  imageFrame.append(image);
  if (product.imageNote) imageFrame.append(createElement('span', 'shop-product__image-note', product.imageNote));

  const body = createElement('div', 'shop-product__body');
  body.append(createElement('h3', '', product.name));
  body.append(createElement('p', 'shop-product__description', product.description));
  const [low, high] = product.price;
  body.append(createElement('p', 'shop-product__price', `$${low}–$${high}`));
  body.append(createElement('p', 'shop-product__price-note', 'Planning estimate · USD; verify current price'));
  if (product.brand) {
    body.append(createElement('p', 'shop-product__brand', `Brand example: ${product.brand}`));
  }

  const tags = createElement('ul', 'shop-product__tags');
  for (const [label, value] of Object.entries(product.filters)) {
    tags.append(createElement('li', '', `${label}: ${value}`));
  }
  body.append(tags);

  const details = document.createElement('details');
  details.append(createElement('summary', '', 'View specifications'));
  details.append(createElement('p', '', product.details));
  body.append(details);

  if (product.photoCredit && product.photoSource) {
    const credit = createElement('p', 'shop-product__credit');
    credit.append(document.createTextNode('Photo: '));
    const source = createElement('a', '', product.photoCredit);
    source.href = product.photoSource;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    credit.append(source);
    body.append(credit);
  }

  const manufacturerUrl = product.productUrl || product.brandUrl;
  if (manufacturerUrl) {
    const manufacturer = createElement(
      'a',
      'shop-manufacturer-link',
      product.productUrl ? 'Check product details' : 'Visit brand site'
    );
    manufacturer.href = manufacturerUrl;
    manufacturer.target = '_blank';
    manufacturer.rel = 'noopener noreferrer';
    body.append(manufacturer);
  }

  const addButton = createElement('button', 'shop-add-button', 'Add to planning cart');
  addButton.type = 'button';
  addButton.addEventListener('click', () => {
    try {
      window.GearStore.addToCart(product.id);
      updateCartCount();
      addButton.textContent = 'Added to cart';
      window.setTimeout(() => { addButton.textContent = 'Add to planning cart'; }, 1800);
    } catch (error) {
      summary.textContent = error.message || 'The item could not be added to your cart.';
    }
  });
  body.append(addButton);
  card.append(imageFrame, body);
  return card;
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  const searchTerms = query.split(/\s+/).filter(Boolean);
  const matchingProducts = products.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedBrand && product.brand !== selectedBrand) return false;
    const searchable = productSearchText(product);
    if (!searchTerms.every((term) => searchable.includes(term))) return false;
    return Object.entries(activeFilters).every(([field, value]) => !value || product.filters[field] === value);
  });

  productGrid.replaceChildren();
  if (matchingProducts.length === 0) {
    productGrid.append(createElement('p', 'shop-empty', 'No gear matches those filters. Try changing or clearing a filter.'));
  } else {
    productGrid.append(...matchingProducts.map(renderProduct));
  }
  const categoryProducts = products.filter((product) =>
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (!selectedBrand || product.brand === selectedBrand)
  );
  const scope = selectedBrand ? `${selectedBrand} examples` : categoryTitles[selectedCategory].toLowerCase();
  summary.textContent = `Showing ${matchingProducts.length} of ${categoryProducts.length} ${scope}.`;
}

function updateCartCount() {
  if (!cartCount) return;
  try {
    const count = window.GearStore.getCart().reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = `(${count} ${count === 1 ? 'item' : 'items'})`;
  } catch (error) {
    cartCount.textContent = '(cart unavailable)';
    summary.textContent = error.message || 'The saved planning list could not be read.';
  }
}

function clearFilters() {
  activeFilters = {};
  selectedBrand = '';
  productSearch.value = '';
  categoryTitle.textContent = categoryTitles[selectedCategory];
  renderCategories();
  renderBrands();
  renderFilters();
  renderProducts();
  updateCartCount();
  updateAddress();
}

async function initializeShop() {
  try {
    const responses = await Promise.all([
      fetch('./products.json'),
      fetch('./products-expanded.json'),
      fetch('./brands.json')
    ]);
    for (const response of responses) {
      if (!response.ok) throw new Error(`Shop catalog request failed (${response.url}: ${response.status}).`);
    }
    const [baseProducts, expandedProducts, brandList] = await Promise.all(responses.map((response) => response.json()));
    products = [...baseProducts, ...expandedProducts];
    brands = brandList;
  } catch (error) {
    summary.textContent = 'The gear catalog could not be loaded. Please reload the page or try again later.';
    console.error(error);
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('category');
  if (categoryTitles[requestedCategory]) selectedCategory = requestedCategory;
  const requestedBrand = params.get('brand');
  if (brands.some((brand) => brand.name === requestedBrand)) {
    selectedBrand = requestedBrand;
    selectedCategory = 'all';
  }
  productSearch.value = params.get('q') || '';
  const requestedProduct = params.get('product');
  if (requestedProduct) {
    const product = products.find((item) => item.id === requestedProduct);
    if (product) {
      selectedCategory = product.category;
      selectedBrand = product.brand || '';
      if (selectedBrand) selectedCategory = 'all';
      productSearch.value = product.name;
    }
  }

  categoryTitle.textContent = selectedBrand ? `${selectedBrand} examples` : categoryTitles[selectedCategory];
  renderCategories();
  renderBrands();
  renderFilters();
  renderProducts();
  updateCartCount();
  productSearch.addEventListener('input', () => {
    renderProducts();
    updateAddress();
  });
  resetButton.addEventListener('click', clearFilters);
}

initializeShop();
