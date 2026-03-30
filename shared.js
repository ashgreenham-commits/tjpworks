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
const PLACEHOLDER_PRODUCTS = [
  {id:'p1',title:'Turbine Housing SR20DET',brand:'OEM Nissan',price:189,original_price:240,compatibility:'Nissan S13 / S14 SR20DET',category:'engine',make:'nissan',models:['S13','S14'],years:[1989,1990,1991,1992,1993,1994,1995,1996,1997,1998],stock:'uk',badge:'JDM',emoji:'⚙️',image:'',images:[],featured:true,description:'Genuine OEM turbine housing for the SR20DET engine. Direct fit, no modifications required. Sourced directly from Japan.'},
  {id:'p2',title:'Coilover Kit GR-S',brand:'Tein',price:699,original_price:null,compatibility:'Toyota Supra A80 / MK4',category:'suspension',make:'toyota',models:['Supra'],years:[1993,1994,1995,1996,1997,1998,1999,2000,2001,2002],stock:'jp',badge:null,emoji:'🔩',image:'',images:[],featured:true,description:'Full coilover kit offering adjustable ride height and damping. Popular upgrade for track and street use.'},
  {id:'p3',title:'Cat-Back Exhaust System',brand:'HKS Hi-Power',price:449,original_price:520,compatibility:'Honda Civic Type R EK9',category:'exhaust',make:'honda',models:['Civic'],years:[1997,1998,1999,2000],stock:'uk',badge:'SALE',emoji:'💨',image:'',images:[],featured:true,description:'Full cat-back exhaust system with signature HKS tone. Stainless steel construction, direct bolt-on fitment.'},
  {id:'p4',title:'EJ20 Short Block Assembly',brand:'OEM Subaru',price:1250,original_price:null,compatibility:'Subaru Impreza WRX GC8',category:'engine',make:'subaru',models:['Impreza'],years:[1992,1993,1994,1995,1996,1997,1998,1999,2000],stock:'jp',badge:'JDM',emoji:'⚙️',image:'',images:[],featured:false,description:'Complete EJ20 short block assembly sourced directly from Japan. Ideal for rebuilds and performance builds.'},
  {id:'p5',title:'Front Lip Splitter FRP',brand:'Varis',price:299,original_price:380,compatibility:'Mitsubishi Lancer Evo IX',category:'body',make:'mitsubishi',models:['Lancer Evo'],years:[2005,2006,2007],stock:'uk',badge:'SALE',emoji:'🚗',image:'',images:[],featured:false,description:'Lightweight FRP front lip splitter for the Evo IX. Improves front-end aerodynamic downforce.'},
  {id:'p6',title:'Air Intake System',brand:'Blitz SUS Power',price:179,original_price:null,compatibility:'Nissan Skyline R32/R33/R34',category:'exhaust',make:'nissan',models:['R32','R33','R34'],years:[1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002],stock:'uk',badge:null,emoji:'💨',image:'',images:[],featured:true,description:'High-flow induction kit for RB-engined Skylines. Significant improvement in throttle response and mid-range power.'},
  {id:'p7',title:'LSD Helical Diff',brand:'Cusco Type RS',price:569,original_price:null,compatibility:'Toyota AE86 / Corolla',category:'engine',make:'toyota',models:['AE86'],years:[1983,1984,1985,1986,1987],stock:'jp',badge:'JDM',emoji:'⚙️',image:'',images:[],featured:false,description:'Helical limited slip differential for the AE86. Smooth operation with excellent traction under power.'},
  {id:'p8',title:'Adjustable Rear Camber Arms',brand:'Whiteline',price:129,original_price:159,compatibility:'Honda Integra DC2/DC5',category:'suspension',make:'honda',models:['Integra'],years:[1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006],stock:'uk',badge:'SALE',emoji:'🔩',image:'',images:[],featured:true,description:'Adjustable rear camber arms for the DC2 and DC5 Integra. Essential for alignment correction after lowering.'},
  {id:'p9',title:'Carbon Rear Wing GT',brand:'Voltex',price:799,original_price:null,compatibility:'Subaru Impreza STI GD',category:'body',make:'subaru',models:['Impreza'],years:[2000,2001,2002,2003,2004,2005,2006,2007],stock:'jp',badge:null,emoji:'🚗',image:'',images:[],featured:false,description:'Full carbon fibre GT rear wing for the GD Impreza. Race-proven aerodynamic performance.'},
  {id:'p10',title:'Brake Pad Set — Front',brand:'Dixcel ES',price:89,original_price:99,compatibility:'Honda Civic FK8 / FL5',category:'brakes',make:'honda',models:['Civic'],years:[2017,2018,2019,2020,2021,2022,2023],stock:'uk',badge:'SALE',emoji:'🛑',image:'',images:[],featured:false,description:'Dixcel ES type brake pads for the FK8 and FL5 Civic Type R. Excellent street performance with low dust.'},
  {id:'p11',title:'Oil Filter — High Performance',brand:'HKS',price:28,original_price:null,compatibility:'Nissan SR20 / RB Series',category:'servicing',make:'nissan',models:['S13','S14','S15','R32','R33','R34'],years:[1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002],stock:'uk',badge:null,emoji:'🛢️',image:'',images:[],featured:false,description:'HKS high performance oil filter for SR20 and RB series engines. Direct replacement, better flow characteristics.'},
  {id:'p12',title:'Radiator Aluminium 3-Core',brand:'Koyorad',price:349,original_price:null,compatibility:'Toyota Supra JZA80',category:'cooling',make:'toyota',models:['Supra'],years:[1993,1994,1995,1996,1997,1998,1999,2000,2001,2002],stock:'jp',badge:'JDM',emoji:'🌡️',image:'',images:[],featured:false,description:'3-core aluminium racing radiator for the JZA80 Supra. Significantly improved cooling capacity over OEM.'},
  {id:'p13',title:'Short Shift Kit',brand:'Cusco',price:199,original_price:240,compatibility:'Subaru Impreza / WRX',category:'interior',make:'subaru',models:['Impreza'],years:[1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007],stock:'uk',badge:'SALE',emoji:'🪑',image:'',images:[],featured:false,description:'Cusco short shift kit for the Impreza. Reduces throw by approximately 30% for faster gear changes.'},
  {id:'p14',title:'Lowering Springs',brand:'Eibach',price:249,original_price:null,compatibility:'Honda Civic FK8',category:'suspension',make:'honda',models:['Civic'],years:[2017,2018,2019,2020,2021],stock:'uk',badge:null,emoji:'🔩',image:'',images:[],featured:false,description:'Eibach progressive lowering springs for the FK8 Civic Type R. 25mm drop with improved handling balance.'},
  {id:'p15',title:'Spark Plugs Iridium (x4)',brand:'NGK',price:64,original_price:null,compatibility:'Honda B/K/F Series',category:'servicing',make:'honda',models:['Civic','Integra','S2000'],years:[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010],stock:'uk',badge:null,emoji:'🛢️',image:'',images:[],featured:false,description:'NGK Laser Iridium spark plugs for Honda B, K and F series engines. Extended service life and improved ignition.'},
];

async function loadProducts() {
  try {
    const res = await fetch('/products.json');
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return PLACEHOLDER_PRODUCTS;
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
