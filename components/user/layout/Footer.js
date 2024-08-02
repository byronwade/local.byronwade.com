"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Plus } from "react-feather";
import { RxSlash } from "react-icons/rx";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@components/ui/dropdown-menu";
import { LuChevronsUpDown } from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { RiComputerFill } from "react-icons/ri";
import { useTheme } from "next-themes";

export default function Header() {
	const [activeIndex, setActiveIndex] = useState(0);
	const { setTheme } = useTheme();

	const menuItems = [
		{ label: "Overview", href: "/user", segment: "(overview)" },
		{ label: "Jobs", href: "/user/jobs", segment: "/user/jobs" },
		{ label: "Activity", href: "/byron-wade/~/activity", segment: "~/activity" },
		{ label: "Domains", href: "/byron-wade/~/domains", segment: "~/domains" },
		{ label: "Usage", href: "/byron-wade/~/usage", segment: "~/usage" },
		{ label: "Monitoring", href: "/byron-wade/~/monitoring", segment: "~/monitoring" },
		{ label: "Storage", href: "/byron-wade/~/stores", segment: "~/stores" },
		{ label: "AI", href: "/byron-wade/~/ai", segment: "~/ai" },
		{ label: "Support", href: "/byron-wade/~/support/cases", segment: "~/support" },
		{ label: "Settings", href: "/byron-wade/~/settings", segment: "~/settings" },
	];

	useEffect(() => {
		setActiveIndex(0);
	}, []);

	return <footer className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">Footer</footer>;
}
