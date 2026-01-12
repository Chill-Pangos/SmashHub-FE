import React, { useState, useEffect, type ReactNode } from "react";
import type { User, AuthData } from "@/types";
import authService from "@/services/auth.service";
import {
  AuthContext,
  type AuthState,
  type AuthContextType,
} from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const user = authService.getStoredUser();
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (user && accessToken && refreshToken) {
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = (authData: AuthData) => {
    authService.saveAuthData(authData);
    setAuthState({
      user: authData.user,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    authService.clearAuthData();
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  };

  const updateTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuthState((prev) => ({
      ...prev,
      accessToken,
      refreshToken,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    updateTokens,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
