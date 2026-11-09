import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function resolveAvatar(metadata = {}, email = '', fullName = '') {
  if (metadata?.avatar_url) return metadata.avatar_url;
  if (metadata?.picture) return metadata.picture;
  if (metadata?.avatar && !metadata.avatar.includes('photo-1534528741775-53994a69daeb')) {
    return metadata.avatar;
  }
  const name = fullName || metadata?.full_name || email?.split('@')[0] || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=171717&color=FF7900&bold=true&size=128`;
}

const defaultDemoUser = {
  id: 'usr-demo-01',
  email: 'admin@phonelytics.uz',
  fullName: 'Manager Sherzod',
  role: 'Store Manager',
  storeName: 'PhoneLytics Premium Store',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('phonelytics_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the saved user has the old unwanted photo and is a custom email, fix it
        if (parsed.avatar?.includes('photo-1534528741775-53994a69daeb')) {
          parsed.avatar = resolveAvatar({}, parsed.email, parsed.fullName);
        }
        return parsed;
      }
      return defaultDemoUser;
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
          const meta = session.user.user_metadata || {};
          const name = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'User';
          const avatar = resolveAvatar(meta, session.user.email, name);

          const profile = {
            id: session.user.id,
            email: session.user.email,
            fullName: name,
            role: meta.role || 'Store Manager',
            storeName: meta.store_name || 'PhoneLytics Store',
            avatar: avatar
          };
          setUser(profile);
          localStorage.setItem('phonelytics_auth_user', JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          // If explicitly signed out
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

  // Update user avatar (Custom photo or upload)
  const updateUserAvatar = async (newAvatarUrl) => {
    if (!user) return;
    const updated = { ...user, avatar: newAvatarUrl };
    setUser(updated);
    localStorage.setItem('phonelytics_auth_user', JSON.stringify(updated));

    try {
      await supabase.auth.updateUser({
        data: { avatar: newAvatarUrl, avatar_url: newAvatarUrl }
      });
    } catch (e) {
      console.warn('Supabase avatar update note:', e.message);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      // 1. Try Supabase Auth signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (!error && data?.user) {
        const meta = data.user.user_metadata || {};
        const name = meta.full_name || meta.name || email.split('@')[0];
        const avatar = resolveAvatar(meta, data.user.email, name);

        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: name,
          role: meta.role || 'Store Manager',
          storeName: meta.store_name || 'PhoneLytics Store',
          avatar
        };
        setUser(loggedUser);
        setLoading(false);
        return { success: true, user: loggedUser, isNew: false };
      }

      // 2. If user doesn't exist yet in Supabase (Invalid login credentials),
      // Automatically register them in Supabase so they appear in Supabase Authentication -> Users!
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('User not found'))) {
        const name = email.split('@')[0];
        const avatar = resolveAvatar({}, email, name);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name,
              role: 'Store Manager',
              store_name: 'PhoneLytics Store',
              avatar: avatar
            }
          }
        });

        if (!signUpError && signUpData?.user) {
          const newUser = {
            id: signUpData.user.id,
            email: signUpData.user.email,
            fullName: name,
            role: 'Store Manager',
            storeName: 'PhoneLytics Store',
            avatar: avatar
          };
          setUser(newUser);
          setLoading(false);
          return { 
            success: true, 
            user: newUser, 
            isNew: true, 
            message: 'Foydalanuvchi muvaffaqiyatli yaratildi va tizimga kirildi!' 
          };
        } else if (signUpError) {
          setLoading(false);
          return { success: false, error: signUpError.message };
        }
      }

      // If other error
      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register
  const register = async (email, password, fullName, storeName = 'PhoneLytics Store') => {
    setLoading(true);
    setAuthError(null);

    try {
      const name = fullName || email.split('@')[0];
      const avatar = resolveAvatar({}, email, name);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name,
            store_name: storeName,
            role: 'Store Manager',
            avatar: avatar
          }
        }
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      const newUser = {
        id: data?.user?.id || `usr-${Date.now().toString().slice(-4)}`,
        email: email.trim(),
        fullName: name,
        role: 'Store Manager',
        storeName: storeName || 'PhoneLytics Store',
        avatar: avatar
      };

      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Sign In with Google OAuth
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
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
      signInWithGoogle,
      updateUserAvatar,
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
