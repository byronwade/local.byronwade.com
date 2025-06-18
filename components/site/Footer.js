"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import { FaGithub, FaDiscord, FaProductHunt, FaHackerNews } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

export default function Footer() {
	const pathname = usePathname();

	// Check if the current route contains /search
	if (pathname.includes("/search")) {
		return null;
	}

	return (
		<>
			<footer className="relative w-full h-full px-4 py-20 pl-8 mx-auto bg-primary text-primary-foreground sm:px-12 lg:px-24">
				<div className="flex flex-col pr-2 my-4 text-sm">
					<div className="flex pb-2 lg:pb-7">
						<div className="flex">
							<Link href="/" className="flex flex-col items-start h-full space-y-4 text-xl font-bold align-middle">
								<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="h-full w-[41px]" />
								<h1 className="text-2xl leading-none">Thorbis</h1>
							</Link>
						</div>
					</div>
					<p className="max-w-[250px] lg:block">Thorbis® is a registered trademark by Wades, Inc. All rights reserved.</p>
					<div className="mt-6 flex h-12 w-[300px] place-items-center gap-3">
						<a className="block" href="/security">
							<Image alt="EU-US Privacy Shield" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
						<a className="block" href="/security">
							<Image alt="ISO 27001" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
						<a className="block" href="/security">
							<Image alt="SOC2" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
						<a className="block" href="/security">
							<Image alt="CCPA" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
						<a className="block" href="/security">
							<Image alt="GDPR" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
						<a className="block" href="/security">
							<Image alt="HIPAA" loading="lazy" width={500} height={500} className="w-full h-12 min-w-11 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 invert" src="/chatgpt.svg" />
						</a>
					</div>
					<div className="flex gap-4 mt-6">
						<FaDiscord className="w-6 h-6 text-primary-foreground/80 hover:text-primary-foreground hover:animate-spin-slow cursor-pointer" />
						<RiTwitterXFill className="w-6 h-6 text-primary-foreground/80 hover:text-primary-foreground hover:animate-spin-slow cursor-pointer" />
						<FaGithub className="w-6 h-6 text-primary-foreground/80 hover:text-primary-foreground hover:animate-spin-slow cursor-pointer" />
						<FaProductHunt className="w-6 h-6 text-primary-foreground/80 hover:text-primary-foreground hover:animate-spin-slow cursor-pointer" />
						<FaHackerNews className="w-6 h-6 text-primary-foreground/80 hover:text-primary-foreground hover:animate-spin-slow cursor-pointer" />
					</div>
					<p className="mt-2 max-w-[350px] pr-4 text-base opacity-50 transition-opacity  ease-in-out hover:opacity-100 ">Our mission is to transform lead management by providing the best business listing and review platform.</p>
					<div className="mt-8">
						<Button>
							<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-4">
								<path d="m5 8 6 6" />
								<path d="m4 14 6-6 2-3" />
								<path d="M2 5h12" />
								<path d="M7 2h1" />
								<path d="m22 22-5-10-5 10" />
								<path d="M14 18h6" />
							</svg>
							<span className="font-normal truncate">English</span>
						</Button>
					</div>
				</div>
				<div>
					<nav className="mt-6 grid w-full grid-cols-1 gap-x-4 gap-y-10 leading-[125%] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						<div>
							<h2 className="text-lg font-semibold uppercase">About</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/about">
									About Thorbis
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/careers">
									Careers
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/press">
									Press
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/investor-relations">
									Investor Relations
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/trust-safety">
									Trust & Safety
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/content-guidelines">
									Content Guidelines
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/accessibility-statement">
									Accessibility Statement
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/terms">
									Terms of Service
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/privacy">
									Privacy Policy
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/ad-choices">
									Ad Choices
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Support</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/mobile">
									Thorbis Mobile
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/developers">
									Developers
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/rss">
									RSS
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/contact-support">
									Contact Support
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/help-center">
									Help Center
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/community-guidelines">
									Community Guidelines
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/faq">
									FAQ
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Business</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business">
									Thorbis for Business
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-owner-login">
									Business Owner Login
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/claim-business">
									Claim your Business Page
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/advertise">
									Advertise on Thorbis
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/restaurant-owners">
									Thorbis for Restaurant Owners
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/table-management">
									Table Management
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-success-stories">
									Business Success Stories
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-support">
									Business Support
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Cities</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=10001">
									New York, NY
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=90001">
									Los Angeles, CA
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=60601">
									Chicago, IL
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=77001">
									Houston, TX
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=85001">
									Phoenix, AZ
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=19101">
									Philadelphia, PA
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=94101">
									San Francisco, CA
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=98101">
									Seattle, WA
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Company</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/jobs">
									Jobs
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/about">
									About
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="https://app.thorbis.com/support">
									Support
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/privacy">
									Privacy
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/terms">
									Terms
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="https://github.com/thorbis/thorbis.com/blob/main/LICENSE">
									License
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/security">
									Security
								</a>
								<a target="_blank" className="hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/subscribe">
									Changelog
								</a>
							</div>
						</div>
					</nav>

					<div className="mt-8 text-center">
						<h2 className="text-lg font-semibold uppercase">Compare to</h2>
						<div className="grid grid-cols-2 gap-6 mt-4 md:grid-cols-3 lg:grid-cols-9">
							<Link href="/yelp-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Yelp" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Yelp</div>
							</Link>
							<Link href="/google-business-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Google Business" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Google Business</div>
							</Link>
							<Link href="/tripadvisor-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="TripAdvisor" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">TripAdvisor</div>
							</Link>
							<Link href="/angies-list-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Angie's List" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Angie&apos;s List</div>
							</Link>
							<Link href="/booking-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Booking.com" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Booking.com</div>
							</Link>
							<Link href="/expedia-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Expedia" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Expedia</div>
							</Link>
							<Link href="/yellow-pages-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Yellow Pages" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Yellow Pages</div>
							</Link>
							<Link href="/bark-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Bark.com" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Bark.com</div>
							</Link>
							<Link href="/thumbtack-alternative" className="flex flex-col items-center p-4 bg-background/10 border rounded-md text-md hover:bg-background/20">
								<Image src="/chatgpt.svg" alt="Thumbtack" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-foreground/80 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Thumbtack</div>
							</Link>
						</div>
					</div>
				</div>
			</footer>
			<div>
				<div className="flex items-center justify-center w-full h-24 bg-black">
					<div className="flex flex-col items-center justify-center space-y-2 text-white">
						<p className="text-sm">© 2004–2024 Thorbis Inc. Thorbis, Thorbis logo, and related marks are registered trademarks of Thorbis.</p>
						<a href="https://byronwade.com" target="_blank" className="text-xs">
							Designed and Developed by <span className="font-bold text-primary">Byron Wade</span>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
