// components/shared/searchBox/AutocompleteSuggestions.js
import React from "react";
import * as Icons from "react-feather";

export default function AutocompleteSuggestions({ suggestions, onSelect }) {
	if (!suggestions.length) return null;

	return (
		<div className="z-50 flex flex-col w-full h-full min-w-0">
			{suggestions.map((suggestion, index) => {
				const Icon = Icons[suggestion.icon];
				return (
					<div key={index} className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-800" onClick={() => onSelect(suggestion.text)}>
						<Icon className="w-5 h-5 mr-2" style={{ color: suggestion.color }} />
						<span>{suggestion.text}</span>
					</div>
				);
			})}
		</div>
	);
}
