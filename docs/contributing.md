# Contributing Guidelines

## Welcome

Thank you for your interest in contributing to Thorbis! This document provides guidelines and information for contributing to our local business directory platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Node.js** 18.x or higher
- **Bun** latest version (preferred package manager)
- **Git** for version control
- **Code editor** (VS Code recommended)
- **Basic knowledge** of React, Next.js, and TypeScript

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/thorbis.com.git
   cd thorbis.com
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/thorbis.com.git
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

## Development Process

### Workflow Overview

1. **Check existing issues** or create a new one
2. **Fork and clone** the repository
3. **Create a feature branch** from main
4. **Make your changes** following coding standards
5. **Write tests** for new functionality
6. **Run tests and linting** to ensure quality
7. **Commit changes** with descriptive messages
8. **Push to your fork** and create a pull request
9. **Respond to review feedback** and iterate
10. **Merge** after approval

### Branch Naming

Use descriptive branch names with prefixes:

```bash
feature/add-business-search
bugfix/fix-map-rendering
hotfix/critical-auth-issue
docs/update-api-documentation
refactor/optimize-search-performance
```

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(search): add real-time business search
fix(auth): resolve login redirect issue
docs(api): update business endpoints documentation
```

## Coding Standards

### Code Style

We use **ESLint** and **Prettier** for consistent code formatting:

```bash
# Run linting
bun run lint

# Fix auto-fixable issues
bun run lint --fix
```

### File Naming Conventions

- **Components**: PascalCase (`BusinessCard.js`)
- **Utilities**: camelCase (`formatAddress.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Pages**: kebab-case (`business-profile.js`)

### Component Guidelines

#### React Components

```javascript
// ✅ Good: Functional component with proper structure
import React, { useState, useEffect } from 'react';
import { cn } from '@lib/utils';

interface BusinessCardProps {
  business: Business;
  onSelect?: (business: Business) => void;
  className?: string;
}

export default function BusinessCard({ 
  business, 
  onSelect, 
  className 
}: BusinessCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(business);
    }
  };
  
  return (
    <div 
      className={cn("business-card", className)}
      onClick={handleClick}
    >
      <h3>{business.name}</h3>
      <p>{business.address}</p>
    </div>
  );
}
```

#### Custom Hooks

```javascript
// ✅ Good: Custom hook with proper error handling
import { useState, useEffect } from 'react';
import { logger } from '@lib/utils/logger';

export function useBusinessSearch(query: string) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!query) return;
    
    const searchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/business/search?q=${query}`);
        const data = await response.json();
        
        setResults(data.businesses);
      } catch (err) {
        logger.error('Business search failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    searchBusinesses();
  }, [query]);
  
  return { results, loading, error };
}
```

### Performance Guidelines

- **Use React.memo** for components that render frequently
- **Implement useMemo** for expensive calculations
- **Use useCallback** for event handlers in optimized components
- **Lazy load** components and routes when appropriate
- **Optimize images** with Next.js Image component
- **Monitor bundle size** and split code strategically

### Accessibility Requirements

- **Semantic HTML**: Use proper HTML elements
- **ARIA labels**: Provide labels for interactive elements
- **Keyboard navigation**: Ensure all functionality is keyboard accessible
- **Color contrast**: Meet WCAG AA standards
- **Screen reader support**: Test with screen readers

```javascript
// ✅ Good: Accessible component
<button
  type="button"
  aria-label="Search for businesses"
  onClick={handleSearch}
  disabled={isLoading}
>
  {isLoading ? 'Searching...' : 'Search'}
</button>
```

## Testing Requirements

### Test Types

1. **Unit Tests**: Component and utility function tests
2. **Integration Tests**: API endpoint and feature tests
3. **E2E Tests**: Critical user flow tests
4. **Performance Tests**: Core Web Vitals monitoring

### Writing Tests

```javascript
// Example: Component test
import { render, screen, fireEvent } from '@testing-library/react';
import BusinessCard from './BusinessCard';

describe('BusinessCard', () => {
  const mockBusiness = {
    id: '1',
    name: 'Test Business',
    address: '123 Main St'
  };
  
  test('renders business information', () => {
    render(<BusinessCard business={mockBusiness} />);
    
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });
  
  test('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <BusinessCard 
        business={mockBusiness} 
        onSelect={mockOnSelect} 
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockBusiness);
  });
});
```

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run E2E tests
bun run test:e2e

# Generate coverage report
bun run test:coverage
```

## Pull Request Process

### Before Creating a PR

- [ ] Code follows project standards
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Accessibility requirements met
- [ ] Performance impact assessed

### PR Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots (if applicable)
Add screenshots to demonstrate changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing verification** in staging environment
4. **Documentation review** if applicable
5. **Final approval** and merge

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## Documentation

### Code Documentation

- **Comment complex logic** and business rules
- **Document API functions** with JSDoc
- **Update README** for significant changes
- **Maintain inline comments** for clarity

### API Documentation

- **Update API docs** for endpoint changes
- **Include request/response examples**
- **Document error codes** and responses
- **Maintain changelog** for API versions

## Recognition

Contributors will be recognized in:
- **Contributors list** in README
- **Release notes** for significant contributions
- **Project documentation** for ongoing contributors

## Questions and Support

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Email**: dev-team@thorbis.com for sensitive issues
- **Discord**: [Developer Community](https://discord.gg/thorbis)

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Thorbis! Your efforts help make local business discovery better for everyone.