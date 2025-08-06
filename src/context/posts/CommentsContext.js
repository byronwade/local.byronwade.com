import React, { createContext, useContext, useState } from "react";

const CommentsContext = createContext();

export const CommentsProvider = ({ initialComments = [], children }) => {
	const [comments, setComments] = useState(initialComments);
	const [replyBox, setReplyBox] = useState(null);
	const [replyText, setReplyText] = useState({});
	const [showReplies, setShowReplies] = useState({});

	const handleReplyClick = (commentId) => {
		setReplyBox(replyBox === commentId ? null : commentId);
		setReplyText({ ...replyText, [commentId]: "" });
	};

	const handleAddReply = (parentId) => {
		const newReply = {
			id: Math.random(), // A unique ID for the new reply
			user: {
				name: "Current User",
				avatar: "https://via.placeholder.com/150",
			},
			comment: replyText[parentId],
			time: "Just now",
			replies: [],
		};

		const addReplyToComment = (comments, parentId) => {
			return comments.map((comment) => {
				if (comment.id === parentId) {
					return { ...comment, replies: [...comment.replies, newReply] };
				} else if (comment.replies) {
					return { ...comment, replies: addReplyToComment(comment.replies, parentId) };
				} else {
					return comment;
				}
			});
		};

		setComments(addReplyToComment(comments, parentId));
		setReplyBox(null);
		setReplyText({ ...replyText, [parentId]: "" });
	};

	const toggleReplies = (commentId) => {
		setShowReplies((prevShowReplies) => ({
			...prevShowReplies,
			[commentId]: !prevShowReplies[commentId],
		}));
	};

	return <CommentsContext.Provider value={{ comments, replyBox, replyText, setReplyText, handleReplyClick, handleAddReply, toggleReplies, showReplies }}>{children}</CommentsContext.Provider>;
};

export const useCommentsContext = () => {
	return useContext(CommentsContext);
};
