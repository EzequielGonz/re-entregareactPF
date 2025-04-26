import React, { useState } from "react";
import ItemCounter from "./ItemCounter";

function ProductDetail({ product, open, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  if (!open || !product) return null;
  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="detail-close-btn" onClick={onClose}>×</button>
        <img src={product.image} alt={product.name} className="detail-image" />
        <h2>{product.name}</h2>
        <span className="detail-category">{product.category}</span>
        <p>{product.description}</p>
        <div className="detail-footer">
          <span className="detail-price">${product.price?.toFixed(2)}</span>
          <ItemCounter value={qty} onChange={setQty} />
          <button className="detail-add-btn" onClick={() => {onAddToCart(product.id, qty); onClose();}}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;