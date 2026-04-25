/* =========================
   PANIER R.A.Y.B
========================= */
console.log("cart.js chargé");
const CART_KEY = "rayb_cart";
const CHECKOUT_KEY = "rayb_checkout";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
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
    quantity: 1
  };

  const existing = cart.find(item =>
    item.id === cleanProduct.id &&
    item.size === cleanProduct.size &&
    item.color === cleanProduct.color
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(cleanProduct);
  }

  saveCart(cart);
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
  const newQuantity = Number(quantity);

  if (index < 0 || index >= cart.length) return;

  if (newQuantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQuantity;
  }

  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");

  if (!drawer || !overlay) {
    console.error("Panier introuvable : vérifie cartDrawer et cartOverlay dans le HTML.");
    return;
  }

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

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="muted">Votre panier est vide.</p>`;
    cartTotal.textContent = "0,00 €";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const itemTotal = price * quantity;
    total += itemTotal;

    const optionText = item.size || item.color || "";

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          ${optionText ? `<span>${optionText}</span>` : ""}
          <span>${price.toFixed(2).replace(".", ",")} €</span>

          <div class="cart-qty">
            <button type="button" onclick="updateQuantity(${index}, ${quantity - 1})">−</button>
            <span>${quantity}</span>
            <button type="button" onclick="updateQuantity(${index}, ${quantity + 1})">+</button>
          </div>

          <button type="button" class="cart-remove" onclick="removeFromCart(${index})">
            Supprimer
          </button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = total.toFixed(2).replace(".", ",") + " €";
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
    alert("Votre panier est vide.");
    return;
  }

  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(cart));
  window.location.href = "paiement.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });
});