import { NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const protectedRoutes = ['/dashboard'];
    
    const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    };
    return NextResponse.next();
};
 export const config = {
        matcher: ["/dashboard/:path*"],
    };