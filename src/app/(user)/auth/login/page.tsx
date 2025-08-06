// ログインページ
"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { FormState } from "./definitions";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { AuthMessage, isSuccessMessage } from "@/types/messages";
import { MessageDisplay } from "@/components/MessageDisplay";

const initialState: FormState = { message: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  // ログイン成功時の処理
  useAuthRedirect({
    successMessage: state.message,
    redirectPath: "/profile",
    redirectMessage: "login-success",
  });

  // ログイン成功時のリダイレクト制御
  useEffect(() => {
    if (state.message === AuthMessage.LOGIN_SUCCESS) {
      console.log("ログイン成功、リダイレクト実行"); // eslint-disable-line no-console
      // リダイレクト後にstateをリセット
      const timer = setTimeout(() => {
        formAction(new FormData());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.message, formAction]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <MessageDisplay className="mb-4" />

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ユーザー名またはメールアドレス
            </label>
            <input
              name="username"
              required
              autoComplete="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {"errors" in state && state.errors?.username && (
            <p className="text-red-600 text-sm">{state.errors.username}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {"errors" in state && state.errors?.password && (
            <p className="text-red-600 text-sm">{state.errors.password}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {state.message && !isSuccessMessage(state.message) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
