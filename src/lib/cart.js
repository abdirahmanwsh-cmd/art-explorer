const KEY = "cart_v1";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function saveCart(items) { localStorage.setItem(KEY, JSON.stringify(items)); }

function addToCart(item) {
  const cart = loadCart();
  const idx = cart.findIndex(x => x.id === item.id && x.source === item.source);
  if (idx >= 0) {
    cart[idx].qty += item.qty || 1;
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);
  return cart;
}
function removeFromCart(id, source) {
  const cart = loadCart().filter(x => !(x.id === id && x.source === source));
  saveCart(cart);
  return cart;
}
function setQty(id, source, qty) {
  const cart = loadCart().map(x => (x.id === id && x.source === source) ? { ...x, qty } : x);
  saveCart(cart);
  return cart;
}
function countItems() {
  return loadCart().reduce((n, x) => n + (x.qty || 1), 0);
}
function clearCart() {
  saveCart([]);
  return [];
}

export { loadCart, saveCart, addToCart, removeFromCart, setQty, countItems, clearCart };