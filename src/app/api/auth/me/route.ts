import { NextResponse } from "next/server";
// import { NextRequest, NextResponse } from "next/server";
import { fetchUserProfile } from "@/lib/api/auth";
// import { parseSessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const user = await fetchUserProfile(accessToken);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
};
