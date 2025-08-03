# API Routes Documentation

## Structure Overview

The API is organized into logical groups with consistent patterns and versioning.

## Current API Routes

### Core Business Operations
- `/api/biz` - Legacy business endpoint (to be migrated)
- `/api/business/*` - Business management endpoints
  - `/api/business/search` - Business search
  - `/api/business/submit` - Submit new business
  - `/api/business/claim` - Claim business ownership
  - `/api/business/featured` - Featured businesses

### User Management
- `/api/users` - User profile operations

### Geolocation Services
- `/api/geocode` - Forward geocoding
- `/api/reverse-geocode` - Reverse geocoding
- `/api/geolocation` - User location detection
- `/api/place-details` - Place information
- `/api/autocomplete` - Search suggestions

### Admin Operations
- `/api/admin/users/*` - User administration

### Utilities
- `/api/send` - Email/messaging services
- `/api/shorten` - URL shortening
- `/api/data-sync` - Data synchronization

## ✅ V2 API Implementation Status

### 🔐 Authentication & Users
```
/api/v2/auth/
├── ✅ login           - Enhanced login with security & session management
├── ✅ signup          - Comprehensive registration with validation
├── 🚧 logout          - Secure logout (pending)
├── 🚧 refresh         - JWT refresh tokens (pending)  
├── 🚧 verify          - Email verification (pending)
└── 🚧 reset-password  - Password reset flow (pending)

/api/v2/users/ (pending)
├── 🚧 profile         - User profile management
├── 🚧 preferences     - User preferences  
├── 🚧 avatar          - Avatar upload/management
└── 🚧 activity        - User activity tracking
```

### 🏢 Business Management
```
/api/v2/businesses/
├── ✅ GET /           - Advanced search with geographic & category filters
├── ✅ POST /          - Create business with geocoding & validation
├── ✅ GET /[id]       - Detailed business profile with relations
├── ✅ PUT /[id]       - Update business (owner/admin permissions)
├── ✅ DELETE /[id]    - Soft delete business (admin only)
├── 🚧 [id]/photos    - Photo management (pending)
├── 🚧 [id]/hours     - Business hours CRUD (pending)
├── 🚧 [id]/claim     - Business claiming workflow (pending)
├── 🚧 categories     - Category management (pending)
├── 🚧 featured       - Featured business management (pending)
└── 🚧 nearby         - Geographic proximity search (pending)
```

### ⭐ Reviews & Ratings
```
/api/v2/reviews/
├── ✅ GET /           - Advanced review search with filters & sorting
├── ✅ POST /          - Create review with content moderation
├── 🚧 GET /[id]       - Individual review details (pending)
├── 🚧 PUT /[id]       - Update review (author/admin) (pending)
├── 🚧 DELETE /[id]    - Delete review (pending)
├── 🚧 [id]/helpful   - Mark review helpful (pending)
├── 🚧 [id]/report    - Report inappropriate content (pending)
├── 🚧 business/[businessId] - Business-specific reviews (pending)
└── 🚧 user/[userId]  - User's review history (pending)
```

### 🌍 Geolocation & Places (Legacy V1)
```
/api/places/ (using existing V1 endpoints)
├── ✅ geocode         - Address to coordinates
├── ✅ reverse-geocode - Coordinates to address  
├── ✅ autocomplete    - Search suggestions
├── ✅ place-details   - Place information
└── 🚧 V2 migration    - Enhanced geolocation API (pending)
```

### 📊 Analytics & Business Intelligence  
```
/api/v2/analytics/
├── ✅ GET /?type=overview     - Key metrics dashboard
├── ✅ GET /?type=businesses   - Business performance metrics
├── ✅ GET /?type=reviews      - Review analytics & insights
├── ✅ GET /?type=users        - User analytics (admin only)
├── ✅ GET /?type=search       - Search analytics (admin only)
├── ✅ GET /?type=performance  - System performance metrics
└── 🚧 POST /events           - Custom event tracking (pending)
```

### 🖼️ Content Management
```
/api/v2/content/ (pending implementation)
├── 🚧 categories     - Business category CRUD
├── 🚧 photos         - Photo upload & processing
├── 🚧 uploads        - File upload handling
└── 🚧 media          - Media optimization & CDN
```

### 👨‍💼 Admin Operations
```
/api/v2/admin/ (pending implementation) 
├── 🚧 users/         - User administration & moderation
├── 🚧 businesses/    - Business approval & management
├── 🚧 reviews/       - Review moderation & responses
├── 🚧 reports/       - Content reports & abuse handling
└── 🚧 settings/      - System configuration & features
```

### 🛠️ Core Infrastructure (✅ Completed)
```
lib/api/middleware.ts - Enterprise-grade middleware system
├── ✅ withAuth              - JWT + API key authentication
├── ✅ withCache             - Intelligent caching with TTL
├── ✅ withValidation        - Zod schema validation  
├── ✅ withPerformanceMonitoring - Real-time metrics
├── ✅ Rate Limiting         - Per-user/role limits
├── ✅ Security Headers      - OWASP compliance
├── ✅ Error Handling        - Standardized error responses
└── ✅ Response Formatting   - Consistent API responses
```

## API Conventions

### HTTP Methods
- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update entire resources
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources

### Response Format
All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "pagination": {},
    "filters": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Handling
Error responses include detailed information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Authentication
- Bearer token authentication
- JWT tokens from Supabase Auth
- Role-based access control (RBAC)
- Rate limiting per user/IP

### Pagination
Consistent pagination across all list endpoints:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering & Sorting
Query parameters for filtering:
- `filter[field]=value`
- `sort=field:asc|desc`
- `include=related,fields`
- `fields=specific,fields,only`

## Migration Plan

### Phase 1: API V2 Structure
1. Create `/api/v2` directory structure
2. Implement new endpoints with proper organization
3. Add comprehensive validation and error handling
4. Implement rate limiting and security measures

### Phase 2: Legacy Migration
1. Update client code to use V2 endpoints
2. Add deprecation warnings to V1 endpoints
3. Monitor usage and migration progress
4. Sunset V1 endpoints after migration period

### Phase 3: Documentation & Testing
1. Generate OpenAPI/Swagger documentation
2. Add comprehensive API tests
3. Performance optimization and monitoring
4. Client SDK generation

## Security Considerations

### Input Validation
- Validate all input data
- Sanitize user content
- Prevent SQL injection and XSS
- Rate limiting and abuse prevention

### Authentication & Authorization
- JWT token validation
- Role-based permissions
- Resource-level access control
- Audit logging for sensitive operations

### Data Protection
- Encrypt sensitive data
- Secure file uploads
- HTTPS enforcement
- CORS configuration

## Performance Optimization

### Caching Strategy
- Redis for session storage
- CDN for static assets
- API response caching
- Database query optimization

### Monitoring & Logging
- Request/response logging
- Performance metrics
- Error tracking
- Usage analytics

## Development Guidelines

### Code Organization
- Feature-based routing
- Consistent error handling
- Proper HTTP status codes
- Documentation for all endpoints

### Testing Requirements
- Unit tests for all endpoints
- Integration tests for workflows
- Load testing for performance
- Security testing for vulnerabilities