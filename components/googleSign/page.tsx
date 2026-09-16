"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignIn() {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleGoogleResponse = async (response: any) => {
    try {
      const result = await fetch("/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      login(data.user.id);

      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Something went wrong with Google login");
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        }
      );
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div ref={googleButtonRef} />;
}