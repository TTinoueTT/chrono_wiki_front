// src/app/(user)/auth/register/actions.ts
"use server";

// import { createSessionCookie } from "@/lib/session";
// import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(prevState: any, formData: FormData) {
  // フォームデータを取得
  const payload = {
    email: formData.get("email"),
    username: formData.get("username"),
    full_name: formData.get("full_name") || undefined,
    avatar_url: formData.get("avatar_url") || undefined,
    bio: formData.get("bio") || undefined,
    password: formData.get("password"),
  };

  // 必須項目チェック
  if (
    !payload.email ||
    !payload.username ||
    String(payload.username).length < 3
  ) {
    return {
      success: false,
      message: "メールアドレスとユーザー名（3文字以上）は必須です",
    };
  }

  // APIリクエスト
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  console.log(res);

  if (res.ok) {
    // 1. ログインエンドポイントを呼び出しアクセストークンを取得
    const data = await res.json().catch(() => ({}));
    console.log(data);
    // TODO: アクセストークンの取得をやるかどうか
    // 2. アクセストークンを Cookie に保存
    // 3. ログインページにリダイレクト
    // const accessToken = data.access_token;
    // const sessionCookie = await createSessionCookie(accessToken);
    // cookies().set("session", sessionCookie);
    redirect("/auth/login?message=signup-success");
  } else {
    const data = await res.json().catch(() => ({}));
    console.log(data);
    return { success: false, message: data.detail || "登録に失敗しました" };
  }
}
