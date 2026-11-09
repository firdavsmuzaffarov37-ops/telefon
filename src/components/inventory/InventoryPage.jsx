import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';
import ProductDetailsPanel from './ProductDetailsPanel';
import ProductModal from './ProductModal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Smartphone, 
  Plus, 
  PackageX, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  ShoppingBag,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InventoryPage() {
  const { 
    products, 
    selectedProduct, 
    setSelectedProduct, 
    isDetailsPanelOpen, 
    setIsDetailsPanelOpen,
    deleteProduct,
    isAddModalOpen,
    setIsAddModalOpen,
    editingProduct,
    setEditingProduct
  } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // View mode toggle: 'grid' or 'table' (Image 2 style)
  const [viewMode, setViewMode] = useState('grid');

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedStorage, setSelectedStorage] = useState('All Storage');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Extract unique brands & storages dynamically
  const brands = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return ['All Brands', ...unique];
  }, [products]);

  const storages = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.storage).filter(Boolean)));
    return ['All Storage', ...unique];
  }, [products]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: products.length,
      inStock: products.filter(p => p.stock > (p.minStockThreshold || 5)).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= (p.minStockThreshold || 5)).length,
      outOfStock: products.filter(p => p.stock <= 0).length,
    };
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Tab filter
      if (activeTab === 'in_stock' && p.stock <= (p.minStockThreshold || 5)) return false;
      if (activeTab === 'low_stock' && (p.stock <= 0 || p.stock > (p.minStockThreshold || 5))) return false;
      if (activeTab === 'out_of_stock' && p.stock > 0) return false;

      // Dropdown Status filter
      if (selectedStatus === 'in_stock' && p.stock <= (p.minStockThreshold || 5)) return false;
      if (selectedStatus === 'low_stock' && (p.stock <= 0 || p.stock > (p.minStockThreshold || 5))) return false;
      if (selectedStatus === 'out_of_stock' && p.stock > 0) return false;

      // Brand filter
      if (selectedBrand !== 'All Brands' && p.brand !== selectedBrand) return false;

      // Storage filter
      if (selectedStorage !== 'All Storage' && p.storage !== selectedStorage) return false;

      // Price filter
      if (p.sellingPrice < priceRange.min || p.sellingPrice > priceRange.max) return false;

      // Search Query (by model, brand, imei, sku)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesModel = p.model?.toLowerCase().includes(query);
        const matchesImei = p.imei?.toLowerCase().includes(query);
        const matchesSku = p.sku?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesModel && !matchesImei && !matchesSku) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price_high') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'stock_low') return a.stock - b.stock;
      if (sortBy === 'stock_high') return b.stock - a.stock;
      if (sortBy === 'popular') return (b.unitsSold || 0) - (a.unitsSold || 0);
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [products, activeTab, selectedStatus, selectedBrand, selectedStorage, priceRange, searchQuery, sortBy]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleCardSelect = (product) => {
    setSelectedProduct(product);
    setIsDetailsPanelOpen(true);
  };

  // Export inventory to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Brand", "Model", "Storage", "RAM", "Color", "SKU", "IMEI", "Purchase Price", "Selling Price", "Stock", "Status"];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name}"`,
      p.brand,
      `"${p.model}"`,
      p.storage,
      p.ram,
      `"${p.color}"`,
      p.sku,
      `"${p.imei}"`,
      p.purchasePrice,
      p.sellingPrice,
      p.stock,
      p.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `phonelytics-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* 1. Header with 100% Translated Text */}
      <Header
        title={t('invTitle')}
        subtitle={t('invSubtitle')}
        actionText={t('newProductBtn')}
        onActionClick={handleOpenAddModal}
      />

      {/* 2. Top 4 Stat Summary Cards (Directly matching Image 2 Apple-style design!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <span className="text-xs font-semibold text-[#888888] block">
            {t('summaryTotalProducts')}
          </span>
          <h3 className="text-3xl font-black text-[#171717] mt-2 font-['Plus_Jakarta_Sans']">
            {counts.all}
          </h3>
          <p className="text-[11px] text-[#888888] mt-1">
            {t('summaryTotalDesc')}
          </p>
        </div>

        {/* Active In Stock Products */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <span className="text-xs font-semibold text-[#888888] block">
            {t('summaryActiveProducts')}
          </span>
          <h3 className="text-3xl font-black text-[#16A36A] mt-2 font-['Plus_Jakarta_Sans']">
            {counts.inStock}
          </h3>
          <p className="text-[11px] text-[#888888] mt-1">
            {t('summaryActiveDesc')}
          </p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <span className="text-xs font-semibold text-[#888888] block">
            {t('summaryOutOfStock')}
          </span>
          <h3 className="text-3xl font-black text-[#E5484D] mt-2 font-['Plus_Jakarta_Sans']">
            {counts.outOfStock}
          </h3>
          <p className="text-[11px] text-[#888888] mt-1">
            {t('summaryOutOfStockDesc')}
          </p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <span className="text-xs font-semibold text-[#888888] block">
            {t('summaryLowStock')}
          </span>
          <h3 className="text-3xl font-black text-[#F5A623] mt-2 font-['Plus_Jakarta_Sans']">
            {counts.lowStock}
          </h3>
          <p className="text-[11px] text-[#888888] mt-1">
            {t('summaryLowStockDesc')}
          </p>
        </div>
      </div>

      {/* 3. Action Bar with View Switcher (Grid / Table) & Export button */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* View Toggle: Grid vs Table */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#EAEAEA] shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-[#666666] hover:bg-neutral-100'
              }`}
              title={t('viewGrid')}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('viewGrid')}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'table'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-[#666666] hover:bg-neutral-100'
              }`}
              title={t('viewTable')}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('viewTable')}</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 text-xs font-bold text-[#171717] shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-[#888888]" />
            <span>{t('exportData')}</span>
          </button>
        </div>

        {/* Quick count indicator */}
        <span className="text-xs font-semibold text-[#888888]">
          {filteredProducts.length} {t('tableProduct').toLowerCase()}
        </span>
      </div>

      {/* 4. Filter and Search Bar */}
      <FilterBar
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedStorage={selectedStorage}
        setSelectedStorage={setSelectedStorage}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        counts={counts}
        brands={brands}
        storages={storages}
      />

      {/* 5. Main Content: Grid Mode vs Table Mode */}
      {viewMode === 'grid' ? (
        /* GRID VIEW (Matching Reference Screenshot 1) */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: 3-column Smartphone Cards Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAEAEA] p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF7900] flex items-center justify-center mx-auto mb-4">
                  <PackageX className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-bold text-[#171717]">{t('noProductsFound')}</h3>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedBrand('All Brands');
                      setSelectedStorage('All Storage');
                      setSelectedStatus('all');
                      setActiveTab('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-[#171717] transition"
                  >
                    {t('resetFilters')}
                  </button>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-semibold shadow-sm transition"
                  >
                    + {t('newProductBtn')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProduct?.id === product.id && isDetailsPanelOpen}
                    onSelect={() => handleCardSelect(product)}
                    onEdit={handleEdit}
                    onDelete={deleteProduct}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details Side Panel */}
          {isDetailsPanelOpen && selectedProduct && (
            <ProductDetailsPanel
              product={selectedProduct}
              onClose={() => setIsDetailsPanelOpen(false)}
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
          )}
        </div>
      ) : (
        /* TABLE / LIST VIEW (Directly Matching Reference Image 2!) */
        <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#888888]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{t('tableProduct')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('tableSKU')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('tableBrand')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('tablePrice')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('tableStock')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('tableStatus')}</th>
                  <th className="py-3.5 px-4 font-semibold text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {filteredProducts.map(p => {
                  let statusBadge = "bg-emerald-50 text-[#16A36A] border-emerald-200";
                  let statusText = t('inStockStatus');

                  if (p.stock <= 0) {
                    statusBadge = "bg-red-50 text-[#E5484D] border-red-200";
                    statusText = t('outOfStockStatus');
                  } else if (p.stock <= (p.minStockThreshold || 5)) {
                    statusBadge = "bg-amber-50 text-[#F5A623] border-amber-200";
                    statusText = t('lowStockStatus');
                  }

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleCardSelect(p)}
                      className="hover:bg-neutral-50/80 transition cursor-pointer"
                    >
                      {/* Product Thumbnail + Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#FAFAFA] p-1 border border-[#EAEAEA] flex items-center justify-center flex-shrink-0">
                            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#171717]">{p.name}</h4>
                            <span className="text-[11px] text-[#888888]">{p.color} • {p.storage}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU / IMEI */}
                      <td className="py-3 px-4 font-mono font-medium text-[#666666]">
                        <div>{p.sku}</div>
                        <div className="text-[10px] text-[#888888]">{p.imei}</div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-semibold text-[#171717]">
                        {p.brand}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#171717]">
                        {formatCurrency(p.sellingPrice)}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-4 font-black text-[#171717]">
                        {p.stock} <span className="text-[11px] font-normal text-[#888888]">dona</span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/pos?product=${p.id}`)}
                            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-orange-50 text-[#FF7900] transition"
                            title={t('quickSellBtn')}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-neutral-100 text-[#171717] transition"
                            title={t('editProductBtn')}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#E5484D] transition"
                            title={t('deleteProductBtn')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
    </div>
  );
}
