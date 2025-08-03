/**
 * Tenant Platform Middleware - {tenant}.thorbis.com
 * Handles tenant-specific routing and customization
 */

import { NextResponse } from 'next/server';

/**
 * Tenant platform middleware
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Extract tenant from hostname
  const tenant = hostname.replace('.thorbis.com', '').replace('.localhub.com', '');
  
  console.log(`Tenant platform request: ${pathname} for tenant: ${tenant}`);
  
  // Add tenant platform headers
  const response = NextResponse.next();
  response.headers.set('X-Platform-Type', 'tenant');
  response.headers.set('X-Tenant-Subdomain', tenant);
  
  // Tenant-specific security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy for tenant
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https://api.thorbis.com",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};