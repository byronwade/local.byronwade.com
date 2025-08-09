"use client";
// Authentication Components Barrel Export
// All authentication-related components

// Core Auth Components
export { default as Login } from "./components/LoginForm/login";
export { default as LoginPage } from "./components/LoginForm/login";
export { default as Signup } from "./components/SignupForm/signup";
export { default as SignupPage } from "./components/SignupForm/signup";
export { ProtectedRoute, ProtectedComponent, ProtectedByRole, ProtectedByLevel, usePermissions, withProtection } from "./components/ProtectedRoute/protected-route";

// Auth Forms
export { BusinessForm } from "./forms/business-form";

// Account Management
export { default as OTP } from "./account/otp";
export { default as AccountOTP } from "./account/otp";
export { default as PasswordReset } from "./account/password-reset";

// Business Certification
export { default as BusinessCertification } from "./certification/business-certification";

// Onboarding Components
export { default as BusinessAddress } from "./onboarding/business-address";
export { default as BusinessInfo } from "./onboarding/business-info";
export { default as BusinessProfile } from "./onboarding/business-profile";
export { default as BusinessVerification } from "./onboarding/business-verification";
export { default as BusinessSkipVerify } from "./onboarding/business-skip-verify";
export { default as BusinessSuccess } from "./onboarding/business-success";
export { default as UserAddress } from "./onboarding/user-address";
export { default as UserInfo } from "./onboarding/user-info";
export { default as UserProfile } from "./onboarding/user-profile";
export { default as UserSuccess } from "./onboarding/user-success";

// Report Components
export { default as Report } from "./report/report";
export { default as WhatAreYouReporting } from "./report/what-are-you-reporting";

// Shared Auth Components
export { default as ActiveBusiness } from "./shared/active-business";
export { default as ActiveUser } from "./shared/active-user";
export { default as BusinessSearch } from "./shared/business-search";
export { default as VerifyAccount } from "./shared/verify-account";
export { default as PasswordStrengthIndicator } from "./shared/password-strength-indicator";
export { default as RateLimitWarning } from "./shared/rate-limit-warning";
export { default as IntelligentLoginMessage } from "./shared/intelligent-login-message";
export { AddBusinessLoginButton, BookServiceLoginButton, ClaimBusinessLoginButton, DashboardLoginButton, IntelligentLoginButton, PremiumLoginButton, SaveBusinessLoginButton, WriteReviewLoginButton, createIntelligentLoginLink } from "./shared/intelligent-login-button";
export { default as PersonalizedSignupFlow } from "./shared/personalized-signup-flow";

// Support Components
export { default as SupportInfo } from "./support/support-info";
