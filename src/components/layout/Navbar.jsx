import React, { useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Smartphone, 
  ShoppingCart, 
  FileText, 
  History, 
  Bell, 
  MessageSquare, 
  Settings, 
  ChevronDown,
  Sparkles,
  Menu,
  X,
  LogOut,
  Camera,
  Sun,
  Moon,
  Receipt,
  Briefcase,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

export default function Navbar({ onOpenAI }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, getTodayStats, theme, toggleTheme } = useApp();
  const { user, logout, updateUserAvatar, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const stats = getTodayStats();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const navItems = [
    { name: t('navDashboard'), path: '/dashboard', icon: LayoutGrid },
    { name: t('navInventory'), path: '/', icon: Smartphone, hasDropdown: true },
    { name: t('navPOS'), path: '/pos', icon: ShoppingCart },
    { name: t('navReports'), path: '/reports', icon: FileText },
    { name: t('navHistory'), path: '/history', icon: History },
    { name: 'Xarajatlar', path: '/expenses', icon: Receipt },
  ];

  // Dynamic Avatar computation
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.email || 'User')}&background=171717&color=FF7900&bold=true&size=128`;

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl && updateUserAvatar) {
        updateUserAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] px-4 md:px-8 py-3">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Ishchi Paneli Badge */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-black/5 p-0.5 border border-black/10 shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="PhoneLytics Icon"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#171717] font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                  Phone<span className="text-[#FF7900]">Lytics</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF7900] text-white px-2 py-0.5 rounded-full shadow-sm hidden sm:inline-block">
                  Ishchi Paneli
                </span>
              </div>
              <span className="text-[10px] text-[#888888] font-semibold -mt-0.5 hidden xl:block">
                Magazin Xodimi Boshqaruvi
              </span>
            </div>
          </NavLink>
        </div>

        {/* Center: Reference-Inspired Pill Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center bg-[#F5F5F4] p-1 rounded-2xl border border-[#EAEAEA]/80 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-white' : 'text-[#888888]'}`} />
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 ml-0.5 opacity-70 ${isActive ? 'text-white' : 'text-[#888888]'}`} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 xl:gap-2.5">
          {/* Switch to Customer Online Store */}
          <NavLink
            to="/shop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
            title="Mijozlar uchun mo'ljallangan internet-do'kon vitrinasiga o'tish"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mijoz Do'koni</span>
          </NavLink>

          {/* Language Switcher */}
          <LanguageSelector />

          {/* Theme Toggle Button: Tungi (Dark) va Kunduzgi (Light) Rejim */}
          <button
            onClick={toggleTheme}
            className="w-8.5 h-8.5 xl:w-9 xl:h-9 rounded-xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 flex items-center justify-center text-[#171717] transition cursor-pointer shadow-sm active:scale-95"
            title={theme === 'dark' ? "Kunduzgi rejimga o'tish (Light Mode)" : "Tungi rejimga o'tish (Dark Mode)"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400 animate-in spin-in-180" />
            ) : (
              <Moon className="w-4 h-4 text-[#171717] animate-in spin-in-90" />
            )}
          </button>

          {/* AI Insights Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/70 text-[#FF7900] text-xs font-bold transition cursor-pointer whitespace-nowrap"
            title="AI Maslahatchi"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
            <span className="hidden 2xl:inline">{t('navAI')}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 flex items-center justify-center text-[#666666] hover:text-[#171717] transition relative cursor-pointer"
              title="Do'kon Bildirishnomalari"
            >
              <Bell className="w-4 h-4" />
              {stats.lowStockCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF7900] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EAEAEA] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
                  <h4 className="text-sm font-semibold text-[#171717]">Do'kon Bildirishnomalari</h4>
                  <span className="text-xs bg-orange-50 text-[#FF7900] font-medium px-2 py-0.5 rounded-full">
                    {stats.lowStockCount} ta
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {stats.lowStockCount > 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                      <p className="font-semibold text-amber-900">{t('lowStockWarning')}</p>
                      <p className="text-amber-700 mt-0.5">
                        {stats.lowStockCount} ta smartfon modeli chegaradan ({settings.lowStockThreshold} dona) past. Omborni to'ldiring!
                      </p>
                    </div>
                  ) : null}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                    <p className="font-semibold text-emerald-900">Bugungi Savdolar</p>
                    <p className="text-emerald-700 mt-0.5">
                      Bugun {stats.phonesSoldToday} ta smartfon sotildi. Tushum va foyda a'lo darajada!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Link */}
          <NavLink
            to="/settings"
            className={`w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 flex items-center justify-center transition ${
              location.pathname === '/settings' ? 'text-[#FF7900] border-orange-300' : 'text-[#666666] hover:text-[#171717]'
            }`}
            title={t('navSettings')}
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative pl-1">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt={user?.fullName || "User"}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF7900]/30 group-hover:ring-[#FF7900] transition shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.email || 'User')}&background=171717&color=FF7900&bold=true`;
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EAEAEA] py-2 z-40 animate-in fade-in">
                      <div className="px-4 py-3 border-b border-[#F0F0F0] flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt={user?.fullName || "User"}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FF7900]/40 flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.email || 'User')}&background=171717&color=FF7900&bold=true`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#171717] truncate">{user?.fullName || 'Foydalanuvchi'}</p>
                          <p className="text-[11px] text-[#888888] truncate">{user?.email || 'admin@phonelytics.uz'}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold bg-orange-50 text-[#FF7900] px-2 py-0.5 rounded-full">
                            {user?.role || 'Do\'kon Boshqaruvchisi'}
                          </span>
                        </div>
                      </div>

                      {/* Change Profile Photo Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2 text-xs font-medium text-[#FF7900] hover:bg-orange-50 flex items-center gap-2 cursor-pointer transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Rasmni almashtirish (Fayl yuklash)</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <NavLink
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="px-4 py-2 text-xs font-medium text-[#171717] hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#888888]" />
                        <span>{t('navSettings')}</span>
                      </NavLink>

                      <div className="border-t border-[#F0F0F0] my-1" />

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full px-4 py-2 text-xs font-medium text-[#E5484D] hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <NavLink
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-neutral-800 transition"
              >
                {t('navLogin')}
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white flex items-center justify-center text-[#171717] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#EAEAEA] flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-[#171717] text-white' : 'text-[#666666] hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#FF7900] text-white mt-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mijoz Do'koniga O'tish</span>
          </NavLink>
        </div>
      )}

      {/* Mobile Bottom Tab Bar (Smartfonlar uchun qulay pastki menyu) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] flex items-center justify-around py-1.5 px-1 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                isActive
                  ? 'text-[#FF7900]'
                  : 'text-[#888888] hover:text-[#171717]'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${isActive ? 'bg-orange-50 text-[#FF7900]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[65px]">{item.name.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
