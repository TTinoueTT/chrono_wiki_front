import "server-only";

import { cookies } from "next/headers";
// import { parseSessionCookie } from "@/lib/session";

export const fetchPersons = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  // const accessToken = await parseSessionCookie(
  //   cookieStore.get("access_token")?.value
  // );
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
