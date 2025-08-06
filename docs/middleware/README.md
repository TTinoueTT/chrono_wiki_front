# Middleware 認証システム実装ガイド

## 概要

Next.js 15のmiddlewareを使用した認証システムの実装について説明します。このシステムは、アクセストークンとリフレッシュトークンを使用したJWT認証を提供します。

## 主要コンポーネント

### 1. Middleware (`src/middleware.ts`)

#### 基本構造
```typescript
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // 保護されたパスへのアクセス処理
  if (isProtectedPath) {
    // 認証チェックとリダイレクト処理
  }

  // 認証ページへのアクセス処理
  if (isAuthPath) {
    // ログイン済みユーザーのリダイレクト処理
  }

  return NextResponse.next();
};
```

#### 重要な実装ポイント

1. **Cookie設定方法**
   ```typescript
   // ❌ 間違った方法（middlewareでは動作しない）
   await createSessionCookie({ name: "access_token", token: access_token, maxAge: expires_in });

   // ✅ 正しい方法
   const response = NextResponse.next();
   response.cookies.set("access_token", access_token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "lax",
     maxAge: expires_in,
     path: "/",
   });
   return response;
   ```

2. **パス設定**
   ```typescript
   // 保護されたパス
   const protectedPaths = ["/profile", "/settings", "/admin", "/events/new", "/persons/new"];
   
   // 認証ページ
   const authPaths = ["/auth/login", "/auth/register"];
   ```

3. **Matcher設定**
   ```typescript
   export const config = {
     matcher: [
       "/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)",
     ],
   };
   ```

### 2. 認証フロー

#### ログイン処理
```typescript
// 1. ログイン成功
const loginRes = await fetchLogin(email, password);
if (loginRes.ok) {
  const data = await loginRes.json();
  
  // 2. セッションCookie作成
  await createSessionCookie({
    name: "access_token",
    token: data.access_token,
    maxAge: data.expires_in,
  });
  
  // 3. 成功メッセージ返却
  return { message: "login-success" };
}
```

#### トークン更新処理
```typescript
// アクセストークンが無効な場合
if (!response.ok) {
  if (refreshToken) {
    const refreshResponse = await refreshAccessToken(refreshToken);
    if (refreshResponse.ok) {
      const { access_token, expires_in } = await refreshResponse.json();
      
      // 新しいトークンをCookieに設定
      const response = NextResponse.next();
      response.cookies.set("access_token", access_token, { /* ... */ });
      return response;
    }
  }
  
  // リフレッシュトークンも無効な場合、ログインページにリダイレクト
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
```

### 3. クライアントサイド認証フロー

#### useAuthRedirect Hook
```typescript
export const useAuthRedirect = ({ successMessage, redirectPath, redirectMessage }) => {
  const { login } = useAuth();
  const router = useRouter();
  const hasExecuted = useRef(false); // 重複実行防止

  useEffect(() => {
    if (successMessage && 
        (successMessage.includes("login-success") || successMessage.includes("signup-success")) &&
        !hasExecuted.current) {
      hasExecuted.current = true;
      
      // ユーザー情報取得とリダイレクト
      const fetchUserAndLogin = async () => {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          login(user);
          router.push(`${redirectPath}?message=${redirectMessage}`);
        }
      };
      
      fetchUserAndLogin();
    }
  }, [successMessage, login, router, redirectPath, redirectMessage]);
};
```

#### 重要な実装ポイント

1. **重複実行防止**
   ```typescript
   const hasExecuted = useRef(false); // 実行済みフラグ
   if (!hasExecuted.current) {
     hasExecuted.current = true; // 一度実行したら永続的にtrue
   }
   ```

2. **適切なメッセージ形式**
   ```typescript
   // ログインアクション
   return { message: "login-success" };
   
   // 登録アクション
   return { message: "signup-success" };
   ```

3. **Stateリセット**
   ```typescript
   // コンポーネントレベルでの制御
   useEffect(() => {
     if (state.message === "login-success") {
       const timer = setTimeout(() => {
         formAction(new FormData()); // stateをリセット
       }, 1000);
       return () => clearTimeout(timer);
     }
   }, [state.message, formAction]);
   ```

## セキュリティ考慮事項

### 1. Cookie設定
- `httpOnly: true` - XSS攻撃防止
- `secure: true` - HTTPS通信でのみ送信
- `sameSite: "lax"` - CSRF攻撃防止

### 2. トークン管理
- アクセストークン: 短時間（例：30分）
- リフレッシュトークン: 長時間（例：7日）
- 自動更新: アクセストークン期限切れ時に自動更新

### 3. エラーハンドリング
```typescript
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`);
  if (response.ok) {
    return NextResponse.next();
  }
} catch (error) {
  console.error("Auth check failed:", error);
  // エラー時はログインページにリダイレクト
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
```

## トラブルシューティング

### 1. 無限リダイレクト
**原因**: `useAuthRedirect`の重複実行
**解決策**: `hasExecuted`フラグで制御

### 2. Middlewareが動作しない
**原因**: `middleware.ts`の配置場所
**解決策**: プロジェクトルートに配置

### 3. Cookieが設定されない
**原因**: `createSessionCookie`をmiddlewareで使用
**解決策**: `NextResponse.cookies.set()`を使用

### 4. 非同期処理の警告
**原因**: `useActionState`の外で`formAction`を呼び出し
**解決策**: `useEffect`内で呼び出し

## パフォーマンス最適化

### 1. API呼び出しの最小化
- Middleware: 軽量なトークン検証のみ
- クライアント: 必要時のみユーザー情報取得

### 2. キャッシュ戦略
- トークンの有効期限チェック
- 不要なAPI呼び出しの削除

### 3. エラー処理
- 適切なフォールバック処理
- ユーザーフレンドリーなエラーメッセージ

## 今後の改善点

1. **トークン暗号化**: JWTベースのセッション管理
2. **キャッシュ戦略**: Redis等を使用したトークンキャッシュ
3. **監査ログ**: 認証イベントの記録
4. **多要素認証**: 2FAの実装
5. **セッション管理**: 同時ログイン制御

## 参考資料

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Cookie Security](https://web.dev/samesite-cookies-explained/) 