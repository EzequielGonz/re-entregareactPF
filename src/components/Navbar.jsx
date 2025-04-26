import React from "react";

function Navbar({ cartCount, onCartToggle }) {
  return (
    <nav className="navbar">
      <span className="navbar-logo">Mi Super Tienda</span>
      <div style={{ flex: 1 }} />
      <button className="cart-btn" onClick={onCartToggle}>
        🛒
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </nav>
  );
}

export default Navbar;