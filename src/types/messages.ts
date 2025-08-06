/**
 * 認証関連のメッセージを管理するEnum
 */
export enum AuthMessage {
  // ログイン関連
  LOGIN_SUCCESS = "login-success",
  LOGIN_FAILED = "login-failed",
  LOGIN_REQUIRED = "login-required",

  // 登録関連
  SIGNUP_SUCCESS = "signup-success",
  SIGNUP_FAILED = "signup-failed",

  // ログアウト関連
  LOGOUT_SUCCESS = "logout-success",
  LOGOUT_FAILED = "logout-failed",

  // パスワード関連
  PASSWORD_RESET_SUCCESS = "password-reset-success",
  PASSWORD_RESET_FAILED = "password-reset-failed",

  // エラー関連
  TOKEN_EXPIRED = "token-expired",
  TOKEN_INVALID = "token-invalid",
  SESSION_EXPIRED = "session-expired",
}

/**
 * メッセージの種類を判定するヘルパー関数
 */
export const isAuthMessage = (message: string): message is AuthMessage => {
  return Object.values(AuthMessage).includes(message as AuthMessage);
};

/**
 * 成功メッセージかどうかを判定するヘルパー関数
 */
export const isSuccessMessage = (message: string): boolean => {
  return message.includes("-success");
};

/**
 * 失敗メッセージかどうかを判定するヘルパー関数
 */
export const isErrorMessage = (message: string): boolean => {
  return (
    message.includes("-failed") ||
    message.includes("-expired") ||
    message.includes("-invalid")
  );
};
