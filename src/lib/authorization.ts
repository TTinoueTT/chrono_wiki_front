// 認証状態チェック用のライブラリ
import { cookies } from "next/headers";
import { getAccessTokenFromCookie } from "./session";
import { fetchUserProfile } from "./api/auth";
import { User } from "@/types/user";

/**
 * 簡易的なログイン状態判定（Cookie存在チェックのみ）
 * パフォーマンス重視の場合に使用
 */
export const isLoggedInSimple = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return !!cookieStore.get("access_token");
};

/**
 * 堅牢なログイン状態判定（トークン有効性チェック）
 * セキュリティ重視の場合に使用
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessTokenFromCookie();
    return !!accessToken;
  } catch (error) {
    // トークンの復号化に失敗した場合
    console.error("Token validation failed:", error);
    return false;
  }
};

/**
 * ユーザー情報付きのログイン状態判定
 * プロフィールページなどで使用
 */
export const getAuthStatus = async (): Promise<{
  isLoggedIn: boolean;
  user: User | null;
}> => {
  try {
    const accessToken = await getAccessTokenFromCookie();
    if (!accessToken) {
      return { isLoggedIn: false, user: null };
    }

    // ユーザー情報を取得
    const user = await fetchUserProfile();

    return {
      isLoggedIn: !!user,
      user,
    };
  } catch (error) {
    console.error("Auth status check failed:", error);
    return { isLoggedIn: false, user: null };
  }
};
