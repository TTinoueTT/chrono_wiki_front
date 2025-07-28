import { NextRequest, NextResponse } from "next/server";
import { fetchUserProfile } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await fetchUserProfile();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
