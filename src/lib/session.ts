// セッション管理用のライブラリ
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// SECRET を Uint8Array に変換
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const isSecure =
  process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";

// JWT生成＋cookieセット
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

// Cookie から復号して中身のトークンを取り出す
export const parseSessionCookie = async (
  cookieValue: string
): Promise<string> => {
  const { payload } = await jwtVerify(cookieValue, SECRET);
  return payload.token as string;
};

export const getAccessTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;
  if (!session) return null;
  return await parseSessionCookie(session);
};
