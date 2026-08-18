"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

export function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-[#eeeeee] shadow border-b">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[#bbedab]"
        >
          Agri Tracker
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text--800">
          {isLoggedIn ? (
            <>
              <Link className="text-brown-700" href="/dashboard">
                Dashboard
              </Link>

              <Link href="/transaction">
                Transaction
              </Link>

              <Link href="/report">
                Reports
              </Link>
              <Link href="/profile">
                Profile
              </Link>

              <Button
                variant="outline"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>

              <Link href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}