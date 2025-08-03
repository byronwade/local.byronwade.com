import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@lib/supabase/ssr";
import { RoleManager, PERMISSIONS } from "@lib/auth/roles";
import { logger } from "@lib/utils/logger";

/**
 * Get all users with role information (Admin only)
 */
export async function GET(request) {
	const startTime = performance.now();

	try {
		const supabase = createSupabaseRouteHandlerClient(request, NextResponse.next());

		// Verify admin authentication
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session?.user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Get admin user roles
		const { data: adminUser, error: adminError } = await supabase
			.from("users")
			.select(
				`
				id,
				user_roles (
					role
				)
			`
			)
			.eq("id", session.user.id)
			.single();

		if (adminError || !adminUser) {
			return NextResponse.json({ error: "Failed to verify admin user" }, { status: 403 });
		}

		const adminRoles = adminUser.user_roles?.map((ur) => ur.role) || [];

		// Check if user has permission to manage users
		if (!RoleManager.hasPermission(adminRoles, PERMISSIONS.USER_MANAGE)) {
			logger.security({
				action: "unauthorized_user_management_attempt",
				userId: session.user.id,
				userRoles: adminRoles,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
		}

		// Get URL parameters for pagination and filtering
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = Math.min(parseInt(searchParams.get("limit")) || 50, 100); // Max 100 per page
		const search = searchParams.get("search") || "";
		const roleFilter = searchParams.get("role") || "";

		const offset = (page - 1) * limit;

		// Build query
		let query = supabase
			.from("users")
			.select(
				`
				id,
				email,
				name,
				first_name,
				last_name,
				avatar_url,
				email_verified,
				phone_verified,
				created_at,
				updated_at,
				last_seen_at,
				user_roles (
					role,
					assigned_at
				)
			`
			)
			.order("created_at", { ascending: false });

		// Apply search filter
		if (search) {
			query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
		}

		// Apply role filter
		if (roleFilter) {
			query = query.eq("user_roles.role", roleFilter);
		}

		// Apply pagination
		query = query.range(offset, offset + limit - 1);

		const { data: users, error: usersError, count } = await query;

		if (usersError) {
			throw usersError;
		}

		// Transform data for easier consumption
		const transformedUsers = users.map((user) => ({
			...user,
			roles: user.user_roles?.map((ur) => ur.role) || [],
			displayName: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed User",
		}));

		// Filter out users that current admin cannot manage
		const adminLevel = RoleManager.getHighestRoleLevel(adminRoles);
		const manageableUsers = transformedUsers.filter((user) => {
			const userLevel = RoleManager.getHighestRoleLevel(user.roles);
			return adminLevel > userLevel || user.id === session.user.id; // Can always see self
		});

		const duration = performance.now() - startTime;
		logger.performance(`User list API completed in ${duration.toFixed(2)}ms`);

		logger.info("User list accessed", {
			adminId: session.user.id,
			adminRoles,
			userCount: manageableUsers.length,
			filters: { search, roleFilter, page, limit },
		});

		return NextResponse.json({
			users: manageableUsers,
			pagination: {
				page,
				limit,
				total: count,
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`User list API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to fetch users",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
