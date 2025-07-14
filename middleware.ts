import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//     console.log("Middleware is running:", req.nextUrl.pathname); // Debugging

//     // const token = req.cookies.get("authToken"); 
//     // const isPublicPage = req.nextUrl.pathname === "/login"; 

//     // if (!token && !isPublicPage) {
//         console.log("Redirecting to /login");
//         return NextResponse.redirect(new URL("/login", req.url)); 
//     // }

//     return NextResponse.next(); 
// }

// export const config = {
//     matcher: "/about", // Apply to all routes except static files
// };

export const middleware = (request: NextRequest) => {
//   const authToken = request.cookies.get("authToken")?.value;
//   const userToken = request.cookies.get("userToken")?.value;

  const url = request.nextUrl.clone();

  console.log("sdfghjkljkl",url.pathname);
  
  // Admin route protection
//   if (url.pathname.startsWith("/Dashboard")) {
//     if (!authToken) {
//       return NextResponse.redirect(new URL("/AdminLogin", request.url));
//     }
//   }

  // User route protection
//   if (url.pathname.startsWith("/UserDashboard")) {
//     if (!userToken) {
//       return NextResponse.redirect(new URL("/Login", request.url));
//     }
//   }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/about",
    // "/UserDashboard/:path*",
  ],
};