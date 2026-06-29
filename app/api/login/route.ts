import { NextRequest, NextResponse } from "next/server";
import {loginUser} from "@/app/services/user";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
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
              {expiresIn: "24h"})
        return NextResponse.json({message: "Login successful", token, user}, { status: 200 });
    } catch (error){
        return NextResponse.json({message: "An error occurred"}, { status: 500 });
    }
}
