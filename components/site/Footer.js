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
				<div className="px-4 lg:px-24 py-16">
					{/* Top Section with Logo and Description */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
						{/* Logo and Brand Section */}
						<div className="lg:col-span-1">
							<div className="flex items-center space-x-4 mb-6">
								<Image src="/ThorbisLogo.webp" alt="Thorbis" width={60} height={60} className="h-12 w-auto" />
								<h1 className="text-3xl font-bold">Thorbis</h1>
							</div>
							<p className="text-lg leading-relaxed mb-6 max-w-md">Thorbis® is a registered trademark by Wades, Inc. All rights reserved.</p>
							<p className="text-base opacity-90 mb-8 max-w-md">Our mission is to transform lead management by providing the best business listing and review platform.</p>

							{/* Social Links */}
							<div className="flex space-x-4 mb-6">
								<a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
									<FaTwitter className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
									<FaLinkedin className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
									<FaInstagram className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
									<FaYoutube className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
									<FaDiscord className="w-5 h-5" />
								</a>
							</div>

							{/* Language Selector */}
							<Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
								<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
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
							<h3 className="text-lg font-semibold mb-4">Trust & Security</h3>
							<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<MdVerifiedUser className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">Privacy Shield</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<FaCertificate className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">ISO 27001</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<FaAward className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">SOC2</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<MdGppGood className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">CCPA</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<MdSecurity className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">GDPR</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
									<div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-full">
										<FaBriefcaseMedical className="w-6 h-6" />
									</div>
									<span className="text-xs text-center">HIPAA</span>
								</div>
							</div>
						</div>
					</div>

					{/* Navigation Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">About</h3>
							<div className="space-y-3">
								<a href="/about" className="block text-sm hover:text-white transition-colors duration-200">
									About Thorbis
								</a>
								<a href="/careers" className="block text-sm hover:text-white transition-colors duration-200">
									Careers
								</a>
								<a href="/press" className="block text-sm hover:text-white transition-colors duration-200">
									Press
								</a>
								<a href="/investor-relations" className="block text-sm hover:text-white transition-colors duration-200">
									Investor Relations
								</a>
								<a href="/trust-safety" className="block text-sm hover:text-white transition-colors duration-200">
									Trust & Safety
								</a>
								<a href="/content-guidelines" className="block text-sm hover:text-white transition-colors duration-200">
									Content Guidelines
								</a>
								<a href="/accessibility-statement" className="block text-sm hover:text-white transition-colors duration-200">
									Accessibility
								</a>
								<a href="/terms" className="block text-sm hover:text-white transition-colors duration-200">
									Terms of Service
								</a>
								<a href="/privacy" className="block text-sm hover:text-white transition-colors duration-200">
									Privacy Policy
								</a>
								<a href="/ad-choices" className="block text-sm hover:text-white transition-colors duration-200">
									Ad Choices
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Support</h3>
							<div className="space-y-3">
								<a href="/mobile" className="block text-sm hover:text-white transition-colors duration-200">
									Thorbis Mobile
								</a>
								<a href="/developers" className="block text-sm hover:text-white transition-colors duration-200">
									Developers
								</a>
								<a href="/rss" className="block text-sm hover:text-white transition-colors duration-200">
									RSS
								</a>
								<a href="/contact-support" className="block text-sm hover:text-white transition-colors duration-200">
									Contact Support
								</a>
								<a href="/help-center" className="block text-sm hover:text-white transition-colors duration-200">
									Help Center
								</a>
								<a href="/community-guidelines" className="block text-sm hover:text-white transition-colors duration-200">
									Community Guidelines
								</a>
								<a href="/faq" className="block text-sm hover:text-white transition-colors duration-200">
									FAQ
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Business</h3>
							<div className="space-y-3">
								<a href="/business" className="block text-sm hover:text-white transition-colors duration-200">
									Thorbis for Business
								</a>
								<a href="/business-owner-login" className="block text-sm hover:text-white transition-colors duration-200">
									Business Owner Login
								</a>
								<a href="/claim-business" className="block text-sm hover:text-white transition-colors duration-200">
									Claim your Business
								</a>
								<a href="/advertise" className="block text-sm hover:text-white transition-colors duration-200">
									Advertise on Thorbis
								</a>
								<a href="/restaurant-owners" className="block text-sm hover:text-white transition-colors duration-200">
									For Restaurant Owners
								</a>
								<a href="/table-management" className="block text-sm hover:text-white transition-colors duration-200">
									Table Management
								</a>
								<a href="/business-success-stories" className="block text-sm hover:text-white transition-colors duration-200">
									Success Stories
								</a>
								<a href="/business-support" className="block text-sm hover:text-white transition-colors duration-200">
									Business Support
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Marketing Tools</h3>
							<div className="space-y-3">
								<a href="/shorts" className="block text-sm hover:text-white transition-colors duration-200">
									Business Shorts
								</a>
								<a href="/learn" className="block text-sm hover:text-white transition-colors duration-200">
									Educational Content Hub
								</a>
								<a href="/challenges" className="block text-sm hover:text-white transition-colors duration-200">
									Business Challenges
								</a>
								<a href="/network" className="block text-sm hover:text-white transition-colors duration-200">
									Local Business Networking
								</a>
								<a href="/events" className="block text-sm hover:text-white transition-colors duration-200">
									Local Events Platform
								</a>
								<a href="/neighborhoods" className="block text-sm hover:text-white transition-colors duration-200">
									Neighborhood Hubs
								</a>
								<a href="/business-story-videos" className="block text-sm hover:text-white transition-colors duration-200">
									Business Story Videos
								</a>
								<a href="/live-streaming" className="block text-sm hover:text-white transition-colors duration-200">
									Live Streaming
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Cities</h3>
							<div className="space-y-3">
								<a href="/search?query=&zip=10001" className="block text-sm hover:text-white transition-colors duration-200">
									New York, NY
								</a>
								<a href="/search?query=&zip=90001" className="block text-sm hover:text-white transition-colors duration-200">
									Los Angeles, CA
								</a>
								<a href="/search?query=&zip=60601" className="block text-sm hover:text-white transition-colors duration-200">
									Chicago, IL
								</a>
								<a href="/search?query=&zip=77001" className="block text-sm hover:text-white transition-colors duration-200">
									Houston, TX
								</a>
								<a href="/search?query=&zip=85001" className="block text-sm hover:text-white transition-colors duration-200">
									Phoenix, AZ
								</a>
								<a href="/search?query=&zip=19101" className="block text-sm hover:text-white transition-colors duration-200">
									Philadelphia, PA
								</a>
								<a href="/search?query=&zip=94101" className="block text-sm hover:text-white transition-colors duration-200">
									San Francisco, CA
								</a>
								<a href="/search?query=&zip=98101" className="block text-sm hover:text-white transition-colors duration-200">
									Seattle, WA
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Company</h3>
							<div className="space-y-3">
								<a href="/jobs" className="block text-sm hover:text-white transition-colors duration-200">
									Jobs
								</a>
								<a href="/about" className="block text-sm hover:text-white transition-colors duration-200">
									About
								</a>
								<a href="/contact" className="block text-sm hover:text-white transition-colors duration-200">
									Contact
								</a>
								<a href="/blog" className="block text-sm hover:text-white transition-colors duration-200">
									Blog
								</a>
								<a href="/press" className="block text-sm hover:text-white transition-colors duration-200">
									Press
								</a>
								<a href="/investors" className="block text-sm hover:text-white transition-colors duration-200">
									Investors
								</a>
								<a href="/partners" className="block text-sm hover:text-white transition-colors duration-200">
									Partners
								</a>
								<a href="/affiliates" className="block text-sm hover:text-white transition-colors duration-200">
									Affiliates
								</a>
							</div>
						</div>
					</div>

					{/* Competitor Comparison Section */}
					<div className="border-t border-white/20 pt-12">
						<h3 className="text-xl font-semibold text-center mb-8 uppercase tracking-wide">Compare to Alternatives</h3>
						<div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
							<Link href="/yelp-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<SiYelp className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Yelp</span>
							</Link>
							<Link href="/google-business-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<SiGoogle className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Google Business</span>
							</Link>
							<Link href="/tripadvisor-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<SiTripadvisor className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">TripAdvisor</span>
							</Link>
							<Link href="/angies-list-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<MdRateReview className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Angie&apos;s List</span>
							</Link>
							<Link href="/booking-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<FaBuilding className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Booking.com</span>
							</Link>
							<Link href="/expedia-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<SiExpedia className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Expedia</span>
							</Link>
							<Link href="/yellow-pages-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<FaBookOpen className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Yellow Pages</span>
							</Link>
							<Link href="/bark-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<MdWork className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Bark.com</span>
							</Link>
							<Link href="/thumbtack-alternative" className="group flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
								<div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/10 rounded-full">
									<SiThumbtack className="w-5 h-5" />
								</div>
								<span className="text-sm font-medium group-hover:text-white transition-colors">Thumbtack</span>
							</Link>
						</div>
					</div>
				</div>
			</footer>

			{/* Bottom Footer with Copyright */}
			<div className="bg-primary/90 backdrop-blur-sm border-t border-white/10">
				<div className="px-4 lg:px-24 py-6">
					<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
						<div className="text-center md:text-left">
							<p className="text-sm text-white/90 font-medium">© 2004–2024 Thorbis Inc. Thorbis, Thorbis logo, and related marks are registered trademarks of Thorbis.</p>
						</div>
						<div className="flex items-center space-x-2 text-white/80">
							<span className="text-sm">Designed and Developed by</span>
							<a href="https://byronwade.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-blue-200 transition-colors duration-200 underline decoration-dotted underline-offset-4">
								Byron Wade
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
