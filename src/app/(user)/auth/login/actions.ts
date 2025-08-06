// src/app/(user)/auth/login/actions.ts
"use server";
import { fetchLogin } from "@/lib/api/auth";
import { LoginFormSchema, FormState } from "./definitions";
import { createSessionCookie } from "@/lib/session";
import { AuthMessage } from "@/types/messages";

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

  const res = await fetchLogin(String(username), String(password));

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
    return { message: AuthMessage.LOGIN_SUCCESS };
  } else {
    const data = await res.json().catch(() => ({}));
    return { success: false, message: data.detail || AuthMessage.LOGIN_FAILED };
  }
};
