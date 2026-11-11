import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Employee Panel Components
import Navbar from './components/layout/Navbar';
import InventoryPage from './components/inventory/InventoryPage';
import DashboardPage from './components/dashboard/DashboardPage';
import POSPage from './components/pos/POSPage';
import DailyReportsPage from './components/reports/DailyReportsPage';
import SalesHistoryPage from './components/sales/SalesHistoryPage';
import ExpensesPage from './components/expenses/ExpensesPage';
import SettingsPage from './components/settings/SettingsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AIInsightsPanel from './components/ai/AIInsightsPanel';
import Toast from './components/common/Toast';

// Customer Storefront Components
import CustomerNavbar from './components/customer/CustomerNavbar';
import CustomerHomePage from './components/customer/CustomerHomePage';
import CustomerCatalogPage from './components/customer/CustomerCatalogPage';
import CustomerProductDetailPage from './components/customer/CustomerProductDetailPage';
import CustomerCartPage from './components/customer/CustomerCartPage';
import CustomerOrdersPage from './components/customer/CustomerOrdersPage';
import CustomerProfilePage from './components/customer/CustomerProfilePage';
import CustomerDealsPage from './components/customer/CustomerDealsPage';

// Context Providers
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CustomerProvider } from './context/CustomerContext';

// Himoyalangan yo'llar (Faqat tizimga kirgan xodimlar uchun)
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Kirish/Ro'yxatdan o'tish yo'li (Agar allaqachon kirgan bo'lsa, asosiy panelga yo'naltiradi)
function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const location = useLocation();
  const isCustomerPortal = location.pathname.startsWith('/shop');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#F5F5F4] dark:bg-[#0E0F12] flex flex-col text-[#171717] dark:text-[#F4F4F6] font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* Dynamic Navigation Bar: Hidden on Login/Register pages */}
      {!isAuthPage && (
        isCustomerPortal ? (
          <CustomerNavbar />
        ) : (
          <Navbar onOpenAI={() => setIsAIOpen(true)} />
        )
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${isAuthPage ? '' : 'pb-24 sm:pb-16'}`}>
        <Routes>
          {/* Employee Management Routes (Protected: First visit forces Login) */}
          <Route path="/" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><DailyReportsPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SalesHistoryPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

          {/* Customer Online Store Routes */}
          <Route path="/shop" element={<CustomerHomePage />} />
          <Route path="/shop/catalog" element={<CustomerCatalogPage />} />
          <Route path="/shop/product/:id" element={<CustomerProductDetailPage />} />
          <Route path="/shop/cart" element={<CustomerCartPage />} />
          <Route path="/shop/orders" element={<CustomerOrdersPage />} />
          <Route path="/shop/profile" element={<CustomerProfilePage />} />
          <Route path="/shop/deals" element={<CustomerDealsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* AI Insights Flyout Panel (Available in Employee Panel) */}
      {!isCustomerPortal && !isAuthPage && (
        <AIInsightsPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      )}

      {/* Global Toast Notification System */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <CustomerProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </CustomerProvider>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}