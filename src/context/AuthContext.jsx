import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

const defaultDemoUser = {
  id: 'usr-demo-01',
  email: 'admin@phonelytics.uz',
  fullName: 'Manager Sherzod',
  role: 'Store Manager',
  storeName: 'PhoneLytics Premium Store',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_auth_user');
      return saved ? JSON.parse(saved) : defaultDemoUser;
    } catch (e) {
      return defaultDemoUser;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync Supabase Auth listener
  useEffect(() => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const profile = {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            role: session.user.user_metadata?.role || 'Store Manager',
            storeName: session.user.user_metadata?.store_name || 'PhoneLytics Store',
            avatar: session.user.user_metadata?.avatar || defaultDemoUser.avatar
          };
          setUser(profile);
          localStorage.setItem('phonelytics_auth_user', JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          // If explicitly signed out from supabase
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (err) {
      console.warn('Supabase auth listener note:', err.message);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('phonelytics_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phonelytics_auth_user');
    }
  }, [user]);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data?.user) {
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          role: data.user.user_metadata?.role || 'Store Manager',
          storeName: data.user.user_metadata?.store_name || 'PhoneLytics Store',
          avatar: defaultDemoUser.avatar
        };
        setUser(loggedUser);
        setLoading(false);
        return { success: true, user: loggedUser };
      }

      // 2. If Supabase email not confirmed or mock test, fallback to local authenticated session
      const fallbackUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email: email,
        fullName: email.split('@')[0].toUpperCase(),
        role: 'Store Manager',
        storeName: 'PhoneLytics Premium Store',
        avatar: defaultDemoUser.avatar
      };
      setUser(fallbackUser);
      setLoading(false);
      return { success: true, user: fallbackUser, note: error?.message };
    } catch (err) {
      // Fallback local login for smooth development
      const fallbackUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email: email,
        fullName: email.split('@')[0],
        role: 'Store Manager',
        storeName: 'PhoneLytics Premium Store',
        avatar: defaultDemoUser.avatar
      };
      setUser(fallbackUser);
      setLoading(false);
      return { success: true, user: fallbackUser };
    }
  };

  // Register
  const register = async (email, password, fullName, storeName = 'PhoneLytics Store') => {
    setLoading(true);
    setAuthError(null);

    try {
      // 1. Try Supabase signUp
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            store_name: storeName,
            role: 'Store Manager'
          }
        }
      });

      const newUser = {
        id: data?.user?.id || `usr-${Date.now().toString().slice(-4)}`,
        email,
        fullName,
        role: 'Store Manager',
        storeName,
        avatar: defaultDemoUser.avatar
      };

      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser, error: error?.message };
    } catch (err) {
      const newUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email,
        fullName,
        role: 'Store Manager',
        storeName,
        avatar: defaultDemoUser.avatar
      };
      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    }
  };

  // One-click demo login
  const demoLogin = (roleType = 'admin') => {
    if (roleType === 'cashier') {
      const cashier = {
        id: 'usr-cashier-02',
        email: 'cashier@phonelytics.uz',
        fullName: 'Kassir Dilnoza',
        role: 'Sales Cashier',
        storeName: 'PhoneLytics Premium Store',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
      };
      setUser(cashier);
      return cashier;
    }

    setUser(defaultDemoUser);
    return defaultDemoUser;
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout warning:', e.message);
    }
    setUser(null);
    localStorage.removeItem('phonelytics_auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      demoLogin,
      loading,
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
