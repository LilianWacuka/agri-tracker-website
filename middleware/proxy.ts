import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const forwardedFor = request.headers.get("x-forwarded-for");
        const clientIp = forwardedFor?.split(",")[0]?.trim() || "unknown";
        const result = await rateLimit(`${clientIp}:${request.nextUrl.pathname}`);

        if (!result.success) {
            return NextResponse.json(
                { message: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(result.retryAfter),
                        "X-RateLimit-Remaining": String(result.remaining),
                    },
                },
            );
        }
    }

    const token = request.cookies.get("token")?.value;
    const protectedRoutes = [
        '/dashboard',
        '/api',
        '/profile',

    ];
    
    const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    };
    return NextResponse.next();
};
 export const config = {
        matcher: [
            "/dashboard/:path*", 
            "/profile/:path*",
            "/api/:path*"
        ],
    };