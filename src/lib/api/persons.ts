import "server-only";

import { getAccessTokenFromCookie } from "@/lib/session";

export const fetchPersons = async () => {
  const accessToken = await getAccessTokenFromCookie();
  if (!accessToken) return null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/persons`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return null;
  return await response.json();
};
