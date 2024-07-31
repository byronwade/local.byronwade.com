import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ActiveUser() {
	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Welcome Back, Byron Wade!</h2> {/* //or welcome if new user */}
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Confirm this is your profile, so we can link a company to you.</p>
			<div className="relative flex flex-row p-2 mt-4 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
				<div className="ml-4">
					<h3>Byron Wade</h3>
					<p className="text-sm text-dark-500 dark:text-gray-300">bcw1995@gmail.com</p>
				</div>
				<Link href="/" className="self-center w-full mr-2 text-sm text-destructive text-end">
					Logout
				</Link>
			</div>
		</div>
	);
}
