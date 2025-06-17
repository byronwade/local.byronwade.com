"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, ArrowLeft, Loader2, Plus, Paperclip, Mic, MoreHorizontal, Settings } from "lucide-react";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";

export default function AISidebarChat({ isOpen, onClose }) {
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
		// Simulate AI analysis and business recommendations
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

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className="h-full bg-background flex flex-col">
			{/* Header - Chat SDK Style */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-full bg-[#10a37f] flex items-center justify-center">
							<span className="text-xs font-bold text-white">AI</span>
						</div>
						<div>
							<h3 className="font-medium text-foreground text-sm">ChatGPT</h3>
							<p className="text-xs text-muted-foreground">Business Assistant</p>
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
									<div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
										<span className="text-xs font-bold text-white">AI</span>
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
									<span className="text-sm font-semibold text-foreground">{message.role === "assistant" ? "ChatGPT" : "You"}</span>
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
								<div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
									<span className="text-xs font-bold text-white">AI</span>
								</div>
							</div>
							<div className="flex-1 space-y-2 overflow-hidden">
								<div className="flex items-center space-x-2">
									<span className="text-sm font-semibold text-foreground">ChatGPT</span>
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
								<Button type="submit" disabled={!input.trim() || isLoading} className="h-9 w-9 p-0 rounded-full bg-muted-foreground/80 text-background hover:bg-muted-foreground disabled:bg-muted-foreground/30 disabled:text-muted-foreground/50 transition-colors">
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
