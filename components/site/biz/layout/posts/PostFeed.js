"use client";
import React from "react";
import Post from "@components/site/biz/layout/posts/Post";
import { PostProvider } from "@context/posts/PostContext";
import { CommentsProvider } from "@context/posts/CommentsContext";
import { ReactionsProvider } from "@context/posts/ReactionsContext";

import AddPost from "@components/site/biz/layout/posts/AddPost";

const handlePostSubmit = (postData) => {
	console.log("Post submitted:", postData);
	// Handle the post data (e.g., send it to an API or update state)
};

const PostFeed = ({ posts }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-auto space-y-4">
			<AddPost onSubmit={handlePostSubmit} />
			{posts.map((post) => (
				<PostProvider key={post.id} initialData={post}>
					<CommentsProvider initialComments={post.comments}>
						<ReactionsProvider initialReactions={post.reactions}>
							<Post postData={post} />
						</ReactionsProvider>
					</CommentsProvider>
				</PostProvider>
			))}
		</div>
	);
};

export default PostFeed;
