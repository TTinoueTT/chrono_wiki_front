"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ロゴ */}
        <div>
          <Link
            href="/"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textDecoration: "none",
              color: "#1f2937",
            }}
          >
            Chrono Wiki
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              gap: "2rem",
            }}
          >
            <li>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: isActive("/") ? "#3b82f6" : "#6b7280",
                  fontWeight: isActive("/") ? "600" : "400",
                }}
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/persons"
                style={{
                  textDecoration: "none",
                  color: isActive("/persons") ? "#3b82f6" : "#6b7280",
                  fontWeight: isActive("/persons") ? "600" : "400",
                }}
              >
                人物
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                style={{
                  textDecoration: "none",
                  color: isActive("/events") ? "#3b82f6" : "#6b7280",
                  fontWeight: isActive("/events") ? "600" : "400",
                }}
              >
                出来事
              </Link>
            </li>
            <li>
              <Link
                href="/timeline"
                style={{
                  textDecoration: "none",
                  color: isActive("/timeline") ? "#3b82f6" : "#6b7280",
                  fontWeight: isActive("/timeline") ? "600" : "400",
                }}
              >
                年表
              </Link>
            </li>
          </ul>
        </nav>

        {/* ユーザーメニュー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {isLoggedIn ? (
            <>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                {user?.full_name || user?.username}さん
              </span>
              <Link
                href="/profile"
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                }}
              >
                プロフィール
              </Link>
              <button
                onClick={async () => await logout()}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  backgroundColor: "#ef4444",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                }}
              >
                ログイン
              </Link>
              <Link
                href="/auth/register"
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  backgroundColor: "#3b82f6",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                }}
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
