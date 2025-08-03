# API Documentation

## Overview

The Thorbis API provides RESTful endpoints for managing businesses, users, reviews, and other platform features. All endpoints use JSON for request and response bodies.

## Base URL

```
Production: https://local.byronwade.com/api
Development: http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens provided by Supabase Auth.

### Authorization Header
```
Authorization: Bearer <jwt_token>
```

### Authentication Flow
1. Users authenticate via Supabase Auth
2. Client receives JWT token
3. Include token in subsequent API requests
4. Server validates token and user permissions

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Endpoints

### Business Management

#### Get Business Details
```http
GET /api/biz
```

**Query Parameters:**
- `id` (required): Business ID
- `include` (optional): Additional data to include (reviews, photos, hours)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "business-id",
    "name": "Business Name",
    "address": "123 Main St",
    "city": "City",
    "state": "State",
    "zip": "12345",
    "phone": "+1234567890",
    "website": "https://example.com",
    "rating": 4.5,
    "review_count": 150,
    "categories": ["restaurant", "pizza"],
    "hours": {
      "monday": "9:00-17:00",
      "tuesday": "9:00-17:00"
    },
    "photos": [
      {
        "id": "photo-id",
        "url": "https://example.com/photo.jpg",
        "caption": "Photo caption"
      }
    ]
  }
}
```

#### Search Businesses
```http
GET /api/business/search
```

**Query Parameters:**
- `q` (optional): Search query
- `location` (optional): Location filter
- `category` (optional): Category filter
- `lat` (optional): Latitude for nearby search
- `lng` (optional): Longitude for nearby search
- `radius` (optional): Search radius in kilometers
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "businesses": [],
    "total": 500,
    "has_more": true,
    "filters": {
      "categories": ["restaurant", "retail"],
      "locations": ["City, State"]
    }
  }
}
```

#### Submit New Business
```http
POST /api/business/submit
```

**Request Body:**
```json
{
  "name": "Business Name",
  "address": "123 Main St",
  "city": "City",
  "state": "State",
  "zip": "12345",
  "phone": "+1234567890",
  "website": "https://example.com",
  "email": "contact@business.com",
  "description": "Business description",
  "categories": ["restaurant"],
  "hours": {
    "monday": "9:00-17:00"
  }
}
```

#### Claim Business
```http
POST /api/business/claim
```

**Request Body:**
```json
{
  "business_id": "business-id",
  "verification_method": "phone|email|document",
  "verification_data": "verification details"
}
```

### User Management

#### Get User Profile
```http
GET /api/users
```

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "preferences": {
      "notifications": true,
      "newsletter": false
    }
  }
}
```

#### Update User Profile
```http
PUT /api/users
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "preferences": {
    "notifications": false
  }
}
```

### Geolocation Services

#### Geocode Address
```http
GET /api/geocode
```

**Query Parameters:**
- `address` (required): Address to geocode

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "123 Main St, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "formatted_address": "123 Main St, City, State 12345, USA"
  }
}
```

#### Reverse Geocode
```http
GET /api/reverse-geocode
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "123 Main St",
    "city": "City",
    "state": "State",
    "zip": "12345",
    "country": "USA"
  }
}
```

#### Get User Location
```http
GET /api/geolocation
```

**Response:**
```json
{
  "success": true,
  "data": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10,
    "city": "New York",
    "state": "NY"
  }
}
```

### Place Details

#### Get Place Information
```http
GET /api/place-details
```

**Query Parameters:**
- `place_id` (required): Google Places ID

**Response:**
```json
{
  "success": true,
  "data": {
    "place_id": "google-place-id",
    "name": "Business Name",
    "address": "123 Main St",
    "phone": "+1234567890",
    "website": "https://example.com",
    "rating": 4.5,
    "hours": {},
    "photos": []
  }
}
```

### Autocomplete

#### Search Suggestions
```http
GET /api/autocomplete
```

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): `business|location|all`
- `limit` (optional): Number of suggestions (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "business",
        "text": "Pizza Restaurant",
        "subtitle": "Restaurant in City, State"
      },
      {
        "type": "location", 
        "text": "City, State",
        "subtitle": "City"
      }
    ]
  }
}
```

### Admin Endpoints

#### Get All Users (Admin Only)
```http
GET /api/admin/users
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Users per page
- `status` (optional): Filter by status
- `role` (optional): Filter by role

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [],
    "total": 1000,
    "page": 1,
    "pages": 50
  }
}
```

#### Update User Status (Admin Only)
```http
PUT /api/admin/users/[userId]
```

**Request Body:**
```json
{
  "status": "active|suspended|banned",
  "role": "user|business|admin",
  "reason": "Optional reason for status change"
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `INVALID_REQUEST` | Invalid request format | Request body or parameters are malformed |
| `UNAUTHORIZED` | Authentication required | Missing or invalid authentication token |
| `FORBIDDEN` | Insufficient permissions | User doesn't have required permissions |
| `NOT_FOUND` | Resource not found | Requested resource doesn't exist |
| `VALIDATION_ERROR` | Validation failed | Request data fails validation rules |
| `RATE_LIMITED` | Too many requests | Rate limit exceeded |
| `SERVER_ERROR` | Internal server error | Unexpected server error |

## Rate Limiting

- **Standard endpoints**: 100 requests per minute per IP
- **Search endpoints**: 30 requests per minute per IP
- **Admin endpoints**: 200 requests per minute per authenticated user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Business Events
- `business.created`: New business submitted
- `business.updated`: Business information updated
- `business.claimed`: Business ownership claimed
- `business.verified`: Business verification completed

### User Events
- `user.registered`: New user registration
- `user.updated`: User profile updated
- `user.deleted`: User account deleted

### Webhook Format
```json
{
  "event": "business.created",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z",
  "id": "webhook-id"
}
```

## SDK and Libraries

### JavaScript/TypeScript
```bash
npm install @thorbis/api-client
```

```javascript
import { ThorbisAPI } from '@thorbis/api-client';

const api = new ThorbisAPI({
  baseURL: 'https://local.byronwade.com/api',
  token: 'your-auth-token'
});

const business = await api.business.get('business-id');
```

## Support

For API support and questions:
- **Documentation**: [API Docs](https://docs.local.byronwade.com)
- **Email**: api-support@local.byronwade.com
- **Discord**: [Developer Community](https://discord.gg/thorbis)