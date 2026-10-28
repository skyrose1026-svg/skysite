const cartItems = document.querySelector("[data-cart-items]");
const cartStatus = document.querySelector("[data-cart-status]");
const cartTotal = document.querySelector("[data-cart-total]");
const clearCartButton = document.querySelector("[data-clear-cart]");

function showCartError(error) {
  cartStatus.textContent = error.message || "The cart could not be updated.";
  cartStatus.className = "form-status form-status--error";
}

function createCartElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderCart(products) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = window.GearStore.getCart();
  cartItems.replaceChildren();
  let lowTotal = 0;
  let highTotal = 0;

  if (!items.length) {
    cartItems.append(createCartElement("p", "shop-empty", "Your cart is empty. Add example gear from the shop or setup builder."));
    cartTotal.textContent = "$0–$0";
    return;
  }

  for (const item of items) {
    const product = productsById.get(item.productId);
    const card = createCartElement("article", "cart-item");
    if (!product) {
      card.append(createCartElement("h2", "", "Catalog item unavailable"));
      card.append(createCartElement("p", "", `Saved item ${item.productId} is no longer in the catalog and cannot be priced.`));
      const remove = createCartElement("button", "shop-brand", "Remove unavailable item");
      remove.type = "button";
      remove.addEventListener("click", () => {
        try {
          window.GearStore.removeFromCart(item.productId);
          renderCart(products);
          cartStatus.textContent = "Unavailable item removed from your cart.";
          cartStatus.className = "form-status";
        } catch (error) {
          showCartError(error);
        }
      });
      card.append(remove);
      cartItems.append(card);
      cartStatus.textContent = "One or more saved items are no longer in the catalog.";
      cartStatus.className = "form-status form-status--error";
      continue;
    }
    card.append(createCartElement("h2", "", product.name));
    card.append(createCartElement("p", "", product.description));
    const [low, high] = product.price;
    lowTotal += low * item.quantity;
    highTotal += high * item.quantity;
    card.append(createCartElement("p", "shop-product__price", `$${low}–$${high} each · planning estimate`));

    const controls = createCartElement("div", "cart-item__controls");
    const label = createCartElement("label", "", "Quantity");
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.step = "1";
    input.value = String(item.quantity);
    input.setAttribute("aria-label", `Quantity for ${product.name}`);
    input.addEventListener("change", () => {
      try {
        const quantity = Number(input.value);
        window.GearStore.setQuantity(product.id, quantity);
        renderCart(products);
        cartStatus.textContent = "Cart quantity updated in this browser.";
        cartStatus.className = "form-status";
      } catch (error) {
        showCartError(error);
      }
    });
    label.append(input);
    const remove = createCartElement("button", "shop-brand", "Remove");
    remove.type = "button";
    remove.addEventListener("click", () => {
      try {
        window.GearStore.removeFromCart(product.id);
        renderCart(products);
        cartStatus.textContent = `${product.name} removed from your cart.`;
        cartStatus.className = "form-status";
      } catch (error) {
        showCartError(error);
      }
    });
    controls.append(label, remove);
    card.append(controls);
    cartItems.append(card);
  }

  cartTotal.textContent = `$${lowTotal}–$${highTotal}`;
}

async function initializeCart() {
  try {
    const responses = await Promise.all([fetch("./products.json"), fetch("./products-expanded.json")]);
    for (const response of responses) {
      if (!response.ok) throw new Error(`Could not load cart catalog (${response.status}).`);
    }
    const catalogs = await Promise.all(responses.map((response) => response.json()));
    renderCart(catalogs.flat());
  } catch (error) {
    showCartError(error);
    cartItems.replaceChildren(createCartElement("p", "shop-empty", "The cart could not be loaded. Please reload and try again."));
    cartTotal.textContent = "Unavailable";
  }
}

clearCartButton.addEventListener("click", () => {
  try {
    window.GearStore.clearCart();
    initializeCart();
    cartStatus.textContent = "Cart cleared from this browser.";
    cartStatus.className = "form-status";
  } catch (error) {
    showCartError(error);
  }
});

initializeCart();
