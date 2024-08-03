"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@components/ui/dropdown-menu";

export default function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [primaryColor, setPrimaryColor] = useState("theme-default");

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const handleModeChange = (mode) => {
		setTheme(mode);
		document.documentElement.className = `${mode} ${primaryColor}`;
	};

	const handlePrimaryColorChange = (color) => {
		setPrimaryColor(color);
		document.documentElement.className = `${resolvedTheme} ${color}`;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
					<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-white border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900">
				<DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => handleModeChange("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleModeChange("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleModeChange("system")}>System</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Primary Color</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={primaryColor} onValueChange={handlePrimaryColorChange}>
					<DropdownMenuRadioItem value="theme-default">Default</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="theme-green">Green</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="theme-blue">Blue</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="theme-red">Red</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
