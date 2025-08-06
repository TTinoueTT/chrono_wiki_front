"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthMessage, isAuthMessage } from "@/types/messages";

interface MessageDisplayProps {
  className?: string;
}

export const MessageDisplay = ({ className = "" }: MessageDisplayProps) => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (messageParam && isAuthMessage(messageParam)) {
      setMessage(messageParam);

      // メッセージタイプの判定
      if (messageParam.includes("-success")) {
        setMessageType("success");
      } else if (
        messageParam.includes("-failed") ||
        messageParam.includes("-expired") ||
        messageParam.includes("-invalid")
      ) {
        setMessageType("error");
      } else {
        setMessageType("info");
      }
    }
  }, [searchParams]);

  if (!message) return null;

  const getMessageText = (messageKey: string): string => {
    switch (messageKey) {
      case AuthMessage.LOGIN_SUCCESS:
        return "ログインに成功しました";
      case AuthMessage.SIGNUP_SUCCESS:
        return "登録に成功しました";
      case AuthMessage.LOGOUT_SUCCESS:
        return "ログアウトしました";
      case AuthMessage.LOGIN_FAILED:
        return "ログインに失敗しました";
      case AuthMessage.SIGNUP_FAILED:
        return "登録に失敗しました";
      case AuthMessage.LOGOUT_FAILED:
        return "ログアウトに失敗しました";
      case AuthMessage.LOGIN_REQUIRED:
        return "ログインが必要です";
      case AuthMessage.TOKEN_EXPIRED:
        return "セッションが期限切れです。再度ログインしてください";
      case AuthMessage.TOKEN_INVALID:
        return "無効なセッションです";
      case AuthMessage.SESSION_EXPIRED:
        return "セッションが期限切れです";
      case AuthMessage.PASSWORD_RESET_SUCCESS:
        return "パスワードリセットに成功しました";
      case AuthMessage.PASSWORD_RESET_FAILED:
        return "パスワードリセットに失敗しました";
      default:
        return "エラーが発生しました";
    }
  };

  const getMessageStyles = () => {
    const baseStyles = "p-4 rounded-md border";

    switch (messageType) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  return (
    <div className={`${getMessageStyles()} ${className}`}>
      <p className="text-sm">{getMessageText(message)}</p>
    </div>
  );
};
