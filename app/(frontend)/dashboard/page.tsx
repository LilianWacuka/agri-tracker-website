"use client"
import {useState, useEffect} from "react";
import {useAuth} from "@/context/authContext";
import {useRouter} from "next/navigation";

export default function DashboardPage(){
    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to the Agri Tracker Dashboard!</p>
        </div>
    );
}