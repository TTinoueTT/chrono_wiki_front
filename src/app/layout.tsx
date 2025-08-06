import React, { type ReactNode } from "react";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";
import { cookies } from "next/headers";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // 軽量な認証チェック（API呼び出しなし）
  const initialAuth = {
    isLoggedIn: !!accessToken,
    user: null,
  };

  return (
    <html lang="ja">
      <body>
        <AuthProvider initialAuth={initialAuth}>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
