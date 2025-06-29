"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "react-feather";
import DarkModeToggle from "@components/ui/DarkModeToggle";

export default function AuthFormsLayout({ children }) {
	return (
		<div className="grid overflow-hidden grid-cols-1 w-screen h-screen bg-white dark:bg-neutral-900 md:grid-cols-2">
			<div className="absolute top-5 right-5 z-10">
				<DarkModeToggle />
			</div>
			<div className="hidden relative flex-col justify-center items-center min-h-screen md:flex">
				<div className="sticky top-1/2 transform -translate-y-1/2">
					<div className="p-6 md:space-y-8 lg:space-y-20">
						<div className="md:space-y-2 lg:space-y-6">
							<Link href="/">
								<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px]" />
							</Link>
							<div>
								<div className="text-[22px] font-bold leading-[34px] ">
									Let&apos;s get to know each other{" "}
									<span role="img" aria-label="wave">
										👋
									</span>
									<p className="text-sm leading-6 text-left text-muted-foreground">Answer a few quick questions to help us set up your account.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="overflow-y-auto relative bg-gray-100 md:shadow-panel md:border-l md:border-neutral-800 dark:md:border-neutral-950 dark:bg-dark-950">
				{/* Back Button - Top Left of Right Panel */}
				<div className="absolute top-5 left-5 z-10">
					<Link href="/">
						<Button variant="outline" size="sm" className="flex gap-2 items-center">
							<ArrowLeft className="w-4 h-4" />
							Back to Thorbis
						</Button>
					</Link>
				</div>

				<div className="flex flex-col justify-center items-center py-20 w-full min-h-screen">
					<div className="p-4 w-full max-w-sm">{children}</div>
				</div>
			</div>
		</div>
	);
}
