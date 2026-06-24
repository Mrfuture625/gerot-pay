import { NextResponse } from "next/server";
import { signup } from "@/server/auth/authService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await signup({
      name: body.name,
      password: body.password,
      signupToken: body.signupToken,
      otp: body.otp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Signup failed.",
      },
      { status: 400 }
    );
  }
}