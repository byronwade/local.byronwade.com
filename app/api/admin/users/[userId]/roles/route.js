import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@lib/supabase/ssr";
import { RoleManager, PERMISSIONS, ROLES } from "@lib/auth/roles";
import { logger } from "@lib/utils/logger";

/**
 * Update user roles (Admin only)
 */
export async function PUT(request, { params }) {
	const startTime = performance.now();

	try {
		const { userId } = await params;
		const { roles: newRoles } = await request.json();

		// Validate input
		if (!Array.isArray(newRoles)) {
			return NextResponse.json({ error: "Roles must be an array" }, { status: 400 });
		}

		// Validate that all roles exist
		const validRoles = Object.values(ROLES).map((role) => role.name);
		const invalidRoles = newRoles.filter((role) => !validRoles.includes(role));
		if (invalidRoles.length > 0) {
			return NextResponse.json({ error: `Invalid roles: ${invalidRoles.join(", ")}` }, { status: 400 });
		}

		const supabase = createSupabaseRouteHandlerClient(request, NextResponse.next());

		// Verify admin authentication
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session?.user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Prevent self-role modification
		if (session.user.id === userId) {
			return NextResponse.json({ error: "Cannot modify your own roles" }, { status: 400 });
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

		// Check permissions
		if (!RoleManager.hasPermission(adminRoles, PERMISSIONS.ROLES_MANAGE)) {
			logger.security({
				action: "unauthorized_role_modification_attempt",
				adminId: session.user.id,
				targetUserId: userId,
				adminRoles,
				attemptedRoles: newRoles,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Insufficient permissions to manage roles" }, { status: 403 });
		}

		// Get target user
		const { data: targetUser, error: userError } = await supabase
			.from("users")
			.select(
				`
				id,
				email,
				name,
				user_roles (
					role
				)
			`
			)
			.eq("id", userId)
			.single();

		if (userError) {
			if (userError.code === "PGRST116") {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
			throw userError;
		}

		const currentUserRoles = targetUser.user_roles?.map((ur) => ur.role) || [];

		// Check if admin can assign all requested roles
		const adminLevel = RoleManager.getHighestRoleLevel(adminRoles);
		const canAssignAllRoles = newRoles.every((role) => {
			const roleData = RoleManager.getRole(role);
			return roleData && adminLevel > roleData.level;
		});

		if (!canAssignAllRoles) {
			logger.security({
				action: "attempted_assignment_of_higher_level_roles",
				adminId: session.user.id,
				targetUserId: userId,
				adminLevel,
				attemptedRoles: newRoles,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Cannot assign roles with higher or equal privileges" }, { status: 403 });
		}

		// Check if target user currently has higher privileges
		const currentUserLevel = RoleManager.getHighestRoleLevel(currentUserRoles);
		if (adminLevel <= currentUserLevel) {
			logger.security({
				action: "attempted_modification_of_higher_level_user",
				adminId: session.user.id,
				targetUserId: userId,
				adminLevel,
				currentUserLevel,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Cannot modify user with higher or equal privileges" }, { status: 403 });
		}

		// Perform role update transaction
		try {
			// Delete existing roles
			await supabase.from("user_roles").delete().eq("user_id", userId);

			// Insert new roles
			if (newRoles.length > 0) {
				const roleInserts = newRoles.map((role) => ({
					user_id: userId,
					role: role,
					assigned_by: session.user.id,
					assigned_at: new Date().toISOString(),
				}));

				const { error: insertError } = await supabase.from("user_roles").insert(roleInserts);

				if (insertError) {
					throw insertError;
				}
			}

			// Log successful role change
			logger.security({
				action: "user_roles_updated",
				adminId: session.user.id,
				targetUserId: userId,
				targetUserEmail: targetUser.email,
				previousRoles: currentUserRoles,
				newRoles: newRoles,
				timestamp: Date.now(),
			});

			const duration = performance.now() - startTime;
			logger.performance(`Role update API completed in ${duration.toFixed(2)}ms`);

			return NextResponse.json({
				success: true,
				message: "User roles updated successfully",
				previousRoles: currentUserRoles,
				newRoles: newRoles,
			});
		} catch (updateError) {
			logger.error("Failed to update user roles:", updateError);
			return NextResponse.json({ error: "Failed to update roles" }, { status: 500 });
		}
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Role update API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to update user roles",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * Get user roles (Admin only)
 */
export async function GET(request, { params }) {
	const startTime = performance.now();

	try {
		const { userId } = await params;
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

		// Check permissions
		if (!RoleManager.hasPermission(adminRoles, PERMISSIONS.USER_VIEW) && !RoleManager.hasPermission(adminRoles, PERMISSIONS.ROLES_MANAGE)) {
			return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
		}

		// Get target user roles
		const { data: userRoles, error: rolesError } = await supabase
			.from("user_roles")
			.select(
				`
				role,
				assigned_at,
				assigned_by
			`
			)
			.eq("user_id", userId);

		if (rolesError) {
			throw rolesError;
		}

		// Get role details
		const rolesWithDetails = userRoles.map((ur) => {
			const roleData = RoleManager.getRole(ur.role);
			return {
				...ur,
				roleData,
			};
		});

		const duration = performance.now() - startTime;
		logger.performance(`Get user roles API completed in ${duration.toFixed(2)}ms`);

		return NextResponse.json({
			userId,
			roles: rolesWithDetails,
			permissions: RoleManager.getAllPermissions(userRoles.map((ur) => ur.role)),
		});
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`Get user roles API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to fetch user roles",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
