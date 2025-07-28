// src/components/AuthProvider.tsx
"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: { isLoggedIn: boolean; user: User | null };
}): React.ReactNode => {
  const [auth, setAuth] = useState(initialAuth);
  const router = useRouter();

  const login = (user: User): void => {
    setAuth({ isLoggedIn: true, user });
  };

  const logout = async (): Promise<void> => {
    try {
      // サーバーサイドでcookieを削除
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // クライアントサイドで状態を更新
    setAuth({ isLoggedIn: false, user: null });

    // ホームページにリダイレクト
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
