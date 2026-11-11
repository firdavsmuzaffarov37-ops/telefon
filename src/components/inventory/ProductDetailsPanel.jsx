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
  PackageCheck,
  Sparkles,
  Layers,
  Award,
  Calendar
} from 'lucide-react';
import { formatCurrency, calculateMargin } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import RestockModal from './RestockModal';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export default function ProductDetailsPanel({ 
  product, 
  onClose, 
  onEdit, 
  onDelete,
  onSave
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isClientMode } = useApp();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    specs: true,
    pricing: true,
    colors: true,
    description: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!product) return null;

  // Stock status styling (5 tadan kam qolgan bo'lsa ogohlantirish)
  const currentStock = Number(product.stock) || 0;
  let stockBadgeClass = "bg-emerald-50 text-[#16A36A] border-emerald-200";
  let stockLabel = `${t('inStockStatus')} (${currentStock} dona)`;

  if (currentStock <= 0) {
    stockBadgeClass = "bg-red-50 text-[#E5484D] border-red-200 font-bold";
    stockLabel = "Tugagan (0 dona)";
  } else if (currentStock <= 5) {
    stockBadgeClass = "bg-orange-50 text-[#FF7900] border-orange-300 dark:bg-orange-500/10 dark:text-amber-400 font-extrabold";
    stockLabel = `⚠️ 5 tadan kam qoldi (${currentStock} dona)`;
  }

  const profitPerUnit = Number(product.sellingPrice) - Number(product.purchasePrice);
  const totalStockValue = Number(product.stock) * Number(product.sellingPrice);
  const totalStockCost = Number(product.stock) * Number(product.purchasePrice);
  const marginPercent = calculateMargin(product.sellingPrice, product.purchasePrice);
  const monthlyInstallment = Math.round(Number(product.sellingPrice) / 12);

  const activeColor = product.colors?.[selectedColorIndex] || {
    name: product.color,
    hex: '#222',
    stock: product.stock
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer on Mobile/Tablet, Sticky Sidebar on Laptop/Desktop */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#18191D] p-5 shadow-2xl flex flex-col overflow-y-auto lg:static lg:z-auto lg:w-[380px] xl:w-[410px] lg:flex-shrink-0 lg:border lg:border-[#EAEAEA] dark:border-[#27282E] lg:rounded-3xl lg:shadow-card lg:h-fit lg:sticky lg:top-24 animate-in slide-in-from-right-full lg:animate-none duration-200">
        {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA] dark:border-[#27282E]">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
            {t('productDetailsTitle')}
          </h2>
          {isClientMode && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Vitrina Ko'rinishi
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#888888] hover:text-[#171717] transition cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-210px)] pr-1 -mr-1 space-y-4 pt-3">
        {/* Title, SKU and Stock Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#171717] leading-tight font-['Plus_Jakarta_Sans']">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#888888] mt-1">
              <span className="font-semibold text-[#555]">{product.storage} • {product.ram}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">{product.sku}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#666] mt-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Kelib tushgan sana: <strong className="text-[#171717]">{product.arrivalDate || "08.11.2026"}</strong></span>
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${stockBadgeClass} whitespace-nowrap`}>
            {stockLabel}
          </span>
        </div>

        {/* Large Product Image Showcase */}
        <div className="w-full h-52 sm:h-56 bg-[#FAFAFA] rounded-2xl flex items-center justify-center p-4 border border-[#F0F0F0] relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#EAEAEA] text-[#171717]">
              {product.brand}
            </span>
            <span className="text-[10px] font-bold bg-[#FF7900] text-white px-2 py-0.5 rounded-lg shadow-sm">
              Original Sealed
            </span>
          </div>
        </div>

        {/* TELEFON HAQIDA (Telefoni tagida yozilgan maxsus blok) */}
        <div className="bg-[#FAF9F6] border border-[#EBE8E0] rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Telefon haqida:</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              1 Yillik Kafolat
            </span>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            {product.description}
          </p>
          {product.highlights && product.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {product.highlights.map((h, i) => (
                <div key={i} className="text-[10.5px] font-medium text-[#333] bg-white rounded-lg px-2 py-1 border border-[#EAEAEA] flex items-center gap-1">
                  <span className="text-[#FF7900] font-bold">•</span>
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RANGLAR VA HAR BIR RANGNING ANIQ QOLDIG'I */}
        <div className="border border-[#EAEAEA] rounded-2xl p-3.5 bg-white space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#171717]">
              <Layers className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Ranglar bo'yicha qoldiq:</span>
            </div>
            <span className="text-[11px] font-semibold text-[#888888]">
              Tanlangan: <strong className="text-[#171717]">{activeColor.name}</strong>
            </span>
          </div>

          {/* Color Circles Selector */}
          <div className="flex items-center gap-2">
            {(product.colors || [{ name: product.color, hex: '#222', stock: product.stock }]).map((c, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                style={{ backgroundColor: c.hex }}
                className={`w-8 h-8 rounded-xl border transition-all duration-150 relative flex items-center justify-center cursor-pointer ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-offset-2 ring-[#FF7900] scale-105 shadow-sm'
                    : 'border-black/10 hover:scale-105'
                }`}
                title={`${c.name} (${c.stock ?? product.stock} dona)`}
              >
                {selectedColorIndex === idx && (
                  <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#E3E4E5' || c.hex === '#F3F2EE' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>

          {/* Color List Table with Exact Stocks */}
          <div className="space-y-1.5 pt-1 border-t border-[#F0F0F0]">
            {(product.colors || [{ name: product.color, hex: '#222', stock: product.stock }]).map((c, idx) => {
              const count = c.stock !== undefined ? c.stock : Math.ceil(product.stock / (product.colors?.length || 1));
              const isSelected = selectedColorIndex === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected 
                      ? 'bg-orange-50/70 border-[#FF7900]/40 font-semibold' 
                      : 'bg-neutral-50/60 border-neutral-200/60 hover:bg-neutral-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full border border-black/20" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <span className="text-[#171717]">{c.name}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    count > 5 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : count > 0 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {count > 0 ? `${count} dona mavjud` : 'Tugagan'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Section (Dual Mode) */}
        {isClientMode ? (
          /* MIJOZ / VITRINA REJIMI */
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/40 border border-orange-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#888888]">Omabop Sotuv Narxi:</span>
              <span className="text-lg font-black text-[#171717] font-['Plus_Jakarta_Sans']">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#FF7900] font-bold block">Bo'lib to'lash (12 oy):</span>
                <span className="text-xs font-black text-[#171717]">~{formatCurrency(monthlyInstallment)} / oy</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                0% Boshlang'ich
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#555] pt-1">
              <Award className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>1 Yil Rasmiy Kafolat va Bepul Servis</span>
            </div>
          </div>
        ) : (
          /* ISHCHI / DOKON REJIMI: Full cost breakdown */
          <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888888] font-bold">Sotuv narxi:</span>
              <span className="text-sm font-black text-[#171717]">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888888] font-bold">Xarid (Tan) narxi:</span>
              <span className="text-xs font-bold text-[#666666]">
                {formatCurrency(product.purchasePrice)}
              </span>
            </div>
            <div className="border-t border-orange-200/50 pt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Sof foyda ({marginPercent}%):
              </span>
              <span className="text-xs font-black text-emerald-600">
                +{formatCurrency(profitPerUnit)} / dona
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#888888] pt-1 border-t border-orange-200/30">
              <span>Ombordagi umumiy tovar qiymati:</span>
              <span className="font-bold text-[#171717]">{formatCurrency(totalStockValue)}</span>
            </div>
          </div>
        )}

        {/* Expandable Specifications Section */}
        <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('specs')}
            className="w-full px-4 py-3 bg-neutral-50/70 hover:bg-neutral-100/60 flex items-center justify-between text-left transition cursor-pointer"
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
                <span className="text-[#888888]">Xotira / RAM:</span>
                <span className="font-semibold text-[#171717]">{product.storage} / {product.ram}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Ekran:</span>
                <span className="font-semibold text-[#171717] text-right max-w-[210px] truncate">{product.specs?.display || 'Super Retina XDR OLED'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Protsessor:</span>
                <span className="font-semibold text-[#171717]">{product.specs?.chipset || 'High-End 3nm'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Kamera:</span>
                <span className="font-semibold text-[#171717] text-right max-w-[210px] truncate">{product.specs?.camera || '50MP Triple System'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Batareya:</span>
                <span className="font-semibold text-[#171717]">{product.specs?.battery || '5,000 mAh'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F5F5F4]">
                <span className="text-[#888888]">Kafolat:</span>
                <span className="font-semibold text-emerald-700">{product.specs?.warranty || '1 Yillik Rasmiy Kafolat'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#888888]">Holati:</span>
                <span className="font-semibold text-[#171717]">{product.specs?.condition || 'Yangi Qadoqda (Original Sealed)'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 border-t border-[#EAEAEA] mt-3 space-y-2">
        {/* Primary Action Button */}
        <button
          onClick={() => {
            if (product.stock <= 0) return;
            navigate(`/pos?product=${product.id}&color=${encodeURIComponent(activeColor.name)}`);
          }}
          disabled={product.stock <= 0}
          className={`w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition ${
            product.stock <= 0
              ? 'bg-neutral-400 cursor-not-allowed opacity-75'
              : 'bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.99] cursor-pointer shadow-orange-500/10'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {product.stock <= 0 
              ? "⛔ Omborda Tugagan (0 dona — Sotuv to'xtatildi)" 
              : (isClientMode ? "Sotib Olish / Rasmiylashtirish" : t('quickSellBtn'))}
          </span>
        </button>

        {/* Secondary Edit, Restock & Delete Buttons (Only in Staff mode) */}
        {!isClientMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-2 px-2.5 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#666666]" />
              <span>{t('editProductBtn')}</span>
            </button>

            <button
              onClick={() => setIsRestockOpen(true)}
              className="flex-1 py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Restock shipment"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('restockBtn')}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm(`${product.name} - ${t('delete')}?`)) {
                  onDelete(product.id);
                }
              }}
              className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#E5484D] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              title={t('delete')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
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
    </>
  );
}
