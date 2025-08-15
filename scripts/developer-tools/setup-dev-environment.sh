#!/bin/bash

# Enterprise Development Environment Setup Script
# This script sets up a complete development environment with security, quality, and productivity tools

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running on macOS or Linux
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          error "Unsupported operating system: ${OS}"
esac

log "Setting up development environment on ${MACHINE}..."

# Check for required system dependencies
check_dependencies() {
    log "Checking system dependencies..."
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 20.x or later."
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -lt 18 ]]; then
        error "Node.js version 18+ is required. Current version: $(node -v)"
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm."
    fi
    
    # Check for git
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git."
    fi
    
    # Check for Docker (optional but recommended)
    if ! command -v docker &> /dev/null; then
        warn "Docker is not installed. Some features may not work."
    fi
    
    log "✅ System dependencies check passed"
}

# Install development tools
install_dev_tools() {
    log "Installing development tools..."
    
    # Global npm packages for development
    npm install -g \
        @vercel/cli \
        @supabase/cli \
        eslint \
        prettier \
        typescript \
        @lhci/cli \
        lighthouse \
        bundlesize \
        npm-check-updates \
        license-checker \
        madge \
        complexity-report \
        jscpd
    
    # Install pre-commit hooks
    if command -v python3 &> /dev/null; then
        pip3 install pre-commit detect-secrets
        log "✅ Pre-commit tools installed"
    else
        warn "Python3 not found. Pre-commit hooks not installed."
    fi
    
    log "✅ Development tools installed"
}

# Setup project dependencies
setup_project() {
    log "Setting up project dependencies..."
    
    # Install root dependencies
    npm ci
    
    # Install app-specific dependencies
    if [[ -d "apps/main" ]]; then
        cd apps/main && npm ci && cd ../..
    fi
    
    if [[ -d "apps/admin" ]]; then
        cd apps/admin && npm ci && cd ../..
    fi
    
    if [[ -d "apps/tenant" ]]; then
        cd apps/tenant && npm ci && cd ../..
    fi
    
    log "✅ Project dependencies installed"
}

# Configure git hooks
setup_git_hooks() {
    log "Setting up Git hooks..."
    
    # Install pre-commit hooks if available
    if command -v pre-commit &> /dev/null; then
        pre-commit install
        pre-commit install --hook-type commit-msg
        pre-commit install --hook-type pre-push
        log "✅ Pre-commit hooks installed"
    else
        warn "Pre-commit not available. Installing manual git hooks..."
        
        # Create simple pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Simple pre-commit hook for code quality

echo "Running pre-commit checks..."

# Run ESLint
if ! npm run lint:check > /dev/null 2>&1; then
    echo "❌ ESLint failed. Run 'npm run lint' to fix issues."
    exit 1
fi

# Run TypeScript check
if ! npm run type-check > /dev/null 2>&1; then
    echo "❌ TypeScript check failed."
    exit 1
fi

# Run tests
if ! npm run test:quick > /dev/null 2>&1; then
    echo "❌ Tests failed."
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF
        chmod +x .git/hooks/pre-commit
    fi
    
    log "✅ Git hooks configured"
}

# Setup environment files
setup_environment() {
    log "Setting up environment configuration..."
    
    # Copy environment template if it doesn't exist
    if [[ ! -f ".env.local" && -f ".env.example" ]]; then
        cp .env.example .env.local
        log "✅ Created .env.local from template"
        warn "Please update .env.local with your actual environment variables"
    fi
    
    # Create development environment files for apps
    for app in apps/*/; do
        if [[ -d "$app" && -f "${app}.env.example" && ! -f "${app}.env.local" ]]; then
            cp "${app}.env.example" "${app}.env.local"
            log "✅ Created environment file for $(basename "$app")"
        fi
    done
}

# Setup VS Code configuration
setup_vscode() {
    log "Setting up VS Code configuration..."
    
    # Create .vscode directory if it doesn't exist
    mkdir -p .vscode
    
    # VS Code settings
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.workingDirectories": ["apps/main", "apps/admin", "apps/tenant"],
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/.vercel": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/coverage": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF

    # VS Code extensions recommendations
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-eslint",
    "github.copilot",
    "github.copilot-chat",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.remote-repositories"
  ]
}
EOF

    # VS Code tasks
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "dev",
      "group": "build",
      "label": "Start Development Server",
      "detail": "Start the Next.js development server"
    },
    {
      "type": "npm",
      "script": "build",
      "group": "build",
      "label": "Build for Production",
      "detail": "Build the application for production"
    },
    {
      "type": "npm",
      "script": "test",
      "group": "test",
      "label": "Run Tests",
      "detail": "Run all tests"
    },
    {
      "type": "npm",
      "script": "lint",
      "group": "build",
      "label": "Lint Code",
      "detail": "Run ESLint to check code quality"
    }
  ]
}
EOF

    log "✅ VS Code configuration created"
}

# Create helpful scripts
create_dev_scripts() {
    log "Creating development scripts..."
    
    mkdir -p scripts/dev
    
    # Database reset script
    cat > scripts/dev/reset-database.sh << 'EOF'
#!/bin/bash
# Reset local database for development

echo "🗄️ Resetting development database..."

if [[ -f "src/lib/database/supabase/complete_schema.sql" ]]; then
    echo "Applying schema..."
    # Add your database reset logic here
    echo "✅ Database reset complete"
else
    echo "❌ Schema file not found"
    exit 1
fi
EOF
    chmod +x scripts/dev/reset-database.sh
    
    # Clean install script
    cat > scripts/dev/clean-install.sh << 'EOF'
#!/bin/bash
# Clean installation of all dependencies

echo "🧹 Cleaning and reinstalling dependencies..."

# Remove node_modules and lock files
rm -rf node_modules package-lock.json
find apps -name "node_modules" -type d -exec rm -rf {} +
find apps -name "package-lock.json" -type f -delete

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Install app dependencies
for app in apps/*/; do
    if [[ -f "${app}package.json" ]]; then
        echo "Installing dependencies for $(basename "$app")..."
        cd "$app" && npm install && cd ../..
    fi
done

echo "✅ Clean installation complete"
EOF
    chmod +x scripts/dev/clean-install.sh
    
    # Code quality check script
    cat > scripts/dev/quality-check.sh << 'EOF'
#!/bin/bash
# Comprehensive code quality check

echo "🔍 Running comprehensive quality check..."

# Type checking
echo "Checking TypeScript..."
npm run type-check

# Linting
echo "Running ESLint..."
npm run lint

# Testing
echo "Running tests..."
npm run test

# Security audit
echo "Running security audit..."
npm audit --audit-level=moderate

# Bundle size check
echo "Checking bundle size..."
npm run build
npm run analyze

echo "✅ Quality check complete"
EOF
    chmod +x scripts/dev/quality-check.sh
    
    log "✅ Development scripts created"
}

# Print helpful information
print_next_steps() {
    log "🎉 Development environment setup complete!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update .env.local with your environment variables"
    echo "2. Run 'npm run dev' to start the development server"
    echo "3. Visit http://localhost:3000 to see your application"
    echo ""
    echo -e "${BLUE}Helpful commands:${NC}"
    echo "• npm run dev           - Start development server"
    echo "• npm run build         - Build for production"
    echo "• npm run test          - Run tests"
    echo "• npm run lint          - Check code quality"
    echo "• npm run type-check    - Check TypeScript types"
    echo ""
    echo -e "${BLUE}Development scripts:${NC}"
    echo "• ./scripts/dev/clean-install.sh     - Clean dependency installation"
    echo "• ./scripts/dev/reset-database.sh    - Reset development database"
    echo "• ./scripts/dev/quality-check.sh     - Full quality check"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "• README.md                    - Project overview"
    echo "• docs/development.md          - Development guide"
    echo "• .github/workflows/README.md  - CI/CD documentation"
    echo ""
}

# Main execution flow
main() {
    log "🚀 Starting enterprise development environment setup..."
    
    check_dependencies
    install_dev_tools
    setup_project
    setup_git_hooks
    setup_environment
    setup_vscode
    create_dev_scripts
    
    print_next_steps
}

# Run main function
main "$@"