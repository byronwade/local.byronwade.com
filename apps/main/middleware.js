/**
 * Main Platform Middleware - thorbis.com
 * Handles marketing site, authentication, and user dashboard routing
 */

import { NextResponse } from 'next/server';

/**
 * Main platform middleware
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Handle main platform specific routing
  console.log(`Main platform request: ${pathname}`);
  
  // Add main platform headers
  const response = NextResponse.next();
  response.headers.set('X-Platform-Type', 'main');
  response.headers.set('X-Platform-Version', process.env.APP_VERSION || '1.0.0');
  
  // Main platform security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};