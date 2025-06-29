"use client";

import { useState } from "react";
import Image from "next/image";
import { Briefcase, MapPin, Search, Building, Clock, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const specialties = ["Product Design", "UX/UI Design", "Web Design", "Brand Design", "Animation", "Illustration"];

const FilterSidebar = () => (
	<Card>
		<CardHeader>
			<CardTitle>Filters</CardTitle>
		</CardHeader>
		<CardContent className="space-y-6">
			<div>
				<h3 className="font-semibold mb-3">Specialties</h3>
				<div className="space-y-2">
					{specialties.map((specialty) => (
						<div key={specialty} className="flex items-center space-x-2">
							<Checkbox id={specialty.toLowerCase().replace(" ", "")} />
							<Label htmlFor={specialty.toLowerCase().replace(" ", "")} className="text-sm font-normal">
								{specialty}
							</Label>
						</div>
					))}
				</div>
			</div>
			<div>
				<h3 className="font-semibold mb-3">Location</h3>
				<div className="flex items-center space-x-2">
					<Checkbox id="remote" />
					<Label htmlFor="remote" className="text-sm font-normal">
						Open to remote
					</Label>
				</div>
			</div>
			<div>
				<h3 className="font-semibold mb-3">Job Type</h3>
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Checkbox id="full-time" />
						<Label htmlFor="full-time" className="text-sm font-normal">
							Full-Time
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox id="contract" />
						<Label htmlFor="contract" className="text-sm font-normal">
							Freelance/Contract
						</Label>
					</div>
				</div>
			</div>
			<Button variant="secondary" className="w-full">
				Clear Filters
			</Button>
		</CardContent>
	</Card>
);

const JobListItem = ({ job }) => (
	<Card>
		<CardContent className="p-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Avatar className="w-12 h-12 rounded-md">
					<AvatarImage src={job.logo} alt={`${job.company} logo`} />
					<AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-semibold text-lg">{job.title}</p>
					<p className="text-sm text-muted-foreground">{job.company}</p>
				</div>
			</div>
			<div className="hidden md:flex items-center gap-4">
				{job.isRemote && <Badge variant="outline">Remote</Badge>}
				<Badge variant="secondary">{job.location}</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Button asChild variant="ghost">
					<Link href={`/jobs/${job.id}`}>View job</Link>
				</Button>
				<Button>Apply now</Button>
			</div>
		</CardContent>
	</Card>
);

export default function JobsClient({ jobs }) {
	return (
		<div className="flex flex-col gap-8">
			{/* Search Card */}
			<Card>
				<CardContent className="p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div className="relative lg:col-span-2">
							<Input placeholder="Job title, keywords, or company" className="pl-10 h-12 text-base" />
							<Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						</div>
						<div className="relative lg:col-span-2">
							<Input placeholder="City, state, or zip code" className="pl-10 h-12 text-base" />
							<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						</div>
						<Button className="w-full h-12 text-base lg:col-span-1">Find Jobs</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
				{/* Filters Sidebar */}
				<aside className="lg:col-span-1 sticky top-24">
					<FilterSidebar />
				</aside>

				{/* Job List */}
				<main className="lg:col-span-3">
					<div className="space-y-4">
						{jobs.map((job) => (
							<JobListItem key={job.id} job={job} />
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
