"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Home(){
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() =>{
        if (isLoading) return; // Wait for auth state to load
        //logged in user, redirect to dashboard
        //unlogged in user, redirect to login page
        router.replace(isLoggedIn ? "/dashboard" : "/login");
    }, [isLoggedIn, isLoading, router]);
    return(
        <main className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-gray-500">
                Loading....</p>
        </main>
    )
}