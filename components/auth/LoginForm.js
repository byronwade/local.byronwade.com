"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
	const form = useForm({
		resolver: zodResolver(loginSchema),
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isValid, touchedFields },
	} = form;

	const onSubmit = (data) => {
		console.log("Login data:", data);
	};

	const getValidationClass = (fieldName) => {
		if (errors[fieldName]) {
			return "border-red-500";
		}
		if (touchedFields[fieldName] && !errors[fieldName]) {
			return "border-green-500";
		}
		return "";
	};

	return (
		<div className="flex w-full h-screen lg:grid lg:grid-cols-2">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">Login</h1>
						<p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="m@example.com" {...register("email")} className={getValidationClass("email")} required />
							{errors.email && <p className="text-red-500">{errors.email.message}</p>}
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<Link href="/forgot-password" className="inline-block ml-auto text-sm underline">
									Forgot your password?
								</Link>
							</div>
							<Input id="password" type="password" {...register("password")} className={getValidationClass("password")} required />
							{errors.password && <p className="text-red-500">{errors.password.message}</p>}
						</div>
						<Button type="submit" className="w-full" disabled={!isValid}>
							Login
						</Button>
						<Button variant="outline" className="w-full">
							Login with Google
						</Button>
					</form>
					<div className="mt-4 text-sm text-center">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="underline">
							Sign up
						</Link>
					</div>
				</div>
			</div>
			<div className="relative hidden lg:block">
				<Image src="/placeholder.svg" alt="Image" layout="fill" objectFit="cover" className="dark:brightness-[0.2] dark:grayscale" />
			</div>
		</div>
	);
}
