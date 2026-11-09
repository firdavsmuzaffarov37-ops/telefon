import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialTransactions, initialExpenses, initialDailyReports, initialSettings } from '../data/initialData';
import { getTodayDateString } from '../utils/formatters';
import { supabase, supabaseService, testConnection } from '../lib/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Supabase cloud connection status
  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: false,
    checking: true,
    message: ''
  });
  // 1. Products state
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically patch legacy cached images so phones always show authentic phone images
        return parsed.map(p => {
          if (p.id === 'prod-012') {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=85'
            };
          }
          if (p.id === 'prod-010') {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=85'
            };
          }
          return p;
        });
      }
      return initialProducts;
    } catch (e) {
      console.error('Error loading products from LocalStorage', e);
      return initialProducts;
    }
  });

  // Selected product for the Right Details Panel
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return products.length > 0 ? products[0] : null;
  });

  // Right Side Panel visibility
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  // 2. Transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch (e) {
      console.error('Error loading transactions from LocalStorage', e);
      return initialTransactions;
    }
  });

  // 3. Operating Expenses state
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_expenses');
      return saved ? JSON.parse(saved) : initialExpenses;
    } catch (e) {
      console.error('Error loading expenses from LocalStorage', e);
      return initialExpenses;
    }
  });

  // 4. Daily Reports state
  const [dailyReports, setDailyReports] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_daily_reports');
      return saved ? JSON.parse(saved) : initialDailyReports;
    } catch (e) {
      console.error('Error loading daily reports from LocalStorage', e);
      return initialDailyReports;
    }
  });

  // 5. Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_settings');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch (e) {
      console.error('Error loading settings from LocalStorage', e);
      return initialSettings;
    }
  });

  // 6. Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('phonelytics_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('phonelytics_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('phonelytics_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('phonelytics_daily_reports', JSON.stringify(dailyReports));
  }, [dailyReports]);

  useEffect(() => {
    localStorage.setItem('phonelytics_settings', JSON.stringify(settings));
  }, [settings]);

  // Check Supabase connection and initial sync on mount
  useEffect(() => {
    async function initSupabase() {
      try {
        const res = await testConnection();
        if (res.connected) {
          setSupabaseStatus({ connected: true, checking: false, message: 'Connected to Supabase Cloud' });

          // Try fetching products from Supabase
          const remoteProducts = await supabaseService.getProducts();
          if (remoteProducts && remoteProducts.length > 0) {
            // Map remote snake_case columns to camelCase
            const mapped = remoteProducts.map(rp => ({
              ...rp,
              purchasePrice: Number(rp.purchase_price || rp.purchasePrice),
              sellingPrice: Number(rp.selling_price || rp.sellingPrice),
              stock: Number(rp.stock),
              minStockThreshold: Number(rp.min_stock_threshold || rp.minStockThreshold || 5),
              tagType: rp.tag_type || rp.tagType || 'new-arrival',
              unitsSold: Number(rp.units_sold || rp.unitsSold || 0)
            }));
            setProducts(mapped);
          } else if (res.tablesReady) {
            // Push initial products to Supabase if table is empty
            for (const p of initialProducts) {
              await supabaseService.upsertProduct(p);
            }
          }

          // Try fetching transactions from Supabase
          const remoteTxns = await supabaseService.getTransactions();
          if (remoteTxns && remoteTxns.length > 0) {
            const mappedTxns = remoteTxns.map(rt => ({
              ...rt,
              productId: rt.product_id || rt.productId,
              productName: rt.product_name || rt.productName,
              purchasePrice: Number(rt.purchase_price || rt.purchasePrice),
              sellingPrice: Number(rt.selling_price || rt.sellingPrice),
              paymentMethod: rt.payment_method || rt.paymentMethod,
              customerName: rt.customer_name || rt.customerName,
              customerPhone: rt.customer_phone || rt.customerPhone
            }));
            setTransactions(mappedTxns);
          }
        } else {
          setSupabaseStatus({ connected: false, checking: false, message: res.error || 'Offline mode' });
        }
      } catch (err) {
        setSupabaseStatus({ connected: false, checking: false, message: err.message });
      }
    }

    initSupabase();
  }, []);

  // Sync All Data to Supabase manually
  const syncToSupabase = async () => {
    try {
      showToast('Synchronizing store data to Supabase...', 'info');
      for (const p of products) {
        await supabaseService.upsertProduct(p);
      }
      for (const t of transactions) {
        await supabaseService.insertTransaction(t);
      }
      for (const r of dailyReports) {
        await supabaseService.saveDailyReport(r);
      }
      showToast('Successfully synchronized all data to Supabase!', 'success');
    } catch (e) {
      showToast(`Sync error: ${e.message}`, 'error');
    }
  };

  // Keep selectedProduct in sync if its stock or info gets updated
  useEffect(() => {
    if (selectedProduct) {
      const updated = products.find(p => p.id === selectedProduct.id);
      if (updated) {
        setSelectedProduct(updated);
      }
    }
  }, [products]);

  // Toast trigger
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Product CRUD
  const addProduct = (productData) => {
    const id = `prod-${Date.now().toString().slice(-4)}`;
    const status = Number(productData.stock) <= 0 
      ? 'out_of_stock' 
      : Number(productData.stock) <= Number(settings.lowStockThreshold || 5) 
        ? 'low_stock' 
        : 'in_stock';

    const newProduct = {
      ...productData,
      id,
      purchasePrice: Number(productData.purchasePrice),
      sellingPrice: Number(productData.sellingPrice),
      stock: Number(productData.stock),
      minStockThreshold: Number(productData.minStockThreshold || settings.lowStockThreshold || 5),
      status,
      views: "1.2k",
      rating: 4.8,
      unitsSold: 0,
      tag: productData.tag || 'New Arrival',
      tagType: productData.tagType || 'new-arrival',
      colors: productData.colors && productData.colors.length > 0 
        ? productData.colors 
        : [{ name: productData.color || "Standard", hex: "#171717", active: true }],
      specs: productData.specs || {
        display: "6.1-inch High Definition Display",
        chipset: "Octa-Core High Performance Processor",
        camera: "50MP Triple AI Camera",
        battery: "5,000 mAh All-day Battery",
        os: "Android / iOS",
        condition: "Brand New Sealed"
      }
    };

    setProducts(prev => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    showToast(`Added ${newProduct.name} to inventory!`, 'success');

    // Async sync to Supabase
    supabaseService.upsertProduct(newProduct).catch(console.warn);

    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    let targetUpdated = null;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        merged.purchasePrice = Number(merged.purchasePrice);
        merged.sellingPrice = Number(merged.sellingPrice);
        merged.stock = Number(merged.stock);
        merged.status = merged.stock <= 0 
          ? 'out_of_stock' 
          : merged.stock <= Number(merged.minStockThreshold || settings.lowStockThreshold || 5) 
            ? 'low_stock' 
            : 'in_stock';
        targetUpdated = merged;
        return merged;
      }
      return p;
    }));
    showToast('Product updated successfully!', 'success');

    if (targetUpdated) {
      supabaseService.upsertProduct(targetUpdated).catch(console.warn);
    }
  };

  const deleteProduct = (id) => {
    const prodToDelete = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      const remaining = products.filter(p => p.id !== id);
      setSelectedProduct(remaining.length > 0 ? remaining[0] : null);
    }
    showToast(`Deleted ${prodToDelete ? prodToDelete.name : 'product'}`, 'warning');

    // Async delete from Supabase
    supabaseService.deleteProduct(id).catch(console.warn);
  };

  // Quick Restock functionality
  const restockProduct = (id, additionalQuantity, supplierName = "Official Wholesale Distribution", unitCost = null) => {
    const qty = Number(additionalQuantity);
    if (isNaN(qty) || qty <= 0) {
      showToast('Please enter a valid restock quantity', 'error');
      return false;
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = p.stock + qty;
        const newPurchasePrice = unitCost !== null && !isNaN(Number(unitCost)) && Number(unitCost) > 0 
          ? Number(unitCost) 
          : p.purchasePrice;
        const status = newStock <= 0 
          ? 'out_of_stock' 
          : newStock <= Number(p.minStockThreshold || 5) 
            ? 'low_stock' 
            : 'in_stock';
        return {
          ...p,
          stock: newStock,
          purchasePrice: newPurchasePrice,
          status
        };
      }
      return p;
    }));

    showToast(`Restocked +${qty} units successfully from ${supplierName}!`, 'success');
    return true;
  };

  // Warranty lookup by IMEI or serial
  const checkWarranty = (imeiQuery) => {
    if (!imeiQuery || !imeiQuery.trim()) return null;
    const clean = imeiQuery.trim().toLowerCase();

    // Look in transactions
    const txn = transactions.find(t => 
      t.imei?.toLowerCase().includes(clean) || 
      t.id?.toLowerCase().includes(clean)
    );

    // Look in current inventory
    const product = products.find(p => 
      p.imei?.toLowerCase().includes(clean) || 
      p.sku?.toLowerCase().includes(clean)
    );

    if (txn) {
      const purchaseDate = new Date(txn.date);
      const warrantyExpiry = new Date(purchaseDate);
      warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + 1); // 1-year standard warranty
      const now = new Date();
      const isValid = now <= warrantyExpiry;
      const daysRemaining = Math.max(0, Math.ceil((warrantyExpiry - now) / (1000 * 60 * 60 * 24)));

      return {
        type: 'sold',
        transaction: txn,
        purchaseDate: txn.date,
        warrantyExpiry: warrantyExpiry.toISOString(),
        isValid,
        daysRemaining,
        customerName: txn.customerName,
        customerPhone: txn.customerPhone,
        productName: txn.productName,
        imei: txn.imei
      };
    } else if (product) {
      return {
        type: 'inventory',
        product,
        productName: `${product.name} ${product.storage}`,
        imei: product.imei,
        stock: product.stock,
        status: 'Unsold - In Store Inventory with Manufacturer Warranty',
        isValid: true,
        daysRemaining: 365
      };
    }
    return null;
  };

  // POS / Sale transaction execution
  const recordSale = ({ productId, quantity, discount = 0, paymentMethod = 'Card', customerName = 'Walk-in Customer', customerPhone = '' }) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      showToast('Product not found in inventory!', 'error');
      return { success: false, error: 'Product not found' };
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      showToast('Invalid quantity specified', 'error');
      return { success: false, error: 'Invalid quantity' };
    }

    if (product.stock < qty) {
      showToast(`Insufficient stock! Only ${product.stock} available.`, 'error');
      return { success: false, error: `Only ${product.stock} available in stock` };
    }

    const unitSelling = Number(product.sellingPrice);
    const unitPurchase = Number(product.purchasePrice);
    const disc = Number(discount) || 0;
    const grossRev = (unitSelling * qty);
    const revenue = Math.max(0, grossRev - disc);
    const cost = unitPurchase * qty;
    const profit = revenue - cost;

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: product.id,
      productName: `${product.name} ${product.storage}`,
      brand: product.brand,
      quantity: qty,
      purchasePrice: unitPurchase,
      sellingPrice: unitSelling,
      discount: disc,
      revenue,
      cost,
      profit,
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '-',
      imei: product.imei || 'IMEI-N/A',
      date: new Date().toISOString(),
      status: 'Completed'
    };

    // 1. Decrement stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const remainingStock = p.stock - qty;
        const status = remainingStock <= 0 
          ? 'out_of_stock' 
          : remainingStock <= Number(p.minStockThreshold || 5) 
            ? 'low_stock' 
            : 'in_stock';
        return {
          ...p,
          stock: remainingStock,
          unitsSold: (p.unitsSold || 0) + qty,
          status
        };
      }
      return p;
    }));

    // 2. Add transaction
    setTransactions(prev => [newTxn, ...prev]);

    // Async sync transaction and updated product to Supabase
    supabaseService.insertTransaction(newTxn).catch(console.warn);
    const updatedProd = products.find(p => p.id === productId);
    if (updatedProd) {
      supabaseService.upsertProduct({
        ...updatedProd,
        stock: updatedProd.stock - qty,
        unitsSold: (updatedProd.unitsSold || 0) + qty
      }).catch(console.warn);
    }

    showToast(`Sale completed! ${qty}x ${product.name} (${paymentMethod})`, 'success');
    return { success: true, transaction: newTxn };
  };

  // Add / Delete Expense
  const addExpense = (expenseData) => {
    const id = `exp-${Date.now().toString().slice(-4)}`;
    const newExp = {
      id,
      ...expenseData,
      amount: Number(expenseData.amount),
      date: expenseData.date || new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense added: ${newExp.name}`, 'success');
    return newExp;
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed', 'warning');
  };

  // Daily report generation
  const closeDayAndGenerateReport = (selectedDate = getTodayDateString(), notes = "") => {
    // Filter transactions by selected date
    const dayTxns = transactions.filter(t => t.date.startsWith(selectedDate));
    
    // Operating expenses on that date
    const dayExpenses = expenses.filter(e => e.date.startsWith(selectedDate));
    const totalDayExpenses = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const phonesSold = dayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);
    const revenue = dayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);
    const purchaseCost = dayTxns.reduce((sum, t) => sum + Number(t.cost), 0);
    const discounts = dayTxns.reduce((sum, t) => sum + Number(t.discount || 0), 0);
    const grossProfit = revenue - purchaseCost;
    const netProfit = grossProfit - totalDayExpenses;

    // Remaining inventory
    const remainingCount = products.reduce((sum, p) => sum + Number(p.stock), 0);
    const remainingValue = products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.sellingPrice)), 0);

    // Best selling phone and brand
    const phoneCountMap = {};
    const brandRevMap = {};
    const paymentBreakdown = { Cash: 0, Card: 0, "Bank Transfer": 0 };

    dayTxns.forEach(t => {
      phoneCountMap[t.productName] = (phoneCountMap[t.productName] || 0) + Number(t.quantity);
      brandRevMap[t.brand] = (brandRevMap[t.brand] || 0) + Number(t.revenue);
      if (paymentBreakdown[t.paymentMethod] !== undefined) {
        paymentBreakdown[t.paymentMethod] += Number(t.revenue);
      } else {
        paymentBreakdown[t.paymentMethod] = Number(t.revenue);
      }
    });

    let bestSellingPhone = "No sales recorded";
    let maxPhoneCount = 0;
    Object.entries(phoneCountMap).forEach(([name, count]) => {
      if (count > maxPhoneCount) {
        maxPhoneCount = count;
        bestSellingPhone = name;
      }
    });

    let bestPerformingBrand = "N/A";
    let maxBrandRev = 0;
    Object.entries(brandRevMap).forEach(([brand, rev]) => {
      if (rev > maxBrandRev) {
        maxBrandRev = rev;
        bestPerformingBrand = brand;
      }
    });

    const reportId = `REP-${selectedDate}`;
    const newReport = {
      id: reportId,
      date: selectedDate,
      phonesSold,
      revenue,
      purchaseCost,
      discounts,
      grossProfit,
      operatingExpenses: totalDayExpenses,
      netProfit,
      remainingInventoryCount: remainingCount,
      remainingStockValue: remainingValue,
      bestSellingPhone,
      bestPerformingBrand,
      paymentBreakdown,
      notes: notes || "Daily closing completed successfully."
    };

    // Prevent accidental duplicate - update if existing or prepend
    setDailyReports(prev => {
      const existsIndex = prev.findIndex(r => r.id === reportId || r.date === selectedDate);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newReport;
        return copy;
      }
      return [newReport, ...prev];
    });

    showToast(`Daily summary report generated for ${selectedDate}!`, 'success');
    return newReport;
  };

  // Helper stats calculation
  const getTodayStats = () => {
    const todayStr = getTodayDateString();
    const todayTxns = transactions.filter(t => t.date.startsWith(todayStr));
    
    // Yesterday
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    const yStr = yDate.toISOString().split('T')[0];
    const yesterdayTxns = transactions.filter(t => t.date.startsWith(yStr));

    const phonesSoldToday = todayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);
    const phonesSoldYesterday = yesterdayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);

    const revenueToday = todayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);
    const revenueYesterday = yesterdayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);

    const costToday = todayTxns.reduce((sum, t) => sum + Number(t.cost), 0);
    const profitToday = revenueToday - costToday;

    const costYesterday = yesterdayTxns.reduce((sum, t) => sum + Number(t.cost), 0);
    const profitYesterday = revenueYesterday - costYesterday;

    const totalStock = products.reduce((sum, p) => sum + Number(p.stock), 0);
    const totalInventoryValue = products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.sellingPrice)), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= Number(settings.lowStockThreshold || 5)).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;

    return {
      phonesSoldToday,
      phonesSoldYesterday,
      soldGrowth: phonesSoldYesterday > 0 
        ? Math.round(((phonesSoldToday - phonesSoldYesterday) / phonesSoldYesterday) * 100) 
        : 100,
      revenueToday,
      revenueYesterday,
      revGrowth: revenueYesterday > 0 
        ? Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100) 
        : 100,
      profitToday,
      profitYesterday,
      profitGrowth: profitYesterday > 0 
        ? Math.round(((profitToday - profitYesterday) / profitYesterday) * 100) 
        : 100,
      totalStock,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount
    };
  };

  // Reset to demo data
  const resetToDemoData = () => {
    setProducts(initialProducts);
    setSelectedProduct(initialProducts[0]);
    setTransactions(initialTransactions);
    setExpenses(initialExpenses);
    setDailyReports(initialDailyReports);
    setSettings(initialSettings);
    localStorage.clear();
    showToast('Store data reset to official demo state', 'warning');
  };

  return (
    <AppContext.Provider value={{
      products,
      selectedProduct,
      setSelectedProduct,
      isDetailsPanelOpen,
      setIsDetailsPanelOpen,
      addProduct,
      updateProduct,
      deleteProduct,
      restockProduct,
      checkWarranty,
      isAddModalOpen,
      setIsAddModalOpen,
      editingProduct,
      setEditingProduct,
      transactions,
      recordSale,
      expenses,
      addExpense,
      deleteExpense,
      dailyReports,
      closeDayAndGenerateReport,
      settings,
      setSettings,
      toasts,
      showToast,
      removeToast,
      getTodayStats,
      resetToDemoData,
      supabaseStatus,
      syncToSupabase
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

