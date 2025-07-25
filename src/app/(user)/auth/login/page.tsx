// ログインページ
"use client";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction } from "./actions";

const initialState = { success: false, message: "" };

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      {message === "signup-success" && (
        <p style={{ color: "green" }}>登録が完了しました！</p>
      )}
      <h1>ログイン</h1>
      <form action={formAction}>
        <div>
          <label>ユーザー名またはメールアドレス</label>
          <input name="username" required autoComplete="username" />
        </div>
        {state.errors?.username && (
          <p style={{ color: "red" }}>{state.errors.username}</p>
        )}
        <div>
          <label>パスワード</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {state.errors?.password && (
          <p style={{ color: "red" }}>{state.errors.password}</p>
        )}
        <button type="submit" disabled={isPending}>
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      {/* {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>
          {state.message}
        </p>
      )} */}
    </div>
  );
}
