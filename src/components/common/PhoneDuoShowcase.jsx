import React from 'react';

/**
 * PhoneDuoShowcase:
 * Renders the exact reference design aesthetic showing BOTH:
 * 1. The BACK of the smartphone (left) with its authentic camera module, color & branding.
 * 2. The FRONT of the smartphone (right) with its AMOLED display ON, wallpapers & bezels.
 */
export default function PhoneDuoShowcase({ product, activeColorHex, className = '' }) {
  if (!product) return null;

  const brand = (product.brand || '').toLowerCase();
  const name = product.name || '';
  const isApple = brand.includes('apple') || name.toLowerCase().includes('iphone');
  const isSamsung = brand.includes('samsung') || name.toLowerCase().includes('galaxy');
  const isGoogle = brand.includes('google') || name.toLowerCase().includes('pixel');
  const isHonor = brand.includes('honor');
  const isVivo = brand.includes('vivo') || brand.includes('iqoo');
  const isOnePlus = brand.includes('oneplus');
  const isRealme = brand.includes('realme');
  const isXiaomi = brand.includes('xiaomi') || name.toLowerCase().includes('redmi');

  // Primary body color
  const bodyColor = activeColorHex || product.colors?.[0]?.hex || '#2B2C33';

  // Screen wallpaper gradient based on model
  const getScreenTheme = () => {
    if (name.includes('17 Pro') || name.includes('16 Pro')) {
      return 'from-[#1A1A24] via-[#2D1F3D] to-[#121217] text-amber-200';
    }
    if (name.includes('S25 Ultra') || name.includes('S24')) {
      return 'from-[#0F1420] via-[#1E293B] to-[#0A0D14] text-cyan-200';
    }
    if (name.includes('Pixel')) {
      return 'from-[#1E2022] via-[#38423B] to-[#151917] text-emerald-200';
    }
    if (name.includes('Honor') || isHonor) {
      return 'from-[#2B1705] via-[#5C2B09] to-[#140A02] text-amber-400';
    }
    if (name.includes('vivo') || name.includes('X300')) {
      return 'from-[#0B1E28] via-[#14425A] to-[#07131A] text-sky-300';
    }
    if (name.includes('realme') || name.includes('GT 7')) {
      return 'from-[#331405] via-[#7C2D12] to-[#1A0A02] text-orange-400';
    }
    if (name.includes('OnePlus')) {
      return 'from-[#2A1115] via-[#4A1D24] to-[#14080A] text-rose-300';
    }
    if (name.includes('iQOO')) {
      return 'from-[#1C1D24] via-[#2A2B3D] to-[#0F1015] text-indigo-300';
    }
    return 'from-[#181920] via-[#272935] to-[#0F1014] text-neutral-300';
  };

  const screenGradient = getScreenTheme();

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* Container holding both overlapping phones */}
      <div className="relative w-48 sm:w-52 h-40 sm:h-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        
        {/* ========================================================
            1. BACK OF PHONE (ORQA TOMONI - LEFT)
           ======================================================== */}
        <div 
          className="absolute left-3 sm:left-4 top-1 w-20 sm:w-22 h-36 sm:h-40 rounded-[20px] p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.22)] border border-white/20 transition-all duration-300 group-hover:-translate-x-1.5 group-hover:-translate-y-1 z-0 flex flex-col justify-between overflow-hidden"
          style={{ 
            backgroundColor: bodyColor,
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.25) 100%)`
          }}
        >
          {/* Subtle metallic edge highlight */}
          <div className="absolute inset-0 rounded-[19px] border border-white/15 pointer-events-none" />

          {/* Camera Module based on Brand */}
          <div className="relative z-10">
            {/* APPLE: Triangular Triple Lens Squircle */}
            {isApple && (
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 p-1 shadow-inner relative">
                <div className="w-3 h-3 rounded-full bg-[#111] border border-neutral-600 shadow-sm absolute top-1 left-1 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-400/60" />
                </div>
                <div className="w-3 h-3 rounded-full bg-[#111] border border-neutral-600 shadow-sm absolute bottom-1 left-1 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-400/60" />
                </div>
                <div className="w-3 h-3 rounded-full bg-[#111] border border-neutral-600 shadow-sm absolute top-3 right-1 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-400/60" />
                </div>
                <div className="w-1 h-1 rounded-full bg-amber-200 absolute top-1.5 right-1.5" />
                <div className="w-1 h-1 rounded-full bg-black/60 absolute bottom-1.5 right-2" />
              </div>
            )}

            {/* SAMSUNG: Floating Vertical Camera Lenses */}
            {isSamsung && (
              <div className="flex flex-col gap-1 pl-1 pt-0.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#111] border-[1.5px] border-neutral-400/80 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                  </div>
                ))}
                {name.includes('Ultra') && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-400 ml-0.5" />
                )}
              </div>
            )}

            {/* HONOR (Honor X9b): Iconic Central Matrix Star Ring */}
            {isHonor && (
              <div className="mx-auto mt-1 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#171717] border border-amber-300/40 relative flex items-center justify-center">
                  {/* Central accent badge */}
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-amber-300">108M</span>
                  </div>
                  {/* 4 Lenses in circular orbit */}
                  <div className="w-2 h-2 rounded-full bg-black border border-neutral-500 absolute top-0.5" />
                  <div className="w-2 h-2 rounded-full bg-black border border-neutral-500 absolute bottom-0.5" />
                  <div className="w-2 h-2 rounded-full bg-black border border-neutral-500 absolute left-0.5" />
                  <div className="w-2 h-2 rounded-full bg-black border border-neutral-500 absolute right-0.5" />
                </div>
              </div>
            )}

            {/* GOOGLE PIXEL: Horizontal Visor Camera Bar */}
            {isGoogle && (
              <div className="w-full h-4 rounded-full bg-neutral-900 border border-neutral-600/80 shadow-md flex items-center px-2 gap-1.5 mt-1">
                <div className="w-4 h-2 rounded-full bg-black border border-neutral-700 flex items-center justify-around px-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-400/70" />
                  <div className="w-1 h-1 rounded-full bg-blue-400/70" />
                </div>
                <div className="w-2 h-2 rounded-full bg-black border border-neutral-700 ml-auto" />
              </div>
            )}

            {/* VIVO / ONEPLUS: Large Circular Ring Camera */}
            {(isVivo || isOnePlus) && !isHonor && (
              <div className="w-10 h-10 rounded-full bg-[#1A1A1D] border-2 border-neutral-400/50 p-1 shadow-md ml-0.5 mt-0.5 relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-black border border-neutral-600 absolute top-1 left-1" />
                <div className="w-3 h-3 rounded-full bg-black border border-neutral-600 absolute bottom-1 left-1" />
                <div className="w-3 h-3 rounded-full bg-black border border-neutral-600 absolute top-1 right-1" />
                <span className="text-[5px] font-mono text-neutral-400 absolute bottom-1 right-1 font-bold">ZEISS</span>
              </div>
            )}

            {/* REALME / XIAOMI / OTHERS: Square Matrix Halo */}
            {!isApple && !isSamsung && !isHonor && !isGoogle && !isVivo && !isOnePlus && (
              <div className="w-9 h-9 rounded-xl bg-[#1C1D22] border border-neutral-600/60 p-1 shadow-md relative">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-neutral-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-neutral-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-neutral-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Subtle Brand Logo Watermark on Back */}
          <div className="pb-1.5 text-center opacity-40">
            {isApple ? (
              <span className="text-[8px] font-black tracking-widest text-white"></span>
            ) : isSamsung ? (
              <span className="text-[6px] font-extrabold tracking-wider text-white">SAMSUNG</span>
            ) : isHonor ? (
              <span className="text-[6px] font-extrabold tracking-widest text-amber-200">HONOR</span>
            ) : isGoogle ? (
              <span className="text-[7px] font-black text-white">G</span>
            ) : isXiaomi ? (
              <span className="text-[6px] font-black tracking-widest text-white">MI</span>
            ) : (
              <span className="text-[5px] font-bold tracking-widest uppercase text-white truncate px-1 block">
                {product.brand}
              </span>
            )}
          </div>
        </div>

        {/* ========================================================
            2. FRONT OF PHONE (OLDI TOMONI - EKRAN - RIGHT)
           ======================================================== */}
        <div className="absolute right-3 sm:right-4 top-0 w-20 sm:w-22 h-38 sm:h-42 rounded-[22px] bg-black p-[2.5px] shadow-[0_16px_32px_rgba(0,0,0,0.35)] border border-neutral-800 z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          {/* Bezel & AMOLED Screen */}
          <div className={`w-full h-full rounded-[19px] bg-gradient-to-b ${screenGradient} relative overflow-hidden flex flex-col justify-between p-1.5`}>
            
            {/* Glass Glare / Gloss highlight */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

            {/* Top Notch / Dynamic Island / Punch Hole */}
            <div className="relative z-10 flex items-center justify-between text-[6px] font-mono opacity-80 pt-0.5 px-0.5 text-white">
              <span>09:41</span>
              {isApple ? (
                /* Dynamic Island */
                <div className="w-5 h-1.5 bg-black rounded-full border border-white/10 shadow-xs flex items-center justify-end pr-0.5">
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-500" />
                </div>
              ) : (
                /* Centered Punch-Hole Camera */
                <div className="w-1.5 h-1.5 rounded-full bg-black border border-white/20 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
                </div>
              )}
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1 border border-white rounded-[1px]" />
              </div>
            </div>

            {/* Center Lockscreen / Wallpaper Typography */}
            <div className="my-auto text-center z-10 px-1 py-1">
              <span className="text-[8px] sm:text-[9px] font-black tracking-tight block leading-tight drop-shadow-md">
                {name.replace('Samsung ', '').replace('Apple ', '').replace('Xiaomi ', '')}
              </span>
              <span className="text-[5.5px] uppercase font-bold tracking-widest opacity-75 mt-0.5 block">
                {product.storage} • {product.ram}
              </span>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="z-10 pb-0.5 flex justify-center">
              <div className="w-7 h-0.5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

