import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import InventoryPage from './components/inventory/InventoryPage';
import DashboardPage from './components/dashboard/DashboardPage';
import POSPage from './components/pos/POSPage';
import DailyReportsPage from './components/reports/DailyReportsPage';
import SalesHistoryPage from './components/sales/SalesHistoryPage';
import SettingsPage from './components/settings/SettingsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AIInsightsPanel from './components/ai/AIInsightsPanel';
import Toast from './components/common/Toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#F5F5F4] flex flex-col text-[#171717] font-['Plus_Jakarta_Sans',sans-serif]">
              {/* Top Navigation */}
              <Navbar onOpenAI={() => setIsAIOpen(true)} />

              {/* Main Routing Content */}
              <main className="flex-1 pb-16">
                <Routes>
                  <Route path="/" element={<InventoryPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/pos" element={<POSPage />} />
                  <Route path="/reports" element={<DailyReportsPage />} />
                  <Route path="/history" element={<SalesHistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* AI Insights Flyout Panel */}
              <AIInsightsPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

              {/* Global Toast System */}
              <Toast />
            </div>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

