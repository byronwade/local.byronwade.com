"use client";
import Header from "@/components/admin/layout/Header";
import Main from "@/components/admin/layout/Main";
import Sidebar from "@/components/admin/layout/Sidebar";

export default function Admin({ children }) {
	return (
		<div className="flex flex-col min-h-screen text-black bg-gray-100">
			<Header />
			<div className="flex flex-1">
				<Sidebar />
				<Main>{children}</Main>
			</div>
		</div>
	);
}