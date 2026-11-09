import React, { useState } from 'react';
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
  Database,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

export default function Navbar({ onOpenAI }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, getTodayStats, supabaseStatus } = useApp();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const stats = getTodayStats();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { name: t('navDashboard'), path: '/dashboard', icon: LayoutGrid },
    { name: t('navInventory'), path: '/', icon: Smartphone, hasDropdown: true },
    { name: t('navPOS'), path: '/pos', icon: ShoppingCart },
    { name: t('navReports'), path: '/reports', icon: FileText },
    { name: t('navHistory'), path: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] px-4 md:px-8 py-3">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF7900] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Smartphone className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#171717] font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                Phone<span className="text-[#FF7900]">Lytics</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#888888]'}`} />
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <ChevronDown className={`w-3.5 h-3.5 ml-0.5 opacity-70 ${isActive ? 'text-white' : 'text-[#888888]'}`} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <LanguageSelector />

          {/* Supabase Connection Status Badge */}
          <NavLink
            to="/settings"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100/80 transition"
            title="Connected to Supabase PostgreSQL"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase</span>
          </NavLink>

          {/* AI Insights Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/70 text-[#FF7900] text-xs font-semibold transition"
            title="AI Business Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
            <span className="hidden sm:inline">{t('navAI')}</span>
          </button>

          {/* Quick Chat / Notes icon from screenshot */}
          <button 
            onClick={onOpenAI}
            className="w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 flex items-center justify-center text-[#666666] hover:text-[#171717] transition relative"
            title="AI Store Advice"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white hover:bg-neutral-50 flex items-center justify-center text-[#666666] hover:text-[#171717] transition relative"
              title="Store Alerts"
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
                  <h4 className="text-sm font-semibold text-[#171717]">Store Notifications</h4>
                  <span className="text-xs bg-orange-50 text-[#FF7900] font-medium px-2 py-0.5 rounded-full">
                    {stats.lowStockCount} alerts
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {stats.lowStockCount > 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                      <p className="font-semibold text-amber-900">Low Stock Warning</p>
                      <p className="text-amber-700 mt-0.5">
                        {stats.lowStockCount} smartphone models are below threshold ({settings.lowStockThreshold} units). Restock advised!
                      </p>
                    </div>
                  ) : null}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                    <p className="font-semibold text-emerald-900">Today's Sales</p>
                    <p className="text-emerald-700 mt-0.5">
                      {stats.phonesSoldToday} smartphones sold today. Gross profit looks solid!
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
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={user?.fullName || "Store Manager"}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF7900]/20 group-hover:ring-[#FF7900] transition"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EAEAEA] py-2 z-40 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-[#F0F0F0]">
                        <p className="text-xs font-bold text-[#171717] truncate">{user?.fullName || 'Manager Sherzod'}</p>
                        <p className="text-[11px] text-[#888888] truncate">{user?.email || 'admin@phonelytics.uz'}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-orange-50 text-[#FF7900] px-2 py-0.5 rounded-full">
                          {user?.role || 'Store Manager'}
                        </span>
                      </div>

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
                        className="w-full px-4 py-2 text-xs font-medium text-[#E5484D] hover:bg-red-50 flex items-center gap-2 text-left"
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
            className="lg:hidden w-9 h-9 rounded-xl border border-[#EAEAEA] bg-white flex items-center justify-center text-[#171717]"
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
        </div>
      )}
    </header>
  );
}

