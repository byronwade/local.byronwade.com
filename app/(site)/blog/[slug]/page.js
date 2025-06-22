import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const allPosts = [
	{
		slug: "e-commerce-ui-has-been-launched",
		title: "We have launched over 80+ components in E-commerce UI and there's more to come!",
		description: "I am thrilled to share the latest updates from Flowbite! Since our last communication, our team has been hard at work, and we are excited to announce the launch of over 85 new E-commerce UI components and blocks.",
		author: "Zoltán Szőgyényi",
		authorImage: "https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp",
		date: "2023-06-23",
		tags: ["Tailwind CSS", "Flowbite", "Figma"],
	},
	{
		slug: "state-of-flowbite-2022",
		title: "State of Flowbite: learn more about our results from 2022 and what we plan to build this year",
		description: 'Learn more about the results, achievements and plans for the future by reading the "State of Flowbite 2022" including the open-source development of the Flowbite Library, the release of new UI components, features, and more.',
		author: "Zoltán Szőgyényi",
		authorImage: "https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp",
		date: "2022-02-22",
		tags: ["Flowbite"],
	},
	// ... other posts
];

const PostPage = ({ params }) => {
	const post = allPosts.find((p) => p.slug === params.slug);

	if (!post) {
		return <div>Post not found</div>;
	}

	const relatedArticles = allPosts.filter((p) => p.slug !== params.slug).slice(0, 4);

	return (
		<>
			<main className="pt-8 pb-16 lg:pt-16 lg:pb-24">
				<div className="flex justify-center max-w-screen-xl px-4 mx-auto">
					<article className="w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
						<header className="mb-4 lg:mb-6 not-format">
							<div className="flex items-center mb-6 not-italic">
								<div className="inline-flex items-center mr-3 text-sm">
									<Avatar className="w-16 h-16 mr-4">
										<AvatarImage src={post.authorImage} alt={post.author} />
										<AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<a href="#" rel="author" className="text-xl font-bold">
											{post.author}
										</a>
										<p className="text-base text-muted-foreground">{post.description.substring(0, 50)}...</p>
										<p className="text-base text-muted-foreground">
											<time pubdate="true" dateTime={post.date} title={new Date(post.date).toLocaleDateString()}>
												{new Date(post.date).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</time>
										</p>
									</div>
								</div>
							</div>
							<h1 className="mb-4 text-3xl font-extrabold leading-tight lg:mb-6 lg:text-4xl">{post.title}</h1>
						</header>

						<div className="space-y-4">
							<p className="lead">Flowbite is an open-source library of UI components built with the utility-first classes from Tailwind CSS. It also includes interactive elements such as dropdowns, modals, datepickers.</p>
							<p>Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way, you can think things through before committing to an actual design project.</p>
							<p>
								But then I found a <a href="https://flowbite.com">component library based on Tailwind CSS called Flowbite</a>. It comes with the most commonly used UI components, such as buttons, navigation bars, cards, form elements, and more which are conveniently built with the utility classes from Tailwind CSS.
							</p>
							<figure>
								<img src="https://flowbite.s3.amazonaws.com/typography-plugin/typography-image-1.png" alt="Digital art" className="w-full rounded-lg" />
								<figcaption className="text-center text-muted-foreground">Digital art by Anonymous</figcaption>
							</figure>
							<h2>Getting started with Flowbite</h2>
							<p>First of all you need to understand how Flowbite works. This library is not another framework. Rather, it is a set of components based on Tailwind CSS that you can just copy-paste from the documentation.</p>
							<p>It also includes a JavaScript file that enables interactive components, such as modals, dropdowns, and datepickers which you can optionally include into your project via CDN or NPM.</p>
						</div>
					</article>
				</div>
			</main>

			<aside aria-label="Related articles" className="py-8 lg:py-24 bg-muted/20">
				<div className="max-w-screen-xl px-4 mx-auto">
					<h2 className="mb-8 text-2xl font-bold">Related articles</h2>
					<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
						{relatedArticles.map((article) => (
							<article key={article.slug} className="max-w-xs">
								<Link href={`/blog/${article.slug}`}>
									<img src={`https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-${Math.floor(Math.random() * 4) + 1}.png`} className="mb-5 rounded-lg" alt={`Image for ${article.title}`} />
								</Link>
								<h2 className="mb-2 text-xl font-bold leading-tight">
									<Link href={`/blog/${article.slug}`}>{article.title}</Link>
								</h2>
								<p className="mb-4 text-muted-foreground">{article.description.substring(0, 100)}...</p>
								<Button asChild variant="link" className="p-0">
									<Link href={`/blog/${article.slug}`}>Read more</Link>
								</Button>
							</article>
						))}
					</div>
				</div>
			</aside>

			<section className="py-16">
				<div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
					<div className="max-w-screen-md mx-auto sm:text-center">
						<h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Sign up for our newsletter</h2>
						<p className="max-w-2xl mx-auto mb-8 text-muted-foreground md:mb-12 sm:text-xl">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
						<form action="#">
							<div className="items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0 sm:gap-4">
								<div className="relative w-full">
									<label htmlFor="email" className="hidden mb-2 text-sm font-medium">
										Email address
									</label>
									<Input type="email" id="email" required placeholder="Enter your email" />
								</div>
								<div>
									<Button type="submit" className="w-full">
										Subscribe
									</Button>
								</div>
							</div>
							<div className="mx-auto max-w-screen-sm text-sm text-left text-muted-foreground newsletter-form-footer">
								We care about the protection of your data.{" "}
								<Link href="/privacy" className="font-medium underline">
									Read our Privacy Policy
								</Link>
								.
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	);
};

export default PostPage;

export async function generateStaticParams() {
	return allPosts.map((post) => ({
		slug: post.slug,
	}));
}
