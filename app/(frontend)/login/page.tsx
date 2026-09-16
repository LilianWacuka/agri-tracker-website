"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/context/authContext";
import GoogleSignIn from "@/components/googleSign/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle login
  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");

    // Validate inputs
    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Send login request to backend
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Convert response body from JSON to JavaScript object

      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Success
      setMessage(data.message || "Login successful! Redirecting...");

      if (data.user?.id) {
        login(data.user.id);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // clear form fields
      setEmail("");
      setPassword("");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Toggle Password Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-green-500">{message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <GoogleSignIn />

        {/* Register Link */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}