import {NextRequest, NextResponse} from "next/server";
import { Resend } from "resend";
import { getUserByEmail, savePasswordResetToken } from "@/app/services/user";
import { createHash, randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest){
    try{
        const {email}= await request.json();
        const normalizedEmail = email.toLowerCase();

        if (!normalizedEmail){
            return NextResponse.json({ message: "Email is required" }, {status: 400});
        }
        const user = await getUserByEmail(normalizedEmail);
        console.log("Password request check:",{
            email: normalizedEmail,
            userFound: Boolean(user),
            hasPasswordHash: Boolean(user?.passwordHash),
        })
        if (user?.passwordHash){
            const token = randomBytes(32).toString("hex");

            const resetTokenHash = createHash("sha256").update(token).digest("hex");
            await savePasswordResetToken(normalizedEmail, resetTokenHash, 
                new Date(Date.now() + 15 * 60 * 1000));
            const reseturl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
            const {data, error} = await resend.emails.send({
                from: process.env.EMAIL_FROM as string,
                to: normalizedEmail,
                subject: "Reset your Agritracker Password",
                html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <p><a href="${reseturl}">Reset Password</a></p>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>`
            })
            console.log("Resend result:", { data, error });
            if(error){
                console.error("Resend error;", error);
            }
        }
        return NextResponse.json({ message: 
            "if an account exists for that email, a password reset link has been sent.",});
    } catch (error){
        console.error("Error occurred:", error);
        return NextResponse.json({ message: "Unable to process your request. Please try again later." },
             { status: 500 });
    }
}