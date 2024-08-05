"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip } from "react-feather";

export default function ChatInput({ addMessage }) {
	const [input, setInput] = useState("");
	const textareaRef = useRef(null);

	const handleSend = (e) => {
		e.preventDefault();
		if (input.trim()) {
			addMessage(input, "user");
			setInput("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			handleSend(e);
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	return (
		<>
			<div className="mx-auto flex flex-1 gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
				<form className="w-full" onSubmit={handleSend}>
					<div className="relative flex flex-col flex-1 h-full max-w-full">
						<div className="absolute left-0 right-0 z-20 bottom-full" />
						<div className="flex items-center w-full">
							<div className="flex w-full flex-col gap-1.5 p-1.5 transition-colors bg-gray-200 dark:bg-[#2f2f2f] rounded-[26px]">
								<div className="flex items-center gap-1.5 md:gap-2">
									<div className="flex flex-col">
										<input multiple type="file" tabIndex={-1} className="hidden" style={{ display: "none" }} />
										<button type="button" className="inline-flex items-center justify-center w-0 h-0 p-0 m-0 text-gray-700 bg-transparent border-none dark:text-white" />
										<button className="flex items-center justify-center h-8 w-8 mb-1 ml-1.5 rounded-full text-gray-700 dark:text-white focus-visible:outline-none">
											<Paperclip className="w-5 h-5 transform rotate-45 scale-x-[-1]" />
										</button>
										<div type="button" data-state="closed" />
									</div>
									<div className="flex flex-col flex-1 min-w-0">
										<textarea tabIndex={0} rows={1} ref={textareaRef} placeholder="Message ChatGPT" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="px-0 m-0 overflow-hidden text-gray-700 bg-transparent border-0 resize-none dark:text-white focus:ring-0 focus-visible:ring-0 focus:outline-none max-h-52" style={{ overflowY: "auto" }} />
									</div>
									<button type="submit" data-testid="send-button" className="flex items-center justify-center w-8 h-8 mb-1 mr-1 text-white transition-colors bg-black rounded-full hover:opacity-70 focus-visible:outline-none dark:bg-white dark:text-black disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:opacity-100 dark:disabled:bg-gray-600 dark:disabled:text-gray-500" disabled={!input.trim()}>
										<ArrowUp className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>

			<div className="relative px-2 py-1 text-xs font-normal text-center text-gray-400">
				<span>Thorbis can make mistakes. Check important info.</span>
			</div>
		</>
	);
}
