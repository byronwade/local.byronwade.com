import React, { createContext, useContext, useState } from "react";

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ initialData, children }) => {
	const [post, setPost] = useState(initialData);
	const [showComments, setShowComments] = useState(false);

	return <PostContext.Provider value={{ post, showComments, setShowComments }}>{children}</PostContext.Provider>;
};
