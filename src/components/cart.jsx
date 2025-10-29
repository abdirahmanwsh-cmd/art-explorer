import { useEffect, useMemo, useState } from "react";
import { loadCart, removeFromCart, setQty, countItems } from "../lib/cart";
import { useAuth } from "../auth";


function Cart({ open, onClose, onCheckout }) {
  const { user, loginWithGoogle } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!open) return;
    if (!user) { loginWithGoogle(); onClose && onClose(); return; }
    setItems(loadCart());
  }, [open, user]);

  function handleRemove(id, source) { setItems(removeFromCart(id, source)); }
  function handleQty(id, source, q) { const qty = Math.max(1, q | 0); setItems(setQty(id, source, qty)); }

  const total = useMemo(() => items.reduce((s, x) => s + x.price * (x.qty || 1), 0), [items]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-neutral-900 border-l border-neutral-800 p-4 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Your Cart ({countItems()})</h3>
          <button onClick={onClose} className="ml-auto rounded-lg border border-neutral-700 px-3 py-1 hover:bg-neutral-800">Close</button>
        </div>

        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-neutral-400">Cart is empty.</div>
          ) : (
            items.map((x) => (
              <div key={`${x.source}_${x.id}`} className="flex gap-3 border border-neutral-800 rounded-xl p-2">
                <img src={x.imageUrl} alt={x.title} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{x.title}</div>
                  <div className="text-xs text-neutral-400">{x.source.toUpperCase()}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={x.qty}
                      onChange={(e) => handleQty(x.id, x.source, Number(e.target.value))}
                      className="w-16 rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
                    />
                    <div className="ml-auto text-sm">${(x.price * x.qty).toFixed(2)}</div>
                  </div>
                </div>
                <button onClick={() => handleRemove(x.id, x.source)} className="self-start rounded-lg border border-neutral-700 px-2 py-1 text-xs hover:bg-neutral-800">Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t border-neutral-800 pt-3 flex items-center">
          <div className="text-base font-semibold">Total</div>
          <div className="ml-auto text-base font-semibold">${total.toFixed(2)}</div>
        </div>
        <button
          className="mt-3 w-full rounded-lg bg-neutral-100 text-neutral-900 px-4 py-2 font-medium hover:bg-white"
          onClick={() => onCheckout && onCheckout()}
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;