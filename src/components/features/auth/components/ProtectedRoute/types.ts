/**
 * ProtectedRoute Component Types
 * Type definitions for route protection
 */

import { ReactNode } from "react";

export interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: string | string[];
	requiredPermissions?: string[];
	fallback?: ReactNode;
	redirectTo?: string;
	loadingComponent?: ReactNode;
	checkInterval?: number;
	allowedUserTypes?: UserType[];
}

export type UserType = "customer" | "business_owner" | "admin" | "moderator";

export interface RoutePermission {
	resource: string;
	action: "read" | "write" | "delete" | "admin";
}

export interface AuthUser {
	id: string;
	email: string;
	role: string;
	permissions: string[];
	userType: UserType;
	isVerified: boolean;
	isActive: boolean;
}

export interface ProtectedRouteState {
	isLoading: boolean;
	isAuthenticated: boolean;
	hasPermission: boolean;
	user: AuthUser | null;
	error: string | null;
}
