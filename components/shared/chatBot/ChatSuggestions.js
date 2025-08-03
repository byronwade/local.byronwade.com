import Image from "next/image";
import React from "react";
import * as Icons from "react-feather";

export default function ChatSuggestions({ suggestions, addMessage }) {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<Image src="/logos/ThorbisLogo.webp" width={100} height={100} alt="robot" className="w-[41px] h-[41px] object-contain" />
			<div style={{ opacity: 1 }}>
				<div className="flex flex-wrap items-stretch justify-center max-w-3xl gap-4 mx-3 mt-12 mb-6">
					{suggestions.map((suggestion, index) => {
						const Icon = Icons[suggestion.icon];
						return (
							<button key={index} className="relative flex w-40 flex-col gap-2 rounded-2xl border border-border px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-muted disabled:cursor-not-allowed" onClick={() => addMessage(suggestion.text, "user")}>
								<Icon className="icon-md text-primary" />
								<div className="max-w-full text-muted-foreground line-clamp-3 text-balance break-word">{suggestion.text}</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
