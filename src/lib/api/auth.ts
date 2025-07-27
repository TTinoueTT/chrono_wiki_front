import { getAccessTokenFromCookie } from "@/lib/session";
import { User } from "@/types/user";

export async function fetchUserProfile(): Promise<User | null> {
  const accessToken = await getAccessTokenFromCookie();
  if (!accessToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchLogin(username: string, password: string) {
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
}
