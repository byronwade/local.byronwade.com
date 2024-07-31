"use client";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@components/ui/DarkModeToggle";

export default function DashboardRootLayout({ children }) {
	return (
		<>
			<div className="grid grid-cols-1 bg-white dark:bg-neutral-900 md:grid-cols-2">
				<div className="absolute top-5 right-5">
					<DarkModeToggle />
				</div>
				<div className="flex-col items-center justify-center hidden min-h-screen bg-transparent md:flex">
					<div className="p-6 md:space-y-8 lg:space-y-20">
						<div className="md:space-y-2 lg:space-y-6">
							<Link href="/">
								<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px]" />
							</Link>
							<div>
								<div className="text-[22px] font-bold leading-[34px] text-gray-900 dark:text-gray-200">
									Let&apos;s get to know each other{" "}
									<span role="img" aria-label="wave">
										👋
									</span>
									<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Answer a few quick questions to help us set up your account.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 md:shadow-panel md:border-l md:border-gray-200 dark:md:border-gray-950 dark:bg-dark-950">
					<div className="w-full max-w-sm p-4">{children}</div>
				</div>
			</div>
		</>
	);
}
