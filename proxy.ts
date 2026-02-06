import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './lib/middleware';

export async function proxy(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/dashboard')) {

    const isValid = await authMiddleware(request);

    if(!isValid){

        // const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('from', request.nextUrl.pathname);
        // return NextResponse.redirect(loginUrl);

        return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
        );
    }
   
  }

  else if (request.nextUrl.pathname.startsWith('/admin')) {

    const isValid = await authMiddleware(request);

    if(!isValid || isValid.role !== "admin"){
        return NextResponse.json({success: false,message: "Forbidden"},{status: 403});
    }
   
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
