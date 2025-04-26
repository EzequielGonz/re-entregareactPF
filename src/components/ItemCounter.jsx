import React from "react";

function ItemCounter({ value, min = 1, max = 99, onChange }) {
  const handleChange = (v) => {
    if (v < min) v = min;
    if (v > max) v = max;
    onChange(v);
  };

  return (
    <div className="item-counter">
      <button onClick={() => handleChange(value - 1)} disabled={value <= min}>-</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => handleChange(Number(e.target.value))}
        style={{ width: 40, textAlign: "center" }}
      />
      <button onClick={() => handleChange(value + 1)} disabled={value >= max}>+</button>
    </div>
  );
}

export default ItemCounter;