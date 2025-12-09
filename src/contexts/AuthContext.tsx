import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { userStorage, sessionStorage, initializeDefaultData } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default data on first load
    initializeDefaultData();
    
    // Check for existing session
    const savedUser = sessionStorage.get();
    if (savedUser) {
      // Verify user still exists and is active
      const currentUser = userStorage.getById(savedUser.id);
      if (currentUser && currentUser.isActive) {
        setUser(currentUser);
      } else {
        sessionStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = userStorage.getByEmail(email);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    if (!foundUser.isActive) {
      return { success: false, error: 'Your account has been deactivated. Please contact support.' };
    }
    
    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    setUser(foundUser);
    sessionStorage.set(foundUser);
    
    return { success: true };
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<{ success: boolean; error?: string }> => {
    // Check if email already exists
    const existingUser = userStorage.getByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }
    
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    userStorage.add(newUser);
    setUser(newUser);
    sessionStorage.set(newUser);
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.clear();
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    userStorage.update(updatedUser);
    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
      sessionStorage.set(updatedUser);
    }
  }, [user]);

  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

