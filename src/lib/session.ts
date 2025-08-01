import "server-only";

// セッション管理用のライブラリ
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { fetchUserProfile } from "./api/auth";

// SECRET を Uint8Array に変換
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const isSecure =
  process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";

/**
 * セッションCookieを作成する
 * @param param0 セッションCookieの情報
 */
export const createSessionCookie = async ({
  name,
  token,
  maxAge,
}: {
  name: string;
  token: string;
  maxAge: number;
}): Promise<void> => {
  const jwt = await new SignJWT({ token })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(SECRET);

  const cookieStore = await cookies();

  cookieStore.set(name, jwt, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: maxAge,
    path: "/",
  });
};

/**
 * Cookieから復号して中身のトークンを取り出す
 * @param cookieValue Cookieの値
 * @returns トークン
 */
export const parseSessionCookie = async (
  cookieValue: string
): Promise<string> => {
  try {
    const { payload } = await jwtVerify(cookieValue, SECRET);
    return payload.token as string;
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      console.error("JWT has expired");
    } else if (error.code === "ERR_JWT_INVALID") {
      console.error("JWT signature is invalid");
    } else if (error.code === "ERR_JWT_NOT_BEFORE") {
      console.error("JWT is not yet valid");
    }
    throw error;
  }
};

/**
 * Cookieからアクセストークンを取得する
 * @returns アクセストークン
 */
export const getAccessTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;
  if (!session) return null;
  return await parseSessionCookie(session);
};

/**
 * 堅牢なログイン状態判定（トークン有効性チェック）
 * セキュリティ重視の場合に使用
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessTokenFromCookie(); // ← ここでjwtVerify実行
    return !!accessToken;
  } catch (error) {
    // jwtVerifyでexp/iat/署名チェックが失敗した場合
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
