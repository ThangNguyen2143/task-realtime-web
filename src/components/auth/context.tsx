"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { tokenStorage } from "@/lib/api/token-storage";
import { AuthContextType, User } from "@/features/auth/types";
import { getMeApi } from "@/features/auth/api";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextValue = AuthContextType & {
  isHydrating: boolean;
};

const USER_STORAGE_KEY = "auth_user";

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const storedUser = getStoredUser();

    setAccessToken(token);
    setUser(storedUser);

    const hydrateAuth = async () => {
      if (!token) {
        setIsHydrating(false);
        return;
      }

      try {
        const me = await getMeApi();

        setUser(me.value);
        setStoredUser(me.value);
      } catch (error) {
        console.error("Hydrate auth failed:", error);
        setUser(null);
        setAccessToken(null);
        setStoredUser(null);
        tokenStorage.removeAccessToken();
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateAuth();
  }, []);

  const setAuth = ({
    user,
    accessToken,
  }: {
    user: User;
    accessToken: string;
  }) => {
    setUser(user);
    setAccessToken(accessToken);
    setStoredUser(user);
    tokenStorage.setAccessToken(accessToken);
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setStoredUser(null);
    tokenStorage.removeAccessToken();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      isHydrating,
      setAuth,
      clearAuth,
    }),
    [user, accessToken, isHydrating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
