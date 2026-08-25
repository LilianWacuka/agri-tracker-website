import { NextRequest, NextResponse } from "next/server";
import {loginUser} from "@/app/services/user";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
    const ip = 
     request.headers.get("x-forwarded-for") || 
     request.headers.get("x-real-ip") || "unknown";
    const {success, remaining, retryAfter}= await rateLimit(`login:${ip}`); 
    if(!success){
        return NextResponse.json(
            {message: "Too many requests. Please try again later."},
            {
            status: 429,
            headers:{
                "Retry-After": retryAfter.toString(),
                "X-RateLimit-Remaining": remaining.toString(),
            }
            }
        )
    }
    
    try{
        const {email, password}= await request.json()
        //Basic validation
        if (! email || !password){
            return NextResponse.json({message: "Fields are required"}, { status: 400 });
        }
        const user = await loginUser(email, password);
        if(!user){
            return NextResponse.json({message: "Invalid credentials"}, { status: 404 });
        }
        const token = jwt.sign(
            {userId: user.id, email: user.email}, process.env.JWT_SECRET as string,
              {expiresIn: "1h"})
        const response = NextResponse.json({message: "Login successful", token, user}, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1 * 60 * 60,
            path: "/",
        });
        return response;
    } catch (error){
        return NextResponse.json({message: "An error occurred"}, { status: 500 });
    }
}
