import React from "react";

function CartDrawer({ cart, products, onClose, onRemoveItem, onUpdateItem, onPay }) {
  const total = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) return sum;
    return sum + prod.price * item.quantity;
  }, 0);

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Tu Carrito</h3>
          <button className="cart-drawer-close" onClick={onClose}>×</button>
        </div>
        <div className="cart-drawer-content">
          {cart.length === 0 ? (
            <p className="cart-empty">No hay productos en tu carrito.</p>
          ) : (
            cart.map(item => {
              const prod = products.find(p => p.id === item.productId);
              if (!prod) return null;
              return (
                <div className="drawer-item" key={item.productId}>
                  <img src={prod.image} alt={prod.name} className="drawer-item-img" />
                  <div style={{ flex: 1 }}>
                    <div className="drawer-item-title">{prod.name}</div>
                    <div className="drawer-item-controls">
                      <span className="drawer-item-price">${prod.price.toFixed(2)}</span>
                      <input
                        type="number"
                        className="drawer-item-qty"
                        min={1}
                        value={item.quantity}
                        onChange={e => onUpdateItem(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <button className="drawer-item-delete" onClick={() => onRemoveItem(item.productId)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-drawer-footer">
          <div className="cart-drawer-total">
            Total: <strong>${total.toFixed(2)}</strong>
          </div>
          <button
            className="cart-paypal-btn"
            onClick={onPay}
            disabled={cart.length === 0}
          >
            Pagar con PayPal
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;