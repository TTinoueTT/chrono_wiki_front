// ユーザー新規登録ページ
// src/app/(user)/auth/register/page.tsx
"use client";
import { useActionState } from "react";
import { signupAction } from "./actions";

const initialState = { success: false, message: "" };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <div>
      <h1>ユーザー新規登録</h1>
      <form action={formAction}>
        <div>
          <label>メールアドレス*</label>
          <input name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label>ユーザー名*</label>
          <input
            name="username"
            minLength={3}
            maxLength={50}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>本名</label>
          <input name="full_name" maxLength={100} autoComplete="name" />
        </div>
        <div>
          <label>プロフィール画像URL</label>
          <input name="avatar_url" maxLength={500} autoComplete="photo" />
        </div>
        <div>
          <label>自己紹介</label>
          <textarea name="bio" maxLength={500} autoComplete="off" />
        </div>
        <div>
          <label>パスワード*</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "登録中..." : "登録"}
        </button>
      </form>
      {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>
          {state.message}
        </p>
      )}
    </div>
  );
}
