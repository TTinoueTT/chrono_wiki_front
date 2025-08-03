import "server-only";

import { getAccessTokenFromCookie } from "@/lib/session";
import { User } from "@/types/user";

export const fetchUserProfile = async (): Promise<User | null> => {
  const accessToken = await getAccessTokenFromCookie();
  if (!accessToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return null;
  return await res.json();
};

export const fetchLogin = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
};

// バックエンドの画像アップロードAPIに送信する関数
export const uploadAvatarImage = async (file: File): Promise<string> => {
  console.log("=== 画像アップロード開始 ==="); // eslint-disable-line no-console
  /* eslint-disable no-console */
  console.log("ファイル情報:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });
  /* eslint-enable no-console */

  const formData = new FormData();
  formData.append("file", file);

  console.log("FormData作成完了"); // eslint-disable-line no-console

  // バックエンドの画像アップロードエンドポイントに送信
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/avatar`,
    {
      method: "POST",
      headers: {
        "X-API-Key": `${process.env.CHRONO_WIKI_API_KEY}`,
      },
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
      body: formData,
    }
  );

  /* eslint-disable no-console */
  console.log("APIレスポンス:", {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  });
  /* eslint-enable no-console */

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("APIエラー:", errorData);
    throw new Error(errorData.detail || "画像アップロードに失敗しました");
  }

  const data = await response.json();
  console.log("API成功レスポンス:", data); // eslint-disable-line no-console

  return data.url; // バックエンドから返された画像URL
};
