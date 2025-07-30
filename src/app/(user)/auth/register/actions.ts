"use server";

import { fetchLogin } from "@/lib/api/auth";
import { RegisterFormSchema, FormState } from "./definitions";
import { createSessionCookie } from "@/lib/session";

export const signupAction = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    // フォームデータを取得
    const payload = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      full_name: (formData.get("full_name") as string) || undefined,
      avatar_url: (formData.get("avatar_url") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
      password: formData.get("password") as string,
    };

    // クライアントサイドバリデーション（React Hook Form + Zod）
    const validatedFields = RegisterFormSchema.safeParse(payload);

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

    // サーバーサイドバリデーション（追加の安全性）
    if (!payload.email || !payload.username || !payload.password) {
      return {
        success: false,
        message: "必須項目が不足しています",
      };
    }

    // 登録APIリクエスト
    const registerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedFields.data),
      }
    );

    if (!registerRes.ok) {
      const errorData = await registerRes.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.detail || "登録に失敗しました",
      };
    }

    // 登録成功後、自動ログイン
    const loginRes = await fetchLogin(payload.email, payload.password);

    if (!loginRes.ok) {
      // 登録は成功したがログインに失敗した場合
      return {
        success: false,
        message:
          "登録は完了しましたが、自動ログインに失敗しました。手動でログインしてください。",
      };
    }

    // ログイン成功、セッションクッキーを作成
    const loginData = await loginRes.json();

    await createSessionCookie({
      name: "access_token",
      token: loginData.access_token,
      maxAge: loginData.expires_in,
    });

    await createSessionCookie({
      name: "refresh_token",
      token: loginData.refresh_token,
      maxAge: 60 * 60 * 24 * 7, // 7日
    });

    // 成功メッセージを返す（クライアントサイドでリダイレクト処理）
    return { message: "signup-success" };
  } catch (error) {
    // 予期しないエラーの処理
    console.error("Signup action error:", error);
    return {
      success: false,
      message:
        "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。",
    };
  }
};
