"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "react-feather";
import DarkModeToggle from "@components/ui/DarkModeToggle";

export default function DashboardRootLayout({ children }) {
	return (
		<>
			<div className="grid w-screen h-screen grid-cols-1 bg-white dark:bg-neutral-900 md:grid-cols-2">
				{/* <div className="absolute top-5 left-5">
					<Link href="/">
						<Button>
							<ArrowLeft className="w-4 h-4 mr-2" /> Thorbis
						</Button>
					</Link>
				</div> */}
				<div className="absolute top-5 right-5">
					<DarkModeToggle />
				</div>
				<div className="relative flex-col items-center justify-center hidden min-h-screen md:flex">
					<div className="sticky transform -translate-y-1/2 top-1/2">
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
				<div className="bg-gray-100 md:shadow-panel md:border-l md:border-gray-200 dark:md:border-gray-950 dark:bg-dark-950">
					<div className="flex flex-col items-center justify-center w-full h-full min-h-screen py-20 ">
						<div className="w-full max-w-sm p-4">{children}</div>
					</div>
				</div>
			</div>
		</>
	);
}
