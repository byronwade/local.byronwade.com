import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from '@shared/lib/supabase/ssr";
import { RoleManager, PERMISSIONS } from '@shared/lib/auth/roles";
import { logger } from '@shared/lib/utils/logger";

/**
 * Get specific user details (Admin only)
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
		if (!RoleManager.hasPermission(adminRoles, PERMISSIONS.USER_MANAGE) && !RoleManager.hasPermission(adminRoles, PERMISSIONS.USER_VIEW)) {
			return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
		}

		// Get target user
		const { data: targetUser, error: userError } = await supabase
			.from("users")
			.select(
				`
				id,
				email,
				name,
				first_name,
				last_name,
				avatar_url,
				bio,
				location,
				website,
				phone,
				email_verified,
				phone_verified,
				created_at,
				updated_at,
				last_seen_at,
				preferences,
				privacy_settings,
				user_roles (
					role,
					assigned_at,
					assigned_by
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

		// Check if admin can view this user
		const targetUserRoles = targetUser.user_roles?.map((ur) => ur.role) || [];
		const adminLevel = RoleManager.getHighestRoleLevel(adminRoles);
		const targetUserLevel = RoleManager.getHighestRoleLevel(targetUserRoles);

		if (adminLevel <= targetUserLevel && session.user.id !== userId) {
			return NextResponse.json({ error: "Cannot access user with higher or equal privileges" }, { status: 403 });
		}

		// Transform data
		const userData = {
			...targetUser,
			roles: targetUserRoles,
			displayName: targetUser.name || `${targetUser.first_name || ""} ${targetUser.last_name || ""}`.trim() || "Unnamed User",
		};

		const duration = performance.now() - startTime;
		logger.performance(`User details API completed in ${duration.toFixed(2)}ms`);

		return NextResponse.json({ user: userData });
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`User details API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to fetch user details",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * Delete user (Admin only)
 */
export async function DELETE(request, { params }) {
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

		// Prevent self-deletion
		if (session.user.id === userId) {
			return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
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
		if (!RoleManager.hasPermission(adminRoles, PERMISSIONS.USER_DELETE)) {
			logger.security({
				action: "unauthorized_user_deletion_attempt",
				adminId: session.user.id,
				targetUserId: userId,
				adminRoles,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
		}

		// Get target user to check if deletion is allowed
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

		// Check if admin can delete this user
		const targetUserRoles = targetUser.user_roles?.map((ur) => ur.role) || [];
		const adminLevel = RoleManager.getHighestRoleLevel(adminRoles);
		const targetUserLevel = RoleManager.getHighestRoleLevel(targetUserRoles);

		if (adminLevel <= targetUserLevel) {
			logger.security({
				action: "attempted_deletion_of_higher_level_user",
				adminId: session.user.id,
				targetUserId: userId,
				adminLevel,
				targetUserLevel,
				timestamp: Date.now(),
			});

			return NextResponse.json({ error: "Cannot delete user with higher or equal privileges" }, { status: 403 });
		}

		// Start transaction-like deletion process
		try {
			// Delete user roles first
			await supabase.from("user_roles").delete().eq("user_id", userId);

			// Delete related data (reviews, business claims, etc.)
			await supabase.from("reviews").delete().eq("user_id", userId);
			await supabase.from("business_claims").delete().eq("user_id", userId);
			await supabase.from("business_submissions").delete().eq("submitter_id", userId);

			// Finally delete the user
			const { error: deleteError } = await supabase.from("users").delete().eq("id", userId);

			if (deleteError) {
				throw deleteError;
			}

			// Log successful deletion
			logger.security({
				action: "user_deleted",
				adminId: session.user.id,
				deletedUserId: userId,
				deletedUserEmail: targetUser.email,
				deletedUserName: targetUser.name,
				deletedUserRoles: targetUserRoles,
				timestamp: Date.now(),
			});

			const duration = performance.now() - startTime;
			logger.performance(`User deletion API completed in ${duration.toFixed(2)}ms`);

			return NextResponse.json({
				success: true,
				message: "User deleted successfully",
			});
		} catch (deleteError) {
			logger.error("Failed to delete user:", deleteError);
			return NextResponse.json({ error: "Failed to delete user completely" }, { status: 500 });
		}
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error(`User deletion API failed in ${duration.toFixed(2)}ms:`, error);

		return NextResponse.json(
			{
				error: "Failed to delete user",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
