"use client";
import { useSearchParams } from "next/navigation";

export default function RedirectMessage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (message === "signup-success") {
    return <p style={{ color: "green" }}>登録が完了しました！</p>;
  }
  if (message === "login-success") {
    return <p style={{ color: "green" }}>ログインに成功しました！</p>;
  }
  return null;
}
