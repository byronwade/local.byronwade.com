"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, ArrowLeft, Loader2, Plus, Paperclip, Mic, MoreHorizontal, Settings, Bot } from "lucide-react";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";

export default function UnifiedAIChat({
	isOpen,
	onClose,
	mode = "sidebar", // "sidebar" | "dropdown"
	className = "",
	style = {},
}) {
	const { filteredBusinesses, setActiveBusinessId, setHighlightedBusinesses } = useBusinessStore();
	const { centerOn } = useMapStore();

	const [messages, setMessages] = useState([
		{
			id: 1,
			role: "assistant",
			content: "Hi! I'm your AI business assistant. I can help you find the perfect local businesses based on your specific needs. What are you looking for today?",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const textareaRef = useRef(null);

	// Quick actions for dropdown mode
	const [quickActions] = useState([
		{ icon: "📍", label: "Near Me", action: "nearme", description: "Find businesses close to your location" },
		{ icon: "🕒", label: "Open Now", action: "open", description: "Show only currently open businesses" },
		{ icon: "⭐", label: "Top Rated", action: "rated", description: "Highest rated businesses in your area" },
		{ icon: "🎧", label: "Support", action: "support", description: "Get help from our support team" },
		{ icon: "🚗", label: "Delivery", action: "delivery", description: "Restaurants and services that deliver" },
		{ icon: "🧭", label: "Navigate", action: "navigate", description: "Help navigating the website" },
	]);

	const [businessCategories] = useState([
		{ emoji: "🍕", name: "Restaurants", count: 1240 },
		{ emoji: "🛠️", name: "Services", count: 850 },
		{ emoji: "🏥", name: "Healthcare", count: 420 },
		{ emoji: "🏪", name: "Shopping", count: 680 },
		{ emoji: "💼", name: "Professional", count: 290 },
		{ emoji: "🎯", name: "Entertainment", count: 180 },
	]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [isOpen]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
		}
	}, [input]);

	const generateAIResponse = (userInput) => {
		// Enhanced AI analysis and business recommendations
		const input = userInput.toLowerCase();
		let response = "";
		let businesses = [];

		if (input.includes("plumber") || input.includes("plumbing")) {
			response = "I found several excellent plumbers in your area! Based on ratings, reviews, and availability, here are my top recommendations:\n\n";
			businesses = filteredBusinesses.filter((b) => b.categories?.some((cat) => cat.toLowerCase().includes("plumb")) || b.name.toLowerCase().includes("plumb")).slice(0, 3);

			businesses.forEach((business, index) => {
				response += `${index + 1}. **${business.name}**\n`;
				response += `   ${business.categories?.[0] || "Plumbing Service"}\n`;
				response += `   Rating: ${business.ratings?.overall?.toFixed(1) || "New"} ⭐ (${business.ratings?.count || 0} reviews)\n\n`;
			});
		} else if (input.includes("restaurant") || input.includes("food") || input.includes("eat")) {
			response = "Great! I've found some highly-rated restaurants that match your preferences. Here are my top picks:\n\n";
			businesses = filteredBusinesses.filter((b) => b.categories?.some((cat) => cat.toLowerCase().includes("restaurant") || cat.toLowerCase().includes("food"))).slice(0, 3);

			businesses.forEach((business, index) => {
				response += `${index + 1}. **${business.name}**\n`;
				response += `   ${business.categories?.[0] || "Restaurant"}\n`;
				response += `   Rating: ${business.ratings?.overall?.toFixed(1) || "New"} ⭐ (${business.ratings?.count || 0} reviews)\n\n`;
			});
		} else if (input.includes("auto") || input.includes("car") || input.includes("repair")) {
			response = "I've identified the best auto repair shops in your area based on customer reviews and service quality:\n\n";
			businesses = filteredBusinesses.filter((b) => b.categories?.some((cat) => cat.toLowerCase().includes("auto") || cat.toLowerCase().includes("repair"))).slice(0, 3);

			businesses.forEach((business, index) => {
				response += `${index + 1}. **${business.name}**\n`;
				response += `   ${business.categories?.[0] || "Auto Repair"}\n`;
				response += `   Rating: ${business.ratings?.overall?.toFixed(1) || "New"} ⭐ (${business.ratings?.count || 0} reviews)\n\n`;
			});
		} else if (input.includes("near me") || input.includes("nearby")) {
			response = "I'll show you the closest businesses to your location. Here are the top-rated options nearby:\n\n";
			businesses = filteredBusinesses.slice(0, 5);
			businesses.forEach((business, index) => {
				response += `${index + 1}. **${business.name}**\n`;
				response += `   ${business.categories?.[0] || "Business"}\n`;
				response += `   Distance: ${business.distance || "< 1 mile"}\n\n`;
			});
		} else if (input.includes("open") || input.includes("hours")) {
			response = "Here are the businesses that are currently open:\n\n";
			businesses = filteredBusinesses.filter((b) => b.isOpenNow).slice(0, 5);
			businesses.forEach((business, index) => {
				response += `${index + 1}. **${business.name}**\n`;
				response += `   ${business.categories?.[0] || "Business"}\n`;
				response += `   Status: Open Now ✅\n\n`;
			});
		} else {
			response = "I understand you're looking for local businesses. Let me search through our database and find the best options for you. Could you be more specific about what type of business or service you need?\n\nFor example, you could ask me about:\n- Restaurants and food\n- Auto repair shops\n- Plumbers and contractors\n- Hair salons and beauty services\n- Medical and healthcare providers";
			businesses = filteredBusinesses.slice(0, 3);
		}

		return { response, businesses };
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			role: "user",
			content: input.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = input;
		setInput("");
		setIsLoading(true);

		// Simulate AI processing
		setTimeout(() => {
			const { response, businesses } = generateAIResponse(currentInput);

			const aiMessage = {
				id: Date.now() + 1,
				role: "assistant",
				content: response,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);

			// Highlight recommended businesses on map
			if (setHighlightedBusinesses && businesses.length > 0) {
				setHighlightedBusinesses(businesses.map((b) => b.id));
			}

			// Center map on first recommended business
			if (businesses.length > 0 && businesses[0].coordinates) {
				const { lat, lng } = businesses[0].coordinates;
				centerOn(lat, lng);
			}
		}, 1500 + Math.random() * 1000);
	};

	// Function to handle external input (from search bar)
	const handleExternalInput = (inputText) => {
		if (!inputText.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			role: "user",
			content: inputText.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		// Simulate AI processing
		setTimeout(() => {
			const { response, businesses } = generateAIResponse(inputText);

			const aiMessage = {
				id: Date.now() + 1,
				role: "assistant",
				content: response,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);

			// Highlight recommended businesses on map
			if (setHighlightedBusinesses && businesses.length > 0) {
				setHighlightedBusinesses(businesses.map((b) => b.id));
			}

			// Center map on first recommended business
			if (businesses.length > 0 && businesses[0].coordinates) {
				const { lat, lng } = businesses[0].coordinates;
				centerOn(lat, lng);
			}
		}, 1500 + Math.random() * 1000);
	};

	// Expose the function for external use
	useEffect(() => {
		if (mode === "dropdown" && typeof window !== "undefined") {
			window.handleAIInput = handleExternalInput;
		}
		return () => {
			if (typeof window !== "undefined") {
				delete window.handleAIInput;
			}
		};
	}, [mode]);

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleQuickAction = (action) => {
		const actionMessages = {
			nearme: "Show me businesses near my location",
			open: "What businesses are open right now?",
			rated: "Show me the highest rated businesses",
			support: "I need help with customer support",
			delivery: "Find restaurants and services that deliver",
			navigate: "Help me navigate this website",
		};

		setInput(actionMessages[action] || "");
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	const handleCategoryClick = (categoryName) => {
		setInput(`Find ${categoryName.toLowerCase()} near me`);
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	// Render different layouts based on mode
	if (mode === "dropdown") {
		return (
			<div className={`bg-background border border-border rounded-lg shadow-lg ${className}`} style={style}>
				{/* Dropdown Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
					<div className="flex items-center gap-2">
						<div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isLoading ? "bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" : "bg-gradient-to-r from-blue-500 to-purple-600"}`}>
							<span className="text-xs font-bold text-white">T</span>
						</div>
						<div>
							<h3 className="font-medium text-foreground text-sm">Thorbis AI</h3>
							<p className="text-xs text-muted-foreground">{isLoading ? "Processing your search..." : "Local Business Search"}</p>
						</div>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-muted">
						<X className="w-3 h-3" />
					</Button>
				</div>

				{/* Connection Indicator */}
				{isLoading && (
					<div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-b border-border/30">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
							<span>Analyzing your search query...</span>
							<div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 opacity-50"></div>
						</div>
					</div>
				)}

				{/* Messages Area - Compact for dropdown */}
				<ScrollArea className="max-h-80">
					<div className="px-4 py-2">
						{messages.map((message, index) => (
							<div key={message.id} className="flex items-start space-x-3 py-3">
								{/* Avatar */}
								<div className="flex-shrink-0">
									{message.role === "assistant" ? (
										<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
											<span className="text-xs font-bold text-white">T</span>
										</div>
									) : (
										<div className="w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center">
											<span className="text-xs font-bold text-white">U</span>
										</div>
									)}
								</div>

								{/* Message Content */}
								<div className="flex-1 space-y-1 overflow-hidden">
									<div className="text-xs font-medium text-foreground">{message.role === "assistant" ? "Thorbis AI" : "You"}</div>
									<div className="text-sm text-foreground leading-relaxed">{message.content}</div>
								</div>
							</div>
						))}

						{isLoading && (
							<div className="flex items-start space-x-3 py-3">
								<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
									<span className="text-xs font-bold text-white">T</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="flex space-x-1">
										<div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
									</div>
								</div>
							</div>
						)}

						{/* Quick Actions for first-time users */}
						{messages.length === 1 && (
							<div className="mt-4 space-y-3">
								<div className="grid grid-cols-3 gap-2">
									{quickActions.slice(0, 6).map((action, index) => (
										<button key={index} type="button" onClick={() => handleQuickAction(action.action)} className="flex flex-col items-center p-2 text-center hover:bg-muted rounded-lg transition-all duration-200 border border-border/50 hover:border-primary/50 bg-background group" title={action.description}>
											<span className="text-sm mb-1">{action.icon}</span>
											<span className="text-xs text-foreground group-hover:text-primary font-medium">{action.label}</span>
										</button>
									))}
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Sidebar mode (default)
	return (
		<div className={`h-full bg-background flex flex-col ${className}`} style={style}>
			{/* Header - Chat SDK Style */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
							<span className="text-xs font-bold text-white">T</span>
						</div>
						<div>
							<h3 className="font-medium text-foreground text-sm">Thorbis AI</h3>
							<p className="text-xs text-muted-foreground">Local Business Search</p>
						</div>
					</div>
				</div>
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
					<MoreHorizontal className="w-4 h-4" />
				</Button>
			</div>

			{/* Messages Area */}
			<ScrollArea className="flex-1">
				<div className="max-w-3xl mx-auto px-4">
					{messages.map((message, index) => (
						<div key={message.id} className="group relative flex items-start space-x-4 py-6">
							{/* Avatar */}
							<div className="flex-shrink-0">
								{message.role === "assistant" ? (
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
										<span className="text-xs font-bold text-white">T</span>
									</div>
								) : (
									<div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center">
										<span className="text-xs font-bold text-white">U</span>
									</div>
								)}
							</div>

							{/* Message Content */}
							<div className="flex-1 space-y-2 overflow-hidden">
								<div className="flex items-center space-x-2">
									<span className="text-sm font-semibold text-foreground">{message.role === "assistant" ? "Thorbis AI" : "You"}</span>
								</div>
								<div className="prose prose-sm max-w-none text-foreground">
									<div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
								</div>
							</div>
						</div>
					))}

					{isLoading && (
						<div className="group relative flex items-start space-x-4 py-6">
							<div className="flex-shrink-0">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
									<span className="text-xs font-bold text-white">T</span>
								</div>
							</div>
							<div className="flex-1 space-y-2 overflow-hidden">
								<div className="flex items-center space-x-2">
									<span className="text-sm font-semibold text-foreground">Thorbis AI</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			{/* ChatGPT Style Input Area */}
			<div className="border-t border-border/20 bg-background">
				<div className="max-w-3xl mx-auto px-4 py-6">
					<form onSubmit={handleSubmit} className="relative">
						{/* Input Container with ChatGPT styling */}
						<div className="relative flex w-full items-center bg-token-bg-primary dark:bg-[#303030] rounded-[28px] shadow-short overflow-hidden">
							{/* Left side tool buttons */}
							<div className="flex items-center pl-4">
								<Button type="button" className="h-8 w-8 p-0 bg-transparent hover:bg-muted/50 border-0 text-muted-foreground rounded-full mr-2" aria-label="Add photos and files">
									<Plus className="w-5 h-5" />
								</Button>
							</div>

							{/* Text input area */}
							<div className="flex-1 relative">
								<textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Message ChatGPT" disabled={isLoading} className="w-full resize-none border-0 bg-transparent px-0 py-4 text-sm text-token-text-primary placeholder:text-token-text-tertiary focus:outline-none focus:ring-0 min-h-[20px] max-h-[200px] leading-relaxed" rows={1} style={{ fontSize: "14px", lineHeight: "1.5" }} />
							</div>

							{/* Right side buttons */}
							<div className="flex items-center pr-4 gap-2">
								{/* Tools Button */}
								<Button type="button" className="h-8 px-3 bg-transparent hover:bg-muted/50 border-0 text-muted-foreground rounded-full flex items-center gap-1.5" aria-label="Choose tool">
									<Settings className="w-4 h-4" />
									<span className="text-sm">Tools</span>
								</Button>

								{/* Voice Button */}
								<Button type="button" className="h-9 w-9 p-0 bg-[#00000014] dark:bg-[#FFFFFF29] text-token-text-primary hover:bg-[#0000001F] hover:dark:bg-[#FFFFFF3D] rounded-full transition-colors" aria-label="Start voice mode">
									<Mic className="w-4 h-4" />
								</Button>

								{/* Send Button */}
								<Button type="submit" disabled={!input.trim() || isLoading} className="h-9 w-9 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:bg-muted-foreground/30 disabled:text-muted-foreground/50 disabled:from-muted-foreground/30 disabled:to-muted-foreground/30 transition-all duration-200 shadow-lg">
									{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
								</Button>
							</div>
						</div>
					</form>

					{/* Footer text */}
					<div className="mt-4 text-center">
						<p className="text-xs text-muted-foreground/80">ChatGPT can make mistakes. Check important info.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
