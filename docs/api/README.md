# API Documentation

## 📡 Enterprise API Documentation

Comprehensive API documentation following **OpenAPI 3.0 standards** used by Stripe, Shopify, and other API-first companies.

### Documentation Structure

```
docs/api/
├── README.md           # This overview
├── openapi.yaml        # OpenAPI specification
├── endpoints/          # Individual endpoint documentation
├── schemas/            # Data schema definitions
├── examples/           # Request/response examples
├── guides/             # Integration guides
└── changelog/          # API version changelog
```

### API Documentation Standards

#### 1. **OpenAPI Specification**
- Complete API schema in `openapi.yaml`
- Automated documentation generation
- Interactive API explorer
- Client SDK generation

#### 2. **Endpoint Documentation**
Each endpoint includes:
- Purpose and use cases
- Request/response schemas
- Authentication requirements
- Rate limiting information
- Error codes and handling
- Code examples in multiple languages

#### 3. **Authentication**
```yaml
# API Key Authentication
securitySchemes:
  ApiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key
    
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

#### 4. **Rate Limiting**
```yaml
# Rate limit headers
headers:
  X-RateLimit-Limit:
    description: Request limit per time window
  X-RateLimit-Remaining:
    description: Remaining requests in current window
  X-RateLimit-Reset:
    description: Time when rate limit resets
```

### API Endpoints

#### Business Operations
- `GET /api/business/search` - Search businesses
- `GET /api/business/{id}` - Get business details
- `POST /api/business` - Create business
- `PUT /api/business/{id}` - Update business
- `DELETE /api/business/{id}` - Delete business

#### User Operations
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

#### Review Operations
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

### Data Schemas

#### Business Schema
```yaml
Business:
  type: object
  required:
    - name
    - category
    - address
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      maxLength: 100
    category:
      type: string
      enum: [restaurant, retail, service, healthcare]
    address:
      $ref: '#/components/schemas/Address'
    phone:
      type: string
      pattern: '^[\+]?[0-9\-\(\)\s]+$'
    rating:
      type: number
      minimum: 0
      maximum: 5
```

#### Error Schema
```yaml
Error:
  type: object
  required:
    - code
    - message
  properties:
    code:
      type: string
    message:
      type: string
    details:
      type: object
    timestamp:
      type: string
      format: date-time
```

### Error Handling

#### Standard Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid/missing auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

#### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### API Versioning

#### Version Strategy
- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Header Versioning**: `API-Version: 2024-01-15`
- **Backward Compatibility**: Minimum 12 months

#### Deprecation Process
1. **Announce** - 6 months notice
2. **Deprecation Headers** - Include in responses
3. **Migration Guide** - Provide clear upgrade path
4. **Sunset** - Remove after notice period

### Integration Guides

#### Getting Started
1. **API Key Setup** - Obtain and configure API keys
2. **Authentication** - Implement auth flow
3. **First Request** - Make your first API call
4. **Error Handling** - Handle errors gracefully
5. **Rate Limiting** - Implement proper rate limiting

#### Best Practices
- **Idempotency** - Use idempotency keys for writes
- **Pagination** - Handle paginated responses
- **Caching** - Implement response caching
- **Retries** - Implement exponential backoff
- **Monitoring** - Track API usage and errors

### Development Tools

#### API Testing
```bash
# Test endpoint with curl
curl -X GET "https://api.example.com/v1/business/search" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### SDK Examples
```javascript
// JavaScript SDK
import { BusinessAPI } from '@company/api-client';

const client = new BusinessAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

const businesses = await client.business.search({
  query: 'pizza',
  location: 'San Francisco'
});
```

### Documentation Maintenance

- **Automated Updates** - Generate docs from code
- **Version Control** - Track documentation changes
- **Review Process** - Technical writing review
- **User Feedback** - Collect and incorporate feedback
- **Analytics** - Track documentation usage