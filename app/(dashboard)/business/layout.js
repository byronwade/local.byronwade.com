"use client";
import Header from "@components/business/layout/Header";
import ProtectedRoute from "@components/auth/ProtectedRoute";

export default function businessRootLayout({ children }) {
	return (
		<ProtectedRoute allowedRoles={["admin", "business_owner", "user"]}>
			<div className="flex flex-col min-h-screen m-auto max-w-screen-2xl">
				<Header />
				<div className="flex flex-1">{children}</div>
			</div>
		</ProtectedRoute>
	);
}
