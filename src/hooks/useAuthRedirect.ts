import { useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { isSuccessMessage } from "@/types/messages";

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
  const hasExecuted = useRef(false);

  useEffect(() => {
    console.info("useAuthRedirect - successMessage:", successMessage);
    console.info("useAuthRedirect - hasExecuted:", hasExecuted.current);

    // 成功メッセージで、かつまだ実行されていない場合のみ実行
    if (
      successMessage &&
      isSuccessMessage(successMessage) &&
      !hasExecuted.current
    ) {
      console.info("useAuthRedirect - 実行開始");
      hasExecuted.current = true;

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

            console.info("redirectUrl:", redirectUrl);

            // リダイレクト実行
            router.push(redirectUrl);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          hasExecuted.current = false; // エラー時はフラグをリセット
        }
      };

      fetchUserAndLogin();
    }
  }, [successMessage, login, router, redirectPath, redirectMessage]);
};
