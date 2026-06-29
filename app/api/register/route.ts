import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import { registerUser, getUserByEmail } from "@/app/services/user";

export async function POST(request: NextRequest) {
    try {
        const { email, userName, password } = await request.json();

        // Basic validation
        if (!email || !userName || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 6);

        // function call
        const user = await registerUser(email, userName, hashedPassword);

        return NextResponse.json(
            { message: "User registered successfully", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in registration route:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}