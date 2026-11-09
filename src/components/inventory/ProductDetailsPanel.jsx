import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Eye, 
  Package, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  DollarSign, 
  Cpu, 
  ShieldCheck, 
  FileText,
  TrendingUp,
  Smartphone,
  PackageCheck
} from 'lucide-react';
import { formatCurrency, calculateMargin } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import RestockModal from './RestockModal';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductDetailsPanel({ 
  product, 
  onClose, 
  onEdit, 
  onDelete,
  onSave
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    specs: true,
    pricing: true,
    imei: false,
    description: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!product) return null;

  // Stock status styling
  let stockBadgeClass = "bg-emerald-50 text-[#16A36A] border-emerald-200";
  let stockLabel = `${t('inStockStatus')} (${product.stock})`;

  if (product.stock <= 0) {
    stockBadgeClass = "bg-red-50 text-[#E5484D] border-red-200";
    stockLabel = `${t('outOfStockStatus')} (0)`;
  } else if (product.stock <= (product.minStockThreshold || 5)) {
    stockBadgeClass = "bg-amber-50 text-[#F5A623] border-amber-200";
    stockLabel = `${t('lowStockStatus')} (${product.stock})`;
  }

  const profitPerUnit = Number(product.sellingPrice) - Number(product.purchasePrice);
  const totalStockValue = Number(product.stock) * Number(product.sellingPrice);
  const totalStockCost = Number(product.stock) * Number(product.purchasePrice);
  const marginPercent = calculateMargin(product.sellingPrice, product.purchasePrice);

  return (
    <div className="w-full lg:w-[410px] xl:w-[440px] flex-shrink-0 bg-white border border-[#EAEAEA] rounded-3xl p-5 shadow-card flex flex-col h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
        <h2 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
          {t('productDetailsTitle')}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#888888] hover:text-[#171717] transition"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-1 -mr-1 space-y-4 pt-3">
        {/* Title, SKU and Stock Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#171717] leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#888888] mt-1">
              <Smartphone className="w-3.5 h-3.5 text-[#888888]" />
              <span>{product.sku}</span>
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${stockBadgeClass} whitespace-nowrap`}>
            {stockLabel}
          </span>
        </div>

        {/* Large Product Image Showcase (Matching reference) */}
        <div className="w-full h-52 sm:h-56 bg-[#FAFAFA] rounded-2xl flex items-center justify-center p-4 border border-[#F0F0F0] relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-semibold bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-[#EAEAEA] text-[#666666]">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Color Swatches / Thumbnails Row (Matching reference screenshot +4 pill) */}
        <div>
          <div className="flex items-center justify-between text-xs text-[#888888] mb-2 font-medium">
            <span>{t('colorVariants')} ({product.colors?.length || 1})</span>
            <span className="text-[#171717] font-semibold">
              {product.colors?.[selectedColorIndex]?.name || product.color}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(product.colors || [{ name: product.color, hex: '#222' }]).map((c, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                style={{ backgroundColor: c.hex }}
                className={`w-8 h-8 rounded-xl border transition-all duration-150 relative flex items-center justify-center ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-offset-2 ring-[#FF7900] scale-105 shadow-sm'
                    : 'border-black/10 hover:scale-105'
                }`}
                title={c.name}
              >
                {selectedColorIndex === idx && (
                  <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#E3E4E5' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
            <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-[#EAEAEA] flex items-center justify-center text-[11px] font-bold text-[#666666]">
              +{Math.max(1, (product.colors?.length || 1))}
            </div>
          </div>
        </div>

        {/* 3-column stats pill row (Rating, Views, Units Sold) */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F0F0F0] text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#171717]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating || '4.8'}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-0.5 font-medium">{t('ratings')}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F0F0F0] text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#171717]">
              <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{product.views || '3.2k'}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-0.5 font-medium">{t('views')}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F0F0F0] text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#171717]">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.unitsSold || 0}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-0.5 font-medium">{t('unitsSold')}</p>
          </div>
        </div>

        {/* Financial Overview Card */}
        <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888] font-medium">{t('sellingPrice')}:</span>
            <span className="text-sm font-bold text-[#171717]">
              {formatCurrency(product.sellingPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888] font-medium">{t('purchaseCost')}:</span>
            <span className="text-xs font-semibold text-[#666666]">
              {formatCurrency(product.purchasePrice)}
            </span>
          </div>
          <div className="border-t border-orange-200/50 pt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              {t('unitProfit')} ({marginPercent}%):
            </span>
            <span className="text-xs font-bold text-emerald-600">
              +{formatCurrency(profitPerUnit)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#888888] pt-1">
            <span>{t('totalStockVal')}:</span>
            <span className="font-semibold text-[#171717]">{formatCurrency(totalStockValue)}</span>
          </div>
        </div>

        {/* Expandable Specifications Section */}
        <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('specs')}
            className="w-full px-4 py-3 bg-neutral-50/70 hover:bg-neutral-100/60 flex items-center justify-between text-left transition"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF7900]" />
              <span className="text-xs font-bold text-[#171717]">{t('hardwareSpecs')}</span>
            </div>
            {openSections.specs ? <ChevronUp className="w-4 h-4 text-[#888888]" /> : <ChevronDown className="w-4 h-4 text-[#888888]" />}
          </button>
          
          {openSections.specs && (
            <div className="p-3.5 space-y-2 text-xs bg-white">
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Storage / RAM:</span>
                <span className="font-semibold text-[#171717]">{product.storage} / {product.ram}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Display:</span>
                <span className="font-semibold text-[#171717] text-right max-w-[200px] truncate">{product.specs?.display || 'Super Retina XDR OLED'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Chipset:</span>
                <span className="font-semibold text-[#171717]">{product.specs?.chipset || 'High-End 3nm'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Camera:</span>
                <span className="font-semibold text-[#171717] text-right max-w-[200px] truncate">{product.specs?.camera || '50MP Triple System'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#888888]">Battery:</span>
                <span className="font-semibold text-[#171717]">{product.specs?.battery || '5,000 mAh'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Expandable Description */}
        <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('description')}
            className="w-full px-4 py-3 bg-neutral-50/70 hover:bg-neutral-100/60 flex items-center justify-between text-left transition"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF7900]" />
              <span className="text-xs font-bold text-[#171717]">Product Description</span>
            </div>
            {openSections.description ? <ChevronUp className="w-4 h-4 text-[#888888]" /> : <ChevronDown className="w-4 h-4 text-[#888888]" />}
          </button>
          
          {openSections.description && (
            <div className="p-3.5 text-xs text-[#666666] leading-relaxed bg-white">
              {product.description || "Official manufacturer sealed warranty smartphone with all accessories included."}
              <div className="mt-2 text-[11px] text-[#888888] font-mono">
                IMEI: {product.imei}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 border-t border-[#EAEAEA] mt-4 space-y-2">
        {/* Primary Orange Save / POS Action Button (Matching reference screenshot) */}
        <button
          onClick={() => navigate(`/pos?product=${product.id}`)}
          className="w-full py-2.5 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('quickSellBtn')}</span>
        </button>

        {/* Secondary Edit, Restock & Delete Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#666666]" />
            <span>{t('editProductBtn')}</span>
          </button>

          <button
            onClick={() => setIsRestockOpen(true)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            title="Restock shipment"
          >
            <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('restockBtn')}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                onDelete(product.id);
              }
            }}
            className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#E5484D] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Restock Modal */}
      {isRestockOpen && (
        <RestockModal
          isOpen={isRestockOpen}
          onClose={() => setIsRestockOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}

