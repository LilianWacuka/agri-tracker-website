"use client"
import{ QuickActions } from "@/components/dashboard/quickActions";
import{ TransactionTable } from "@/components/transactions/transactionTable"
import {useState, useEffect} from "react";
import {useAuth} from "@/context/authContext";
import {useRouter} from "next/navigation";

export default function DashboardPage(){
    
    return(
        <div className="p-4">
            <QuickActions />
            <TransactionTable />
        </div>
    );
}                                   
