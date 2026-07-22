import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserProfile } from "@/app/services/user";
//Get user profile

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userId");
        if(!userId){
            return NextResponse.json(
                {message: "User Id is required"}, {status: 400}
            );
        }
        const user = await getUserById(userId);
        if(!user){
            return NextResponse.json(
                {message: "User not found"}, {status: 404}
            );
        }
        return NextResponse .json(
            {message: "User profile fetched successfully", user: user}, {status: 200});
    } catch (error) {
        console.error("error fetching user profile:", error);
        return NextResponse.json(
            {message: "Internal Server Error"}, {status: 500}
        )
    }
}
//Update user profile
export async function PATCH(request: NextRequest){
    try{
        const {userId, userName, email, farmName, phoneNumber, 
            fullName
        } = await request.json();
        if(!userId){
            return NextResponse.json(
                {message: "User Id is required"}, {status: 400}
            );
        }
        const updatedUser = await updateUserProfile(
            userId,
            userName,
            email,
            farmName,
            phoneNumber,
            fullName,
        )
        return NextResponse.json(
            {message: "User profile updated successfully", user: updatedUser});    
    } catch (error){
        console.error("error updating user profile:", error);
        return NextResponse.json(
            {message: "Internal Server Error"}, {status: 500}
        )
    }
}