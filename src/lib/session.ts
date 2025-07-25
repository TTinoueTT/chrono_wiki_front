import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// SECRET を Uint8Array に変換
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const isSecure =
  process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";

// JWT生成＋cookieセット
export async function createSessionCookie({
  name,
  token,
  maxAge,
}: {
  name: string;
  token: string;
  maxAge: number;
}) {
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
}

// Cookie から復号して中身のトークンを取り出す
export async function parseSessionCookie(cookieValue: string): Promise<string> {
  const { payload } = await jwtVerify(cookieValue, SECRET);
  return payload.token as string;
}
