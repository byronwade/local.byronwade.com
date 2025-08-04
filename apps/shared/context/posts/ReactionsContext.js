import React, { createContext, useContext, useState } from "react";

const ReactionsContext = createContext();

export const ReactionsProvider = ({ initialReactions = {}, children }) => {
	const [reactions, setReactions] = useState(initialReactions);

	const handleReactionClick = (id, reaction) => {
		setReactions((prevReactions) => {
			const updatedReactions = { ...prevReactions };
			if (!updatedReactions[id]) {
				updatedReactions[id] = {};
			}
			if (!updatedReactions[id][reaction]) {
				updatedReactions[id][reaction] = 0;
			}
			updatedReactions[id][reaction] += 1;
			return updatedReactions;
		});
	};

	return <ReactionsContext.Provider value={{ reactions, handleReactionClick }}>{children}</ReactionsContext.Provider>;
};

export const useReactionsContext = () => useContext(ReactionsContext);
