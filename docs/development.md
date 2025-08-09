# Development Guide

## Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **Bun**: Latest version (preferred package manager)
- **Git**: For version control
- **PostgreSQL**: Via Supabase (cloud) or local instance

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thorbis.com
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database setup**
   ```bash
   bun run db:push
   bun run seed:database
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

## Project Architecture

### Directory Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (site)/            # Public pages
│   └── api/               # API endpoints
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── business/         # Business-related components
│   ├── shared/           # Shared/common components
│   ├── site/             # Public site components
│   └── ui/               # Base UI components
├── lib/                  # Core utilities and services
│   ├── api/              # API client configurations
│   ├── auth/             # Authentication utilities
│   ├── supabase/         # Supabase integration
│   └── utils/            # Utility functions
├── hooks/                # Custom React hooks
├── store/                # State management (Zustand)
├── context/              # React context providers
└── public/               # Static assets
```

### Component Organization

Components are organized by feature and responsibility:

- **Feature-based**: Components are grouped by the feature they serve
- **Barrel exports**: Each directory has an `index.js` for clean imports
- **Separation of concerns**: UI, business logic, and data fetching are separated

### State Management

We use **Zustand** for state management with the following stores:

- `useAuthStore`: Authentication state
- `useBusinessStore`: Business data and operations
- `useSearchStore`: Search functionality
- `useMapStore`: Map interactions
- `useFormStore`: Form state management

## Development Workflow

### Code Style

- **ESLint**: Automatic linting and formatting
- **Prettier**: Code formatting (via ESLint)
- **TypeScript**: Type safety where applicable
- **Naming conventions**: camelCase for variables, PascalCase for components

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit with descriptive messages
3. Push branch and create pull request
4. Code review and merge to main

### Testing Strategy

- **Unit tests**: Component testing with React Testing Library
- **Integration tests**: API endpoint testing
- **E2E tests**: Critical user flows with Cypress
- **Performance tests**: Core Web Vitals monitoring

## Database Management

### Supabase Integration

- **Authentication**: Built-in auth with social providers
- **Real-time**: Live updates for collaborative features
- **Storage**: File upload and management
- **Edge Functions**: Server-side logic

### Schema Management

```bash
# Generate TypeScript types
bun run types:generate

# Apply schema changes
bun run db:push

# Reset database (development only)
bun run db:reset
```

## API Development

### Route Organization

```
api/
├── admin/              # Admin-only endpoints
├── business/           # Business management
├── users/              # User management
└── [feature]/          # Feature-specific APIs
```

### API Standards

- **RESTful design**: Standard HTTP methods and status codes
- **Error handling**: Consistent error response format
- **Authentication**: JWT tokens via Supabase
- **Rate limiting**: Protection against abuse
- **CORS**: Proper cross-origin configuration

## Performance Optimization

### Code Splitting

- **Dynamic imports**: For heavy components
- **Route-based splitting**: Automatic with Next.js
- **Component-level splitting**: Strategic lazy loading

### Caching Strategy

- **API responses**: Intelligent caching with SWR
- **Static assets**: CDN and browser caching
- **Database queries**: Query optimization and indexing

### Core Web Vitals

We monitor and optimize for:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Debugging

### Development Tools

- **React DevTools**: Component inspection
- **Redux DevTools**: State debugging (Zustand)
- **Next.js DevTools**: Performance analysis
- **Supabase Dashboard**: Database and auth monitoring

### Logging

- **Client-side**: Console logging with levels
- **Server-side**: Structured logging with metadata
- **Error tracking**: Integration with monitoring services

### Common Issues

1. **Hydration errors**: Ensure server/client state consistency
2. **Authentication issues**: Check token validity and permissions
3. **Database connection**: Verify Supabase configuration
4. **Performance issues**: Use React Profiler and Lighthouse

## Deployment

### Environments

- **Development**: Local development server
- **Staging**: Pre-production testing
- **Production**: Live application

### Build Process

```bash
# Production build
bun run build

# Start production server
bun run start

# Analyze bundle
npm run analyze
```

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Additional service keys as needed

## Best Practices

### Code Quality

- Write self-documenting code
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow React best practices
- Optimize for performance

### Security

- Validate all inputs
- Use Row Level Security (RLS)
- Sanitize user content
- Implement proper authentication
- Follow OWASP guidelines

### Accessibility

- Use semantic HTML
- Implement keyboard navigation
- Provide alternative text
- Ensure color contrast
- Test with screen readers

## Contributing

Please refer to [Contributing Guidelines](contributing.md) for detailed information about contributing to this project.