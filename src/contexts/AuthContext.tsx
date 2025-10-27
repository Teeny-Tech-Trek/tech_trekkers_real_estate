// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useAtom } from 'jotai';
import { authAtom, setAuthAtom, setAuthLoadingAtom } from '../atoms/authAtom';
import { AuthContextType } from '../types/auth';
import { signup, login, logout, refresh } from '../services/api';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useAtom(setAuthAtom);
  const [, setLoading] = useAtom(setAuthLoadingAtom);
  const [state] = useAtom(authAtom);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed.tokens?.refreshToken) {
          try {
            const data = await refresh(parsed.tokens.refreshToken);
            setAuth({ user: data.user, tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken } });
          } catch (error) {
            setAuth({ user: null, tokens: null });
            localStorage.removeItem('auth');
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [setAuth, setLoading]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setAuth({ user: data.user, tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken } });
      toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await signup(data);
      setAuth({ user: response.user, tokens: { accessToken: response.accessToken, refreshToken: response.refreshToken } });
      toast({ title: 'Account created!', description: 'Welcome to Virtual Sales Platform.' });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.message || 'Please check your information and try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setAuth({ user: null, tokens: null });
      localStorage.removeItem('auth');
      toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.response?.data?.message || 'An error occurred while logging out.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { tokens } = state;
      if (tokens?.refreshToken) {
        const data = await refresh(tokens.refreshToken);
        setAuth({ user: data.user, tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken } });
      }
    } catch (error) {
      setAuth({ user: null, tokens: null });
      localStorage.removeItem('auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login: handleLogin, signup: handleSignup, logout: handleLogout, refresh: handleRefresh, isLoading: state.isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};