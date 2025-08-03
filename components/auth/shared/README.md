# Intelligent Login System

An extremely intelligent login system that provides contextual messaging and smart redirects based on user intent.

## 🚀 Features

- **Context Detection**: Automatically detects what users were trying to do
- **Intelligent Messaging**: Shows relevant information based on user intent  
- **Smart Redirects**: Takes users exactly where they intended to go after login
- **Business Context**: Special handling for business-related actions
- **Social Proof**: Shows relevant statistics and benefits
- **Time-Sensitive Alerts**: Highlights urgent actions
- **Responsive Design**: Works perfectly on all devices

## 📋 Usage Examples

### Basic Implementation

```javascript
// In any component where you need authentication
import { IntelligentLoginButton } from '@components/auth/shared/IntelligentLoginButton';
import { redirectToLogin } from '@lib/auth/intelligentRedirects';

// Simple redirect
redirectToLogin.forAddingBusiness();

// Component usage
<IntelligentLoginButton 
  context="add-business" 
  variant="intelligent"
  showIcon={true}
  showBadge={true}
  badgeText="Free"
>
  Add Your Business
</IntelligentLoginButton>
```

### Business Actions

```javascript
// Add business
<AddBusinessLoginButton variant="intelligent" />

// Claim business
<ClaimBusinessLoginButton 
  businessId="123" 
  variant="intelligent" 
/>

// Write review
<WriteReviewLoginButton 
  businessId="123"
  variant="intelligent"
>
  Share Your Experience
</WriteReviewLoginButton>

// Save business
<SaveBusinessLoginButton 
  businessId="123"
  variant="intelligent"
/>

// Book service
<BookServiceLoginButton 
  businessId="123"
  variant="intelligent"
  showBadge={true}
  badgeText="Quick & Easy"
/>
```

### Dashboard Access

```javascript
// User dashboard
<DashboardLoginButton role="user" variant="intelligent" />

// Business dashboard  
<DashboardLoginButton role="business" variant="intelligent" />

// Admin dashboard
<DashboardLoginButton role="admin" variant="intelligent" />
```

### Premium Features

```javascript
<PremiumLoginButton 
  variant="intelligent"
  showBadge={true}
  badgeText="Upgrade"
>
  Unlock Advanced Features
</PremiumLoginButton>
```

### Custom Context

```javascript
<IntelligentLoginButton 
  context="custom-action"
  contextParams={{ feature: "analytics", plan: "premium" }}
  variant="intelligent"
  showIcon={true}
  showBadge={true}
  badgeText="New!"
>
  Access Analytics
</IntelligentLoginButton>
```

## 🔗 URL Parameters

The system automatically handles these URL parameters:

- `context` - The action context (e.g., 'add-business', 'write-review')
- `redirect` - Where to go after login
- `business` - Business ID for business-specific actions
- `business_action` - Specific business action (review, save, book, claim)
- `action` - Generic action parameter
- `referrer` - Source page information

## 🎯 Available Contexts

### Business Contexts
- `add-business` - Adding a new business listing
- `claim-business` - Claiming an existing business
- `business-dashboard` - Accessing business dashboard

### Social Contexts  
- `write-review` - Writing a business review
- `save-business` - Saving/favoriting a business
- `join-community` - Joining the community

### Booking Contexts
- `book-service` - Booking a service appointment

### Account Contexts
- `view-profile` - Accessing user profile
- `admin-access` - Administrator access

### Premium Contexts
- `premium-features` - Accessing premium features

### Support Contexts
- `get-support` - Getting help and support

## 📱 Context Detection

The system automatically detects context from:

1. **Explicit URL Parameters**: `?context=add-business`
2. **Path Analysis**: `/add-a-business` → `add-business` context
3. **Action Parameters**: `?action=review&business=123`
4. **Referrer Information**: Coming from business listing pages
5. **Business Actions**: `?business=123&business_action=claim`

## 🎨 Contextual Messaging

Each context provides:

- **Title**: Context-specific heading
- **Subtitle**: Descriptive subtitle
- **Icon**: Relevant visual indicator
- **Message**: Explanatory text
- **Benefits**: List of what users get
- **Social Proof**: Trust indicators
- **Priority Level**: Urgency indication
- **Action Text**: Custom button text

## 🔄 Smart Redirects

After successful login, users are redirected to:

1. **Context-specific pages** (e.g., add business form)
2. **Business-specific pages** (e.g., review form for specific business)
3. **Role-based dashboards** (user/business/admin)
4. **Original intended destination**

## 📊 Analytics Integration

The system logs:

- Context detection events
- Login attempts with context
- Success/failure rates by context
- User journey analytics
- Conversion tracking

## 🛠️ Development Guidelines

### Adding New Contexts

1. **Define Context** in `lib/auth/loginContext.js`:
```javascript
'new-action': {
  title: 'Action Title',
  subtitle: 'Action description',
  icon: '🎯',
  message: 'Why login is needed',
  benefits: ['Benefit 1', 'Benefit 2'],
  redirectPath: '/target-page',
  priority: 'medium',
  actionText: 'Continue Action',
  category: 'category'
}
```

2. **Add Detection Logic** in `LoginContextDetector`:
```javascript
{ pattern: /\/new-action/, context: 'new-action' }
```

3. **Create Helper Function** in `intelligentRedirects.js`:
```javascript
static redirectToNewAction(params = {}) {
  return this.redirectWithContext('new-action', params);
}
```

4. **Add Button Component** (optional):
```javascript
export function NewActionLoginButton(props) {
  // Implementation
}
```

### Testing Contexts

Test all contexts with these URLs:

- `/login?context=add-business`
- `/login?context=write-review&business=123`
- `/login?action=save&business=123`
- Direct path: `/add-a-business` (should redirect with context)

## 🎪 Demo

Visit `/login-demo` to see all contexts in action.

## 🔧 Troubleshooting

### Context Not Detected
- Check URL parameters are correctly formatted
- Verify context exists in `LOGIN_CONTEXTS`
- Check path patterns in `LoginContextDetector`

### Wrong Redirect After Login
- Verify `redirectPath` in context definition
- Check `getPostLoginRedirect` logic
- Ensure URL parameters are preserved

### Missing Messaging
- Check context definition completeness
- Verify component props are passed correctly
- Check for JavaScript errors in console

## 📚 Best Practices

1. **Always provide context** when redirecting to login
2. **Use descriptive action text** that matches user intent
3. **Include relevant benefits** for each context
4. **Test across all devices** and screen sizes
5. **Monitor analytics** to optimize messaging
6. **Keep messages concise** but informative
7. **Use appropriate urgency levels** for different actions

This intelligent login system transforms authentication from a barrier into a helpful, contextual experience that guides users toward their goals.