// ── Shared across all pages ───────────────────────────────────

// ── Cart ──────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('tjp_cart') || '[]');

function saveCart() {
  localStorage.setItem('tjp_cart', JSON.stringify(cart));
}

function addToCart(id, products) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  const ex = cart.find(c => c.id === id);
  if (ex) { ex.qty++; } else { cart.push({ ...p, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(p.title + ' added to cart');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const badge = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  if (badge) badge.textContent = count;
  if (totalEl) totalEl.textContent = '£' + total.toLocaleString();
  const body = document.getElementById('cartBody');
  if (!body) return;
  if (!cart.length) { body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>'; return; }
  body.innerHTML = cart.map(c => `
    <div class="cart-line">
      <div class="cart-line-img">${c.image ? `<img src="${c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover"/>` : c.emoji}</div>
      <div class="cart-line-info">
        <div class="cart-line-name">${c.title}</div>
        <div class="cart-line-compat">${c.compatibility}</div>
        <div class="cart-line-price">£${c.price} × ${c.qty}</div>
        <button class="cart-line-remove" onclick="removeFromCart('${c.id}')">Remove</button>
      </div>
    </div>`).join('');
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Mobile nav ────────────────────────────────────────────────
function toggleMobileNav() {
  document.getElementById('mobileNav')?.classList.toggle('open');
  document.getElementById('mobileOverlay')?.classList.toggle('open');
}

// ── Products loader ───────────────────────────────────────────
async function loadProducts() {
  try {
    const res = await fetch('/products.json?v=' + Date.now());
    if (!res.ok) throw new Error('No products.json');
    return await res.json();
  } catch {
    return [];
  }
}
// ── Vehicle data ──────────────────────────────────────────────
const VEHICLE_DATA = {
  nissan:     { label: 'Nissan',     models: ['180SX','200SX','240SX','300ZX','350Z','370Z','GTR','R32','R33','R34','S13','S14','S15','Silvia','Skyline'] },
  toyota:     { label: 'Toyota',     models: ['AE86','Aristo','Celica','Chaser','Corolla','Crown','GR86','JZX100','MR2','Soarer','Supra','Verossa'] },
  honda:      { label: 'Honda',      models: ['Accord','Beat','Civic','CR-X','DC2 Integra','DC5 Integra','EK9','EP3','FK2','FK8','FL5','NSX','Prelude','S2000'] },
  subaru:     { label: 'Subaru',     models: ['BRZ','Forester','Impreza','Legacy','Outback','WRX STI'] },
  mitsubishi: { label: 'Mitsubishi', models: ['3000GT','Eclipse','Evo I','Evo II','Evo III','Evo IV','Evo V','Evo VI','Evo VII','Evo VIII','Evo IX','Evo X','FTO','GTO','Lancer Evo'] },
  mazda:      { label: 'Mazda',      models: ['Cosmo','MX-5','RX-7','RX-8'] },
};

// ── Slug helper ───────────────────────────────────────────────
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getProductId(p) {
  return p.id || toSlug(p.title);
}

// ── Nav active state ──────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.endsWith(href)) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setActiveNav();
});
