import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@store/useAuthStore";

const rolePriorities = {
	admin: 1,
	business_owner: 2,
	user: 3,
};

const getHighestPriorityRole = (roles) => {
	return roles.reduce((highest, role) => {
		if (rolePriorities[role] < rolePriorities[highest]) {
			return role;
		}
		return highest;
	}, roles[0]);
};

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, loading, userRoles, initializeAuth } = useAuthStore();
	const router = useRouter();
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const init = async () => {
			await initializeAuth();
			setIsInitialized(true);
		};
		init();
	}, [initializeAuth]);

	useEffect(() => {
		if (isInitialized && !loading) {
			if (!user) {
				router.push("/login");
			} else {
				const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
				if (!hasAccess) {
					console.log("unauthorized");
					router.push("/unauthorized");
				} else {
					const highestRole = getHighestPriorityRole(userRoles);
					if (allowedRoles.includes(highestRole)) {
						// User has one of the allowed roles, let them access the route
						return;
					} else {
						// Redirect based on the highest priority role the user has
						if (userRoles.includes("admin")) {
							router.push("/admin");
						} else if (userRoles.includes("business_owner")) {
							router.push("/business");
						} else {
							router.push("/user");
						}
					}
				}
			}
		}
	}, [isInitialized, user, loading, userRoles, router, allowedRoles]);

	if (!isInitialized || loading) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user || !allowedRoles.some((role) => userRoles.includes(role))) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
