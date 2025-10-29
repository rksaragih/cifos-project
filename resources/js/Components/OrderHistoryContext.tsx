import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  discount?: number;
  finalTotal: number;
  orderDate: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface OrderHistoryContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

export const OrderHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `#${timestamp}${random}`;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      orderDate: new Date(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Save to localStorage for persistence
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('orderHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  // Load orders from localStorage on mount
  React.useEffect(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate)
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error loading order history:', error);
      }
    }
  }, []);

  return (
    <OrderHistoryContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getOrdersByStatus
    }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('useOrderHistory must be used within OrderHistoryProvider');
  }
  return context;
};



