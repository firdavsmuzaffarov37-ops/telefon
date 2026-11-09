import React, { useState, useEffect } from 'react';
import { X, Smartphone, DollarSign, Image, Hash, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductModal({ isOpen, onClose, productToEdit = null }) {
  const { addProduct, updateProduct } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    brand: 'Apple',
    model: '',
    storage: '256GB',
    ram: '8GB',
    color: 'Black',
    imei: '',
    sku: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '10',
    minStockThreshold: '5',
    tag: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        brand: productToEdit.brand || 'Apple',
        model: productToEdit.model || '',
        storage: productToEdit.storage || '256GB',
        ram: productToEdit.ram || '8GB',
        color: productToEdit.color || 'Black',
        imei: productToEdit.imei || '',
        sku: productToEdit.sku || '',
        purchasePrice: productToEdit.purchasePrice || '',
        sellingPrice: productToEdit.sellingPrice || '',
        stock: productToEdit.stock?.toString() || '10',
        minStockThreshold: productToEdit.minStockThreshold?.toString() || '5',
        tag: productToEdit.tag || 'New Arrival',
        image: productToEdit.image || '',
        description: productToEdit.description || ''
      });
    } else {
      setFormData({
        brand: 'Apple',
        model: '',
        storage: '256GB',
        ram: '8GB',
        color: 'Titanium Black',
        imei: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        sku: '',
        purchasePrice: '',
        sellingPrice: '',
        stock: '10',
        minStockThreshold: '5',
        tag: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80',
        description: ''
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.model.trim()) errs.model = "Model nomini kiritish shart (masalan, iPhone 16 Pro)";
    if (!formData.brand) errs.brand = "Brendni tanlash shart";
    if (!formData.purchasePrice || Number(formData.purchasePrice) <= 0) errs.purchasePrice = "Tannarxni to'g'ri kiriting";
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) errs.sellingPrice = "Sotish narxini to'g'ri kiriting";
    if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
      errs.sellingPrice = "Sotish narxi tannarxdan yuqori bo'lishi kerak";
    }
    if (formData.stock === '' || Number(formData.stock) < 0) errs.stock = "Miqdor manfiy bo'lishi mumkin emas";
    if (!formData.imei || formData.imei.length < 8) errs.imei = "To'g'ri IMEI / Seriya raqamini kiriting";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fullProductName = `${formData.brand} ${formData.model}`;
    const generatedSku = formData.sku.trim() || `${formData.brand.slice(0, 3).toUpperCase()}-${formData.model.replace(/\s+/g, '').slice(0, 4).toUpperCase()}-${formData.storage}`;

    const payload = {
      ...formData,
      name: fullProductName,
      sku: generatedSku,
      tagType: formData.tag === 'Best Seller' ? 'best-seller' : formData.tag === 'Popular' ? 'popular' : 'new-arrival'
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              {productToEdit ? t('modalEditTitle') : t('modalAddTitle')}
            </h2>
            <p className="text-xs text-[#888888]">
              {t('modalSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#888888] hover:text-[#171717] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldBrand')} *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:bg-white focus:outline-none"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Honor">Honor</option>
                <option value="Google">Google</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Huawei">Huawei</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldModel')} *
              </label>
              <input
                type="text"
                placeholder="masalan: iPhone 16 Pro, Galaxy S24"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className={`w-full bg-[#FAFAFA] border rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:bg-white focus:outline-none ${
                  errors.model ? 'border-red-400 bg-red-50/20' : 'border-[#EAEAEA]'
                }`}
              />
              {errors.model && <p className="text-[11px] text-[#E5484D] mt-1">{errors.model}</p>}
            </div>
          </div>

          {/* Storage & RAM & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldStorage')}
              </label>
              <select
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              >
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldRAM')}
              </label>
              <select
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              >
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
                <option value="16GB">16GB</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldColor')}
              </label>
              <input
                type="text"
                placeholder="masalan: Qora, Desert Titanium"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing: Purchase & Selling Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-orange-50/40 border border-orange-200/50">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldPurchaseCost')} *
              </label>
              <input
                type="number"
                placeholder="masalan: 13500000"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-[#171717] font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none ${
                  errors.purchasePrice ? 'border-red-400' : 'border-[#EAEAEA]'
                }`}
              />
              {errors.purchasePrice && <p className="text-[11px] text-[#E5484D] mt-1">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldSellingPrice')} *
              </label>
              <input
                type="number"
                placeholder="masalan: 15900000"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-[#171717] font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none ${
                  errors.sellingPrice ? 'border-red-400' : 'border-[#EAEAEA]'
                }`}
              />
              {errors.sellingPrice && <p className="text-[11px] text-[#E5484D] mt-1">{errors.sellingPrice}</p>}
            </div>

            {formData.purchasePrice && formData.sellingPrice && (
              <div className="col-span-1 sm:col-span-2 text-xs flex items-center justify-between pt-1">
                <span className="text-[#888888]">{t('unitProfit')}:</span>
                <span className="font-bold text-emerald-600">
                  +{(Number(formData.sellingPrice) - Number(formData.purchasePrice)).toLocaleString()} so'm
                </span>
              </div>
            )}
          </div>

          {/* Stock Quantity & Threshold & IMEI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldAvailableStock')} *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
              {errors.stock && <p className="text-[11px] text-[#E5484D] mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldLowStockAlert')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.minStockThreshold}
                onChange={(e) => setFormData({ ...formData, minStockThreshold: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldBadge')}
              </label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              >
                <option value="New Arrival">{t('tagNewArrival')}</option>
                <option value="Popular">{t('tagPopular')}</option>
                <option value="Best Seller">{t('tagBestSeller')}</option>
              </select>
            </div>
          </div>

          {/* IMEI & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldIMEI')} *
              </label>
              <input
                type="text"
                placeholder="15 xonali apparat IMEI raqami"
                value={formData.imei}
                onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                className={`w-full bg-[#FAFAFA] border rounded-xl px-3.5 py-2.5 text-xs text-[#171717] font-mono focus:ring-1 focus:ring-[#FF7900] focus:outline-none ${
                  errors.imei ? 'border-red-400' : 'border-[#EAEAEA]'
                }`}
              />
              {errors.imei && <p className="text-[11px] text-[#E5484D] mt-1">{errors.imei}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('fieldImageURL')}
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="text-xs font-semibold text-[#171717] block mb-1.5">
              {t('fieldDescription')}
            </label>
            <textarea
              rows={2}
              placeholder="Qadoq tarkibi, kafolat shartlari va boshqalar..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-3 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAEAEA] text-xs font-semibold text-[#666666] hover:bg-neutral-100 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold shadow-md shadow-orange-500/10 transition"
            >
              {productToEdit ? t('btnSaveProduct') : t('btnAddProduct')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

