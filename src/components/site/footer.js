"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDiscord, FaCertificate, FaAward, FaBriefcaseMedical, FaBookOpen, FaBuilding, FaArrowRight } from "react-icons/fa";
import { SiYelp, SiGoogle, SiTripadvisor, SiExpedia, SiThumbtack } from "react-icons/si";
import { MdVerifiedUser, MdGppGood, MdSecurity, MdRateReview, MdWork, MdCompare } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import LanguageSelector from "@components/ui/language-selector";
import { useLanguage } from "@context/language-context";
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
	const pathname = usePathname();
	const { dictionary, loading } = useLanguage();

	// Check if the current route contains /search
	if (pathname.includes("/search")) {
		return null;
	}

	// Show loading state or fallback to English
	if (loading || !dictionary) {
		return <FooterSkeleton />;
	}

	const { footer } = dictionary;

	return (
		<>
			<footer className="relative w-full text-gray-900 dark:text-white bg-neutral-900 dark:bg-neutral-900 border-t border-neutral-800 dark:border-neutral-900">
				{/* Main Footer Content */}
				<div className="px-4 py-20 lg:px-24">
					{/* Top Section with Logo and Description */}
					<div className="grid grid-cols-1 gap-16 mb-20 lg:grid-cols-4">
						{/* Logo and Brand Section */}
						<div className="lg:col-span-1">
							<div className="flex items-center mb-6 space-x-4">
								<Image src="/logos/ThorbisLogo.webp" alt="Thorbis" width={60} height={60} className="w-auto h-12" />
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thorbis</h1>
							</div>
							<p className="mb-6 max-w-md text-lg leading-relaxed text-gray-700 dark:text-gray-300">{footer.trademark}</p>
							<p className="mb-8 max-w-md text-base text-gray-600 dark:text-gray-400">{footer.mission}</p>

							{/* Social Links */}
							<div className="flex mb-8 space-x-4">
								<a href="https://twitter.com/localhub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<Twitter className="w-5 h-5" />
								</a>
								<a href="https://facebook.com/localhub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<Facebook className="w-5 h-5" />
								</a>
								<a href="https://instagram.com/localhub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<Instagram className="w-5 h-5" />
								</a>
								<a href="https://linkedin.com/company/localhub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<Linkedin className="w-5 h-5" />
								</a>
								<a href="https://youtube.com/localhub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<Youtube className="w-5 h-5" />
								</a>
								<a href="#" className="p-3 rounded-full border transition-all duration-300 flex justify-center items-center w-10 h-10 rounded-full bg-neutral-800 dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-110 border-neutral-900 dark:border-neutral-900">
									<FaDiscord className="w-5 h-5 text-gray-700 dark:text-gray-300" />
								</a>
							</div>

							{/* Language Selector */}
							<LanguageSelector />
						</div>

						{/* Trust Badges */}
						<div className="lg:col-span-3">
							<TooltipProvider>
								<h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">{footer.trustTitle}</h3>
								<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
									{/* Privacy Shield */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-green-500/20 hover:border-green-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-green-400/30 to-green-600/30 border-green-400/50">
													<MdVerifiedUser className="w-6 h-6 text-green-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">Privacy Shield</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-green-400/10 to-green-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-green-700">Privacy Shield</div>
											<div className="text-sm">Ensures your data is protected when transferred between the US and EU. We comply with strict privacy standards.</div>
										</TooltipContent>
									</Tooltip>

									{/* ISO 27001 */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-blue-500/20 hover:border-blue-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-blue-400/30 to-blue-600/30 border-blue-400/50">
													<FaCertificate className="w-6 h-6 text-blue-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">ISO 27001</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-blue-400/10 to-blue-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-blue-700">ISO 27001</div>
											<div className="text-sm">International standard for information security management. We follow best practices to protect your data.</div>
										</TooltipContent>
									</Tooltip>

									{/* SOC2 */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-purple-500/20 hover:border-purple-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-purple-400/30 to-purple-600/30 border-purple-400/50">
													<FaAward className="w-6 h-6 text-purple-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">SOC2</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-purple-400/10 to-purple-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-purple-700">SOC2</div>
											<div className="text-sm">Our systems are audited for security, availability, and confidentiality. Your data is handled with care.</div>
										</TooltipContent>
									</Tooltip>

									{/* CCPA */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-orange-500/20 hover:border-orange-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-orange-400/30 to-orange-600/30 border-orange-400/50">
													<MdGppGood className="w-6 h-6 text-orange-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">CCPA</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-orange-400/10 to-orange-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-orange-700">CCPA</div>
											<div className="text-sm">Gives California residents control over their personal information. We honor your privacy rights.</div>
										</TooltipContent>
									</Tooltip>

									{/* GDPR */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-indigo-500/20 hover:border-indigo-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-indigo-400/30 to-indigo-600/30 border-indigo-400/50">
													<MdSecurity className="w-6 h-6 text-indigo-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">GDPR</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-indigo-400/10 to-indigo-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-indigo-700">GDPR</div>
											<div className="text-sm">EU&apos;s data protection law. We are committed to transparency and user control over personal data.</div>
										</TooltipContent>
									</Tooltip>

									{/* HIPAA */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex relative flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/5 border-white/20 hover:bg-teal-500/20 hover:border-teal-400/40">
												<div className="flex justify-center items-center mb-3 w-12 h-12 bg-gradient-to-br rounded-lg border from-teal-400/30 to-teal-600/30 border-teal-400/50">
													<FaBriefcaseMedical className="w-6 h-6 text-teal-300" />
												</div>
												<span className="text-sm font-medium text-center text-white">HIPAA</span>
												<div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-teal-400/10 to-teal-600/10 group-hover:opacity-100"></div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="p-4 max-w-xs rounded-xl border shadow-2xl backdrop-blur-sm bg-white/95 text-slate-900 border-white/20">
											<div className="mb-1 font-semibold text-teal-700">HIPAA</div>
											<div className="text-sm">Protects your health information. We meet strict standards for medical data privacy and security.</div>
										</TooltipContent>
									</Tooltip>
								</div>
							</TooltipProvider>
						</div>
					</div>

					{/* Compare Alternatives Section */}
					<div className="mb-16">
						<div className="mb-12 text-center">
							<h3 className="flex gap-3 justify-center items-center mb-4 text-2xl font-bold text-white">
								<MdCompare className="w-6 h-6 text-blue-300" />
								{footer.compareTitle}
							</h3>
							<p className="mx-auto max-w-2xl text-lg text-slate-300">{footer.compareDescription}</p>
						</div>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
							<Link href="/yelp-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-red-500/20 hover:border-red-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<SiYelp className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Yelp</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/google-business-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-blue-500/20 hover:border-blue-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<SiGoogle className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Google Business</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/tripadvisor-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-green-500/20 hover:border-green-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<SiTripadvisor className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs TripAdvisor</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/angies-list-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-pink-500/20 hover:border-pink-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<MdRateReview className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Angie&apos;s List</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/booking-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<FaBuilding className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Booking.com</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/expedia-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-orange-500/20 hover:border-orange-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<SiExpedia className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Expedia</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/yellow-pages-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-yellow-500/20 hover:border-yellow-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<FaBookOpen className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Yellow Pages</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/bark-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-emerald-500/20 hover:border-emerald-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<MdWork className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Bark.com</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
							<Link href="/thumbtack-alternative" className="group">
								<div className="flex flex-col items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/20 hover:bg-purple-500/20 hover:border-purple-400/40">
									<div className="flex justify-center items-center mb-3 w-12 h-12 rounded-lg border bg-white/10 border-white/20">
										<SiThumbtack className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-center text-white">vs Thumbtack</span>
									<FaArrowRight className="mt-2 w-4 h-4 transition-all duration-300 text-slate-400 group-hover:translate-x-1 group-hover:text-white" />
								</div>
							</Link>
						</div>
					</div>

					{/* Navigation Links */}
					<div className="grid grid-cols-2 gap-12 mb-16 md:grid-cols-4 lg:grid-cols-6">
						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.about}</h3>
							<div className="space-y-4">
								<a href="/about-us" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.aboutUs}
								</a>
								<a href="/careers" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.careers}
								</a>
								<a href="/press" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.press}
								</a>
								<a href="/investor-relations" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.investorRelations}
								</a>
								<a href="/trust-safety" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.trustSafety}
								</a>
								<a href="/transparency" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.transparency}
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.support}</h3>
							<div className="space-y-4">
								<a href="/mobile" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.mobile}
								</a>
								<a href="/developers" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.developers}
								</a>
								<a href="/rss" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.rss}
								</a>
								<a href="/contact-support" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.contactSupport}
								</a>
								<a href="/help-center" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.helpCenter}
								</a>
								<a href="/faq" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.faq}
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.business}</h3>
							<div className="space-y-4">
								<a href="/business" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.businessForBusiness}
								</a>
								<a href="/business-owner-login" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.businessOwnerLogin}
								</a>
								<a href="/claim-a-business" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.claimBusiness}
								</a>
								<a href="/advertise" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.advertise}
								</a>
								<a href="/restaurant-owners" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.restaurantOwners}
								</a>
								<a href="/table-management" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.tableManagement}
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.legal}</h3>
							<div className="space-y-4">
								<a href="/terms" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.terms}
								</a>
								<a href="/privacy" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.privacy}
								</a>
								<a href="/content-guidelines" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.contentGuidelines}
								</a>
								<a href="/community-guidelines" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.communityGuidelines}
								</a>
								<a href="/ad-choices" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.adChoices}
								</a>
								<a href="/accessibility-statement" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.accessibility}
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.resources}</h3>
							<div className="space-y-4">
								<a href="/blog" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.blog}
								</a>
								<a href="/news" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.news}
								</a>
								<a href="/events" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.events}
								</a>
								<a href="/case-studies" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.caseStudies}
								</a>
								<a href="/business-success-stories" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.successStories}
								</a>
								<a href="/learn" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.learn}
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">{footer.sections.partners}</h3>
							<div className="space-y-4">
								<a href="/partners" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.partnerships}
								</a>
								<a href="/affiliates" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.affiliates}
								</a>
								<a href="/business-certification" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.certification}
								</a>
								<a href="/api" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.api}
								</a>
								<a href="/integrations" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.integrations}
								</a>
								<a href="/marketplace" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									{footer.links.marketplace}
								</a>
							</div>
						</div>

						{/* Industries (compact, collapsible) */}
						<div>
							<h3 className="mb-6 text-lg font-semibold tracking-wide text-white uppercase">Industries</h3>
							<div className="space-y-4">
								<a href="/industries" className="block text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
									Industries overview
								</a>
								<div className="grid grid-cols-2 gap-2">
									<a href="/field-management-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Field Management
									</a>
									<a href="/construction-management-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Construction
									</a>
									<a href="/retail-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Retail
									</a>
									<a href="/healthcare-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Healthcare
									</a>
									<a href="/hospitality-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Hospitality
									</a>
									<a href="/automotive-shop-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Automotive
									</a>
									<a href="/property-management-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Property Mgmt
									</a>
									<a href="/logistics-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
										Logistics
									</a>
								</div>
								<details className="mt-2">
									<summary className="text-sm text-slate-400 hover:text-blue-300 cursor-pointer select-none">More industries</summary>
									<div className="mt-3 grid grid-cols-2 gap-2">
										<a href="/academy-learning-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Academy
										</a>
										<a href="/admin-operations-console" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Admin Console
										</a>
										<a href="/agriculture-management-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Agriculture
										</a>
										<a href="/field-service-management" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Field Service Management
										</a>
										<a href="/beauty-salon-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Beauty Salon
										</a>
										<a href="/business-management-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Business Mgmt
										</a>
										<a href="/ecommerce-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											eCommerce
										</a>
										<a href="/energy-services-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Energy Services
										</a>
										<a href="/fitness-studio-software" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Fitness Studio
										</a>
										<a href="/localhub-marketplace-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											LocalHub
										</a>
										<a href="/nonprofit-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Nonprofit
										</a>
										<a href="/professional-services-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Professional Services
										</a>
										<a href="/real-estate-operations-platform" className="text-sm transition-colors duration-200 hover:text-blue-300 text-slate-300">
											Real Estate
										</a>
									</div>
								</details>
							</div>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="pt-8 border-t border-white/20">
						<div className="flex flex-col justify-between items-center space-y-4 md:flex-row md:space-y-0">
							<div className="flex items-center space-x-6 text-sm text-slate-400">
								<span>{footer.copyright}</span>
								<span>•</span>
								<span>{footer.madeWith}</span>
							</div>
							<div className="flex items-center space-x-6">
								<a href="/sitemap" className="text-sm transition-colors text-slate-400 hover:text-blue-300">
									{footer.links.sitemap}
								</a>
								<a href="/status" className="text-sm transition-colors text-slate-400 hover:text-blue-300">
									{footer.links.status}
								</a>
								<a href="/feedback" className="text-sm transition-colors text-slate-400 hover:text-blue-300">
									{footer.links.feedback}
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}

// Loading skeleton for footer
function FooterSkeleton() {
	return (
		<footer className="relative w-full text-white bg-gradient-to-br via-blue-900 from-slate-900 to-slate-800">
			<div className="px-4 py-20 lg:px-24">
				<div className="animate-pulse">
					<div className="grid grid-cols-1 gap-16 mb-20 lg:grid-cols-4">
						<div className="lg:col-span-1">
							<div className="flex items-center mb-6 space-x-4">
								<div className="w-12 h-12 rounded bg-white/20"></div>
								<div className="w-24 h-8 rounded bg-white/20"></div>
							</div>
							<div className="space-y-4">
								<div className="w-full h-4 rounded bg-white/20"></div>
								<div className="w-3/4 h-4 rounded bg-white/20"></div>
							</div>
						</div>
						<div className="lg:col-span-3">
							<div className="mb-8 w-48 h-8 rounded bg-white/20"></div>
							<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="h-24 rounded-xl bg-white/10"></div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
