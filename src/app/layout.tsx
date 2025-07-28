import React, { type ReactNode } from "react";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";
import { getAuthStatus } from "@/lib/session";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialAuth = await getAuthStatus();
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
