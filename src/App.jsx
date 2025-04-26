import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import CategoryFilter from "./components/CategoryFilter";
import ProductDetail from "./components/ProductDetail";
import UserFormModal from "./components/UserFormModal";

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

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // [{ productId, quantity }]
  const [showCart, setShowCart] = useState(false);
  const [category, setCategory] = useState(""); // ""=todas
  const [showDetail, setShowDetail] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [userData, setUserData] = useState(null);

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
          await setDoc(docRef, newProductData);
        } else {
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

  const categories = useMemo(() =>
    Array.from(new Set(products.map(p => p.category))).filter(Boolean), [products]
  );

  const filteredProducts = useMemo(() =>
    category ? products.filter(p => p.category === category) : products,
    [products, category]
  );

  // Añade producto o aumenta cantidad en carrito, admite cantidad específica
  const addToCart = (productId, amount = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity: amount }];
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

  // Simula inicio del pago (muestra formulario de usuario)
  const handlePay = () => {
    setShowUserForm(true);
  };

  // Finaliza compra (simula guardar, genera ID)
  const handleUserFormSubmit = (userdata) => {
    setUserData(userdata);
    // Simula ID orden "ORDxxx"
    setOrderId('ORD' + Math.floor(Math.random() * 1000000));
    setCart([]); 
  };

  // Al cerrar el userform, limpia
  const closeUserForm = () => {
    setShowUserForm(false);
    setOrderId("");
    setUserData(null);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} onCartToggle={() => setShowCart(true)} />
      <div className="app-container">
        <h1>¡Bienvenido a nuestra tienda!</h1>
        {/* Filtrado por categoría */}
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        {loading ? (
          <p className="loading">Cargando productos...</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => {setDetailProduct(product); setShowDetail(true);}}
                style={{ cursor: "pointer" }}
              >
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
                    <span className="product-price">${product.price?.toFixed(2)}</span>
                    {/* Se sugiere usar el ItemCounter en detalle, no aquí directo */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Drawer carrito */}
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

      {/* Modal detalle producto */}
      <ProductDetail
        product={detailProduct}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onAddToCart={(id, cantidad) => addToCart(id, cantidad)}
      />

      {/* Formulario usuario / recibo */}
      <UserFormModal
        open={showUserForm}
        onSubmit={handleUserFormSubmit}
        onCancel={closeUserForm}
        orderId={orderId}
      />
    </>
  );
}

export default App;
