// AutocompleteSuggestions.js

import React from "react";
import { motion } from "framer-motion";

const AutocompleteSuggestions = ({ suggestions, onSelect }) => {
	return (
		<motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 w-full bg-background border border-border divide-y divide-border rounded-lg shadow-lg">
			{suggestions.map((suggestion, index) => (
				<li key={index} onClick={() => onSelect(suggestion)} className="p-3 cursor-pointer hover:bg-muted transition-colors text-sm">
					{suggestion}
				</li>
			))}
		</motion.ul>
	);
};

export default AutocompleteSuggestions;
