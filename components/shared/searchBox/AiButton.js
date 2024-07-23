// components/AiButton.js
import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import Chat from "../chatBot/Chat";

const AiButton = ({ handleTextareaInput, showBeta }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (isOpen && !e.target.closest(".drawer-content") && !e.target.closest(".drawer-trigger")) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			document.addEventListener("click", handleOutsideClick);
		} else {
			document.body.style.overflow = "auto";
			document.removeEventListener("click", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [isOpen]);

	return (
		<>
			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerTrigger asChild>
					<Button className="relative flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none drawer-trigger shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
						{showBeta && (
							<Badge variant="outline" className="absolute z-50 bg-purple-700 -top-2 -right-4 p-0 px-[4px] text-[9px]">
								Beta
							</Badge>
						)}
						<SparklesIcon className="w-4 h-4 text-white" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="drawer-content bg-[#212121] border-0 max-h-screen">
					<DrawerHeader>
						<DrawerTitle>Chat with Thorbis</DrawerTitle>
					</DrawerHeader>
					<Chat variant="Full" />
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default AiButton;
