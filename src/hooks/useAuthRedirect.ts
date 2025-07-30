import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface UseAuthRedirectProps {
  successMessage: string;
  redirectPath: string;
  redirectMessage?: string;
}

export const useAuthRedirect = ({
  successMessage,
  redirectPath,
  redirectMessage,
}: UseAuthRedirectProps) => {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (successMessage) {
      // ユーザー情報を取得してAuthProviderの状態を更新
      const fetchUserAndLogin = async () => {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const user = await response.json();
            login(user);

            // リダイレクトパスにメッセージを追加
            const redirectUrl = redirectMessage
              ? `${redirectPath}?message=${redirectMessage}`
              : redirectPath;

            router.push(redirectUrl);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUserAndLogin();
    }
  }, [successMessage, login, router, redirectPath, redirectMessage]);
};
