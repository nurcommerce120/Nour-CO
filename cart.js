/* =========================
   PANIER R.A.Y.B
========================= */

const CART_KEY = "rayb_cart";
const CHECKOUT_KEY = "rayb_checkout";
const STOCK_OVERRIDE_KEY = "rayb_stock_overrides";

function showToast(message, type) {
  let toast = document.getElementById("raybToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "raybToast";
    toast.style.cssText =
      "position:fixed;bottom:24px;right:24px;z-index:9999;" +
      "padding:12px 22px;border-radius:8px;font-size:14px;font-weight:500;" +
      "font-family:Inter,sans-serif;" +
      "transition:opacity .3s ease,transform .3s ease;" +
      "opacity:0;transform:translateY(10px);pointer-events:none;max-width:320px;";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = type === "error" ? "#b91c1c" : "#111111";
  toast.style.color = "#ffffff";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 2800);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function getStockOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STOCK_OVERRIDE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function getAvailableStockForItem(item) {
  const overrides = getStockOverrides();
  if (item && item.id && Object.prototype.hasOwnProperty.call(overrides, item.id)) {
    return Math.max(0, Number(overrides[item.id]));
  }
  if (item && item.stock !== undefined && item.stock !== null && item.stock !== "") {
    return Math.max(0, Number(item.stock));
  }
  return Infinity;
}

function getQuantityInCart(cart, product) {
  return cart
    .filter(item => item.id === product.id)
    .reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function addToCart(product) {
  const cart = getCart();
  const cleanProduct = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image,
    size: product.size || "",
    color: product.color || "",
    stock: product.stock !== undefined ? Number(product.stock) : undefined,
    quantity: 1
  };

  const availableStock = getAvailableStockForItem(cleanProduct);
  const currentQuantityForProduct = getQuantityInCart(cart, cleanProduct);

  if (availableStock <= 0) {
    showToast("Produit épuisé.", "error");
    return;
  }

  if (currentQuantityForProduct + 1 > availableStock) {
    showToast("Stock insuffisant : il reste " + availableStock + " article(s).", "error");
    return;
  }

  const existing = cart.find(item =>
    item.id === cleanProduct.id &&
    item.size === cleanProduct.size &&
    item.color === cleanProduct.color
  );
  if (existing) {
    existing.quantity += 1;
    existing.stock = cleanProduct.stock;
  } else {
    cart.push(cleanProduct);
  }
  saveCart(cart);
  showToast("Ajouté : " + cleanProduct.name);
  openCart();
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
  }
}

function updateQuantity(index, quantity) {
  const cart = getCart();
  const newQty = Number(quantity);
  if (index < 0 || index >= cart.length) return;
  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    const item = cart[index];
    const availableStock = getAvailableStockForItem(item);
    const otherQtySameProduct = cart
      .filter((entry, i) => i !== index && entry.id === item.id)
      .reduce((total, entry) => total + Number(entry.quantity || 0), 0);

    if (otherQtySameProduct + newQty > availableStock) {
      showToast("Stock insuffisant : il reste " + availableStock + " article(s).", "error");
      item.quantity = Math.max(1, availableStock - otherQtySameProduct);
    } else {
      item.quantity = newQty;
    }
  }
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
  });
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("cart-open");
  renderCart();
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("cart-open");
}

function cartHasStockIssue(cart) {
  return cart.some(item => Number(item.quantity || 1) > getAvailableStockForItem(item));
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="muted" style="padding:16px 0;">Votre panier est vide.</p>';
    cartTotal.textContent = "0,00 €";
    const checkoutBtn = document.querySelector(".cart-checkout");
    if (checkoutBtn) checkoutBtn.classList.remove("is-disabled");
    return;
  }

  let total = 0;
  const hasIssue = cartHasStockIssue(cart);
  cartItems.innerHTML = cart.map((item, index) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const availableStock = getAvailableStockForItem(item);
    const stockIssue = quantity > availableStock;
    total += price * quantity;
    const optionText = item.size || item.color || "";
    const plusDisabled = quantity >= availableStock ? "disabled" : "";
    return `
      <div class="cart-item ${stockIssue ? "out-of-stock" : ""}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          ${optionText ? `<span>${optionText}</span>` : ""}
          <span>${price.toFixed(2).replace(".", ",")} €</span>
          ${Number.isFinite(availableStock) ? `<span class="muted">Stock disponible : ${availableStock}</span>` : ""}
          ${stockIssue ? `<span class="cart-stock-warning">Quantité trop élevée : il ne reste que ${availableStock} article(s).</span>` : ""}
          <div class="cart-qty">
            <button type="button" onclick="updateQuantity(${index}, ${quantity - 1})">−</button>
            <span>${quantity}</span>
            <button type="button" ${plusDisabled} onclick="updateQuantity(${index}, ${quantity + 1})">+</button>
          </div>
          <button type="button" class="cart-remove" onclick="removeFromCart(${index})">Supprimer</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = total.toFixed(2).replace(".", ",") + " €";
  const checkoutBtn = document.querySelector(".cart-checkout");
  if (checkoutBtn) {
    checkoutBtn.classList.toggle("is-disabled", hasIssue);
    checkoutBtn.disabled = hasIssue;
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CHECKOUT_KEY);
  updateCartCount();
  renderCart();
}

function goToPayment() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Votre panier est vide.", "error");
    return;
  }
  if (cartHasStockIssue(cart)) {
    showToast("Corrigez les quantités avant de payer.", "error");
    openCart();
    return;
  }
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(cart));
  window.location.href = "paiement.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
});
