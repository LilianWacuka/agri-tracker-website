import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createHash, randomBytes } from "crypto";
import {
  getUserByEmail,
  savePasswordResetToken,
} from "@/app/services/user";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Check that email was sent before using string methods.
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    // Only users with an email/password account can reset a password.
    if (user?.passwordHash) {
      const token = randomBytes(32).toString("hex");

      // Save a hash only; the original token exists only in the email link.
      const resetTokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

      await savePasswordResetToken(
        normalizedEmail,
        resetTokenHash,
        new Date(Date.now() + 15 * 60 * 1000) // Expires in 15 minutes.
      );

      const resetUrl =
        `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: normalizedEmail,
        subject: "Reset your Agri Tracker password",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link expires in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
      }
    }

    // This stays generic to avoid revealing whether an email is registered.
    return NextResponse.json({
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Unable to process your request. Please try again later." },
      { status: 500 }
    );
  }
}