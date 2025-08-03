# Professional Multi-Tenant Architecture for Thorbis

## 🏗️ **Domain Architecture (Professional SaaS Pattern)**

### **Domain Structure**
```
Main Platform:    thorbis.com              # Marketing, auth, billing
Tenant Hubs:      {tenant}.thorbis.com     # Isolated tenant experiences  
Admin Platform:   admin.thorbis.com        # Platform management
API Gateway:      api.thorbis.com          # Unified API layer
CDN Assets:       cdn.thorbis.com          # Static assets
```

### **URL Patterns**
```
# Main Platform (thorbis.com)
/                                 # Landing page
/pricing                         # Pricing
/login                          # Authentication
/signup                         # Registration
/dashboard                      # User dashboard (creates/manages hubs)

# Tenant Hubs ({tenant}.thorbis.com)
/                               # Tenant home page
/businesses                     # Business listings
/businesses/{slug}              # Business details
/categories/{category}          # Category pages
/search                         # Search functionality
/contact                        # Contact information

# Admin Platform (admin.thorbis.com)
/                               # Admin dashboard
/tenants                        # Tenant management
/analytics                      # Platform analytics
/settings                       # Platform configuration

# API Gateway (api.thorbis.com)
/v1/tenants                     # Tenant CRUD
/v1/tenants/{id}/businesses     # Business management
/v1/auth                        # Authentication
/v1/analytics                   # Analytics data
```

## 🔧 **Technical Implementation**

### **1. Next.js App Structure**
```
apps/
├── main/                       # thorbis.com (main platform)
│   ├── app/
│   │   ├── page.js            # Landing page
│   │   ├── login/page.js      # Authentication
│   │   ├── dashboard/         # User management
│   │   └── api/               # Main platform APIs
│   └── middleware.js          # Auth & routing
├── tenants/                    # {tenant}.thorbis.com
│   ├── app/
│   │   ├── page.js            # Tenant home
│   │   ├── businesses/        # Business pages
│   │   ├── search/            # Search functionality
│   │   └── api/               # Tenant-specific APIs
│   └── middleware.js          # Tenant routing & isolation
├── admin/                      # admin.thorbis.com
│   ├── app/
│   │   ├── page.js            # Admin dashboard
│   │   ├── tenants/           # Tenant management
│   │   └── analytics/         # Platform analytics
│   └── middleware.js          # Admin auth & routing
└── shared/                     # Shared components & utilities
    ├── components/
    ├── lib/
    └── types/
```

### **2. Middleware Routing Strategy**
```javascript
// apps/main/middleware.js - Main platform routing
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Handle main platform routes
  if (request.headers.get('host') === 'thorbis.com') {
    return handleMainPlatform(request);
  }
  
  return NextResponse.next();
}

// apps/tenants/middleware.js - Tenant platform routing
export function middleware(request) {
  const host = request.headers.get('host');
  
  // Extract tenant from subdomain
  if (host?.endsWith('.thorbis.com')) {
    const tenant = host.replace('.thorbis.com', '');
    return handleTenantRouting(request, tenant);
  }
  
  return NextResponse.next();
}
```

### **3. Database Isolation Strategy**
Following [SuperTokens multi-tenant patterns](https://supertokens.com/blog/multi-tenant-architecture):

```sql
-- Option A: Schema-per-Tenant (Recommended)
CREATE SCHEMA tenant_santacruz;
CREATE SCHEMA tenant_raleigh;

-- Option B: Row-Level Security (Current approach)
-- Keep current shared schema with RLS policies

-- Option C: Database-per-Tenant (Enterprise)
-- Separate databases for high-security tenants
```

## 🚀 **Migration Strategy**

### **Phase 1: Subdomain Infrastructure**
1. Configure DNS for `*.thorbis.com`
2. Set up SSL wildcards
3. Deploy tenant detection middleware

### **Phase 2: Route Separation**
1. Move main site to `thorbis.com`
2. Move tenant pages to `{tenant}.thorbis.com`
3. Update all internal links

### **Phase 3: App Isolation**
1. Split into separate Next.js apps
2. Implement shared component library
3. Set up monorepo structure

## 📊 **Benefits of This Architecture**

### **Scalability**
- ✅ Unlimited tenants without URL conflicts
- ✅ Independent scaling per tenant
- ✅ Separate CDN strategies

### **Security** 
- ✅ Complete tenant isolation
- ✅ Separate SSL certificates
- ✅ Independent security policies

### **Performance**
- ✅ Tenant-specific optimizations
- ✅ Separate caching strategies  
- ✅ Reduced main app complexity

### **Maintenance**
- ✅ Clear separation of concerns
- ✅ Independent deployments
- ✅ Easier debugging

## 🔄 **Real-World Examples**

### **Shopify** (`{store}.myshopify.com`)
- Clean tenant isolation
- No URL conflicts
- Scalable to millions of stores

### **Slack** (`{workspace}.slack.com`)
- Perfect tenant boundaries
- Independent customization
- Enterprise-grade security

### **GitHub** (`github.com/{org}`)
- Namespace-based approach
- SEO benefits from main domain
- Clear hierarchical structure

## 📋 **Implementation Checklist**

### **Infrastructure**
- [ ] Configure wildcard DNS (`*.thorbis.com`)
- [ ] Set up wildcard SSL certificates
- [ ] Configure load balancer routing

### **Application**
- [ ] Split Next.js apps by domain
- [ ] Implement tenant detection middleware
- [ ] Set up shared component library

### **Database**
- [ ] Implement tenant isolation strategy
- [ ] Migrate existing data
- [ ] Set up tenant-specific analytics

### **Security**
- [ ] Implement tenant-scoped authentication
- [ ] Set up CORS policies
- [ ] Configure security headers

## 🎯 **Recommended Next Steps**

1. **Start with subdomain infrastructure** - Get DNS and SSL configured
2. **Implement middleware routing** - Detect and route by subdomain
3. **Gradually migrate routes** - Move one section at a time
4. **Split applications** - Final step for full isolation

This architecture follows industry best practices and will scale to millions of tenants without URL conflicts or performance issues.