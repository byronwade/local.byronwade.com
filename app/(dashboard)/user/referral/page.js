"use client";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { ChevronDown, Facebook, Linkedin, Mail, Twitter } from "react-feather";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@components/ui/dropdown-menu";

import { Card, CardHeader, CardDescription, CardTitle } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";

import { Copy } from "react-feather";

export default function Referral() {
	const [referralLink, setReferralLink] = useState("https://thorbis.com/referral-code-1234");

	const copyToClipboard = () => {
		navigator.clipboard.writeText(referralLink).then(
			() => alert("Referral link copied to clipboard!"),
			(err) => console.error("Failed to copy: ", err)
		);
	};

	return (
		<>
			<div className="w-full mx-auto my-16 space-y-16">
				<div className="flex items-center justify-between space-x-6">
					<h1 className="text-4xl">Referrals</h1>
				</div>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="mb-4 text-xl font-bold">Share Your Referral Link</h2>
					<div className="col-span-12">
						<div className="relative">
							<Input value={referralLink} readOnly />
							<div className="absolute inset-y-0 right-0 flex items-center pl-3 pr-1 space-x-1">
								<Button variant="secondary" size="xs" onClick={copyToClipboard}>
									<Copy className="w-4 h-4 mr-2 text-muted-foreground" />
									<span className="truncate text-muted-foreground">Copy</span>
								</Button>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-4 mt-4">
						<Button variant="ghost" size="sm">
							<Mail className="w-5 h-5 mr-2" />
							Email
						</Button>
						<Button variant="ghost" size="sm">
							<Twitter className="w-5 h-5 mr-2" />
							Twitter
						</Button>
						<Button variant="ghost" size="sm">
							<Facebook className="w-5 h-5 mr-2" />
							Facebook
						</Button>
						<Button variant="ghost" size="sm">
							<Linkedin className="w-5 h-5 mr-2" />
							LinkedIn
						</Button>
					</div>
				</div>
				<div class="bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 p-4 mb-6" data-pc-el-id="div-42-58">
					<div class="flex justify-between items-center mb-2" data-pc-el-id="div-43-46">
						<span class="font-semibold" data-pc-el-id="span-44-44">
							Referrals
						</span>
						<span class="text-2xl font-bold text-primary" data-pc-el-id="span-45-45">
							3
						</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700" data-pc-el-id="div-47-56">
						<div class="bg-primary h-2.5 rounded-full w-[30%]" role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="10" data-pc-el-id="div-48-55" />
					</div>
					<p class="text-sm dark:text-gray-500 text-gray-500 mt-1" data-pc-el-id="p-57-57">
						3 out of 10 referrals
					</p>
				</div>

				<div className="w-full max-w-4xl p-6 border rounded-lg bg-background">
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold">Referral Program</h2>
								<Button variant="outline" size="sm">
									View Leaderboard
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-4 mt-6">
								<Card>
									<CardHeader>
										<CardDescription>Total Referrals</CardDescription>
										<CardTitle>1,234</CardTitle>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardDescription>Rewards Earned</CardDescription>
										<CardTitle>$2,500</CardTitle>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardDescription>Conversion Rate</CardDescription>
										<CardTitle>25%</CardTitle>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardDescription>Top Referrer</CardDescription>
										<CardTitle>John Doe</CardTitle>
									</CardHeader>
								</Card>
							</div>
						</div>
						<div>
							<h2 className="text-2xl font-bold">Share Referral</h2>
							<div className="mt-6 space-y-4">
								<div>
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
								</div>
								<div className="flex gap-2">
									<Button variant="outline" className="flex-1">
										<div className="w-4 h-4 mr-2" />
										Twitter
									</Button>
									<Button variant="outline" className="flex-1">
										<div className="w-4 h-4 mr-2" />
										LinkedIn
									</Button>
									<Button variant="outline" className="flex-1">
										<div className="w-4 h-4 mr-2" />
										Facebook
									</Button>
								</div>
								<div className="flex items-center gap-2">
									<Input type="text" value="https://example.com/referral" readOnly className="flex-1" />
									<Button variant="outline">
										<div className="w-4 h-4" />
										Copy
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-8">
						<h2 className="text-2xl font-bold">Referral Program Details</h2>
						<div className="mt-6 space-y-4">
							<p>Our referral program allows you to earn rewards for sharing our product with your friends and colleagues. For every successful referral, you&APOS;ll receive a $25 credit towards your account.</p>
							<p>To refer someone, simply share your unique referral link or use the social media buttons above. Once your friend signs up and makes a purchase, you&APOS;ll automatically receive your reward.</p>
							<p>The more people you refer, the more you can earn. Check the leaderboard to see how you&APOS;re doing compared to other top referrers.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
