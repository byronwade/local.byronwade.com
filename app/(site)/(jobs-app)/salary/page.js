"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, MapPin, Search } from "lucide-react";

const mockSalaries = [
	{ title: "Frontend Developer", location: "Springfield, IL", average: "$95,000", range: "$70,000 - $120,000" },
	{ title: "Backend Developer", location: "Springfield, IL", average: "$105,000", range: "$80,000 - $130,000" },
	{ title: "Project Manager", location: "Springfield, IL", average: "$85,000", range: "$65,000 - $110,000" },
	{ title: "UX/UI Designer", location: "Springfield, IL", average: "$80,000", range: "$60,000 - $100,000" },
	{ title: "Data Analyst", location: "Springfield, IL", average: "$75,000", range: "$55,000 - $95,000" },
];

export default function SalaryGuidePage() {
	return (
		<div className="space-y-8">
			<Card className="text-center p-8 bg-card/80">
				<CardHeader>
					<CardTitle className="text-3xl">Find a career you&apos;ll love</CardTitle>
					<CardDescription>Explore salaries for different roles and locations.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="max-w-xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<Input placeholder="Job title or keyword" className="pl-10 h-12 text-base" />
								<Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							</div>
							<div className="relative">
								<Input placeholder="City, state, or zip code" className="pl-10 h-12 text-base" />
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							</div>
						</div>
						<Button className="mt-4 w-full h-12 text-base">Search Salaries</Button>
					</div>
				</CardContent>
			</Card>

			<div>
				<h2 className="text-2xl font-bold mb-4">Average Salary in Springfield, IL</h2>
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Job Title</TableHead>
								<TableHead>Average Salary</TableHead>
								<TableHead>Salary Range</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockSalaries.map((salary) => (
								<TableRow key={salary.title}>
									<TableCell className="font-medium">{salary.title}</TableCell>
									<TableCell>{salary.average}</TableCell>
									<TableCell>{salary.range}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
		</div>
	);
}
