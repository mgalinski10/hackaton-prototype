"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, surname: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: (User & { password: string })[] = [
  { id: "u1", name: "Jan", surname: "Kowalski", email: "jan@example.com", password: "haslo123", role: "USER" },
  { id: "u2", name: "Anna", surname: "Wolontariusz", email: "anna@example.com", password: "haslo123", role: "VOLUNTEER" },
  { id: "u3", name: "Admin", surname: "Fundacji", email: "admin@animalhelper.pl", password: "admin123", role: "ADMIN" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...u } = found;
      setUser(u);
      return true;
    }
    return false;
  };

  const register = async (name: string, surname: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: `u-${Date.now()}`, name, surname, email, role: "USER" });
    return true;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
