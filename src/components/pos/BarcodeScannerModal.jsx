import React, { useState, useEffect, useRef } from 'react';
import { X, Scan, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

// Simple Web Audio synthesizer beep for barcode scan feedback
function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // 1.4kHz barcode scanner chirp
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    // Audio might be blocked before user interaction
  }
}

export default function BarcodeScannerModal({ isOpen, onClose, onScan, onDetected }) {
  const { t } = useLanguage();
  const { products } = useApp();
  const [manualImei, setManualImei] = useState('');
  const [detectedItem, setDetectedItem] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScan = (imei) => {
    playBeep();
    const found = products.find(p => 
      p.imei?.toLowerCase().includes(imei.toLowerCase()) || 
      p.sku?.toLowerCase().includes(imei.toLowerCase())
    );

    if (found) {
      setDetectedItem(found);
      setTimeout(() => {
        if (onScan) onScan(found.imei || found.sku || found.id);
        if (onDetected) onDetected(found);
        onClose();
      }, 600);
    } else {
      alert(`Bunday IMEI / SKU li smartfon topilmadi: ${imei}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!manualImei.trim()) return;
    handleScan(manualImei.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#171717] p-1 rounded-full hover:bg-neutral-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-[#EAEAEA]">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center">
            <Scan className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              {t('barcodeModalTitle')}
            </h3>
            <p className="text-xs text-[#888888]">USB Shtrix-kod skaneri va apparat IMEI qidiruvi</p>
          </div>
        </div>

        {/* Viewport Frame with animated scanning line */}
        <div className="my-5 relative w-full h-44 rounded-2xl bg-neutral-900 overflow-hidden flex items-center justify-center border-2 border-neutral-700">
          {/* Animated red laser line */}
          <div className="absolute inset-x-6 h-0.5 bg-red-500 shadow-lg shadow-red-500/80 animate-pulse z-10" />

          {/* Target Box */}
          <div className="w-56 h-28 border-2 border-dashed border-white/60 rounded-xl flex flex-col items-center justify-center text-white/70 p-3 text-center">
            <Scan className="w-8 h-8 mb-1 text-white/80" />
            <span className="text-[11px] font-medium tracking-wide">
              Shtrix-kodni markazga to'g'rilang
            </span>
          </div>

          {detectedItem && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-white z-20 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
              <span className="text-xs font-bold">{detectedItem.name}</span>
              <span className="text-[11px] text-emerald-300 font-mono mt-0.5">{detectedItem.imei}</span>
            </div>
          )}
        </div>

        {/* Manual Barcode input (USB Barcode gun works automatically here) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#666666] block mb-1">
              USB Skaner yoki qo'lda IMEI kiritish:
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="15 xonali apparat IMEI raqami..."
                value={manualImei}
                onChange={(e) => setManualImei(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs font-mono text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Qidirish
              </button>
            </div>
          </div>
        </form>

        {/* Quick Test Barcode Buttons for Demo */}
        <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
          <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
            1-bosishda test IMEI larni sinash:
          </span>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {products.slice(0, 6).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleScan(p.imei)}
                className="p-2 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-orange-50 hover:border-orange-300 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate pr-1">
                  <p className="text-[11px] font-bold text-[#171717] truncate">{p.name}</p>
                  <p className="text-[10px] font-mono text-[#888888]">{p.imei?.slice(0, 8)}...</p>
                </div>
                <Zap className="w-3 h-3 text-[#888888] group-hover:text-[#FF7900] flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
