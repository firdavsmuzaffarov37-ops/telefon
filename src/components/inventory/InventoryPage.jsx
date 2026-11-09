import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';
import ProductDetailsPanel from './ProductDetailsPanel';
import ProductModal from './ProductModal';
import { useApp } from '../../context/AppContext';
import { Smartphone, Plus, PackageX, Sparkles } from 'lucide-react';

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
      // default newest:
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

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6">
      {/* Page Header (Matching reference screenshot) */}
      <Header
        title="Smartphone Inventory"
        subtitle="Manage your smartphones, stock availability, and product information across retail channels."
        actionText="New Product"
        onActionClick={handleOpenAddModal}
      />

      {/* Filter and Search Bar (Matching reference screenshot) */}
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

      {/* Main Content Layout: Product Grid (3 cols) + Right Details Panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: 3-Column Smartphone Cards Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-[#EAEAEA] p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF7900] flex items-center justify-center mx-auto mb-4">
                <PackageX className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">No Smartphones Found</h3>
              <p className="text-xs text-[#888888] max-w-sm mx-auto mt-1">
                No smartphones matched your active filters or search terms. Try clearing filters or adding a new device.
              </p>
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
                  Clear Filters
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-semibold shadow-sm transition"
                >
                  + Add New Phone
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

        {/* Right Side: Product Details Side Panel (Matching reference screenshot) */}
        {isDetailsPanelOpen && selectedProduct && (
          <ProductDetailsPanel
            product={selectedProduct}
            onClose={() => setIsDetailsPanelOpen(false)}
            onEdit={handleEdit}
            onDelete={deleteProduct}
          />
        )}
      </div>

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

