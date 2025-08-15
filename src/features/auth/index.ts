/**
 * Auth Feature Barrel Export
 * Enterprise-level feature organization following Netflix/Shopify patterns
 *
 * This file exports all auth-related components, hooks, services, and types
 * in a clean, organized manner for easy consumption by other parts of the app.
 */

// ============================================================================
// COMPONENTS
// ============================================================================
export { LoginForm } from "./components/LoginForm";
export { SignupForm } from "./components/SignupForm";
export { ProtectedRoute } from "./components/protected-route";
export { VerifyAccount } from "./components/VerifyAccount";
export { ActiveUser } from "./components/ActiveUser";
export { BusinessInfo } from "./components/BusinessInfo";
export { BusinessAddress } from "./components/BusinessAddress";
export { BusinessProfile } from "./components/BusinessProfile";
export { BusinessSuccess } from "./components/BusinessSuccess";
export { BusinessVerification } from "./components/BusinessVerification";
export { BusinessForm } from "./components/business-form";
export { AccountOTP } from "./components/AccountOTP";
export { PasswordReset } from "./components/PasswordReset";
export { ActiveBusiness } from "./components/ActiveBusiness";
export { BusinessSearch } from "./components/BusinessSearch";

// Export all IntelligentLoginButton components
export { 
  IntelligentLoginButton,
  AddBusinessLoginButton,
  ClaimBusinessLoginButton,
  WriteReviewLoginButton,
  SaveBusinessLoginButton,
  BookServiceLoginButton,
  DashboardLoginButton,
  PremiumLoginButton,
  createIntelligentLoginLink
} from "./components/IntelligentLoginButton/intelligent-login-button";

// Export login component directly for backward compatibility
export { default as LoginPage } from "./components/LoginForm/login";
export { default as SignupPage } from "./components/SignupForm/signup";

// TODO: Add these components as they're created
// export { AuthLayout } from './components/AuthLayout';
// export { SocialAuth } from './components/SocialAuth';
// export { PasswordReset } from './components/PasswordReset';

// ============================================================================
// HOOKS
// ============================================================================
// TODO: Export hooks as they're created
// export { useAuth } from './hooks/use-auth';
// export { useLogin } from './hooks/useLogin';
// export { useSignup } from './hooks/useSignup';

// ============================================================================
// SERVICES
// ============================================================================
// TODO: Export services as they're created
// export { authService } from './services/authService';
// export { validationService } from './services/validation';

// ============================================================================
// TYPES
// ============================================================================
export type { LoginFormProps, LoginCredentials } from "./components/LoginForm/types";
export type { SignupFormProps, SignupData } from "./components/SignupForm/types";
export type { ProtectedRouteProps, AuthUser } from "./components/ProtectedRoute/types";

// ============================================================================
// CONSTANTS
// ============================================================================
// TODO: Export constants as they're created
// export { AUTH_ROUTES, AUTH_ERRORS } from './constants/auth.constants';

// ============================================================================
// UTILITIES
// ============================================================================
// TODO: Export utilities as they're created
// export { validateEmail, validatePassword } from './utils/validation';
// export { encryptToken, decryptToken } from './utils/encryption';
