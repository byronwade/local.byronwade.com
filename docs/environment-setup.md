# Environment Variables Setup Guide

This guide provides comprehensive instructions for setting up environment variables for the complete authentication, email, and business management system.

## Required Environment Variables

### Core Application Settings

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="Thorbis"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Supabase Configuration

```bash
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Resend Email Service

```bash
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY="re_your_api_key"
RESEND_DOMAIN="yourdomain.com"

# System email addresses
ADMIN_EMAIL="admin@yourdomain.com"
SUPPORT_EMAIL="support@yourdomain.com"
```

### OAuth Providers (Optional)

Enable social login by configuring OAuth providers:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Add other providers as needed...
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Set up authentication providers in Authentication > Providers
4. Configure email templates in Authentication > Email Templates
5. Set up the database schema (see `lib/supabase/complete_schema.sql`)

### 2. Resend Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key from the dashboard
4. Set up custom email templates

### 3. OAuth Providers Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Database Schema

Run the complete database schema found in `lib/supabase/complete_schema.sql` to set up all required tables for:

- User authentication and profiles
- Business listings and claims
- Email automation and scheduling
- File storage and reviews

## Security Best Practices

1. **Never commit real environment variables** to version control
2. **Use different keys for development/staging/production**
3. **Regularly rotate API keys and secrets**
4. **Enable 2FA on all external service accounts**
5. **Set up proper access controls and permissions**
6. **Monitor API usage and set up billing alerts**

## Feature Flags

Enable or disable features using environment variables:

```bash
# Feature toggles
FEATURE_BUSINESS_CLAIMS="true"
FEATURE_BUSINESS_SUBMISSIONS="true"
FEATURE_USER_REVIEWS="true"
FEATURE_PHONE_VERIFICATION="false"
FEATURE_AI_RECOMMENDATIONS="false"
```

## Development vs Production

### Development Settings
- Use localhost URLs
- Enable debug logging
- Allow test data
- Disable rate limiting

### Production Settings
- Use HTTPS URLs
- Enable security headers
- Configure proper CORS
- Enable rate limiting
- Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Email not sending**: Check Resend domain verification
2. **OAuth login fails**: Verify redirect URLs match exactly
3. **Database errors**: Ensure schema is properly set up
4. **CORS errors**: Check NEXT_PUBLIC_APP_URL matches your domain

### Debugging

Enable debug logging:
```bash
DEBUG="true"
```

Check logs for specific error messages and refer to the comprehensive logging system implemented throughout the application.

## Support

For additional help:
1. Check the console logs for specific error messages
2. Verify all required environment variables are set
3. Test individual components (auth, email, database) separately
4. Review Supabase logs and metrics
5. Check Resend delivery logs

## Complete Environment Template

For a complete list of all possible environment variables, refer to the comprehensive configuration in the codebase comments.