import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

const INVENTED_PRODUCTS = [
  {
    id: "prod1",
    name: "Smart TV 4K",
    description: "Televisor inteligente con resolución 4K para una experiencia visual impresionante.",
    price: 499.99,
    category: "Electronica",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "prod2",
    name: "Mueble de Madera Rústica",
    description: "Mueble artesanal de madera rústica, ideal para decorar tu hogar con estilo natural.",
    price: 299.99,
    category: "Muebles",
    imageUrl: "hhttps://images.unsplash.com/photo-1519219788971-8d9797e0928e?q=80&w=1444&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "prod3",
    name: "Camisa Azul Rallada",
    description: "Camisa azul con rayas, cómoda y elegante para cualquier ocasión.",
    price: 39.99,
    category: "Ropa",
    imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80"
  },
];

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

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // [{ productId, quantity }]
  const [showCart, setShowCart] = useState(false);

  // Seed the database with invented products if they don't exist
  useEffect(() => {
    const seedProducts = async () => {
      for (const product of INVENTED_PRODUCTS) {
        const docRef = doc(db, "products", product.id);
        const docSnap = await getDoc(docRef);
        const newProductData = {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.imageUrl,
        };
        if (!docSnap.exists()) {
          // Si no existe, lo crea
          await setDoc(docRef, newProductData);
        } else {
          // Si hay alguna diferencia en cualquier campo, lo actualiza
          const dbData = docSnap.data();
          const needsUpdate = Object.keys(newProductData).some(
            key => dbData[key] !== newProductData[key]
          );
          if (needsUpdate) {
            await setDoc(docRef, { ...dbData, ...newProductData }, { merge: true });
          }
        }
      }
    };
    seedProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Añade producto o aumenta cantidad en carrito
  const addToCart = (productId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity: 1 }];
      }
    });
  };

  // Cambia cantidad de un producto en carrito
  const updateCartItem = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: quantity < 1 ? 1 : quantity }
          : item
      )
    );
  };

  // Elimina producto del carrito
  const removeCartItem = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  // Simula pago
  const handlePay = () => {
    alert("¡Gracias por su compra usando PayPal (simulado)!");
    setCart([]); // Vacía el carrito después de pagar
    setShowCart(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} onCartToggle={() => setShowCart(true)} />
      <div className="app-container">
        <h1>¡Bienvenido a nuestra tienda!</h1>
        {loading ? (
          <p className="loading">Cargando productos...</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button
                      className="product-buy-btn"
                      onClick={() => addToCart(product.id)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCart && (
        <CartDrawer
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeCartItem}
          onPay={handlePay}
        />
      )}
    </>
  );
}

export default App;

