import { createContext } from "react";
import type { User, AuthData } from "@/types";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (authData: AuthData) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
