# Testing Structure

## 🧪 Enterprise Testing Organization

This directory follows **Netflix/Google testing standards** with comprehensive test organization:

### Directory Structure

```
tests/
├── unit/                    # Unit tests (isolated component/function testing)
├── integration/             # Integration tests (API endpoints, database)
├── e2e/                     # End-to-end tests (full user workflows)
├── components/              # Component-specific tests
├── hooks/                   # Custom hook tests
├── lib/                     # Library/utility function tests
├── api/                     # API route tests
├── utils/                   # Testing utilities and helpers
├── __mocks__/               # Mock files for external dependencies
├── fixtures/                # Test data and fixtures
└── README.md                # This file
```

### Testing Strategy

#### 1. **Unit Tests** (`/unit/`)
- Test individual components in isolation
- Mock all external dependencies
- Fast execution (< 1ms per test)
- High code coverage target (>90%)

#### 2. **Integration Tests** (`/integration/`)
- Test feature workflows
- Test API endpoint integration
- Test database operations
- Mock external services only

#### 3. **End-to-End Tests** (`/e2e/`)
- Test complete user journeys
- Real browser automation
- Production-like environment
- Critical business flows only

#### 4. **Component Tests** (`/components/`)
- Feature-based component testing
- Mirrors component directory structure
- Tests user interactions and props

#### 5. **Hook Tests** (`/hooks/`)
- Custom hook behavior testing
- State management testing
- Side effect testing

### Testing Tools

- **Vitest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking
- **Testing utilities** - Custom helpers

### Naming Conventions

```
ComponentName.test.js        # Component tests
hookName.test.js            # Hook tests
utilityName.test.js         # Utility tests
featureName.integration.js  # Integration tests
userJourney.e2e.js         # E2E tests
```

### Running Tests

```bash
# All tests
bun test

# Unit tests only
bun test:unit

# Integration tests
bun test:integration

# E2E tests
bun test:e2e

# Watch mode
bun test:watch

# Coverage report
bun test:coverage
```

### Test Data Management

- **Fixtures** - Static test data in `/fixtures/`
- **Factories** - Dynamic test data generation
- **Mocks** - External service mocks in `/__mocks__/`
- **Setup** - Global test configuration

### Best Practices

1. **Arrange, Act, Assert** pattern
2. **Descriptive test names** that explain behavior
3. **Single assertion per test** when possible
4. **Mock external dependencies** in unit tests
5. **Test user behavior**, not implementation details
6. **Maintain test independence** - no shared state
7. **Use meaningful test data** - avoid magic numbers
8. **Clean up after tests** - reset state and mocks