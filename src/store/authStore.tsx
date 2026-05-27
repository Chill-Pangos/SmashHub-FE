import React, { useState, useEffect, type ReactNode } from "react";
import type { User, AuthData, UserRoleInput } from "@/types";
import authService from "@/services/auth.service";
import { userService } from "@/services";
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

  const normalizeRoles = (roles?: UserRoleInput[]): UserRoleInput[] => {
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles
      .map((role) => {
        if (typeof role === "number") {
          return role;
        }

        if (!role || typeof role !== "object") {
          return null;
        }

        if (typeof role.id !== "number" || typeof role.name !== "string") {
          return null;
        }

        return { id: role.id, name: role.name };
      })
      .filter((role): role is UserRole => Boolean(role));
  };

  const isUnauthorized = (error: unknown): boolean => {
    if (!error || typeof error !== "object" || !("response" in error)) {
      return false;
    }

    const response = (error as { response?: { status?: number } }).response;
    return response?.status === 401;
  };

  const normalizeAuthUser = (user: User): User => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fallbackDisplayName = `${firstName} ${lastName}`.trim();
    const roles = normalizeRoles(user.roles);

    return {
      ...user,
      firstName,
      lastName,
      roles,
      username: user.username || fallbackDisplayName || user.email,
    };
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    void checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const storedUser = authService.getStoredUser();
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (!accessToken || !refreshToken) {
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      let currentUser: User | null = null;
      try {
        currentUser = await userService.getCurrentUser();
      } catch (error) {
        if (isUnauthorized(error)) {
          authService.clearAuthData();
          setAuthState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        console.error("Failed to refresh current user:", error);
      }

      const nextUser = currentUser ?? storedUser;
      if (!nextUser) {
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const normalizedUser = normalizeAuthUser(nextUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setAuthState({
        user: normalizedUser,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
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
    const normalizedAuthData: AuthData = {
      ...authData,
      user: normalizeAuthUser(authData.user),
    };

    authService.saveAuthData(normalizedAuthData);
    setAuthState({
      user: normalizedAuthData.user,
      accessToken: normalizedAuthData.accessToken,
      refreshToken: normalizedAuthData.refreshToken,
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
    const normalizedUser = normalizeAuthUser(user);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setAuthState((prev) => ({
      ...prev,
      user: normalizedUser,
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
