// app/layout.js
"use client";
import Header from "@components/admin/layout/Header";
import Main from "@components/admin/layout/Main";
import Sidebar from "@components/admin/layout/Sidebar";
import ProtectedRoute from "@components/auth/ProtectedRoute";

export default function AdminLayout({ children }) {
	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div className="flex flex-col min-h-screen text-black bg-gray-100">
				<Header />
				<div className="flex flex-1">
					<Sidebar />
					<Main>{children}</Main>
				</div>
			</div>
		</ProtectedRoute>
	);
}
