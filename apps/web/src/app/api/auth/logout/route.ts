import { NextResponse } from "next/server";
import { deleteSession } from "@/server/sessions/deleteSession";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Logout failed.",
      },
      {
        status: 500,
      }
    );
  }
}