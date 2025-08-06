// REQUIRED: Intelligent Login Button Component
// Pre-configured buttons for common authentication scenarios

"use client";

import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useIntelligentAuth } from "@lib/auth/intelligentRedirects";
import { cn } from "@utils";
import { Building2, Star, Calendar, Heart, Users, Shield, Sparkles, MessageCircle, User, Settings, LogIn } from "lucide-react";

const CONTEXT_ICONS = {
	"add-business": Building2,
	"claim-business": Building2,
	"write-review": Star,
	"save-business": Heart,
	"book-service": Calendar,
	"business-dashboard": Settings,
	"view-profile": User,
	"admin-access": Shield,
	"premium-features": Sparkles,
	"join-community": Users,
	"get-support": MessageCircle,
	default: LogIn,
};

const CONTEXT_COLORS = {
	"add-business": "bg-blue-600 hover:bg-blue-700",
	"claim-business": "bg-green-600 hover:bg-green-700",
	"write-review": "bg-yellow-600 hover:bg-yellow-700",
	"save-business": "bg-red-600 hover:bg-red-700",
	"book-service": "bg-purple-600 hover:bg-purple-700",
	"business-dashboard": "bg-gray-600 hover:bg-gray-700",
	"view-profile": "bg-indigo-600 hover:bg-indigo-700",
	"admin-access": "bg-orange-600 hover:bg-orange-700",
	"premium-features": "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
	"join-community": "bg-teal-600 hover:bg-teal-700",
	"get-support": "bg-cyan-600 hover:bg-cyan-700",
	default: "bg-gray-900 hover:bg-gray-800",
};

/**
 * Intelligent Login Button for Business Actions
 */
export function AddBusinessLoginButton({ className, children, variant = "default", size = "default", ...props }) {
	const { redirectToAddBusiness } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["add-business"];

	return (
		<Button onClick={redirectToAddBusiness} className={cn(variant === "intelligent" && CONTEXT_COLORS["add-business"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Add Your Business"}
			{variant === "intelligent" && (
				<Badge variant="secondary" className="ml-2">
					Sign In Required
				</Badge>
			)}
		</Button>
	);
}

/**
 * Claim Business Login Button
 */
export function ClaimBusinessLoginButton({ businessId, className, children, variant = "default", size = "default", ...props }) {
	const { redirectToClaimBusiness } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["claim-business"];

	return (
		<Button onClick={() => redirectToClaimBusiness(businessId)} className={cn(variant === "intelligent" && CONTEXT_COLORS["claim-business"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Claim This Business"}
			{variant === "intelligent" && (
				<Badge variant="secondary" className="ml-2">
					Free
				</Badge>
			)}
		</Button>
	);
}

/**
 * Write Review Login Button
 */
export function WriteReviewLoginButton({ businessId, className, children, variant = "default", size = "default", ...props }) {
	const { redirectToWriteReview } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["write-review"];

	return (
		<Button onClick={() => redirectToWriteReview(businessId)} className={cn(variant === "intelligent" && CONTEXT_COLORS["write-review"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Write a Review"}
		</Button>
	);
}

/**
 * Save Business Login Button
 */
export function SaveBusinessLoginButton({ businessId, className, children, variant = "default", size = "default", ...props }) {
	const { redirectToSaveBusiness } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["save-business"];

	return (
		<Button onClick={() => redirectToSaveBusiness(businessId)} className={cn(variant === "intelligent" && CONTEXT_COLORS["save-business"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Save Business"}
		</Button>
	);
}

/**
 * Book Service Login Button
 */
export function BookServiceLoginButton({ businessId, className, children, variant = "default", size = "default", ...props }) {
	const { redirectToBookService } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["book-service"];

	return (
		<Button onClick={() => redirectToBookService(businessId)} className={cn(variant === "intelligent" && CONTEXT_COLORS["book-service"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Book Service"}
			{variant === "intelligent" && (
				<Badge variant="secondary" className="ml-2">
					Quick & Easy
				</Badge>
			)}
		</Button>
	);
}

/**
 * Dashboard Access Login Button
 */
export function DashboardLoginButton({ role = "user", className, children, variant = "default", size = "default", ...props }) {
	const { redirectToDashboard } = useIntelligentAuth();
	const contextKey = role === "admin" ? "admin-access" : role === "business" ? "business-dashboard" : "view-profile";
	const IconComponent = CONTEXT_ICONS[contextKey];

	return (
		<Button onClick={() => redirectToDashboard(role)} className={cn(variant === "intelligent" && CONTEXT_COLORS[contextKey], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
		</Button>
	);
}

/**
 * Premium Features Login Button
 */
export function PremiumLoginButton({ className, children, variant = "default", size = "default", ...props }) {
	const { redirectToPremium } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS["premium-features"];

	return (
		<Button onClick={redirectToPremium} className={cn(variant === "intelligent" && CONTEXT_COLORS["premium-features"], className)} variant={variant} size={size} {...props}>
			{variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Unlock Premium"}
			{variant === "intelligent" && (
				<Badge variant="secondary" className="ml-2">
					Upgrade
				</Badge>
			)}
		</Button>
	);
}

/**
 * Generic Intelligent Login Button
 */
export function IntelligentLoginButton({ context = "default", contextParams = {}, className, children, variant = "default", size = "default", showIcon = true, showBadge = false, badgeText, ...props }) {
	const { redirectWithContext } = useIntelligentAuth();
	const IconComponent = CONTEXT_ICONS[context] || CONTEXT_ICONS["default"];

	const handleClick = () => {
		redirectWithContext(context, contextParams);
	};

	return (
		<Button onClick={handleClick} className={cn(variant === "intelligent" && (CONTEXT_COLORS[context] || CONTEXT_COLORS["default"]), className)} variant={variant} size={size} {...props}>
			{showIcon && variant === "intelligent" && <IconComponent className="w-4 h-4 mr-2" />}
			{children || "Sign In"}
			{showBadge && badgeText && (
				<Badge variant="secondary" className="ml-2">
					{badgeText}
				</Badge>
			)}
		</Button>
	);
}

/**
 * Smart Login Link (for use with Next.js Link component)
 */
export function createIntelligentLoginLink(context, contextParams = {}) {
	const { createContextLink } = useIntelligentAuth();
	return createContextLink(context, contextParams);
}

export default {
	AddBusinessLoginButton,
	ClaimBusinessLoginButton,
	WriteReviewLoginButton,
	SaveBusinessLoginButton,
	BookServiceLoginButton,
	DashboardLoginButton,
	PremiumLoginButton,
	IntelligentLoginButton,
	createIntelligentLoginLink,
};
