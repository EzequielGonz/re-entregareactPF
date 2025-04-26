import React, { useState } from "react";

function UserFormModal({ open, onSubmit, onCancel, orderId }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (form.name && form.email) {
      onSubmit(form);
    }
  };

  if (!open) return null;

  return (
    <div className="userform-modal-overlay" onClick={onCancel}>
      <div className="userform-modal" onClick={e => e.stopPropagation()}>
        {orderId ? (
          <div className="userform-confirm">
            <h2>¡Compra finalizada!</h2>
            <p>Gracias, <strong>{form.name}</strong>. Pronto recibirás un correo a <b>{form.email}</b></p>
            <p>Tu número de orden es: <b>{orderId}</b></p>
            <button onClick={onCancel}>Cerrar</button>
          </div>
        ) : (
          <>
            <h2>Datos para tu compra</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <button type="submit">Finalizar Compra</button>
              <button type="button" onClick={onCancel}>Cancelar</button>
            </form>
            {submitted && (!form.name || !form.email) && <p className="userform-error">Completa todos los campos.</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default UserFormModal;