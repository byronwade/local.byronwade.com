import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { ChevronDown } from "react-feather";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";

export default function Boosts() {
	return (
		<>
			<div className="w-full mx-auto my-16 space-y-16">
				<div className="flex items-center justify-between space-x-6">
					<h1 className="text-4xl">Boosts</h1>
					<div className="flex items-center gap-x-3">
						<Link href="/add-a-business" passHref legacyBehavior>
							<Button variant="outline" size="sm">
								Claim a Business
							</Button>
						</Link>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button variant="outline" size="sm">
									Add new... <ChevronDown className="w-4 h-4 ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Job</DropdownMenuItem>
								<DropdownMenuItem>Buisiness</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			<div>boosts</div>
		</>
	);
}
