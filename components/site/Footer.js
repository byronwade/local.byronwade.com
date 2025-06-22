"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import { FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaDiscord, FaCertificate, FaAward, FaBriefcaseMedical, FaBookOpen, FaBuilding } from "react-icons/fa";
import { SiYelp, SiGoogle, SiTripadvisor, SiExpedia, SiThumbtack } from "react-icons/si";
import { MdVerifiedUser, MdGppGood, MdSecurity, MdRateReview, MdWork } from "react-icons/md";

export default function Footer() {
	const pathname = usePathname();

	// Check if the current route contains /search
	if (pathname.includes("/search")) {
		return null;
	}

	return (
		<>
			<footer className="relative w-full bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
				{/* Main Footer Content */}
				<div className="px-4 py-16 lg:px-24">
					{/* Top Section with Logo and Description */}
					<div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-3">
						{/* Logo and Brand Section */}
						<div className="lg:col-span-1">
							<div className="flex items-center mb-6 space-x-4">
								<Image src="/ThorbisLogo.webp" alt="Thorbis" width={60} height={60} className="w-auto h-12" />
								<h1 className="text-3xl font-bold">Thorbis</h1>
							</div>
							<p className="mb-6 max-w-md text-lg leading-relaxed">Thorbis® is a registered trademark by Wades, Inc. All rights reserved.</p>
							<p className="mb-8 max-w-md text-base opacity-90">Our mission is to transform lead management by providing the best business listing and review platform.</p>

							{/* Social Links */}
							<div className="flex mb-6 space-x-4">
								<a href="#" className="p-3 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110">
									<FaTwitter className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110">
									<FaLinkedin className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110">
									<FaInstagram className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110">
									<FaYoutube className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110">
									<FaDiscord className="w-5 h-5" />
								</a>
							</div>

							{/* Language Selector */}
							<Button variant="outline" className="text-white bg-white/10 border-white/20 hover:bg-white/20">
								<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mr-2 w-4 h-4">
									<path d="m5 8 6 6" />
									<path d="m4 14 6-6 2-3" />
									<path d="M2 5h12" />
									<path d="M7 2h1" />
									<path d="m22 22-5-10-5 10" />
									<path d="M14 18h6" />
								</svg>
								English
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="lg:col-span-2">
							<h3 className="mb-4 text-lg font-semibold">Trust & Security</h3>
							<div className="grid grid-cols-3 gap-4 md:grid-cols-6">
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<MdVerifiedUser className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">Privacy Shield</span>
								</div>
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<FaCertificate className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">ISO 27001</span>
								</div>
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<FaAward className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">SOC2</span>
								</div>
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<MdGppGood className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">CCPA</span>
								</div>
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<MdSecurity className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">GDPR</span>
								</div>
								<div className="flex flex-col items-center p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10">
									<div className="flex justify-center items-center mb-2 w-10 h-10 rounded-full bg-white/10">
										<FaBriefcaseMedical className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">HIPAA</span>
								</div>
							</div>
						</div>
					</div>

					{/* Navigation Links */}
					<div className="grid grid-cols-2 gap-8 mb-12 md:grid-cols-3 lg:grid-cols-6">
						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">About</h3>
							<div className="space-y-3">
								<a href="/about-us" className="block text-sm transition-colors duration-200 hover:text-white">
									About Thorbis
								</a>
								<a href="/careers" className="block text-sm transition-colors duration-200 hover:text-white">
									Careers
								</a>
								<a href="/press" className="block text-sm transition-colors duration-200 hover:text-white">
									Press
								</a>
								<a href="/investor-relations" className="block text-sm transition-colors duration-200 hover:text-white">
									Investor Relations
								</a>
								<a href="/trust-safety" className="block text-sm transition-colors duration-200 hover:text-white">
									Trust & Safety
								</a>
								<a href="/content-guidelines" className="block text-sm transition-colors duration-200 hover:text-white">
									Content Guidelines
								</a>
								<a href="/accessibility-statement" className="block text-sm transition-colors duration-200 hover:text-white">
									Accessibility
								</a>
								<a href="/terms" className="block text-sm transition-colors duration-200 hover:text-white">
									Terms of Service
								</a>
								<a href="/privacy" className="block text-sm transition-colors duration-200 hover:text-white">
									Privacy Policy
								</a>
								<a href="/ad-choices" className="block text-sm transition-colors duration-200 hover:text-white">
									Ad Choices
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">Support</h3>
							<div className="space-y-3">
								<a href="/mobile" className="block text-sm transition-colors duration-200 hover:text-white">
									Thorbis Mobile
								</a>
								<a href="/developers" className="block text-sm transition-colors duration-200 hover:text-white">
									Developers
								</a>
								<a href="/rss" className="block text-sm transition-colors duration-200 hover:text-white">
									RSS
								</a>
								<a href="/contact-support" className="block text-sm transition-colors duration-200 hover:text-white">
									Contact Support
								</a>
								<a href="/help-center" className="block text-sm transition-colors duration-200 hover:text-white">
									Help Center
								</a>
								<a href="/community-guidelines" className="block text-sm transition-colors duration-200 hover:text-white">
									Community Guidelines
								</a>
								<a href="/faq" className="block text-sm transition-colors duration-200 hover:text-white">
									FAQ
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">Business</h3>
							<div className="space-y-3">
								<a href="/business" className="block text-sm transition-colors duration-200 hover:text-white">
									Thorbis for Business
								</a>
								<a href="/business-owner-login" className="block text-sm transition-colors duration-200 hover:text-white">
									Business Owner Login
								</a>
								<a href="/claim-a-business" className="block text-sm transition-colors duration-200 hover:text-white">
									Claim your Business
								</a>
								<a href="/advertise" className="block text-sm transition-colors duration-200 hover:text-white">
									Advertise on Thorbis
								</a>
								<a href="/restaurant-owners" className="block text-sm transition-colors duration-200 hover:text-white">
									For Restaurant Owners
								</a>
								<a href="/table-management" className="block text-sm transition-colors duration-200 hover:text-white">
									Table Management
								</a>
								<a href="/business-success-stories" className="block text-sm transition-colors duration-200 hover:text-white">
									Success Stories
								</a>
								<a href="/business-support" className="block text-sm transition-colors duration-200 hover:text-white">
									Business Support
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">Marketing Tools</h3>
							<div className="space-y-3">
								<a href="/shorts" className="block text-sm transition-colors duration-200 hover:text-white">
									Business Shorts
								</a>
								<a href="/learn" className="block text-sm transition-colors duration-200 hover:text-white">
									Educational Content Hub
								</a>
								<a href="/challenges" className="block text-sm transition-colors duration-200 hover:text-white">
									Business Challenges
								</a>
								<a href="/network" className="block text-sm transition-colors duration-200 hover:text-white">
									Local Business Networking
								</a>
								<a href="/events" className="block text-sm transition-colors duration-200 hover:text-white">
									Local Events Platform
								</a>
								<a href="/neighborhoods" className="block text-sm transition-colors duration-200 hover:text-white">
									Neighborhood Hubs
								</a>
								<a href="/business-story-videos" className="block text-sm transition-colors duration-200 hover:text-white">
									Business Story Videos
								</a>
								<a href="/live-streaming" className="block text-sm transition-colors duration-200 hover:text-white">
									Live Streaming
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">Cities</h3>
							<div className="space-y-3">
								<a href="/search?query=&zip=10001" className="block text-sm transition-colors duration-200 hover:text-white">
									New York, NY
								</a>
								<a href="/search?query=&zip=90001" className="block text-sm transition-colors duration-200 hover:text-white">
									Los Angeles, CA
								</a>
								<a href="/search?query=&zip=60601" className="block text-sm transition-colors duration-200 hover:text-white">
									Chicago, IL
								</a>
								<a href="/search?query=&zip=77001" className="block text-sm transition-colors duration-200 hover:text-white">
									Houston, TX
								</a>
								<a href="/search?query=&zip=85001" className="block text-sm transition-colors duration-200 hover:text-white">
									Phoenix, AZ
								</a>
								<a href="/search?query=&zip=19101" className="block text-sm transition-colors duration-200 hover:text-white">
									Philadelphia, PA
								</a>
								<a href="/search?query=&zip=94101" className="block text-sm transition-colors duration-200 hover:text-white">
									San Francisco, CA
								</a>
								<a href="/search?query=&zip=98101" className="block text-sm transition-colors duration-200 hover:text-white">
									Seattle, WA
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold tracking-wide uppercase">Company</h3>
							<div className="space-y-3">
								<a href="/jobs" className="block text-sm transition-colors duration-200 hover:text-white">
									Jobs
								</a>
								<a href="/about-us" className="block text-sm transition-colors duration-200 hover:text-white">
									About
								</a>
								<a href="/contact-support" className="block text-sm transition-colors duration-200 hover:text-white">
									Contact
								</a>
								<a href="/blog" className="block text-sm transition-colors duration-200 hover:text-white">
									Blog
								</a>
								<a href="/press" className="block text-sm transition-colors duration-200 hover:text-white">
									Press
								</a>
								<a href="/investor-relations" className="block text-sm transition-colors duration-200 hover:text-white">
									Investors
								</a>
								<a href="/partners" className="block text-sm transition-colors duration-200 hover:text-white">
									Partners
								</a>
								<a href="/affiliates" className="block text-sm transition-colors duration-200 hover:text-white">
									Affiliates
								</a>
							</div>
						</div>
					</div>

					{/* Competitor Comparison Section */}
					<div className="pt-12 border-t border-white/20">
						<h3 className="mb-8 text-xl font-semibold tracking-wide text-center uppercase">Compare to Alternatives</h3>
						<div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
							<Link href="/yelp-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<SiYelp className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Yelp</span>
							</Link>
							<Link href="/google-business-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<SiGoogle className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Google Business</span>
							</Link>
							<Link href="/tripadvisor-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<SiTripadvisor className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">TripAdvisor</span>
							</Link>
							<Link href="/angies-list-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<MdRateReview className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Angie&apos;s List</span>
							</Link>
							<Link href="/booking-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<FaBuilding className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Booking.com</span>
							</Link>
							<Link href="/expedia-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<SiExpedia className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Expedia</span>
							</Link>
							<Link href="/yellow-pages-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<FaBookOpen className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Yellow Pages</span>
							</Link>
							<Link href="/bark-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<MdWork className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Bark.com</span>
							</Link>
							<Link href="/thumbtack-alternative" className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 group bg-white/5 hover:bg-white/15 hover:scale-105">
								<div className="flex justify-center items-center mb-2 w-8 h-8 rounded-full bg-white/10">
									<SiThumbtack className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium transition-colors group-hover:text-white">Thumbtack</span>
							</Link>
						</div>
					</div>
				</div>
			</footer>

			{/* Bottom Footer with Copyright */}
			<div className="border-t backdrop-blur-sm bg-primary/90 border-white/10">
				<div className="px-4 py-6 lg:px-24">
					<div className="flex flex-col justify-between items-center space-y-4 md:flex-row md:space-y-0">
						<div className="text-center md:text-left">
							<p className="text-sm font-medium text-white/90">© 2004–2024 Thorbis Inc. Thorbis, Thorbis logo, and related marks are registered trademarks of Thorbis.</p>
						</div>
						<div className="flex items-center space-x-2 text-white/80">
							<span className="text-sm">Designed and Developed by</span>
							<a href="https://byronwade.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white underline transition-colors duration-200 hover:text-blue-200 decoration-dotted underline-offset-4">
								Byron Wade
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
