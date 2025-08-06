/**
 * useBusinessTeam Hook
 * Custom hook for managing business team members
 * Extracted from large profile component for better organization
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "@components/ui/use-toast";

export const useBusinessTeam = (initialTeam = []) => {
	const [team, setTeam] = useState(initialTeam);

	// Create a new team member template
	const createTeamMemberTemplate = useCallback(
		() => ({
			id: Date.now() + Math.random(),
			name: "",
			role: "",
			bio: "",
			email: "",
			phone: "",
			avatar: "",
			isActive: true,
			joinedDate: new Date().toISOString(),
			socialLinks: {
				linkedin: "",
				twitter: "",
				website: "",
			},
		}),
		[]
	);

	// Add a new team member
	const addTeamMember = useCallback(() => {
		const newMember = createTeamMemberTemplate();
		setTeam((prev) => [...prev, newMember]);

		toast({
			title: "Team Member Added",
			description: "New team member has been added. Fill in their details.",
		});
	}, [createTeamMemberTemplate]);

	// Remove a team member
	const removeTeamMember = useCallback((memberId) => {
		setTeam((prev) => prev.filter((member) => member.id !== memberId));

		toast({
			title: "Team Member Removed",
			description: "The team member has been removed from your profile.",
		});
	}, []);

	// Update a team member field
	const updateTeamMember = useCallback((memberId, field, value) => {
		setTeam((prev) => prev.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)));
	}, []);

	// Update team member social links
	const updateTeamMemberSocial = useCallback((memberId, platform, url) => {
		setTeam((prev) =>
			prev.map((member) =>
				member.id === memberId
					? {
							...member,
							socialLinks: {
								...member.socialLinks,
								[platform]: url,
							},
						}
					: member
			)
		);
	}, []);

	// Bulk update team
	const updateTeam = useCallback((newTeam) => {
		setTeam(newTeam);
	}, []);

	// Validate team member data
	const validateTeamMember = useCallback((member) => {
		const errors = [];

		if (!member.name || member.name.trim().length < 2) {
			errors.push("Name must be at least 2 characters long");
		}

		if (!member.role || member.role.trim().length < 2) {
			errors.push("Role/job title is required");
		}

		if (member.email && !isValidEmail(member.email)) {
			errors.push("Invalid email format");
		}

		if (member.phone && !isValidPhone(member.phone)) {
			errors.push("Invalid phone number format");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}, []);

	// Validate all team members
	const validateAllTeamMembers = useCallback(() => {
		const validationResults = team.map((member) => ({
			member,
			...validateTeamMember(member),
		}));

		const invalidMembers = validationResults.filter((result) => !result.isValid);

		if (invalidMembers.length > 0) {
			const firstError = invalidMembers[0];
			toast({
				title: "Team Validation Error",
				description: `${firstError.member.name || "Team member"}: ${firstError.errors[0]}`,
				variant: "destructive",
			});
			return false;
		}

		return true;
	}, [team, validateTeamMember]);

	// Get team statistics
	const getTeamStats = useCallback(() => {
		const totalMembers = team.length;
		const completeProfiles = team.filter((member) => {
			const validation = validateTeamMember(member);
			return validation.isValid;
		}).length;

		const activeMembers = team.filter((member) => member.isActive).length;

		return {
			total: totalMembers,
			complete: completeProfiles,
			incomplete: totalMembers - completeProfiles,
			active: activeMembers,
			inactive: totalMembers - activeMembers,
			completionRate: totalMembers > 0 ? Math.round((completeProfiles / totalMembers) * 100) : 0,
		};
	}, [team, validateTeamMember]);

	// Reorder team members (for drag and drop)
	const reorderTeamMembers = useCallback((startIndex, endIndex) => {
		setTeam((prev) => {
			const result = Array.from(prev);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		});
	}, []);

	// Toggle team member active status
	const toggleTeamMemberStatus = useCallback((memberId) => {
		setTeam((prev) => prev.map((member) => (member.id === memberId ? { ...member, isActive: !member.isActive } : member)));
	}, []);

	// Duplicate a team member
	const duplicateTeamMember = useCallback(
		(memberId) => {
			const memberToClone = team.find((m) => m.id === memberId);
			if (!memberToClone) return;

			const duplicatedMember = {
				...memberToClone,
				id: Date.now() + Math.random(),
				name: `${memberToClone.name} (Copy)`,
				joinedDate: new Date().toISOString(),
			};

			setTeam((prev) => [...prev, duplicatedMember]);

			toast({
				title: "Team Member Duplicated",
				description: `${memberToClone.name} has been duplicated.`,
			});
		},
		[team]
	);

	// Get team members by role
	const getTeamByRole = useCallback(() => {
		const teamByRole = team.reduce((acc, member) => {
			const role = member.role || "Unspecified";
			if (!acc[role]) {
				acc[role] = [];
			}
			acc[role].push(member);
			return acc;
		}, {});

		return teamByRole;
	}, [team]);

	// Export team data
	const exportTeam = useCallback(() => {
		const exportData = {
			team,
			exportedAt: new Date().toISOString(),
			totalMembers: team.length,
		};

		return JSON.stringify(exportData, null, 2);
	}, [team]);

	// Import team data
	const importTeam = useCallback(
		(importData) => {
			try {
				const data = typeof importData === "string" ? JSON.parse(importData) : importData;

				if (!data.team || !Array.isArray(data.team)) {
					throw new Error("Invalid import data format");
				}

				// Validate imported team members
				const validMembers = data.team.filter((member) => {
					const validation = validateTeamMember(member);
					return validation.isValid;
				});

				if (validMembers.length !== data.team.length) {
					toast({
						title: "Import Warning",
						description: `${data.team.length - validMembers.length} invalid team members were skipped.`,
						variant: "destructive",
					});
				}

				setTeam(validMembers);

				toast({
					title: "Team Imported",
					description: `${validMembers.length} team members imported successfully.`,
				});

				return true;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: "Unable to import team data. Please check the file format.",
					variant: "destructive",
				});
				return false;
			}
		},
		[validateTeamMember]
	);

	return {
		// State
		team,

		// Actions
		addTeamMember,
		removeTeamMember,
		updateTeamMember,
		updateTeamMemberSocial,
		updateTeam,
		duplicateTeamMember,
		reorderTeamMembers,
		toggleTeamMemberStatus,

		// Validation & Stats
		validateTeamMember,
		validateAllTeamMembers,
		getTeamStats,
		getTeamByRole,

		// Import/Export
		exportTeam,
		importTeam,

		// Computed Values
		stats: getTeamStats(),
		teamByRole: getTeamByRole(),
		hasMembers: team.length > 0,
	};
};

// Helper functions
const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const isValidPhone = (phone) => {
	// Simple phone validation - can be enhanced
	const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
	return phoneRegex.test(phone.replace(/\s/g, ""));
};
