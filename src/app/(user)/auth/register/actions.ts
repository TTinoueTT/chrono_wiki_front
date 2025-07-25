// src/app/(user)/auth/register/actions.ts
"use server";

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
  const res = await fetch("http://localhost:8020/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log(res);

  if (res.ok) {
    return { success: true, message: "登録が完了しました！" };
  } else {
    const data = await res.json().catch(() => ({}));
    console.log(data);
    return { success: false, message: data.message || "登録に失敗しました" };
  }
}
