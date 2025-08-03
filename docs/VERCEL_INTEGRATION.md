# Vercel Integration for Automatic Subdomain Management

## 🚀 **Overview**

This integration leverages **Vercel's enterprise-grade multi-tenant infrastructure** to automatically create subdomains, provision SSL certificates, and handle DNS routing for tenant applications.

### **What's Automated**
- ✅ **Subdomain Creation** - Automatic `{tenant}.thorbis.com` provisioning
- ✅ **SSL Certificates** - Automatic issuance and renewal via Let's Encrypt
- ✅ **DNS Routing** - Intelligent traffic routing to correct tenant
- ✅ **Edge Caching** - Global CDN with tenant-specific caching
- ✅ **Security Headers** - Automatic HTTPS, HSTS, and security policies

## 🔧 **Required Environment Variables**

Add these to your `.env.local` and production environment:

```bash
# Vercel API Configuration
VERCEL_TOKEN=your_vercel_api_token_here
VERCEL_TEAM_ID=your_team_id_here  # Optional, for team accounts
VERCEL_PROJECT_ID=your_project_id_here

# Domain Configuration
NEXT_PUBLIC_MAIN_DOMAIN=thorbis.com
NEXT_PUBLIC_TENANT_DOMAIN=thorbis.com
NEXT_PUBLIC_API_URL=https://thorbis.com/api

# Database (existing)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔑 **Getting Your Vercel Credentials**

### **1. Vercel API Token**
```bash
# Create API token at: https://vercel.com/account/tokens
# Select scope: "Full Access" or "Deploy" + "Read"

VERCEL_TOKEN=v1_1234567890abcdef...
```

### **2. Team ID (if using team account)**
```bash
# Get team ID from: https://vercel.com/teams/[team-slug]/settings
# Or via API: curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/teams

VERCEL_TEAM_ID=team_1234567890abcdef
```

### **3. Project ID**
```bash
# Get project ID from Vercel dashboard or API
# Dashboard: Project Settings → General → Project ID
# API: curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v9/projects

VERCEL_PROJECT_ID=prj_1234567890abcdef
```

## 🌐 **DNS Configuration**

### **Step 1: Add Main Domain to Vercel**
1. Go to Vercel Dashboard → Project → Domains
2. Add `thorbis.com` as a domain
3. Follow Vercel's DNS setup instructions

### **Step 2: Configure Nameservers**
Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### **Step 3: Verify Wildcard Support**
Vercel automatically supports `*.thorbis.com` once the main domain is verified.

## 📋 **Integration Flow**

### **Subdomain Creation Process**
1. **User Creates Hub** → Form submission in dashboard
2. **Database Record** → Local hub created with `status: 'pending'`
3. **Vercel API Call** → Automatic subdomain provisioning
4. **SSL Provisioning** → Automatic certificate generation
5. **Status Update** → Hub status changed to `'active'`
6. **DNS Propagation** → Usually complete within 30 seconds

### **Error Handling**
```javascript
// If Vercel creation fails:
1. Hub status → 'failed'
2. User notification → "Contact support"
3. Admin alert → Manual review required
4. Retry mechanism → Automatic retry after 5 minutes
```

## 🔍 **Testing Your Integration**

### **1. Verify Environment Variables**
```bash
# Test Vercel API connection
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v2/user

# Should return user information
```

### **2. Test Subdomain Creation**
```bash
# Create test subdomain via API
curl -X POST http://localhost:3000/api/v2/subdomains \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "subdomain": "test-hub",
    "name": "Test Hub",
    "city": "Test City",
    "state": "TS"
  }'
```

### **3. Verify DNS Resolution**
```bash
# Test subdomain resolution
nslookup test-hub.thorbis.com

# Test HTTPS connection
curl -I https://test-hub.thorbis.com
```

## 🏗️ **Integration Architecture**

### **Request Flow**
```
User Request (tenant.thorbis.com)
    ↓
Vercel Edge Network
    ↓
Next.js Middleware (tenant detection)
    ↓
Dynamic Route (app/[tenant]/)
    ↓
Tenant-Specific Content
```

### **Database Integration**
```sql
-- New fields in local_hubs table
ALTER TABLE local_hubs ADD COLUMN vercel_domain_id TEXT;
ALTER TABLE local_hubs ADD COLUMN domain_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE local_hubs ADD COLUMN domain_created_at TIMESTAMPTZ;
ALTER TABLE local_hubs ADD COLUMN domain_removed_at TIMESTAMPTZ;
```

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- **Performance Metrics** - Automatic Core Web Vitals tracking
- **Edge Logs** - Real-time request monitoring
- **Error Tracking** - Automatic error detection and alerts

### **Custom Monitoring**
```javascript
// Track subdomain performance
logger.vercelMetrics({
  subdomain: 'santa-cruz',
  responseTime: 145,
  cacheHit: true,
  edgeRegion: 'sfo1',
});
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Domain not found" Error**
```bash
# Check if domain was added to project
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/domains
```

#### **SSL Certificate Issues**
- **Cause**: Domain not verified or DNS propagation incomplete
- **Solution**: Wait 5-10 minutes and retry
- **Check**: `curl -I https://subdomain.thorbis.com`

#### **403 Forbidden on API Calls**
- **Cause**: Invalid API token or insufficient permissions
- **Solution**: Regenerate token with proper scopes
- **Check**: Token has "Deploy" and "Read" permissions

#### **Subdomain Not Resolving**
```bash
# Check DNS propagation
dig subdomain.thorbis.com

# Should return Vercel's IP addresses
# 76.76.19.61 or similar
```

## 🎯 **Production Deployment**

### **Environment Setup**
```bash
# Production environment variables
VERCEL_TOKEN=prod_token_here
VERCEL_PROJECT_ID=prod_project_id
NEXT_PUBLIC_MAIN_DOMAIN=thorbis.com

# Set in Vercel dashboard under:
# Project Settings → Environment Variables
```

### **Domain Verification**
1. **Add Production Domain** to Vercel project
2. **Update Nameservers** at domain registrar
3. **Verify Wildcard** support is working
4. **Test SSL** on `*.thorbis.com`

### **Health Checks**
```javascript
// Add to your monitoring
const healthCheck = {
  vercelAPI: () => testVercelConnection(),
  domainResolution: () => testWildcardDNS(),
  sslCertificates: () => testSSLValidity(),
  subdomainCreation: () => testEndToEndFlow(),
};
```

## 📈 **Scaling Considerations**

### **Rate Limits**
- **Vercel API**: 100 requests/minute per token
- **Domain Creation**: 10 domains/minute recommended
- **Bulk Operations**: Use queue system for large batches

### **Cost Optimization**
- **Edge Caching**: Automatic for static assets
- **Function Invocations**: Optimized routing reduces compute
- **Bandwidth**: Global CDN reduces transfer costs

## 🔒 **Security Best Practices**

### **API Token Security**
- ✅ Store tokens in secure environment variables
- ✅ Use team tokens with minimal required permissions
- ✅ Rotate tokens every 90 days
- ✅ Monitor token usage in Vercel dashboard

### **Domain Security**
- ✅ Enable HSTS headers (automatic with Vercel)
- ✅ Use secure cookies for authentication
- ✅ Implement CSP headers per tenant
- ✅ Monitor for subdomain takeover attempts

## 🎉 **Benefits of Vercel Integration**

### **For Developers**
- 🚀 **Zero DNS Management** - Vercel handles everything
- ⚡ **Instant SSL** - Automatic certificate provisioning
- 🔄 **Automatic Renewals** - Never worry about expiring certificates
- 📊 **Built-in Analytics** - Performance monitoring included

### **For Users**
- ⚡ **Fast Performance** - Global edge network
- 🔒 **Secure by Default** - HTTPS everywhere
- 🌍 **Global Availability** - Works worldwide
- 📱 **Mobile Optimized** - Edge-optimized delivery

### **For Business**
- 💰 **Cost Effective** - No infrastructure management
- 📈 **Infinitely Scalable** - Handles millions of subdomains
- 🔧 **Zero Maintenance** - Vercel manages all infrastructure
- 🚀 **Professional Grade** - Enterprise SLA and support

This integration transforms your multi-tenant application into a professional, scalable platform that can handle unlimited growth! 🌟