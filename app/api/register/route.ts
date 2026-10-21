import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, registerUser } from "@/app/services/user";

export async function POST(request: NextRequest) {
  try {
    const { email, userName, password } = await request.json();
// validate the input fields
    if (!email || !userName || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
// Check if the email is already registered
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }
// Hash the password and register the user
    const hashedPassword = await bcrypt.hash(password, 6);
    const user = await registerUser(email, userName, hashedPassword);

    // Create a login token immediately after registration.
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
        },
      },
      { status: 201 }
    );

    // This cookie lets proxy.ts recognize the new user as logged in.
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in registration route:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}