"use server";

import { redirect } from "next/navigation";
import { RegisterFormSchema, FormState } from "./definitions";

export async function signupAction(state: FormState, formData: FormData) {
  // フォームデータを取得
  const payload = {
    email: formData.get("email"),
    username: formData.get("username"),
    full_name: formData.get("full_name") || undefined,
    avatar_url: formData.get("avatar_url") || undefined,
    bio: formData.get("bio") || undefined,
    password: formData.get("password"),
  };

  const validatedFields = RegisterFormSchema.safeParse({
    email: payload.email,
    username: payload.username,
    password: payload.password,
    full_name: payload.full_name,
    avatar_url: payload.avatar_url,
    bio: payload.bio,
  });

  if (!validatedFields.success) {
    const formatted = validatedFields.error.format();
    return {
      errors: {
        email: formatted.email?._errors,
        username: formatted.username?._errors,
        password: formatted.password?._errors,
        full_name: formatted.full_name?._errors,
        avatar_url: formatted.avatar_url?._errors,
        bio: formatted.bio?._errors,
      },
    };
  }

  console.log(payload);

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
