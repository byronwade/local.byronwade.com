// AutocompleteSuggestions.js

import React from "react";
import { motion } from "framer-motion";

const AutocompleteSuggestions = ({ suggestions, onSelect }) => {
	return (
		<motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 w-full bg-gray-900 border border-gray-700 divide-y divide-gray-700 rounded-md shadow-lg">
			{suggestions.map((suggestion, index) => (
				<li key={index} onClick={() => onSelect(suggestion)} className="p-2 cursor-pointer hover:bg-gray-800">
					{suggestion}
				</li>
			))}
		</motion.ul>
	);
};

export default AutocompleteSuggestions;
