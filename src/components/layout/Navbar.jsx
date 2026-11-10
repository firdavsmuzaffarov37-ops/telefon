import React, { useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Smartphone, 
  ShoppingCart, 
  FileText, 
  History, 
  Bell, 
  Settings, 
  ChevronDown,
  Sparkles,
  Menu,
  X,
  LogOut,
  Camera,
  Sun,
  Moon,
  Receipt
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

  // Responsive Navigation Items (Never overflows on notebooks/laptops)
  const navItems = [
    { 
      id: 'dashboard',
      path: '/dashboard', 
      icon: LayoutGrid,
      label: t('navDashboard'),
      renderName: () => <span>{t('navDashboard')}</span>
    },
    { 
      id: 'inventory',
      path: '/', 
      icon: Smartphone, 
      hasDropdown: true,
      label: t('navInventory'),
      renderName: () => (
        <span>
          <span className="hidden 2xl:inline">Smartfonlar </span>Ombor
        </span>
      )
    },
    { 
      id: 'pos',
      path: '/pos', 
      icon: ShoppingCart,
      label: t('navPOS'),
      renderName: () => (
        <span>
          <span className="hidden xl:inline">Savdo / </span>POS
        </span>
      )
    },
    { 
      id: 'reports',
      path: '/reports', 
      icon: FileText,
      label: t('navReports'),
      renderName: () => <span>{t('navReports')}</span>
    },
    { 
      id: 'history',
      path: '/history', 
      icon: History,
      label: t('navHistory'),
      renderName: () => (
        <span>
          <span className="hidden 2xl:inline">Savdo </span>Tarixi
        </span>
      )
    },
    { 
      id: 'expenses',
      path: '/expenses', 
      icon: Receipt,
      label: 'Xarajatlar',
      renderName: () => <span>Xarajatlar</span>
    },
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-[#EAEAEA] dark:border-[#27282E] px-3 sm:px-6 2xl:px-8 py-2.5 xl:py-3 transition-colors">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2 lg:gap-3 xl:gap-6 min-w-0">
        
        {/* Left: Clean Brand Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/10 p-0.5 border border-black/10 dark:border-white/10 shadow-xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="PhoneLytics"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
              Phone<span className="text-[#FF7900]">Lytics</span>
            </span>
          </NavLink>
        </div>

        {/* Center: Reference-Inspired Pill Navigation (Optimized to never squish on laptop screens) */}
        <nav className="hidden lg:flex items-center bg-[#F5F5F4] dark:bg-[#1C1D22] p-1 xl:p-1.5 rounded-2xl border border-[#EAEAEA]/80 dark:border-[#27282E] shadow-inner gap-0.5 xl:gap-1 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm font-bold'
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#25262C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-white dark:text-[#171717]' : 'text-[#888888] dark:text-[#71717A]'}`} />
                {item.renderName()}
                {item.hasDropdown && (
                  <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 ml-0.5 opacity-70 ${isActive ? 'text-white dark:text-[#171717]' : 'text-[#888888] dark:text-[#71717A]'}`} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions: Clean, Relaxed & Well-Spaced (Guaranteed safe margins, never clips) */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 flex-shrink-0">
          {/* Language Switcher */}
          <LanguageSelector />

          {/* Theme Toggle Button: Tungi (Dark) va Kunduzgi (Light) Rejim */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-[#25262C] flex items-center justify-center text-[#171717] dark:text-white transition cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
            title={theme === 'dark' ? "Kunduzgi rejimga o'tish (Light Mode)" : "Tungi rejimga o'tish (Dark Mode)"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#171717] animate-in spin-in-90 duration-300" />
            )}
          </button>

          {/* AI Insights Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/80 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-[#FF7900] text-xs font-bold transition cursor-pointer whitespace-nowrap shadow-xs flex-shrink-0"
            title="AI Maslahatchi"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
            <span className="hidden sm:inline">
              <span className="hidden 2xl:inline">AI </span>Maslahatchi
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-[#25262C] flex items-center justify-center text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white transition relative cursor-pointer"
              title="Do'kon Bildirishnomalari"
            >
              <Bell className="w-4 h-4" />
              {stats.lowStockCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7900] ring-2 ring-white dark:ring-[#1C1D22] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#18191D] rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-[#27282E] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA] dark:border-[#27282E]">
                  <h4 className="text-sm font-semibold text-[#171717] dark:text-white">Do'kon Bildirishnomalari</h4>
                  <span className="text-xs bg-orange-50 dark:bg-orange-500/10 text-[#FF7900] font-medium px-2 py-0.5 rounded-full">
                    {stats.lowStockCount} ta
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {stats.lowStockCount > 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 text-xs">
                      <p className="font-semibold text-amber-900 dark:text-amber-400">{t('lowStockWarning')}</p>
                      <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                        {stats.lowStockCount} ta smartfon modeli chegaradan ({settings.lowStockThreshold} dona) past. Omborni to'ldiring!
                      </p>
                    </div>
                  ) : null}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-xs">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-400">Bugungi Savdolar</p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
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
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-[#25262C] flex items-center justify-center transition flex-shrink-0 ${
              location.pathname === '/settings' 
                ? 'text-[#FF7900] border-orange-300 dark:border-orange-500/50' 
                : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white'
            }`}
            title={t('navSettings')}
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative pl-0.5 sm:pl-1 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group cursor-pointer"
                  title={user?.fullName || "Foydalanuvchi"}
                >
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt={user?.fullName || "User"}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-[#FF7900]/30 group-hover:ring-[#FF7900] transition shadow-xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.email || 'User')}&background=171717&color=FF7900&bold=true`;
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#121316]" />
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#18191D] rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-[#27282E] py-2 z-40 animate-in fade-in">
                      <div className="px-4 py-3 border-b border-[#F0F0F0] dark:border-[#27282E] flex items-center gap-3">
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
                          <p className="text-xs font-bold text-[#171717] dark:text-white truncate">{user?.fullName || 'Foydalanuvchi'}</p>
                          <p className="text-[11px] text-[#888888] truncate">{user?.email || 'admin@phonelytics.uz'}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold bg-orange-50 dark:bg-orange-500/10 text-[#FF7900] px-2 py-0.5 rounded-full">
                            {user?.role || 'Do\'kon Boshqaruvchisi'}
                          </span>
                        </div>
                      </div>

                      {/* Change Profile Photo Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2 text-xs font-medium text-[#FF7900] hover:bg-orange-50 dark:hover:bg-orange-500/10 flex items-center gap-2 cursor-pointer transition"
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
                        className="px-4 py-2 text-xs font-medium text-[#171717] dark:text-white hover:bg-neutral-50 dark:hover:bg-[#25262C] flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#888888]" />
                        <span>{t('navSettings')}</span>
                      </NavLink>

                      <div className="border-t border-[#F0F0F0] dark:border-[#27282E] my-1" />

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full px-4 py-2 text-xs font-medium text-[#E5484D] hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 text-left cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition whitespace-nowrap shadow-xs"
              >
                {t('navLogin')}
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] flex items-center justify-center text-[#171717] dark:text-white cursor-pointer flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#EAEAEA] dark:border-[#27282E] flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive 
                    ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold' 
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:bg-neutral-100 dark:hover:bg-[#1E1F24]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Tab Bar (Smartfonlar uchun qulay pastki menyu) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md border-t border-[#EAEAEA] dark:border-[#27282E] flex items-center justify-around py-1.5 px-1 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                isActive
                  ? 'text-[#FF7900]'
                  : 'text-[#888888] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${isActive ? 'bg-orange-50 dark:bg-orange-500/10 text-[#FF7900]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[65px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}