import React, { useState, useEffect, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Landmark, 
  CheckCircle2, 
  Printer, 
  X,
  Smartphone,
  Scan,
  Calendar,
  RefreshCw,
  Receipt,
  Eye,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSearchParams } from 'react-router-dom';
import BarcodeScannerModal from './BarcodeScannerModal';

export default function POSPage() {
  const { 
    products, 
    transactions,
    recordSale, 
    settings,
    staffMembers,
    activeCashier,
    selectActiveCashier
  } = useApp();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // URL orqali kelgan xodimni avtomatik faol sotuvchi qilish
  useEffect(() => {
    const cashierParam = searchParams.get('cashier');
    if (cashierParam && staffMembers) {
      const found = staffMembers.find(s => s.name.toLowerCase() === cashierParam.toLowerCase());
      if (found) {
        selectActiveCashier(found);
      }
    }
  }, [searchParams, staffMembers]);

  // Search & Brand Filter for fast product selection
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('All');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Cart / Checkout state
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [customerName, setCustomerName] = useState('Mijoz');
  const [customerPhone, setCustomerPhone] = useState('');

  // Installment (Nasiya) State
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentTerm, setInstallmentTerm] = useState(12); // 3, 6, 12, 24 months
  const [financingPartner, setFinancingPartner] = useState('Uzum Nasiya');

  // Trade-In State
  const [tradeInActive, setTradeInActive] = useState(false);
  const [tradeInModel, setTradeInModel] = useState('');
  const [tradeInValue, setTradeInValue] = useState(0);

  // Receipt Modal state
  const [completedTxn, setCompletedTxn] = useState(null);

  // Check URL query param if navigated via "Quick Sell"
  useEffect(() => {
    const preselectId = searchParams.get('product');
    if (preselectId) {
      const found = products.find(p => p.id === preselectId);
      if (found && found.stock > 0) {
        setSelectedProductId(found.id);
      }
    } else if (products.length > 0 && !selectedProductId) {
      const inStockItem = products.find(p => p.stock > 0);
      if (inStockItem) setSelectedProductId(inStockItem.id);
    }
  }, [searchParams, products, selectedProductId]);

  // Selected product object
  const currentProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Set selected color whenever product changes or URL param specifies
  useEffect(() => {
    if (currentProduct) {
      const urlColor = searchParams.get('color');
      if (urlColor && currentProduct.colors?.some(c => c.name === urlColor)) {
        setSelectedColor(urlColor);
      } else if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0].name);
      } else {
        setSelectedColor(currentProduct.color || 'Standart');
      }
    }
  }, [currentProduct, searchParams]);

  // Available brands
  const brands = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];
  }, [products]);

  // Filtered devices list for POS picker
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeBrand !== 'All' && p.brand !== activeBrand) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesImei = p.imei?.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        if (!matchesName && !matchesImei && !matchesSku) return false;
      }
      return true;
    });
  }, [products, activeBrand, searchQuery]);

  // Today's POS statistics
  const todayStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTxns = (transactions || []).filter(t => t.date && t.date.startsWith(todayStr));
    const totalRevenue = todayTxns.reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
    const totalProfit = todayTxns.reduce((sum, t) => sum + Number(t.profit || 0), 0);
    const totalStock = (products || []).reduce((sum, p) => sum + Number(p.stock || 0), 0);
    return {
      todayCount: todayTxns.length,
      todayRevenue: totalRevenue,
      todayProfit: totalProfit,
      totalStock,
      totalModels: products.length
    };
  }, [transactions, products]);

  // Recent transactions for quick POS ledger
  const recentTransactions = useMemo(() => {
    return (transactions || []).slice(0, 5);
  }, [transactions]);

  // Financial calculations
  const unitPrice = currentProduct ? Number(currentProduct.sellingPrice) : 0;
  const unitCost = currentProduct ? Number(currentProduct.purchasePrice) : 0;
  const subtotal = unitPrice * quantity;
  const rawDiscount = Number(discount || 0);
  const tradeInCredit = tradeInActive ? Number(tradeInValue || 0) : 0;
  const totalDiscount = rawDiscount + tradeInCredit;
  const totalAmount = Math.max(0, subtotal - totalDiscount);
  const totalCost = unitCost * quantity;
  const estimatedProfit = totalAmount - totalCost;
  const monthlyPayment = installmentTerm > 0 ? Math.round(totalAmount / installmentTerm) : 0;

  const handleSelectProduct = (product) => {
    if (product.stock <= 0) return;
    setSelectedProductId(product.id);
    setQuantity(1);
  };

  const handleBarcodeScanned = (code) => {
    const found = products.find(p => 
      p.imei?.toLowerCase() === code.toLowerCase() ||
      p.sku?.toLowerCase() === code.toLowerCase() ||
      p.id?.toLowerCase() === code.toLowerCase()
    );
    if (found) {
      if (found.stock > 0) {
        setSelectedProductId(found.id);
        setQuantity(1);
      } else {
        alert(t('outOfStockStatus'));
      }
    } else {
      setSearchQuery(code);
    }
  };

  const handleConfirmSale = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantity > currentProduct.stock) {
      alert(`${t('cannotSellAlert')} ${currentProduct.stock}`);
      return;
    }

    const effectiveMethod = isInstallment 
      ? `Nasiya (${financingPartner} ${installmentTerm}oy)`
      : paymentMethod;

    const res = recordSale({
      productId: currentProduct.id,
      quantity,
      color: selectedColor || currentProduct.color,
      discount: totalDiscount,
      paymentMethod: effectiveMethod,
      customerName: customerName.trim() || 'Mijoz',
      customerPhone: customerPhone.trim(),
      cashierName: activeCashier?.name || 'Sardor Rahimov',
      cashierRole: activeCashier?.role || 'Katta Sotuvchi'
    });

    if (res.success) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCompletedTxn({
        ...res.transaction,
        tradeInModel: tradeInActive ? tradeInModel : null,
        tradeInValue: tradeInActive ? tradeInCredit : 0,
        isInstallment,
        installmentTerm,
        financingPartner,
        monthlyPayment
      });

      // Reset form
      setQuantity(1);
      setDiscount(0);
      setTradeInActive(false);
      setTradeInModel('');
      setTradeInValue(0);
      setCustomerName('Mijoz');
      setCustomerPhone('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6">
      <Header
        title={t('posTitle')}
        subtitle={t('posSubtitle')}
        showDate={true}
        actionText=""
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Product Selection Grid & Fast Search */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Quick Search & Barcode Button & Brand Pills */}
          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t('posSearchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#171717] placeholder:text-[#888888] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none font-medium"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#FF7900] border border-[#FF7900]/30 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95"
                title={t('scanBarcodeBtn')}
              >
                <Scan className="w-4 h-4" />
                <span className="hidden sm:inline">{t('scanBarcodeBtn')}</span>
              </button>
            </div>

            {/* Quick Brand Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeBrand === brand
                      ? 'bg-[#171717] text-white shadow-sm'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-[#666666]'
                  }`}
                >
                  {brand === 'All' ? t('all') : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items List - Clean, smooth grid showing all products without cutting off */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map(product => {
              const isSelected = selectedProductId === product.id;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleSelectProduct(product)}
                  className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                    isOutOfStock
                      ? 'bg-neutral-50/70 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 opacity-60 cursor-not-allowed'
                      : isSelected
                        ? 'bg-orange-50/60 dark:bg-orange-950/30 border-[#FF7900] ring-2 ring-[#FF7900]/30 cursor-pointer shadow-sm'
                        : 'bg-white dark:bg-[#181920] border-[#EAEAEA] dark:border-neutral-800 hover:border-[#FF7900]/60 cursor-pointer shadow-sm hover:shadow'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FAFAFA] dark:bg-[#202127] rounded-xl flex items-center justify-center p-1 border border-[#F0F0F0] dark:border-neutral-800 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#171717] dark:text-white truncate">{product.name}</h4>
                      <p className="text-[11px] text-[#888888] dark:text-neutral-400">{product.storage} • {product.ram}</p>
                      <p className="text-xs font-extrabold text-[#FF7900] dark:text-[#FF7900] mt-1">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F0F0F0] dark:border-neutral-800 text-[11px]">
                    <span className="font-mono text-[#888888] dark:text-neutral-400 truncate max-w-[120px]">{product.sku}</span>
                    <span className={`font-semibold ${
                      isOutOfStock ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isOutOfStock ? t('outOfStockStatus') : `${product.stock} ${t('stockAvailable')}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick POS Ledger & Terminal Stats: Fills the entire lower left space with rich live data */}
          <div className="bg-white dark:bg-[#181920] rounded-3xl border border-[#EAEAEA] dark:border-neutral-800 p-5 shadow-sm space-y-4 mt-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA] dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#FF7900]" />
                <h4 className="text-sm font-bold text-[#171717] dark:text-white">
                  Kassa Ko'rsatkichlari & So'nggi Savdolar
                </h4>
              </div>
              <span className="text-[11px] text-[#888888] dark:text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Bugungi kassa jurnali
              </span>
            </div>

            {/* 4 Mini Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800">
                <span className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-0.5">Mavjud Modellar</span>
                <span className="text-sm font-extrabold text-[#171717] dark:text-white">{todayStats.totalModels} ta</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800">
                <span className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-0.5">Jami Zaxira</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{todayStats.totalStock} dona</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800">
                <span className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-0.5">Bugungi Cheklar</span>
                <span className="text-sm font-extrabold text-[#FF7900]">{todayStats.todayCount} ta sotuv</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800">
                <span className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-0.5">Bugungi Tushum</span>
                <span className="text-sm font-extrabold text-[#171717] dark:text-white truncate block">
                  {formatCurrency(todayStats.todayRevenue)}
                </span>
              </div>
            </div>

            {/* Recent 5 Transactions Mini Table */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#171717] dark:text-white block">
                So'nggi Sotuv Cheklari:
              </span>
              {recentTransactions.length > 0 ? (
                <div className="divide-y divide-[#EAEAEA] dark:divide-neutral-800 rounded-2xl border border-[#EAEAEA] dark:border-neutral-800 overflow-hidden">
                  {recentTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-3 flex items-center justify-between text-xs bg-white dark:bg-[#181920] hover:bg-neutral-50 dark:hover:bg-[#202127] transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#171717] dark:text-white truncate">
                            {tx.productName || 'Smartfon'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100/70 dark:bg-orange-950/60 text-[#FF7900] font-semibold">
                            {tx.paymentMethod || 'Naqd'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#888888] dark:text-neutral-400 mt-0.5">
                          {tx.customerName || 'Mijoz'} • {formatDateTime(tx.date)} • Kassir: {tx.cashierName || 'Sardor'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="font-extrabold text-[#171717] dark:text-white">
                          {formatCurrency(tx.totalAmount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCompletedTxn(tx)}
                          className="p-1.5 rounded-lg border border-[#EAEAEA] dark:border-neutral-700 hover:border-[#FF7900] text-[#666666] dark:text-neutral-300 hover:text-[#FF7900] transition cursor-pointer"
                          title="Chekni ko'rish / Chop etish"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#888888] dark:text-neutral-400">
                  Hozircha sotuv cheklari mavjud emas
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Active Order Terminal / Checkout Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF7900]" />
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                  {t('activeOrder')}
                </h3>
              </div>
              <span className="text-xs bg-orange-50 text-[#FF7900] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                POS
              </span>
            </div>

            {currentProduct ? (
              <form onSubmit={handleConfirmSale} className="space-y-4">
                {/* Sotuvchi / Kassir Tanlash (Har qanday ishchini tanlab sotish imkoniyati) */}
                <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#171717] dark:text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF7900]" />
                      Sotuvchi (Kassir):
                    </span>
                    <span className="text-[11px] font-extrabold text-[#FF7900]">
                      {activeCashier?.name || 'Sardor Rahimov'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {(staffMembers || []).map((staff) => {
                      const isChosen = activeCashier?.name === staff.name;
                      return (
                        <button
                          key={staff.name}
                          type="button"
                          onClick={() => selectActiveCashier(staff)}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                            isChosen
                              ? 'border-[#FF7900] bg-white dark:bg-[#18191D] ring-2 ring-[#FF7900]/30 shadow-xs'
                              : 'border-[#EAEAEA] dark:border-[#27282E] bg-white/70 dark:bg-[#202127] hover:bg-white text-[#666]'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                            isChosen ? 'bg-[#FF7900] text-white' : 'bg-neutral-100 dark:bg-[#2C2D35] text-[#555] dark:text-[#AAA]'
                          }`}>
                            {staff.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-[#171717] dark:text-white truncate leading-tight">{staff.name.split(' ')[0]}</p>
                            <span className="text-[9px] text-[#888] truncate block">{staff.role.split(' ')[0]}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Smartphone Header */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800 flex items-center gap-3">
                  <img src={currentProduct.image} alt={currentProduct.name} className="w-12 h-12 object-contain bg-white dark:bg-[#181920] rounded-xl p-1 border dark:border-neutral-700" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#171717] dark:text-white truncate">{currentProduct.name}</h4>
                    <p className="text-[11px] text-[#888888] dark:text-neutral-400">{currentProduct.storage} • {selectedColor || currentProduct.color}</p>
                    <p className="text-xs font-mono text-[#666666] dark:text-neutral-400">IMEI: {currentProduct.imei}</p>
                  </div>
                </div>

                {/* Color Selector with Real-time Stock per Color */}
                {currentProduct.colors && currentProduct.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#171717] dark:text-white">Sotilayotgan Rang:</span>
                      <span className="text-[11px] text-[#888888] dark:text-neutral-400">
                        Tanlangan: <strong className="text-[#171717] dark:text-white">{selectedColor}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {currentProduct.colors.map((c, idx) => {
                        const count = c.stock !== undefined ? c.stock : Math.ceil(currentProduct.stock / currentProduct.colors.length);
                        const isChosen = selectedColor === c.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedColor(c.name)}
                            className={`p-2 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                              isChosen
                                ? 'border-[#FF7900] bg-orange-50/70 dark:bg-orange-950/40 ring-1 ring-[#FF7900]'
                                : 'border-[#EAEAEA] dark:border-neutral-700 bg-white dark:bg-[#202127] hover:bg-neutral-50 dark:hover:bg-[#282932]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span 
                                className="w-3 h-3 rounded-full border border-black/20 flex-shrink-0" 
                                style={{ backgroundColor: c.hex }} 
                              />
                              <span className="text-xs font-semibold text-[#171717] dark:text-white truncate">{c.name.split(' ')[0]}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${count > 0 ? 'bg-neutral-100 dark:bg-neutral-800 text-[#444] dark:text-neutral-300' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>
                              {count} ta
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Payment Mode Selector: Full Payment vs Installment / Nasiya */}
                <div className="flex bg-neutral-100 dark:bg-[#202127] p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setIsInstallment(false)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      !isInstallment ? 'bg-white dark:bg-[#181920] text-[#171717] dark:text-white shadow-sm' : 'text-[#888888] dark:text-neutral-400 hover:text-[#171717]'
                    }`}
                  >
                    {t('fullPaymentTab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInstallment(true)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isInstallment ? 'bg-[#FF7900] text-white shadow-sm' : 'text-[#888888] dark:text-neutral-400 hover:text-[#171717]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {t('installmentTab')}
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between p-3 rounded-2xl border border-[#EAEAEA] dark:border-neutral-800">
                  <span className="text-xs font-semibold text-[#171717] dark:text-white">{t('quantity')}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-[#171717] dark:text-white cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-[#171717] dark:text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-[#171717] dark:text-white cursor-pointer"
                      disabled={quantity >= currentProduct.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Discount Field */}
                <div>
                  <label className="text-xs font-semibold text-[#171717] dark:text-white block mb-1.5">
                    {t('discount')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-[#171717] dark:text-white font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  />
                </div>

                {/* Trade-In Toggle & Valuation */}
                <div className="p-3 bg-neutral-50 dark:bg-[#202127] rounded-2xl border border-[#EAEAEA] dark:border-neutral-800 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#FF7900]" />
                      {t('tradeInTitle')}
                    </span>
                    <input
                      type="checkbox"
                      checked={tradeInActive}
                      onChange={(e) => setTradeInActive(e.target.checked)}
                      className="w-4 h-4 accent-[#FF7900] rounded cursor-pointer"
                    />
                  </label>
                  {tradeInActive && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-1">{t('tradeInModelLabel')}</label>
                        <input
                          type="text"
                          placeholder="masalan: iPhone 11"
                          value={tradeInModel}
                          onChange={(e) => setTradeInModel(e.target.value)}
                          className="w-full bg-white dark:bg-[#181920] border border-[#EAEAEA] dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-[#171717] dark:text-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#888888] dark:text-neutral-400 block mb-1">{t('tradeInValueLabel')}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={tradeInValue}
                          onChange={(e) => setTradeInValue(e.target.value)}
                          className="w-full bg-white dark:bg-[#181920] border border-[#EAEAEA] dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-[#171717] dark:text-white font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Installment Configuration (if Installment selected) */}
                {isInstallment ? (
                  <div className="p-3.5 bg-orange-50/50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717] dark:text-white">{t('financingPartner')}</span>
                      <select
                        value={financingPartner}
                        onChange={(e) => setFinancingPartner(e.target.value)}
                        className="bg-white dark:bg-[#181920] border border-[#EAEAEA] dark:border-neutral-700 rounded-xl px-2 py-1 text-xs font-semibold text-[#171717] dark:text-white focus:outline-none"
                      >
                        <option value="Uzum Nasiya">Uzum Nasiya</option>
                        <option value="Anorbank">Anorbank</option>
                        <option value="Alif Nasiya">Alif Nasiya</option>
                        <option value="Paymart">Paymart</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#666666] dark:text-neutral-400 block mb-1">{t('installmentMonths')}</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[3, 6, 12, 24].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setInstallmentTerm(m)}
                            className={`py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              installmentTerm === m
                                ? 'bg-[#FF7900] text-white border-[#FF7900]'
                                : 'bg-white dark:bg-[#181920] text-[#666666] dark:text-neutral-300 border-[#EAEAEA] dark:border-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            {m} oy
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-orange-200/60 dark:border-orange-900/40 text-xs">
                      <span className="text-[#888888] dark:text-neutral-400 font-medium">{t('monthlyPayment')}:</span>
                      <span className="font-extrabold text-[#FF7900] text-sm">
                        {formatCurrency(monthlyPayment)} / oy
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Standard Payment Methods */
                  <div>
                    <label className="text-xs font-semibold text-[#171717] dark:text-white block mb-2">
                      {t('paymentMethod')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'Card', label: t('paymentCard'), icon: CreditCard },
                        { id: 'Cash', label: t('paymentCash'), icon: Banknote },
                        { id: 'Bank Transfer', label: t('paymentTransfer'), icon: Landmark },
                      ].map(method => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                              isSelected
                                ? 'border-[#FF7900] bg-orange-50/70 dark:bg-orange-950/40 text-[#FF7900]'
                                : 'border-[#EAEAEA] dark:border-neutral-700 bg-white dark:bg-[#202127] text-[#666666] dark:text-neutral-300 hover:border-neutral-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#666666] dark:text-neutral-400 block mb-1">
                      {t('customerName')}
                    </label>
                    <input
                      type="text"
                      placeholder="Mijoz ismi"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-[#171717] dark:text-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#666666] dark:text-neutral-400 block mb-1">
                      {t('customerPhone')}
                    </label>
                    <input
                      type="text"
                      placeholder="+998 90..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-[#171717] dark:text-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkout Summary Box */}
                <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202127] border border-[#F0F0F0] dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-[#888888] dark:text-neutral-400">
                    <span>{t('unitPriceLabel')}</span>
                    <span className="font-semibold text-[#171717] dark:text-white">{formatCurrency(unitPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#888888] dark:text-neutral-400">
                    <span>{t('quantity')}:</span>
                    <span className="font-semibold text-[#171717] dark:text-white">{quantity}x</span>
                  </div>
                  {rawDiscount > 0 && (
                    <div className="flex justify-between text-[#E5484D]">
                      <span>{t('discount')}:</span>
                      <span className="font-semibold">-{formatCurrency(rawDiscount)}</span>
                    </div>
                  )}
                  {tradeInCredit > 0 && (
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                      <span>{t('tradeInDeduction')}:</span>
                      <span className="font-semibold">-{formatCurrency(tradeInCredit)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#EAEAEA] dark:border-neutral-800 pt-2 flex justify-between text-sm font-bold text-[#171717] dark:text-white">
                    <span>{t('totalAmount')}:</span>
                    <span className="text-[#FF7900] text-base">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <span>{t('estimatedProfit')}:</span>
                    <span>+{formatCurrency(estimatedProfit)}</span>
                  </div>
                </div>

                {/* Confirm Sale Button */}
                <button
                  type="submit"
                  disabled={currentProduct.stock <= 0}
                  className="w-full py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  <span>{t('confirmSaleBtn')}</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center text-[#888888]">
                <Smartphone className="w-10 h-10 mx-auto mb-2 text-[#CCCCCC]" />
                <p className="text-xs">{t('posSelectDevicePrompt')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barcode / IMEI Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Printable Receipt Modal */}
      {completedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setCompletedTxn(null)}
              className="absolute top-4 right-4 text-[#888888] hover:text-[#171717] p-1 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-dashed border-[#EAEAEA]">
              <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-2 border border-[#EAEAEA] shadow-sm">
                <img src="/logo.png" alt="Store Icon" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                {t('saleCompleted')}
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">{settings.storeName}</p>
              <p className="text-[11px] font-mono text-[#666666] mt-1">{completedTxn.id} • {formatDateTime(completedTxn.date)}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs border-b border-dashed border-[#EAEAEA]">
              <div className="flex justify-between font-bold text-[#171717]">
                <span>{t('receiptItem')}</span>
                <span>{completedTxn.productName}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>{t('receiptIMEI')}</span>
                <span className="font-mono text-[#171717]">{completedTxn.imei}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>{t('receiptUnitPriceQty')}</span>
                <span className="text-[#171717]">{formatCurrency(completedTxn.sellingPrice)} × {completedTxn.quantity}</span>
              </div>
              {completedTxn.discount > 0 && (
                <div className="flex justify-between text-[#E5484D]">
                  <span>{t('receiptDiscount')}</span>
                  <span>-{formatCurrency(completedTxn.discount)}</span>
                </div>
              )}
              {completedTxn.tradeInModel && (
                <div className="flex justify-between text-indigo-600">
                  <span>Trade-In ({completedTxn.tradeInModel}):</span>
                  <span>-{formatCurrency(completedTxn.tradeInValue)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>{t('receiptPaymentMethod')}</span>
                <span className="font-semibold text-[#171717]">{completedTxn.paymentMethod}</span>
              </div>
              {completedTxn.isInstallment && (
                <div className="flex justify-between text-[#FF7900] font-semibold">
                  <span>{t('monthlyPayment')}:</span>
                  <span>{formatCurrency(completedTxn.monthlyPayment)} / oy</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>Sotuvchi (Kassir):</span>
                <span className="font-semibold text-[#171717]">{completedTxn.cashierName || 'Sardor Rahimov'} ({completedTxn.cashierRole || 'Katta Sotuvchi'})</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>{t('receiptCustomer')}</span>
                <span className="text-[#171717]">{completedTxn.customerName} {completedTxn.customerPhone ? `(${completedTxn.customerPhone})` : ''}</span>
              </div>
              <div className="pt-2 border-t border-[#F0F0F0] flex justify-between text-base font-black text-[#171717]">
                <span>{t('receiptTotalPaid')}</span>
                <span className="text-[#FF7900]">{formatCurrency(completedTxn.revenue)}</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-[#888888] italic mb-4">
                {settings.receiptFooter || "1 Yillik Rasmiy Kafolat Beriladi."}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-[#171717] flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('receiptPrint')}</span>
                </button>
                <button
                  onClick={() => setCompletedTxn(null)}
                  className="flex-1 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-xs font-bold text-white transition"
                >
                  {t('receiptDone')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
