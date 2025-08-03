# API V2 Documentation

## 🚀 Overview

The V2 API provides a comprehensive, performance-optimized, and secure interface for managing businesses, reviews, users, and analytics. Built with modern best practices including authentication, caching, rate limiting, and comprehensive error handling.

## 🏗️ Architecture

### Core Principles
- **Performance First**: All endpoints optimized for speed with intelligent caching
- **Security Focused**: Role-based access control, rate limiting, and input validation
- **Type Safe**: Full TypeScript support with exported response types
- **Scalable**: Designed to handle high traffic with proper middleware
- **Observable**: Comprehensive logging and analytics built-in

### Middleware Stack
```typescript
Request → Performance Monitoring → Authentication → Rate Limiting → Caching → Validation → Handler
```

## 🔐 Authentication

### Methods
1. **JWT Bearer Token** (Primary)
2. **API Key** (For integrations)

### Headers
```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>  // Alternative authentication
```

### Roles & Permissions
- **Admin**: Full access to all resources
- **Business Owner**: Manage own businesses and view analytics
- **User**: Read access, can create reviews
- **Anonymous**: Limited read access to published content

## 📊 Rate Limiting

| Role | Requests/Hour | Burst Limit |
|------|---------------|-------------|
| Anonymous | 100 | 20 |
| User | 1000 | 50 |
| Business Owner | 2000 | 100 |
| Admin | 5000 | 200 |
| API Key | Custom | Custom |

Rate limit headers are included in all responses:
```
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640995200
```

## 🗂️ API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v2/auth/login` | User login with enhanced security | No |
| POST | `/api/v2/auth/signup` | User registration with validation | No |
| POST | `/api/v2/auth/logout` | Secure logout | Yes |
| POST | `/api/v2/auth/refresh` | Refresh JWT token | Yes |
| POST | `/api/v2/auth/verify` | Email verification | No |
| POST | `/api/v2/auth/reset-password` | Password reset | No |

### Businesses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v2/businesses` | Search businesses with filters | No |
| POST | `/api/v2/businesses` | Create new business | Yes |
| GET | `/api/v2/businesses/{id}` | Get business details | No |
| PUT | `/api/v2/businesses/{id}` | Update business | Yes (Owner/Admin) |
| DELETE | `/api/v2/businesses/{id}` | Delete business | Yes (Admin) |
| GET | `/api/v2/businesses/{id}/photos` | Get business photos | No |
| POST | `/api/v2/businesses/{id}/photos` | Upload business photos | Yes (Owner/Admin) |
| GET | `/api/v2/businesses/{id}/hours` | Get business hours | No |
| PUT | `/api/v2/businesses/{id}/hours` | Update business hours | Yes (Owner/Admin) |
| POST | `/api/v2/businesses/{id}/claim` | Claim business ownership | Yes |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v2/reviews` | Get reviews with filters | No |
| POST | `/api/v2/reviews` | Create new review | Yes |
| GET | `/api/v2/reviews/{id}` | Get review details | No |
| PUT | `/api/v2/reviews/{id}` | Update review | Yes (Author/Admin) |
| DELETE | `/api/v2/reviews/{id}` | Delete review | Yes (Author/Admin) |
| POST | `/api/v2/reviews/{id}/helpful` | Mark review helpful | Yes |
| POST | `/api/v2/reviews/{id}/report` | Report inappropriate review | Yes |
| POST | `/api/v2/reviews/{id}/respond` | Business response to review | Yes (Owner/Admin) |

### Analytics
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v2/analytics` | Get analytics data | Yes (Owner/Admin) |
| GET | `/api/v2/analytics/businesses` | Business performance metrics | Yes (Owner/Admin) |
| GET | `/api/v2/analytics/reviews` | Review analytics | Yes (Owner/Admin) |
| GET | `/api/v2/analytics/users` | User analytics | Yes (Admin) |
| GET | `/api/v2/analytics/search` | Search analytics | Yes (Admin) |
| POST | `/api/v2/analytics/events` | Track custom events | Yes |

### Content Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v2/content/categories` | Get business categories | No |
| POST | `/api/v2/content/categories` | Create category | Yes (Admin) |
| GET | `/api/v2/content/uploads` | Get upload URL | Yes |
| POST | `/api/v2/content/media` | Process uploaded media | Yes |

### Admin Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v2/admin/users` | List users | Yes (Admin) |
| GET | `/api/v2/admin/businesses` | List businesses (all) | Yes (Admin) |
| PUT | `/api/v2/admin/businesses/{id}/approve` | Approve business | Yes (Admin) |
| GET | `/api/v2/admin/reviews/pending` | Get pending reviews | Yes (Admin) |
| PUT | `/api/v2/admin/reviews/{id}/moderate` | Moderate review | Yes (Admin) |
| GET | `/api/v2/admin/reports` | Get reports | Yes (Admin) |

## 📝 Request/Response Format

### Standard Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    performance?: {
      queryTime: number;
      cacheHit: boolean;
    };
    rateLimit?: {
      remaining: number;
      reset: number;
    };
  };
  timestamp: string;
}
```

### Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| UNAUTHORIZED | Authentication required | 401 |
| FORBIDDEN | Insufficient permissions | 403 |
| NOT_FOUND | Resource not found | 404 |
| VALIDATION_ERROR | Invalid input data | 400 |
| RATE_LIMIT_EXCEEDED | Too many requests | 429 |
| INTERNAL_ERROR | Server error | 500 |

## 🔍 Query Parameters

### Common Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort order
- `include`: Include related data

### Business Search Parameters
```typescript
{
  query?: string;              // Search term
  location?: string;           // Location filter
  category?: string;           // Category slug
  categories?: string[];       // Multiple categories
  rating?: number;             // Minimum rating (1-5)
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  features?: string[];         // Required features
  open?: 'now' | 'today' | 'any';
  verified?: boolean;          // Verified businesses only
  featured?: boolean;          // Featured businesses only
  bounds?: {                   // Geographic bounds
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center?: {                   // Geographic center with radius
    lat: number;
    lng: number;
    radius?: number;           // km, default: 10
  };
  sort?: 'relevance' | 'rating' | 'distance' | 'newest' | 'popular';
  include?: ('photos' | 'reviews' | 'categories' | 'hours' | 'metrics')[];
}
```

### Review Query Parameters
```typescript
{
  businessId?: string;         // Filter by business
  userId?: string;             // Filter by user (permissions required)
  rating?: number;             // Filter by rating
  status?: 'pending' | 'approved' | 'rejected' | 'flagged';
  verified?: boolean;          // Verified purchase only
  hasPhotos?: boolean;         // Reviews with photos
  hasResponse?: boolean;       // Reviews with business response
  sort?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  include?: ('user' | 'business' | 'photos' | 'responses' | 'helpful_votes')[];
}
```

### Analytics Query Parameters
```typescript
{
  type: 'overview' | 'businesses' | 'users' | 'reviews' | 'search' | 'performance';
  period: '1d' | '7d' | '30d' | '90d' | '1y' | 'all';
  granularity: 'hour' | 'day' | 'week' | 'month';
  businessId?: string;         // Specific business
  category?: string;           // Category filter
  location?: {                 // Location filter
    city?: string;
    state?: string;
    country?: string;
  };
  metrics?: string[];          // Specific metrics to include
  compare?: boolean;           // Include comparison data
  compareperiod?: 'previous' | 'previous_year';
}
```

## 📊 Caching Strategy

### Cache TTL by Endpoint
- **Business Search**: 5 minutes
- **Business Details**: 5 minutes
- **Reviews**: 5 minutes
- **Analytics**: 10 minutes
- **Categories**: 1 hour
- **User Profile**: 15 minutes

### Cache Keys Format
```
api:v2:{endpoint}:{params_hash}:{user_id}
```

### Cache Headers
```
X-Cache: HIT | MISS
X-Cache-Key: cache_key
X-Cache-TTL: ttl_in_ms
```

## 📈 Performance Monitoring

### Response Headers
```
X-Response-Time: 150.25ms
X-Auth-Time: 5.10ms
X-Query-Time: 89.15ms
X-Timestamp: 2024-01-01T00:00:00Z
```

### Performance Targets
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time | <300ms | >1000ms |
| Auth Time | <100ms | >500ms |
| Query Time | <200ms | >800ms |
| Cache Hit Rate | >80% | <60% |
| Error Rate | <0.1% | >1% |

## 🛡️ Security Features

### Request Security
- HTTPS only in production
- CORS properly configured
- Request size limits
- SQL injection prevention
- XSS protection headers

### Data Protection
- Sensitive data encryption
- PII data handling
- Secure password storage
- JWT token security
- API key management

### Audit Logging
All sensitive operations are logged with:
- User ID and role
- IP address and user agent
- Timestamp and action
- Request parameters
- Response status

## 🚀 Getting Started

### 1. Authentication
```typescript
// Login
const response = await fetch('/api/v2/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123!',
    rememberMe: true
  })
});

const { data } = await response.json();
const { session } = data;
```

### 2. Search Businesses
```typescript
const params = new URLSearchParams({
  query: 'restaurant',
  location: 'Atlanta, GA',
  category: 'restaurants',
  rating: '4',
  limit: '20'
});

const response = await fetch(`/api/v2/businesses?${params}`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
});

const { data } = await response.json();
const { businesses } = data;
```

### 3. Create Review
```typescript
const response = await fetch('/api/v2/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    businessId: 'business-uuid',
    rating: 5,
    title: 'Great Experience!',
    text: 'Had an amazing time at this restaurant. Food was excellent and service was outstanding.',
    verifiedPurchase: true,
    aspects: {
      service: 5,
      quality: 5,
      value: 4,
      atmosphere: 5
    }
  })
});

const { data } = await response.json();
const { review } = data;
```

### 4. Get Analytics
```typescript
const params = new URLSearchParams({
  type: 'businesses',
  period: '30d',
  businessId: 'business-uuid'
});

const response = await fetch(`/api/v2/analytics?${params}`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
});

const { data } = await response.json();
const { analytics } = data;
```

## 📋 TypeScript Support

All endpoints export TypeScript types for responses:

```typescript
import type { 
  BusinessSearchResponse,
  BusinessCreateResponse,
  ReviewsResponse,
  AnalyticsResponse 
} from '@/app/api/v2/...';
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
API_RATE_LIMIT_REQUESTS=1000
API_RATE_LIMIT_WINDOW_MS=3600000
CACHE_TTL_DEFAULT=300
ENABLE_API_ANALYTICS=true
```

## 📞 Support

- **Documentation**: This file and inline code comments
- **Error Tracking**: All errors are logged with context
- **Performance Monitoring**: Real-time metrics available
- **Rate Limiting**: Automatic with clear error messages

## 🚀 Migration from V1

### Key Differences
1. **Consistent Response Format**: All endpoints return standardized responses
2. **Enhanced Authentication**: JWT with role-based access control
3. **Better Error Handling**: Detailed error codes and messages
4. **Performance Optimizations**: Caching and query optimization
5. **Type Safety**: Full TypeScript support

### Migration Steps
1. Update authentication to use JWT tokens
2. Adapt to new response format structure
3. Update error handling for new error codes
4. Leverage new filtering and sorting options
5. Implement proper caching strategies

The V2 API provides a robust, scalable foundation for modern applications with comprehensive business, review, and analytics capabilities.