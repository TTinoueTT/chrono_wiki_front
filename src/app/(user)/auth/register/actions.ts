"use server";

import { fetchLogin, uploadAvatarImage } from "@/lib/api/auth";
import { RegisterFormSchema, FormState } from "./definitions";
import { createSessionCookie } from "@/lib/session";
import { AuthMessage } from "@/types/messages";

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
      avatar_file: formData.get("avatar_file") as File | null,
      bio: (formData.get("bio") as string) || undefined,
      password: formData.get("password") as string,
    };

    console.log("=== サインアップ処理開始 ==="); // eslint-disable-line no-console
    /* eslint-disable no-console */
    console.log("フォームデータ:", {
      email: payload.email,
      username: payload.username,
      full_name: payload.full_name,
      avatar_file: payload.avatar_file
        ? {
            name: payload.avatar_file.name,
            size: payload.avatar_file.size,
            type: payload.avatar_file.type,
          }
        : null,
      bio: payload.bio,
    });
    /* eslint-enable no-console */

    // クライアントサイドバリデーション（React Hook Form + Zod）
    const validatedFields = RegisterFormSchema.safeParse(payload);

    if (!validatedFields.success) {
      console.log("バリデーションエラー:", validatedFields.error.format()); // eslint-disable-line no-console
      const formatted = validatedFields.error.format();
      return {
        errors: {
          email: formatted.email?._errors,
          username: formatted.username?._errors,
          password: formatted.password?._errors,
          full_name: formatted.full_name?._errors,
          avatar_file: formatted.avatar_file?._errors,
          bio: formatted.bio?._errors,
        },
      };
    }

    console.log("バリデーション成功"); // eslint-disable-line no-console

    // サーバーサイドバリデーション（追加の安全性）
    if (!payload.email || !payload.username || !payload.password) {
      console.log("必須項目不足"); // eslint-disable-line no-console
      return {
        success: false,
        message: "必須項目が不足しています",
      };
    }

    // 画像ファイルの処理（バックエンドに送信）
    let avatarUrl: string | undefined;
    if (payload.avatar_file) {
      console.log("画像ファイル検出、アップロード開始"); // eslint-disable-line no-console
      try {
        // バックエンドの画像アップロードAPIに送信
        avatarUrl = await uploadAvatarImage(payload.avatar_file);
        console.log("画像アップロード成功:", avatarUrl); // eslint-disable-line no-console
      } catch (error) {
        console.error("画像アップロードエラー:", error); // eslint-disable-line no-console
        return {
          success: false,
          message: "画像のアップロードに失敗しました。",
        };
      }
    } else {
      console.warn("画像ファイルなし");
    }

    // 登録用のペイロードを作成
    const registerPayload = {
      email: payload.email,
      username: payload.username,
      full_name: payload.full_name,
      avatar_url: avatarUrl, // バックエンドから返されたURL
      bio: payload.bio,
      password: payload.password,
    };

    /* eslint-disable no-console */
    console.log("登録ペイロード:", {
      email: registerPayload.email,
      username: registerPayload.username,
      full_name: registerPayload.full_name,
      avatar_url: registerPayload.avatar_url,
      bio: registerPayload.bio,
    });
    /* eslint-enable no-console */

    // 登録APIリクエスト
    const registerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerPayload),
      }
    );

    /* eslint-disable no-console */
    console.log(
      "登録APIレスポンス:",
      registerRes.status,
      registerRes.statusText
    );
    /* eslint-enable no-console */

    if (!registerRes.ok) {
      const errorData = await registerRes.json().catch(() => ({}));
      console.log("登録APIエラー:", errorData); // eslint-disable-line no-console
      return {
        success: false,
        message: errorData.detail || "登録に失敗しました",
      };
    }

    console.log("登録成功、ログイン開始"); // eslint-disable-line no-console

    // 登録成功後、自動ログイン
    const loginRes = await fetchLogin(payload.email, payload.password);

    if (!loginRes.ok) {
      console.log("ログイン失敗"); // eslint-disable-line no-console
      // 登録は成功したがログインに失敗した場合
      return {
        success: false,
        message:
          "登録は完了しましたが、自動ログインに失敗しました。手動でログインしてください。",
      };
    }

    console.log("ログイン成功"); // eslint-disable-line no-console

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

    console.log("セッションクッキー作成完了"); // eslint-disable-line no-console

    // 成功メッセージを返す（クライアントサイドでリダイレクト処理）
    return { message: AuthMessage.SIGNUP_SUCCESS };
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
