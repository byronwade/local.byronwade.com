"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";

export default function PublicHeader() {
	const pathname = usePathname();

	// Check if the current route contains /search
	if (pathname.includes("/search")) {
		return null;
	}

	return (
		<>
			<footer className="bg-primary-700 font-matter md:rounded-4xl h-full px-6 py-14 text-gray-50 lg:px-11 lg:pb-[68px] lg:pt-11 relative mx-auto w-full max-w-[1440px] md:px-[34px] md:px-unset z-20 md:pb-[32px]">
				<div className="flex flex-col pr-2 my-4 text-sm">
					<div className="flex pb-2 lg:pb-7">
						<div className="flex">
							<a href="/">
								<span className="text-lg font-extrabold lg:inline-block">Thorbis</span>
							</a>
						</div>
					</div>
					<p className="max-w-[250px] lg:block">Thorbis® is a registered trademark by Thorbis, Inc. All rights reserved.</p>
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
						<div className="-mt-px">
							<span>
								<span />
							</span>
						</div>{" "}
						<a className="[&>svg]:fill-primary-300 [&>svg]:transition-fill [&>svg]:duration-150 [&>svg]:hover:fill-white" aria-label="Discord" target="_blank" rel="noopener" href="https://go.thorbis.com/discord">
							<svg className="mt-0.5" width={22} height={22} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
								<path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z" />
							</svg>
						</a>
						<a className="[&>svg]:fill-primary-300 [&>svg]:transition-fill [&>svg]:duration-150 [&>svg]:hover:fill-white" aria-label="Twitter" target="_blank" rel="noopener" href="https://twitter.com/thorbis">
							<svg className="mt-1" width={22} height={22} viewBox="0 0 26 26" aria-label="X formerly known as Twitter" fill="currentColor">
								<path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z" />
							</svg>
						</a>
						<a className="[&>svg]:fill-primary-300 [&>svg]:transition-fill [&>svg]:duration-150 [&>svg]:hover:fill-white" aria-label="GitHub" target="_blank" rel="noopener" href="https://github.com/thorbis">
							<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M12 2C6.477 2 2 6.484 2 12.017C2 16.442 4.865 20.197 8.839 21.521C9.339 21.613 9.521 21.304 9.521 21.038C9.521 20.801 9.513 20.17 9.508 19.335C6.726 19.94 6.139 17.992 6.139 17.992C5.685 16.834 5.029 16.526 5.029 16.526C4.121 15.906 5.098 15.918 5.098 15.918C6.101 15.988 6.629 16.95 6.629 16.95C7.521 18.48 8.97 18.038 9.539 17.782C9.631 17.135 9.889 16.694 10.175 16.444C7.955 16.191 5.62 15.331 5.62 11.493C5.62 10.4 6.01 9.505 6.649 8.805C6.546 8.552 6.203 7.533 6.747 6.155C6.747 6.155 7.587 5.885 9.497 7.181C10.3128 6.95851 11.1544 6.84519 12 6.844C12.85 6.848 13.705 6.959 14.504 7.181C16.413 5.885 17.251 6.154 17.251 6.154C17.797 7.533 17.453 8.552 17.351 8.805C17.991 9.505 18.379 10.4 18.379 11.493C18.379 15.341 16.04 16.188 13.813 16.436C14.172 16.745 14.491 17.356 14.491 18.291C14.491 19.629 14.479 20.71 14.479 21.038C14.479 21.306 14.659 21.618 15.167 21.52C17.1583 20.8521 18.8893 19.5753 20.1155 17.87C21.3416 16.1648 22.0009 14.1173 22 12.017C22 6.484 17.522 2 12 2Z"
								/>
							</svg>
						</a>
						<a className="[&>svg]:fill-primary-300 [&>svg]:transition-fill [&>svg]:duration-150 [&>svg]:hover:fill-white" aria-label="Product Hunt" target="_blank" rel="noopener" href="https://go.thorbis.com/producthunt">
							<svg width={22} height={22} viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 1 }}>
								<path d="M58.48 29.24C58.48 45.388 45.388 58.48 29.24 58.48C13.09 58.48 0 45.388 0 29.24C0 13.09 13.091 0 29.24 0C45.388 0 58.48 13.091 58.48 29.24Z" />
								<path
									d="M33.138 29.24H24.854V20.468H33.138C33.714 20.468 34.2843 20.5815 34.8164 20.8019C35.3486 21.0223 35.8321 21.3454 36.2394 21.7526C36.6467 22.1599 36.9697 22.6434 37.1901 23.1756C37.4106 23.7077 37.524 24.278 37.524 24.854C37.524 25.43 37.4106 26.0003 37.1901 26.5325C36.9697 27.0646 36.6467 27.5481 36.2394 27.9554C35.8321 28.3627 35.3486 28.6857 34.8164 28.9061C34.2843 29.1266 33.714 29.24 33.138 29.24ZM33.138 14.62H19.006V43.86H24.854V35.088H33.138C38.79 35.088 43.372 30.506 43.372 24.854C43.372 19.202 38.79 14.62 33.138 14.62Z"
									fill="black"
								/>
							</svg>
						</a>
						<a className="[&>svg]:fill-primary-300 [&>svg]:transition-fill [&>svg]:duration-150 [&>svg]:hover:fill-white" aria-label="Hacker News" target="_blank" rel="noopener" href="https://go.thorbis.com/hackernews">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width={24} height={24}>
								<path d="M4,4v42h42V4H4z M44,44H6V6h38V44z M42,8H8v34h34V8z M27,28v8h-4v-8l-7-13h3.18L25,25.19L30.82,15H34L27,28z" />
							</svg>
						</a>
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
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/about">
									About Thorbis
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/careers">
									Careers
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/press">
									Press
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/investor-relations">
									Investor Relations
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/trust-safety">
									Trust & Safety
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/content-guidelines">
									Content Guidelines
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/accessibility-statement">
									Accessibility Statement
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/terms">
									Terms of Service
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/privacy">
									Privacy Policy
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/ad-choices">
									Ad Choices
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Support</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/mobile">
									Thorbis Mobile
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/developers">
									Developers
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/rss">
									RSS
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/contact-support">
									Contact Support
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/help-center">
									Help Center
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/community-guidelines">
									Community Guidelines
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/faq">
									FAQ
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Business</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business">
									Thorbis for Business
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-owner-login">
									Business Owner Login
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/claim-business">
									Claim your Business Page
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/advertise">
									Advertise on Thorbis
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/restaurant-owners">
									Thorbis for Restaurant Owners
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/table-management">
									Table Management
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-success-stories">
									Business Success Stories
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/business-support">
									Business Support
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Cities</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=10001">
									New York, NY
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=90001">
									Los Angeles, CA
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=60601">
									Chicago, IL
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=77001">
									Houston, TX
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=85001">
									Phoenix, AZ
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=19101">
									Philadelphia, PA
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=94101">
									San Francisco, CA
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/search?query=&zip=98101">
									Seattle, WA
								</a>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold uppercase">Company</h2>
							<div className="flex flex-col mt-4 space-y-4">
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/jobs">
									Jobs
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/about">
									About
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="https://app.thorbis.com/support">
									Support
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/privacy">
									Privacy
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/terms">
									Terms
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="https://github.com/thorbis/thorbis.com/blob/main/LICENSE">
									License
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/security">
									Security
								</a>
								<a target="_blank" className="hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]" href="/subscribe">
									Changelog
								</a>
							</div>
						</div>
					</nav>

					<div className="mt-8 text-center">
						<h2 className="text-lg font-semibold uppercase">Compare to</h2>
						<div className="grid grid-cols-2 gap-6 mt-4 md:grid-cols-3 lg:grid-cols-9">
							<Link href="/yelp-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Yelp" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Yelp</div>
							</Link>
							<Link href="/google-business-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Google Business" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Google Business</div>
							</Link>
							<Link href="/tripadvisor-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="TripAdvisor" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">TripAdvisor</div>
							</Link>
							<Link href="/angies-list-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Angie's List" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Angie&apos;s List</div>
							</Link>
							<Link href="/booking-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Booking.com" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Booking.com</div>
							</Link>
							<Link href="/expedia-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Expedia" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Expedia</div>
							</Link>
							<Link href="/yellow-pages-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Yellow Pages" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Yellow Pages</div>
							</Link>
							<Link href="/bark-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Bark.com" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Bark.com</div>
							</Link>
							<Link href="/thumbtack-alternative" className="flex flex-col items-center p-4 bg-black border rounded-md text-md hover:bg-gray-900">
								<Image src="/chatgpt.svg" alt="Thumbtack" width={30} height={30} className="w-[30px] h-[30px] m-auto invert" />
								<div className="mt-2 hover:text-primary-200 truncate text-ellipsis transition-colors duration-150 [text-wrap:nowrap]">Thumbtack</div>
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
							Designed and Developed by <span className="font-bold text-brand">Byron Wade</span>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
