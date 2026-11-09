import React, { useState } from 'react';
import { X, Plus, PackageCheck, DollarSign, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export default function RestockModal({ isOpen, onClose, product }) {
  const { restockProduct } = useApp();
  const [quantity, setQuantity] = useState('10');
  const [supplier, setSupplier] = useState('Official Wholesale Distributor');
  const [unitCost, setUnitCost] = useState(product ? product.purchasePrice : '');

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = restockProduct(product.id, quantity, supplier, unitCost);
    if (ok) onClose();
  };

  const totalCost = Number(quantity || 0) * Number(unitCost || product.purchasePrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#171717] p-1 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-[#EAEAEA]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Restock Smartphone Units
            </h3>
            <p className="text-xs text-[#888888]">Receive fresh inventory shipment from supplier</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Target Product */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-[#EAEAEA] flex items-center gap-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-white rounded-xl p-1 border" />
            <div>
              <h4 className="text-xs font-bold text-[#171717]">{product.name}</h4>
              <p className="text-[11px] text-[#888888]">{product.storage} • Current Stock: {product.stock} units</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#171717] block mb-1.5">
              Additional Units to Inflow *
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] font-bold focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#171717] block mb-1.5">
              Supplier / Source
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#171717] block mb-1.5">
              Batch Unit Purchase Cost (so'm)
            </label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs text-[#171717] font-semibold focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
            />
          </div>

          {/* Shipment Cost Summary */}
          <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-1 text-xs">
            <div className="flex justify-between text-[#888888]">
              <span>New Total Stock After Restock:</span>
              <strong className="text-[#171717] font-bold">{Number(product.stock) + Number(quantity || 0)} units</strong>
            </div>
            <div className="flex justify-between text-[#888888]">
              <span>Total Shipment Inflow Cost:</span>
              <strong className="text-[#FF7900] font-black">{formatCurrency(totalCost)}</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EAEAEA] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666666] hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              Confirm Restock (+{quantity})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

