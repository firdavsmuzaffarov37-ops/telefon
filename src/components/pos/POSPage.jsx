import React, { useState, useEffect, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Landmark, 
  CheckCircle2, 
  Printer, 
  X,
  Smartphone,
  Tag,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSearchParams } from 'react-router-dom';

export default function POSPage() {
  const { products, recordSale, settings } = useApp();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Search & Brand Filter for fast product selection
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('All');

  // Cart / Checkout state
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');

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
  }, [searchParams, products]);

  // Selected product object
  const currentProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

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

  // Financial calculations
  const unitPrice = currentProduct ? Number(currentProduct.sellingPrice) : 0;
  const unitCost = currentProduct ? Number(currentProduct.purchasePrice) : 0;
  const subtotal = unitPrice * quantity;
  const totalAmount = Math.max(0, subtotal - Number(discount || 0));
  const totalCost = unitCost * quantity;
  const estimatedProfit = totalAmount - totalCost;

  const handleSelectProduct = (product) => {
    if (product.stock <= 0) return;
    setSelectedProductId(product.id);
    setQuantity(1);
  };

  const handleConfirmSale = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantity > currentProduct.stock) {
      alert(`Cannot sell ${quantity} units. Only ${currentProduct.stock} available.`);
      return;
    }

    const res = recordSale({
      productId: currentProduct.id,
      quantity,
      discount: Number(discount) || 0,
      paymentMethod,
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim()
    });

    if (res.success) {
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedTxn(res.transaction);
      // Reset form
      setQuantity(1);
      setDiscount(0);
      setCustomerName('Walk-in Customer');
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
          {/* Quick Search & Brand Bar */}
          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t('posSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#171717] placeholder:text-[#888888] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
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
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredProducts.map(product => {
              const isSelected = selectedProductId === product.id;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleSelectProduct(product)}
                  className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                    isOutOfStock
                      ? 'bg-neutral-50/70 border-neutral-200 opacity-60 cursor-not-allowed'
                      : isSelected
                        ? 'bg-orange-50/40 border-[#FF7900] ring-2 ring-[#FF7900]/20 cursor-pointer shadow-sm'
                        : 'bg-white border-[#EAEAEA] hover:border-neutral-300 cursor-pointer shadow-sm hover:shadow'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FAFAFA] rounded-xl flex items-center justify-center p-1 border border-[#F0F0F0] flex-shrink-0">
                      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#171717] truncate">{product.name}</h4>
                      <p className="text-[11px] text-[#888888]">{product.storage} • {product.ram}</p>
                      <p className="text-xs font-extrabold text-[#171717] mt-1">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F0F0F0] text-[11px]">
                    <span className="font-mono text-[#888888] truncate max-w-[120px]">{product.sku}</span>
                    <span className={`font-semibold ${
                      isOutOfStock ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>
              );
            })}
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
              <span className="text-xs bg-orange-50 text-[#FF7900] font-bold px-2.5 py-1 rounded-full">
                Active Order
              </span>
            </div>

            {currentProduct ? (
              <form onSubmit={handleConfirmSale} className="space-y-4">
                {/* Selected Smartphone Header */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-[#EAEAEA] flex items-center gap-3">
                  <img src={currentProduct.image} alt={currentProduct.name} className="w-12 h-12 object-contain bg-white rounded-xl p-1 border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#171717] truncate">{currentProduct.name}</h4>
                    <p className="text-[11px] text-[#888888]">{currentProduct.storage} • {currentProduct.color}</p>
                    <p className="text-xs font-mono text-[#666666]">IMEI: {currentProduct.imei}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between p-3 rounded-2xl border border-[#EAEAEA]">
                  <span className="text-xs font-semibold text-[#171717]">{t('quantity')}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#171717]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#171717]"
                      disabled={quantity >= currentProduct.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Discount Field */}
                <div>
                  <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                    {t('discount')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs text-[#171717] font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  />
                </div>

                {/* Customer Details (Optional) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#666666] block mb-1">
                      {t('customerName')}
                    </label>
                    <input
                      type="text"
                      placeholder="Walk-in Customer"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#666666] block mb-1">
                      {t('customerPhone')}
                    </label>
                    <input
                      type="text"
                      placeholder="+998 90..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="text-xs font-semibold text-[#171717] block mb-2">
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
                          className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                            isSelected
                              ? 'border-[#FF7900] bg-orange-50/70 text-[#FF7900]'
                              : 'border-[#EAEAEA] bg-white text-[#666666] hover:border-neutral-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkout Summary Box */}
                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#F0F0F0] space-y-2 text-xs">
                  <div className="flex justify-between text-[#888888]">
                    <span>Unit Selling Price:</span>
                    <span className="font-semibold text-[#171717]">{formatCurrency(unitPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#888888]">
                    <span>{t('quantity')}:</span>
                    <span className="font-semibold text-[#171717]">{quantity}x</span>
                  </div>
                  {Number(discount) > 0 && (
                    <div className="flex justify-between text-[#E5484D]">
                      <span>{t('discount')}:</span>
                      <span className="font-semibold">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#EAEAEA] pt-2 flex justify-between text-sm font-bold text-[#171717]">
                    <span>{t('totalAmount')}:</span>
                    <span className="text-[#FF7900] text-base">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-600 font-semibold pt-1">
                    <span>{t('estimatedProfit')}:</span>
                    <span>+{formatCurrency(estimatedProfit)}</span>
                  </div>
                </div>

                {/* Confirm Sale Button */}
                <button
                  type="submit"
                  disabled={currentProduct.stock <= 0}
                  className="w-full py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  <span>{t('confirmSaleBtn')}</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center text-[#888888]">
                <Smartphone className="w-10 h-10 mx-auto mb-2 text-[#CCCCCC]" />
                <p className="text-xs">Select a smartphone from the list to initiate sale</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

            {/* Receipt Styling */}
            <div className="text-center pb-4 border-b border-dashed border-[#EAEAEA]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Sale Completed!
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">{settings.storeName}</p>
              <p className="text-[11px] font-mono text-[#666666] mt-1">{completedTxn.id} • {formatDateTime(completedTxn.date)}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs border-b border-dashed border-[#EAEAEA]">
              <div className="flex justify-between font-bold text-[#171717]">
                <span>Item</span>
                <span>{completedTxn.productName}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>IMEI / Hardware:</span>
                <span className="font-mono text-[#171717]">{completedTxn.imei}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Unit Price × Qty:</span>
                <span className="text-[#171717]">{formatCurrency(completedTxn.sellingPrice)} × {completedTxn.quantity}</span>
              </div>
              {completedTxn.discount > 0 && (
                <div className="flex justify-between text-[#E5484D]">
                  <span>Discount Applied:</span>
                  <span>-{formatCurrency(completedTxn.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>Payment Method:</span>
                <span className="font-semibold text-[#171717]">{completedTxn.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Customer:</span>
                <span className="text-[#171717]">{completedTxn.customerName} {completedTxn.customerPhone ? `(${completedTxn.customerPhone})` : ''}</span>
              </div>
              <div className="pt-2 border-t border-[#F0F0F0] flex justify-between text-base font-black text-[#171717]">
                <span>Total Paid:</span>
                <span className="text-[#FF7900]">{formatCurrency(completedTxn.revenue)}</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-[#888888] italic mb-4">
                {settings.receiptFooter || "1 Year Official Warranty Included."}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-[#171717] flex items-center justify-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setCompletedTxn(null)}
                  className="flex-1 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-xs font-bold text-white transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

