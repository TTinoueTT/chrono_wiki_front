// ユーザー新規登録ページ
// src/app/(user)/auth/register/page.tsx
"use client";
import { useActionState } from "react";
import { signupAction } from "./actions";
import { FormState } from "./definitions";

const initialState: FormState = { message: "" };

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
        {"errors" in state && state.errors?.email && (
          <p style={{ color: "red" }}>{state.errors.email}</p>
        )}
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
        {"errors" in state && state.errors?.username && (
          <p style={{ color: "red" }}>{state.errors.username}</p>
        )}
        <div>
          <label>本名</label>
          <input name="full_name" maxLength={100} autoComplete="name" />
        </div>
        {"errors" in state && state.errors?.full_name && (
          <p style={{ color: "red" }}>{state.errors.full_name}</p>
        )}
        <div>
          <label>プロフィール画像URL</label>
          <input name="avatar_url" maxLength={500} autoComplete="photo" />
        </div>
        {"errors" in state && state.errors?.avatar_url && (
          <p style={{ color: "red" }}>{state.errors.avatar_url}</p>
        )}
        <div>
          <label>自己紹介</label>
          <textarea name="bio" maxLength={500} autoComplete="off" />
        </div>
        {"errors" in state && state.errors?.bio && (
          <p style={{ color: "red" }}>{state.errors.bio}</p>
        )}
        <div>
          <label>パスワード*</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {"errors" in state && state.errors?.password && (
          <p style={{ color: "red" }}>{state.errors.password}</p>
        )}
        <button type="submit" disabled={isPending}>
          {isPending ? "登録中..." : "登録"}
        </button>
      </form>
      {state.message && <p style={{ color: "red" }}>{state.message}</p>}
    </div>
  );
}
