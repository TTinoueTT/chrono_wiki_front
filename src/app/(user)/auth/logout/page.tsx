"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // ログアウトAPIを呼び出し
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          // ログアウト成功後、ホームページにリダイレクト
          router.push("/?message=logout-success");
        } else {
          console.error("ログアウトに失敗しました");
          router.push("/?message=logout-error");
        }
      } catch (error) {
        console.error("ログアウトエラー:", error);
        router.push("/?message=logout-error");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">ログアウト中...</h2>
          <p className="mt-2 text-gray-600">しばらくお待ちください</p>
        </div>
      </div>
    </div>
  );
}
