"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

// -------------------------
// TYPES
// -------------------------
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// -------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes ONLY in browser
  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized (SSR mode)");
      return;
    }

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // -------------------------
  // LOGOUT (Safe)
  // -------------------------
  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// -------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};
