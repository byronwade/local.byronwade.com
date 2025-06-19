import React from "react";
import { Utensils, Carrot, Wine, ChefHat, Pizza, IceCream, Beer, Fish, Bread, Apple, Star, Clock, DollarSign, Heart, Eye, Phone } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

export default function MenuSection({ business }) {
	// Defensive programming - provide fallback data if business or menu is undefined
	if (!business || !business.menu) {
		return (
			<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
				<div className="mb-8">
					<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
						<Utensils className="w-6 h-6 mr-3 text-primary" />
						🍽️ Our Menu
					</h2>
					<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
				</div>
				<div className="p-6 border rounded-xl bg-card/30 border-border">
					<p className="text-muted-foreground">Menu information is loading...</p>
				</div>
			</section>
		);
	}

	const { categories = [], specials = [], dietaryInfo = {} } = business.menu;

	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Utensils className="w-6 h-6 mr-3 text-primary" />
					🍽️ Our Menu
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="space-y-8">
				{/* Daily Specials */}
				{specials.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Today&apos;s Specials</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{specials.map((special, index) => (
								<div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800/50">
									<div className="flex items-start justify-between mb-2">
										<h4 className="font-medium text-foreground">{special.name}</h4>
										<Badge variant="destructive" className="text-xs">
											{special.discount}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{special.description}</p>
									<div className="flex items-center justify-between">
										<span className="text-lg font-bold text-primary">{special.price}</span>
										<span className="text-sm text-muted-foreground line-through">{special.originalPrice}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Menu Categories */}
				<div className="space-y-6">
					{categories.map((category, index) => (
						<div key={index} className="space-y-4">
							<div className="flex items-center space-x-3">
								{category.icon === "pizza" && <Pizza className="w-5 h-5 text-primary" />}
								{category.icon === "wine" && <Wine className="w-5 h-5 text-primary" />}
								{category.icon === "fish" && <Fish className="w-5 h-5 text-primary" />}
								{category.icon === "bread" && <Bread className="w-5 h-5 text-primary" />}
								{category.icon === "ice-cream" && <IceCream className="w-5 h-5 text-primary" />}
								{category.icon === "beer" && <Beer className="w-5 h-5 text-primary" />}
								{category.icon === "apple" && <Apple className="w-5 h-5 text-primary" />}
								{category.icon === "carrot" && <Carrot className="w-5 h-5 text-primary" />}
								{category.icon === "chef-hat" && <ChefHat className="w-5 h-5 text-primary" />}
								{category.icon === "utensils" && <Utensils className="w-5 h-5 text-primary" />}
								<h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
								{category.popular && (
									<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
										Popular
									</Badge>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{(category.items || []).map((item, itemIndex) => (
									<div key={itemIndex} className="p-4 border rounded-lg bg-card/30 border-border hover:bg-card/50 transition-colors">
										<div className="flex items-start justify-between mb-2">
											<div className="flex-1">
												<h4 className="font-medium text-foreground">{item.name}</h4>
												{item.chefRecommendation && (
													<Badge variant="outline" className="mt-1 text-xs border-primary/20 text-primary">
														<ChefHat className="w-3 h-3 mr-1" />
														Chef&apos;s Pick
													</Badge>
												)}
											</div>
											<span className="text-lg font-bold text-primary ml-4">{item.price}</span>
										</div>
										<p className="text-sm text-muted-foreground mb-3">{item.description}</p>

										{/* Dietary Information */}
										{item.dietary && (
											<div className="flex flex-wrap gap-1 mb-3">
												{item.dietary.vegetarian && (
													<Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
														<Carrot className="w-3 h-3 mr-1" />
														Vegetarian
													</Badge>
												)}
												{item.dietary.vegan && (
													<Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
														Vegan
													</Badge>
												)}
												{item.dietary.glutenFree && (
													<Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
														Gluten-Free
													</Badge>
												)}
												{item.dietary.spicy && (
													<Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
														Spicy
													</Badge>
												)}
											</div>
										)}

										{/* Item Details */}
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<div className="flex items-center space-x-4">
												{item.calories && <span>{item.calories} cal</span>}
												{item.prepTime && (
													<div className="flex items-center">
														<Clock className="w-3 h-3 mr-1" />
														{item.prepTime}
													</div>
												)}
											</div>
											{item.rating && (
												<div className="flex items-center">
													<Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
													{item.rating}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Dietary Information Guide */}
				{dietaryInfo && Object.keys(dietaryInfo).length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Dietary Information</h3>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{dietaryInfo.vegetarian && (
								<div className="p-3 border rounded-lg bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50">
									<div className="flex items-center space-x-2">
										<Carrot className="w-4 h-4 text-green-600" />
										<span className="text-sm font-medium text-green-800 dark:text-green-400">Vegetarian Options</span>
									</div>
								</div>
							)}
							{dietaryInfo.vegan && (
								<div className="p-3 border rounded-lg bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50">
									<div className="flex items-center space-x-2">
										<Apple className="w-4 h-4 text-green-600" />
										<span className="text-sm font-medium text-green-800 dark:text-green-400">Vegan Options</span>
									</div>
								</div>
							)}
							{dietaryInfo.glutenFree && (
								<div className="p-3 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/50">
									<div className="flex items-center space-x-2">
										<Bread className="w-4 h-4 text-blue-600" />
										<span className="text-sm font-medium text-blue-800 dark:text-blue-400">Gluten-Free</span>
									</div>
								</div>
							)}
							{dietaryInfo.halal && (
								<div className="p-3 border rounded-lg bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/50">
									<div className="flex items-center space-x-2">
										<Star className="w-4 h-4 text-purple-600" />
										<span className="text-sm font-medium text-purple-800 dark:text-purple-400">Halal</span>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Menu Actions */}
				<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
					<Button className="flex-1">
						<Eye className="w-4 h-4 mr-2" />
						View Full Menu
					</Button>
					<Button variant="outline" className="flex-1">
						<Phone className="w-4 h-4 mr-2" />
						Call to Order
					</Button>
					<Button variant="outline" className="flex-1">
						<Heart className="w-4 h-4 mr-2" />
						Save Menu
					</Button>
				</div>
			</div>
		</section>
	);
}
