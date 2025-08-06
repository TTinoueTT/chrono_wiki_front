import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./lib/api/auth";
import { AuthMessage } from "./types/messages";

// 認証が必要なパス
const protectedPaths = [
  "/profile",
  "/settings",
  "/admin",
  "/events/new",
  "/persons/new",
];

// 認証不要のパス（ログイン済みユーザーがアクセスするとリダイレクト）
const authPaths = ["/auth/login", "/auth/register"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  console.info("=== Middleware実行 ===");
  console.info("pathname:", pathname);

  // アクセストークンとリフレッシュトークンを取得
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // 保護されたパスへのアクセス
  if (isProtectedPath) {
    console.info("保護されたパスにアクセス:", pathname);

    if (!accessToken) {
      console.info("アクセストークンなし");
      if (refreshToken) {
        console.info("リフレッシュトークンあり");
        const refreshResponse = await refreshAccessToken(refreshToken);
        if (refreshResponse.ok) {
          console.info("アクセストークン更新成功");
          const { access_token, expires_in } = await refreshResponse.json();
          const response = NextResponse.next();
          response.cookies.set("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: expires_in,
            path: "/",
          });
          return response;
        }
      }
      // ログインページにリダイレクト
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("message", AuthMessage.LOGIN_REQUIRED);
      return NextResponse.redirect(loginUrl);
    }

    // アクセストークンがある場合
    console.info("アクセストークンあり、有効性をチェック");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      console.info("アクセストークン有効");
      return NextResponse.next();
    } else {
      console.info("アクセストークン無効");
      // リフレッシュトークンで更新を試行
      if (refreshToken) {
        const refreshResponse = await refreshAccessToken(refreshToken);
        if (refreshResponse.ok) {
          const { access_token, expires_in } = await refreshResponse.json();
          const response = NextResponse.next();
          response.cookies.set("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: expires_in,
            path: "/",
          });
          return response;
        }
      }
      // ログインページにリダイレクト
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("message", AuthMessage.TOKEN_EXPIRED);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 認証ページへのアクセス
  if (isAuthPath) {
    console.info("認証ページにアクセス:", pathname);
    // ログイン直後はリダイレクトしない（useAuthRedirectに任せる）
    return NextResponse.next();
  }

  // その他のパスはそのまま進む
  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (well-known files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)",
  ],
};
