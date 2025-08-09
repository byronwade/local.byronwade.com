"use client";
import React from "react";
import Post from "@components/site/biz/layout/posts/post";
import { PostProvider } from "@context/posts/post-context";
import { CommentsProvider } from "@context/posts/comments-context";
import { ReactionsProvider } from "@context/posts/reactions-context";

import AddPost from "@components/site/biz/layout/posts/add-post";

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
