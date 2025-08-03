# Thorbis - Local Business Directory Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.6-blue)](https://tailwindcss.com/)

## 🏢 Enterprise-Grade Local Business Directory

Thorbis is a comprehensive local business directory platform built with modern technologies and enterprise-level architecture. The platform provides businesses with tools to manage their online presence and customers with an intuitive way to discover local services.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables (see docs/environment-setup.md)
cp .env.example .env.local

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## 📁 Project Structure

```
local.byronwade.com/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (site)/                   # Public-facing pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── admin/                    # Admin dashboard components
│   ├── auth/                     # Authentication components
│   ├── business/                 # Business-related components
│   ├── shared/                   # Shared/common components
│   ├── site/                     # Public site components
│   └── ui/                       # Base UI components (shadcn/ui)
├── lib/                         # Core business logic & utilities
│   ├── api/                     # API client configurations
│   ├── auth/                    # Authentication utilities
│   ├── email/                   # Email service integrations
│   ├── supabase/                # Supabase client & utilities
│   └── utils/                   # Shared utility functions
├── hooks/                       # Custom React hooks
├── store/                       # State management (Zustand)
├── context/                     # React context providers
├── public/                      # Static assets
├── scripts/                     # Build & deployment scripts
└── docs/                        # Project documentation
```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with App Router
- **UI Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.6
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Maps**: React Map GL (Mapbox)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development
- **Package Manager**: Bun
- **Linting**: ESLint
- **Testing**: Cypress
- **Type Safety**: TypeScript + Zod

## 🔧 Key Features

### For Businesses
- **Business Profiles**: Comprehensive business information management
- **Review Management**: Respond to and manage customer reviews
- **Analytics Dashboard**: Track business performance metrics
- **Media Management**: Upload and manage business photos/videos
- **Certification System**: Business verification and certification

### For Customers
- **Advanced Search**: Location-based business discovery
- **Interactive Maps**: Visual business location browsing
- **Review System**: Read and write business reviews
- **User Profiles**: Manage personal information and preferences
- **Favorites**: Save and organize preferred businesses

### For Administrators
- **User Management**: Comprehensive user administration
- **Business Moderation**: Review and approve business listings
- **Content Management**: Manage platform content and categories
- **Analytics**: Platform-wide performance monitoring

## 📚 Documentation

- [Environment Setup](docs/environment-setup.md)
- [Development Guide](docs/development.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

## 🔐 Security

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Secure user authentication with Supabase
- **Data Validation**: Comprehensive input validation with Zod
- **HTTPS**: All communications encrypted
- **CORS**: Properly configured cross-origin resource sharing

## 🚀 Performance

- **Core Web Vitals**: Optimized for Google's performance metrics
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic code splitting for optimal loading
- **Caching**: Strategic caching for API responses and static content
- **Bundle Analysis**: Regular bundle size monitoring

## 🧪 Development

### Scripts
```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run types:generate   # Generate TypeScript types from Supabase
bun run test:supabase    # Test Supabase connection
bun run seed:database    # Seed development database
```

### Environment Variables
See `docs/environment-setup.md` for complete environment configuration.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support and questions, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ by the Thorbis team**