"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const searchSchema = z.object({
	location: z.string().nonempty({ message: "Location is required" }),
	contractorType: z.string().nonempty({ message: "Contractor type is required" }),
});

export default function Component() {
	const form = useForm({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			location: "",
			contractorType: "",
		},
	});

	const handleSearch = (values) => {
		console.log("Search values:", values);
		// Add your search logic here
	};

	const {
		formState: { errors, touchedFields },
		control,
		handleSubmit,
	} = form;

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
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] max-w-screen-2xl">
				<Image src="/placeholder.svg" alt="Hero Image" width={1980} height={1020} className="object-cover object-center w-full h-auto mx-auto overflow-hidden aspect-square rounded-xl sm:w-full lg:order-last" />
				<div className="flex flex-col justify-center space-y-4">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find the Perfect Contractor for Your Home</h1>
						<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Search our database of trusted contractors in your area and get the job done right.</p>
					</div>
					<form onSubmit={handleSubmit(handleSearch)} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<label htmlFor="location" className="text-sm font-medium">
									Location
								</label>
								<Input id="location" {...form.register("location")} placeholder="Enter your city or zip code" className={getValidationClass("location")} />
								{errors.location && <span className="text-red-500">{errors.location.message}</span>}
							</div>
							<div className="grid gap-2">
								<label htmlFor="contractor-type" className="text-sm font-medium">
									Contractor Type
								</label>
								<Select id="contractor-type" onValueChange={(value) => form.setValue("contractorType", value)} className={getValidationClass("contractorType")}>
									<SelectTrigger>
										<SelectValue placeholder="Select contractor type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="plumber">Plumber</SelectItem>
										<SelectItem value="electrician">Electrician</SelectItem>
										<SelectItem value="roofer">Roofer</SelectItem>
										<SelectItem value="painter">Painter</SelectItem>
										<SelectItem value="general-contractor">General Contractor</SelectItem>
									</SelectContent>
								</Select>
								{errors.contractorType && <span className="text-red-500">{errors.contractorType.message}</span>}
							</div>
						</div>
						<Button type="submit" className="w-full">
							Find Contractors
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}
