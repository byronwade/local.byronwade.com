# Migration Guide: Current → Professional Architecture

## 🎯 **Overview**

This guide shows how to migrate from the current `app/[subdomain]/` structure to a professional multi-tenant architecture that eliminates URL conflicts and follows industry best practices.

## 📊 **Current vs. Professional Structure**

### **Current Structure (Has Conflicts)**
```
app/
├── [subdomain]/                    # ❌ Conflicts with other routes
│   ├── layout.js                   # Mixed with main app
│   ├── page.js                     # URL conflicts possible
│   ├── businesses/page.js          # Could conflict with /businesses
│   └── search/page.js              # Could conflict with /search
├── (site)/                         # Main site mixed with subdomains
├── (auth)/dashboard/               # Dashboard mixed with tenants
└── api/                            # API mixed with everything
```

### **Professional Structure (No Conflicts)**
```
apps/
├── main/                           # thorbis.com (marketing, auth)
│   ├── app/
│   │   ├── page.js                # Landing page
│   │   ├── pricing/page.js        # Pricing
│   │   ├── login/page.js          # Authentication
│   │   ├── dashboard/             # User management
│   │   └── api/                   # Main platform APIs
│   └── middleware.js              # Main platform routing
├── tenant/                         # {tenant}.thorbis.com
│   ├── app/
│   │   ├── [tenant]/              # Tenant-specific routes
│   │   │   ├── page.js           # Tenant home
│   │   │   ├── businesses/       # Business pages
│   │   │   └── search/           # Search functionality
│   │   └── api/                   # Tenant APIs
│   └── middleware.js              # Tenant routing
├── admin/                          # admin.thorbis.com
│   ├── app/
│   │   ├── page.js               # Admin dashboard
│   │   ├── tenants/              # Tenant management
│   │   └── analytics/            # Platform analytics
│   └── middleware.js             # Admin routing
└── shared/                         # Shared components
    ├── components/
    ├── lib/
    └── utils/
```

## 🚀 **Step-by-Step Migration**

### **Phase 1: Set Up Infrastructure**

#### 1. Configure DNS
```bash
# Add DNS records for subdomains
*.thorbis.com       CNAME   your-app.vercel.app
admin.thorbis.com   CNAME   your-app.vercel.app
api.thorbis.com     CNAME   your-app.vercel.app
```

#### 2. Set Up SSL Certificates
```bash
# For Vercel (automatic)
# Add domains in Vercel dashboard

# For other platforms
# Configure wildcard SSL: *.thorbis.com
```

#### 3. Update Environment Variables
```bash
# .env.local
NEXT_PUBLIC_MAIN_DOMAIN=thorbis.com
NEXT_PUBLIC_TENANT_DOMAIN=thorbis.com
NEXT_PUBLIC_ADMIN_DOMAIN=admin.thorbis.com
NEXT_PUBLIC_API_DOMAIN=api.thorbis.com
```

### **Phase 2: Create New App Structure**

#### 1. Create Apps Directory
```bash
mkdir -p apps/{main,tenant,admin,shared}
mkdir -p apps/shared/{components,lib,utils}
```

#### 2. Move Main Platform Files
```bash
# Move marketing and auth pages
mv app/(site)/* apps/main/app/
mv app/(auth)/login apps/main/app/
mv app/(auth)/signup apps/main/app/
mv app/(auth)/dashboard apps/main/app/
```

#### 3. Move Tenant Platform Files
```bash
# Move subdomain-specific files
mv app/[subdomain]/* apps/tenant/app/[tenant]/
mv components/subdomain apps/shared/components/
mv lib/utils/subdomainSeo.js apps/shared/lib/utils/
```

#### 4. Move Shared Components
```bash
# Move shared utilities
mv components/ui apps/shared/components/
mv lib/supabase apps/shared/lib/
mv lib/utils apps/shared/lib/
```

### **Phase 3: Update Middleware**

#### 1. Replace Current Middleware
```javascript
// Replace middleware.js with professional version
import { createProfessionalSubdomainMiddleware } from './lib/middleware/professional-subdomain';

export function middleware(request) {
  return createProfessionalSubdomainMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### 2. Add Platform-Specific Middleware
```javascript
// apps/main/middleware.js
export function middleware(request) {
  // Handle main platform routing
  return handleMainPlatform(request);
}

// apps/tenant/middleware.js  
export function middleware(request) {
  // Handle tenant platform routing
  return handleTenantPlatform(request);
}

// apps/admin/middleware.js
export function middleware(request) {
  // Handle admin platform routing
  return handleAdminPlatform(request);
}
```

### **Phase 4: Update API Routes**

#### 1. Reorganize API Structure
```bash
# Before
app/api/v2/subdomains/

# After
apps/main/app/api/auth/          # Authentication APIs
apps/main/app/api/billing/       # Billing APIs
apps/tenant/app/api/businesses/  # Business APIs
apps/admin/app/api/tenants/      # Tenant management APIs
```

#### 2. Update API URLs
```javascript
// Before
/api/v2/subdomains/${subdomain}

// After  
https://api.thorbis.com/v1/tenants/${tenant}
https://${tenant}.thorbis.com/api/businesses
```

### **Phase 5: Update Components**

#### 1. Update Import Paths
```javascript
// Before
import { SubdomainLayout } from '@components/subdomain/SubdomainLayout';

// After
import { SubdomainLayout } from '@shared/components/subdomain/SubdomainLayout';
```

#### 2. Update API Calls
```javascript
// Before
const response = await fetch(`/api/v2/subdomains/${subdomain}`);

// After
const response = await fetch(`https://api.thorbis.com/v1/tenants/${tenant}`);
```

#### 3. Update Navigation
```javascript
// Before
<Link href={`/${subdomain}/businesses`}>

// After  
<Link href="/businesses"> {/* Relative to current tenant domain */}
```

### **Phase 6: Update Configuration**

#### 1. Update Next.js Config
```javascript
// next.config.mjs
const nextConfig = {
  // Enable experimental features for multi-app
  experimental: {
    appDir: true,
  },
  
  // Configure rewrites for API gateway
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.thorbis.com/:path*',
      },
    ];
  },
  
  // Configure headers for subdomains
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Platform-Type',
            value: 'tenant',
          },
        ],
      },
    ];
  },
};
```

#### 2. Update Package.json Scripts
```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:main": "next dev -p 3000 apps/main",
    "dev:tenant": "next dev -p 3001 apps/tenant", 
    "dev:admin": "next dev -p 3002 apps/admin",
    "build": "turbo build",
    "build:main": "next build apps/main",
    "build:tenant": "next build apps/tenant",
    "build:admin": "next build apps/admin"
  }
}
```

## 🔄 **Testing Migration**

### **1. Test URL Routing**
```bash
# Test main platform
curl -H "Host: thorbis.com" http://localhost:3000/

# Test tenant platform  
curl -H "Host: santacruz.thorbis.com" http://localhost:3000/

# Test admin platform
curl -H "Host: admin.thorbis.com" http://localhost:3000/
```

### **2. Test API Endpoints**
```bash
# Test tenant API
curl https://santacruz.thorbis.com/api/businesses

# Test main API
curl https://thorbis.com/api/auth/session

# Test admin API  
curl https://admin.thorbis.com/api/tenants
```

### **3. Test SEO and Metadata**
```bash
# Check tenant-specific metadata
curl -s https://santacruz.thorbis.com/ | grep "<title>"
curl -s https://santacruz.thorbis.com/ | grep "meta.*description"
```

## 📋 **Migration Checklist**

### **Infrastructure**
- [ ] DNS configured for `*.thorbis.com`
- [ ] SSL certificates set up
- [ ] Load balancer routing configured
- [ ] CDN configured for static assets

### **Application**
- [ ] Apps directory structure created
- [ ] Files moved to appropriate apps
- [ ] Middleware updated for each platform
- [ ] API routes reorganized
- [ ] Shared components extracted

### **Configuration**
- [ ] Environment variables updated
- [ ] Next.js config updated for multi-app
- [ ] Package.json scripts updated
- [ ] TypeScript paths updated

### **Testing**
- [ ] All routes work correctly
- [ ] APIs respond properly
- [ ] SEO metadata generates correctly
- [ ] Performance meets requirements
- [ ] Security headers are correct

### **Deployment**
- [ ] CI/CD pipeline updated
- [ ] Separate deployments for each app
- [ ] Monitoring configured per platform
- [ ] Analytics tracking updated

## 🎯 **Benefits After Migration**

### **No URL Conflicts**
- ✅ Clean separation between platforms
- ✅ No route overlaps or conflicts
- ✅ Clear URL hierarchies

### **Better Performance** 
- ✅ Smaller bundle sizes per platform
- ✅ Platform-specific optimizations
- ✅ Independent caching strategies

### **Improved Security**
- ✅ Platform-specific security policies
- ✅ Isolated authentication systems
- ✅ Tenant data isolation

### **Easier Maintenance**
- ✅ Clear separation of concerns
- ✅ Independent deployments
- ✅ Platform-specific monitoring

### **Professional Scalability**
- ✅ Unlimited tenants without conflicts
- ✅ Independent scaling per platform
- ✅ Clear upgrade paths

## 🚨 **Common Migration Issues**

### **Issue: Import Path Errors**
```javascript
// Problem
import { Component } from '@components/ui/component';

// Solution
import { Component } from '@shared/components/ui/component';
```

### **Issue: API URL Conflicts**
```javascript
// Problem
fetch('/api/businesses'); // Ambiguous platform

// Solution  
fetch('https://api.thorbis.com/v1/businesses'); // Clear API endpoint
```

### **Issue: Middleware Not Routing**
```javascript
// Problem: Single middleware handling everything

// Solution: Platform-specific middleware
export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
```

This migration transforms your subdomain system into a professional, scalable architecture that eliminates conflicts and follows industry best practices used by companies like Shopify, Slack, and GitHub.