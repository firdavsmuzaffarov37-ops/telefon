import React, { useState } from 'react';
import { MoreVertical, Smartphone, ShoppingBag, Edit3, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductCard({ 
  product, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Tag badge color styling
  let tagClass = "bg-orange-50 text-[#FF7900] border-orange-200/60";
  let tagText = t('tagNewArrival');

  if (product.tagType === 'popular' || product.tag === 'Popular') {
    tagClass = "bg-sky-50 text-[#0284C7] border-sky-200/60";
    tagText = t('tagPopular');
  } else if (product.tagType === 'best-seller' || product.tag === 'Best Seller') {
    tagClass = "bg-emerald-50 text-[#16A36A] border-emerald-200/60";
    tagText = t('tagBestSeller');
  }

  // Stock status text & color
  let stockText = `${t('inStockStatus')} (${product.stock})`;
  let stockColor = "text-[#16A36A]";

  if (product.stock <= 0) {
    stockText = t('outOfStockStatus');
    stockColor = "text-[#E5484D]";
  } else if (product.stock <= (product.minStockThreshold || 5)) {
    stockText = `${t('lowStockStatus')} (${product.stock})`;
    stockColor = "text-[#F5A623]";
  }

  const handleQuickSale = (e) => {
    e.stopPropagation();
    navigate(`/pos?product=${product.id}`);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col p-4 shadow-sm hover:shadow-card-hover ${
        isSelected
          ? 'border-[#FF7900] ring-2 ring-[#FF7900]/20'
          : 'border-[#EAEAEA] hover:border-neutral-300'
      }`}
    >
      {/* Top Card Header: Badge & 3-dot Menu */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagClass}`}>
          {tagText}
        </span>

        {/* 3-dot action button */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg text-[#888888] hover:text-[#171717] hover:bg-neutral-100 flex items-center justify-center transition"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Popup Dropdown Menu */}
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setMenuOpen(false)} 
              />
              <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-[#EAEAEA] py-1.5 z-30 animate-in fade-in">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSelect();
                  }}
                  className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-[#888888]" />
                  <span>{t('view')}</span>
                </button>
                <button
                  onClick={handleQuickSale}
                  className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#FF7900] hover:bg-orange-50 flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('quickSellBtn')}</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(product);
                  }}
                  className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#888888]" />
                  <span>{t('editProductBtn')}</span>
                </button>
                <div className="border-t border-[#EAEAEA] my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(product.id);
                  }}
                  className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#E5484D] hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#E5484D]" />
                  <span>{t('deleteProductBtn')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Image Container */}
      <div className="relative w-full h-44 sm:h-48 my-2 flex items-center justify-center overflow-hidden rounded-xl bg-[#FAFAFA]/70 p-3 group-hover:bg-[#F7F7F6] transition-colors">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback placeholder
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";
          }}
        />
        
        {/* Quick sale button on hover */}
        <button
          onClick={handleQuickSale}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#FF7900] text-white p-2 rounded-xl shadow-md hover:bg-[#EA6E00] flex items-center gap-1.5 text-xs font-semibold"
          title={t('sellBtn')}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('sellBtn')}</span>
        </button>
      </div>

      {/* Product Details Bottom Block */}
      <div className="mt-auto pt-2">
        {/* Product Title */}
        <h3 className="font-semibold text-sm text-[#171717] leading-snug line-clamp-1 group-hover:text-[#FF7900] transition-colors">
          {product.name}
        </h3>

        {/* Storage, RAM & SKU info */}
        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#888888]">
          <span className="font-medium text-[#666666]">{product.storage} • {product.ram}</span>
          <span>•</span>
          <span className="truncate">{product.sku}</span>
        </div>

        {/* Price and Stock row (matching reference layout) */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0F0F0]">
          <span className="font-bold text-sm text-[#171717]">
            {formatCurrency(product.sellingPrice)}
          </span>
          <span className={`text-xs font-semibold ${stockColor}`}>
            {stockText}
          </span>
        </div>
      </div>
    </div>
  );
}

