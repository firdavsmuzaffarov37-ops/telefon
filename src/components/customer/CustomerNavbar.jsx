import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  ShoppingCart, 
  Search, 
  User, 
  Package, 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { useApp } from '../../context/AppContext';

export default function CustomerNavbar() {
  const { cartCount } = useCustomer();
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Bosh Sahifa', path: '/shop' },
    { name: 'Smartfonlar', path: '/shop/catalog' },
    { name: 'Chegirmalar', path: '/shop/deals' },
    { name: 'Buyurtmalarim', path: '/shop/orders' },
    { name: 'Profilim', path: '/shop/profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-[#EAEAEA] dark:border-[#27282E] transition-colors">
      {/* Top Banner (Free delivery & Guarantee) */}
      <div className="bg-[#171717] dark:bg-black text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
        <span>Barcha smartfonlarga <strong>1 Yillik Rasmiy Kafolat</strong> va butun O'zbekiston bo'ylab <strong>Bepul Yetkazib Berish</strong>!</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand Logo (Avenix Hub / PhoneLytics Store style) */}
        <NavLink to="/shop" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/10 p-0.5 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="PhoneLytics" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
              Phone<span className="text-[#FF7900]">Lytics</span>
            </span>
            <span className="text-[10px] text-[#888888] font-semibold -mt-1 tracking-wider uppercase">
              Rasmiy Do'kon
            </span>
          </div>
        </NavLink>

        {/* Center: Clean Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#555] dark:text-[#A1A1AA]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`transition hover:text-[#FF7900] relative py-1 ${
                  isActive ? 'text-[#171717] dark:text-white font-bold' : ''
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7900] rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Search, Cart, Theme & Employee Panel Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:block w-52">
            <input
              type="text"
              placeholder="Smartfon qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#1E1F24] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
            />
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] flex items-center justify-center text-[#171717] dark:text-white transition cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
            title={theme === 'dark' ? "Kunduzgi rejim" : "Tungi rejim"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#171717]" />
            )}
          </button>

          {/* Cart Button with Count Badge */}
          <NavLink
            to="/shop/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="Savatcha"
          >
            <ShoppingCart className="w-4 h-4 text-[#171717] dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF7900] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* User Profile Shortcut */}
          <NavLink
            to="/shop/profile"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-[#171717] dark:text-white cursor-pointer"
            title="Mening Profilim"
          >
            <User className="w-4 h-4" />
          </NavLink>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] flex items-center justify-center text-[#171717] dark:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#121316] p-4 space-y-3 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Smartfon qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#1E1F24] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171717] dark:text-white placeholder:text-[#888888]"
            />
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-1.5 pt-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#171717] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

