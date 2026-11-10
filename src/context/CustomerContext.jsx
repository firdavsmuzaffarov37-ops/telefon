import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const { showToast, products, recordSale } = useApp();

  // 1. Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_customer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart', e);
      return [];
    }
  });

  // 2. Customer orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_customer_orders');
      if (saved) return JSON.parse(saved);
      // Sample initial order for demonstration
      return [
        {
          id: 'ORD-8921',
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          customerName: 'Jahongir Olimov',
          customerPhone: '+998 90 123 45 67',
          customerAddress: 'Toshkent sh., Yunusobod tumani, 14-mavze, 22-uy',
          paymentMethod: 'Naqd (Yetkazilganda)',
          status: 'Yetkazilmoqda',
          items: [
            {
              id: 'prod-001',
              name: 'Apple iPhone 16 Pro',
              storage: '256GB',
              color: 'Desert Titanium',
              price: 14200000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=85'
            }
          ],
          totalAmount: 14200000
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // 3. Customer Profile state
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_customer_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Jahongir Olimov',
        phone: '+998 90 123 45 67',
        address: 'Toshkent sh., Yunusobod tumani, 14-mavze, 22-uy',
        email: 'jahongir@gmail.com'
      };
    } catch {
      return {
        name: 'Mijoz',
        phone: '+998 90 000 00 00',
        address: 'Toshkent sh.',
        email: ''
      };
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('phonelytics_customer_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('phonelytics_customer_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('phonelytics_customer_profile', JSON.stringify(profile));
  }, [profile]);

  // Cart operations
  const addToCart = (product, color = null, quantity = 1) => {
    const chosenColor = color || (product.colors?.[0]?.name || product.color || 'Standart');
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.color === chosenColor);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          storage: product.storage,
          color: chosenColor,
          price: Number(product.sellingPrice),
          image: product.image,
          quantity
        }
      ];
    });
    showToast(`"${product.name} (${chosenColor})" savatchaga qo'shildi!`, 'success');
  };

  const updateQuantity = (id, color, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.color === color) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.color === color)));
    showToast('Mahsulot savatchadan olib tashlandi', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place order
  const placeOrder = ({ customerName, customerPhone, customerAddress, paymentMethod }) => {
    if (cart.length === 0) {
      showToast('Savatchangiz bo\'sh!', 'error');
      return null;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: customerName || profile.name || 'Mijoz',
      customerPhone: customerPhone || profile.phone || '-',
      customerAddress: customerAddress || profile.address || 'Yetkazib berish manzili',
      paymentMethod: paymentMethod || 'Naqd (Yetkazilganda)',
      status: 'Qabul qilindi',
      items: [...cart],
      totalAmount
    };

    // Save into customer orders
    setOrders(prev => [newOrder, ...prev]);

    // Also deduct stock from store inventory for each phone in order
    cart.forEach(item => {
      recordSale({
        productId: item.id,
        quantity: item.quantity,
        color: item.color,
        discount: 0,
        paymentMethod: paymentMethod || 'Online Buyurtma',
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone
      });
    });

    clearCart();
    showToast(`Buyurtmangiz muvaffaqiyatli qabul qilindi! Buyurtma ID: #${orderId}`, 'success');
    return newOrder;
  };

  const updateProfile = (updated) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast('Profilingiz muvaffaqiyatli yangilandi!', 'success');
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CustomerContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      orders,
      placeOrder,
      profile,
      updateProfile
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

