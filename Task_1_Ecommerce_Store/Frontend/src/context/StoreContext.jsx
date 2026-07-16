import { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item._id !== id));
  const clearCart = () => setCart([]);
  const logout = () => { localStorage.removeItem('userInfo'); setUser(null); };

  return (
    <StoreContext.Provider value={{ cart, user, setUser, addToCart, removeFromCart, clearCart, logout }}>
      {children}
    </StoreContext.Provider>
  );
};
