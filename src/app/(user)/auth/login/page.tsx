// ログインページ
"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";
import RedirectMessage from "@/components/RedirectMessage";
import { FormState } from "./definitions";

const initialState: FormState = { message: "" };

export default function LoginPage() {
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
      <RedirectMessage />
      <h1>ログイン</h1>
      <form action={formAction}>
        <div>
          <label>ユーザー名またはメールアドレス</label>
          <input name="username" required autoComplete="username" />
        </div>
        {"errors" in state && state.errors?.username && (
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
        {"errors" in state && state.errors?.password && (
          <p style={{ color: "red" }}>{state.errors.password}</p>
        )}
        <button type="submit" disabled={isPending}>
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      {state.message && <p style={{ color: "red" }}>{state.message}</p>}
    </div>
  );
}
