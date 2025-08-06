import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthMessage } from "@/types/messages";

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.json({ message: AuthMessage.LOGOUT_SUCCESS });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: AuthMessage.LOGOUT_FAILED },
      { status: 500 }
    );
  }
};
