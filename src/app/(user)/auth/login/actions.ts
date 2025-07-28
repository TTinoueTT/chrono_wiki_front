// src/app/(user)/auth/login/actions.ts
"use server";
import { fetchLogin } from "@/lib/api/auth";
import { LoginFormSchema, FormState } from "./definitions";

import { createSessionCookie } from "@/lib/session";

export const loginAction = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  // フォームフィールドの検証
  const username = formData.get("username");
  const password = formData.get("password");

  const validatedFields = LoginFormSchema.safeParse({
    username: username,
    password: password,
  });

  if (!validatedFields.success) {
    const formatted = validatedFields.error.format();
    return {
      errors: {
        username: formatted.username?._errors,
        password: formatted.password?._errors,
      },
    };
  }

  // 仮実装: 入力内容をコンソールに出力
  // console.log("ログイン情報", { username, password });

  const res = await fetchLogin(String(username), String(password));

  // console.log(res);

  if (res.ok) {
    const data = await res.json().catch(() => ({}));
    // アクセストークン
    await createSessionCookie({
      name: "access_token",
      token: data.access_token,
      maxAge: data.expires_in,
    });
    // リフレッシュトークン
    await createSessionCookie({
      name: "refresh_token",
      token: data.refresh_token,
      maxAge: 60 * 60 * 24 * 7, // 例: 7日
    });
    return { message: "ログインに成功しました" };
  } else {
    const data = await res.json().catch(() => ({}));
    // console.log(data);
    return { success: false, message: data.detail || "ログインに失敗しました" };
  }
};
