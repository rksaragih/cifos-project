import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  isFavorite?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleFavorite: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getCartForOrder: () => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, quantity } : i
    ));
  };

  const toggleFavorite = (id: number) => {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartForOrder = () => {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      description: item.description,
      image: item.image
    }));
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      toggleFavorite,
      clearCart,
      getTotal,
      getItemCount,
      getCartForOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
