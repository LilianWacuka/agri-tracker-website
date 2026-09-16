import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import {
  createGoogleUser,
  getUserByEmail,
  getUserByGoogleId,
  linkGoogleAccount,
} from "@/app/services/user";
import { rateLimit } from "@/lib/rate-limit";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { success, remaining, retryAfter } = await rateLimit(
    `google-login:${ip}`
  );

  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  }

  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required" },
        { status: 400 }
      );
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid Google credential" },
        { status: 401 }
      );
    }

    const { sub: googleId, email, email_verified: emailVerified } = payload;

    if (!googleId || !email) {
      return NextResponse.json(
        { message: "Google account information is incomplete" },
        { status: 400 }
      );
    }

    if (!emailVerified) {
      return NextResponse.json(
        { message: "Google email is not verified" },
        { status: 401 }
      );
    }

    let user = await getUserByGoogleId(googleId);

    if (!user) {
      user = await getUserByEmail(email);

      if (user) {
        user = await linkGoogleAccount(user.id, googleId);
      } else {
        user = await createGoogleUser(
          googleId,
          email.split("@")[0],
          email
        );
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const response = NextResponse.json(
      {
        message: "Google login successful",
        token,
        user,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    );
  }
}