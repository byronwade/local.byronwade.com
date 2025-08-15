import { Suspense } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Monitor, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp,
  ArrowRight,
  Package,
  Settings,
  BarChart3,
  Users,
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering for real-time inventory
export const dynamic = "force-dynamic";

// Store categories with comprehensive product data
const storeCategories = [
  {
    id: "pos-systems",
    name: "POS Systems",
    description: "Complete point-of-sale solutions for modern businesses",
    icon: CreditCard,
    products: [
      {
        id: "thorbis-pos-pro",
        name: "Thorbis POS Pro",
        description: "Advanced point-of-sale system with integrated payment processing",
        price: 1299,
        originalPrice: 1599,
        image: "/placeholder-business.svg",
        features: ["Contactless payments", "Inventory management", "Employee tracking", "Analytics dashboard"],
        rating: 4.8,
        reviewCount: 127,
        inStock: true,
        badge: "Best Seller"
      },
      {
        id: "thorbis-pos-lite",
        name: "Thorbis POS Lite",
        description: "Essential POS system for small businesses",
        price: 799,
        originalPrice: 999,
        image: "/placeholder-business.svg",
        features: ["Basic payments", "Simple inventory", "Receipt printing", "Cloud backup"],
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        badge: "Popular"
      },
      {
        id: "thorbis-pos-enterprise",
        name: "Thorbis POS Enterprise",
        description: "Enterprise-grade POS for multi-location businesses",
        price: 2499,
        originalPrice: 2999,
        image: "/placeholder-business.svg",
        features: ["Multi-location sync", "Advanced analytics", "API integration", "24/7 support"],
        rating: 4.9,
        reviewCount: 45,
        inStock: true,
        badge: "Enterprise"
      }
    ]
  },
  {
    id: "fleet-management",
    name: "Fleet Management",
    description: "GPS tracking and fleet optimization solutions",
    icon: Truck,
    products: [
      {
        id: "thorbis-fleet-tracker",
        name: "Thorbis Fleet Tracker",
        description: "Real-time GPS tracking for fleet vehicles",
        price: 299,
        originalPrice: 399,
        image: "/placeholder-business.svg",
        features: ["Real-time GPS", "Route optimization", "Fuel monitoring", "Driver safety"],
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        badge: "Top Rated"
      },
      {
        id: "thorbis-fleet-analytics",
        name: "Thorbis Fleet Analytics",
        description: "Advanced analytics and reporting for fleet operations",
        price: 599,
        originalPrice: 799,
        image: "/placeholder-business.svg",
        features: ["Performance metrics", "Cost analysis", "Predictive maintenance", "Custom reports"],
        rating: 4.8,
        reviewCount: 78,
        inStock: true,
        badge: "Analytics"
      }
    ]
  },
  {
    id: "hardware-devices",
    name: "Hardware Devices",
    description: "Professional hardware for business operations",
    icon: Monitor,
    products: [
      {
        id: "thorbis-payment-terminal",
        name: "Thorbis Payment Terminal",
        description: "Secure payment processing terminal",
        price: 199,
        originalPrice: 249,
        image: "/placeholder-business.svg",
        features: ["EMV compliant", "Contactless support", "Bluetooth connectivity", "Battery powered"],
        rating: 4.6,
        reviewCount: 234,
        inStock: true,
        badge: "Secure"
      },
      {
        id: "thorbis-receipt-printer",
        name: "Thorbis Receipt Printer",
        description: "High-speed thermal receipt printer",
        price: 149,
        originalPrice: 199,
        image: "/placeholder-business.svg",
        features: ["Thermal printing", "Auto-cutter", "USB/WiFi", "Paper sensor"],
        rating: 4.5,
        reviewCount: 167,
        inStock: true,
        badge: "Reliable"
      },
      {
        id: "thorbis-barcode-scanner",
        name: "Thorbis Barcode Scanner",
        description: "High-performance barcode scanner",
        price: 89,
        originalPrice: 119,
        image: "/placeholder-business.svg",
        features: ["1D/2D scanning", "Wireless connectivity", "Long battery life", "Drop resistant"],
        rating: 4.7,
        reviewCount: 198,
        inStock: true,
        badge: "Fast"
      }
    ]
  },
  {
    id: "software-solutions",
    name: "Software Solutions",
    description: "Cloud-based business management software",
    icon: Settings,
    products: [
      {
        id: "thorbis-business-suite",
        name: "Thorbis Business Suite",
        description: "Complete business management platform",
        price: 99,
        originalPrice: 129,
        image: "/placeholder-business.svg",
        features: ["CRM integration", "Accounting tools", "Marketing automation", "Customer support"],
        rating: 4.8,
        reviewCount: 312,
        inStock: true,
        badge: "Complete"
      },
      {
        id: "thorbis-analytics-pro",
        name: "Thorbis Analytics Pro",
        description: "Advanced business intelligence and analytics",
        price: 199,
        originalPrice: 249,
        image: "/placeholder-business.svg",
        features: ["Real-time dashboards", "Predictive analytics", "Custom reports", "Data export"],
        rating: 4.9,
        reviewCount: 145,
        inStock: true,
        badge: "Pro"
      }
    ]
  }
];

// Loading skeleton for store sections
function StoreSectionSkeleton() {
  return (
    <div className="space-y-16">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-8">
          {/* Section header skeleton */}
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-48 animate-pulse"></div>
              </div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-80 animate-pulse"></div>
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div key={cardIndex} className="animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700 rounded-2xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Product card component
function ProductCard({ product }) {
  return (
    <div className="group relative">
      <div className="group relative h-full flex flex-col border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 rounded-lg my-0.5">
        
        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute z-[1] right-2 top-2 h-9 w-9"
        >
          <Heart className="h-5 w-5 transition-colors duration-200 fill-secondary stroke-foreground/60 group-hover:stroke-foreground/80" />
        </Button>

        {/* Product Image */}
        <Link href={`/store/product/${product.id}`} className="block shrink-0 w-full">
          <div className="relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-colors border-0 aspect-square w-full rounded-t-lg">
            <Image
              alt={product.name}
              loading="eager"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={product.image}
            />
            {/* Badge Overlay */}
            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-medium">
                  {product.badge}
                </Badge>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-col mt-3 flex-1 p-3">
          <Link href={`/store/product/${product.id}`} className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Thorbis</p>
            <h2 className="font-medium text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h2>
            
            {/* Rating */}
            <div className="mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              {product.originalPrice > product.price && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground line-through">
                    List Price: ${product.originalPrice}
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium text-blue-600 dark:text-blue-400" aria-label={`Price: $${product.price}`}>
                  <span className="text-sm">$</span>
                  <span>{Math.floor(product.price)}</span>
                  <span className="text-sm">.{(product.price % 1).toFixed(2).slice(2)}</span>
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-red-600 font-medium">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 
                    (${(product.originalPrice - product.price).toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Availability & Shipping */}
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'Available' : 'Out of Stock'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.inStock ? 'In Stock' : 'Unavailable'}
                </span>
              </div>
              {product.inStock && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">FREE Shipping</span>
                  <span className="text-xs text-muted-foreground">Ships within 1-2 business days</span>
                </div>
              )}
            </div>
          </Link>

          {/* Add to Cart Button */}
          <div className="flex items-stretch gap-2 mt-3">
            <Button 
              className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white border border-foreground/10 hover:border-foreground/20"
              disabled={!product.inStock}
            >
              <div className="flex items-center justify-center w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Add to Cart</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category section component
function CategorySection({ category }) {
  const IconComponent = category.icon;
  
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            {category.description}
          </p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href={`/store/category/${category.id}`}>
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Hero section component - Redesigned with product focus
function StoreHero() {
  const featuredProducts = [
    {
      id: "thorbis-pos-pro",
      name: "Thorbis POS Pro",
      image: "/placeholder-business.svg",
      price: "$1,299",
      badge: "Best Seller",
      description: "Complete POS solution"
    },
    {
      id: "thorbis-fleet-tracker",
      name: "Fleet Tracker",
      image: "/placeholder-business.svg",
      price: "$299",
      badge: "Top Rated",
      description: "Real-time GPS tracking"
    },
    {
      id: "payment-terminal",
      name: "Payment Terminal",
      image: "/placeholder-business.svg",
      price: "$199",
      badge: "New",
      description: "Secure payments"
    }
  ];

  return (
    <section className="relative bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative">
        {/* Main Hero Content */}
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            
            {/* Header Badge */}
            <div className="flex justify-center">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
                <Package className="mr-2 w-4 h-4" />
                Our Complete Product Range
              </Badge>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                Transform Your Business
                <span className="block text-blue-600 dark:text-blue-400 mt-2">
                  With Our Products
                </span>
              </h1>
              
                          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From cutting-edge POS systems to fleet management solutions, discover 
              professional-grade equipment that powers successful businesses worldwide.
            </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold">
                <ShoppingCart className="mr-3 w-5 h-5" />
                Shop All Products
              </Button>
              <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-semibold border-2">
                <BarChart3 className="mr-3 w-5 h-5" />
                Compare Solutions
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Products Showcase */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Bestselling Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover why thousands of businesses choose these solutions
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="group relative">
                  <div className="group relative h-full flex flex-col border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 rounded-lg my-0.5">
                    
                    {/* Wishlist Button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute z-[1] right-2 top-2 h-9 w-9"
                    >
                      <Heart className="h-5 w-5 transition-colors duration-200 fill-secondary stroke-foreground/60 group-hover:stroke-foreground/80" />
                    </Button>

                    {/* Product Image */}
                    <Link href={`/store/product/${product.id}`} className="block shrink-0 w-full">
                      <div className="relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-colors border-0 aspect-square w-full rounded-t-lg">
                        <Image
                          alt={product.name}
                          loading="eager"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          src={product.image}
                        />
                        {/* Badge Overlay */}
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-medium">
                            {product.badge}
                          </Badge>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-col mt-3 flex-1 p-3">
                      <Link href={`/store/product/${product.id}`} className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Thorbis</p>
                        <h2 className="font-medium text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h2>
                        
                        {/* Rating */}
                        <div className="mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-3 h-3 fill-yellow-400 text-yellow-400" 
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">
                              (127 reviews)
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-medium text-blue-600 dark:text-blue-400" aria-label={`Price: ${product.price}`}>
                              {product.price}
                            </span>
                          </div>
                        </div>

                        {/* Availability & Shipping */}
                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">Available</span>
                            <span className="text-xs text-muted-foreground">In Stock</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-600">FREE Shipping</span>
                            <span className="text-xs text-muted-foreground">Ships within 1-2 business days</span>
                          </div>
                        </div>
                      </Link>

                      {/* Add to Cart Button */}
                      <div className="flex items-stretch gap-2 mt-3">
                        <Button className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white border border-foreground/10 hover:border-foreground/20">
                          <div className="flex items-center justify-center w-full">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            <span>Add to Cart</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Satisfied Customers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Expert Support</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">System Uptime</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">30-Day</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Money Back</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Strip */}
        <div className="bg-blue-600 dark:bg-blue-700 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Ready to upgrade your business?
                </h3>
                <p className="text-blue-100">
                  Join 10,000+ businesses already using our solutions
                </p>
              </div>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 font-semibold"
                >
                  <Users className="mr-2 w-5 h-5" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features section component
function StoreFeatures() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Get up and running in minutes with our plug-and-play solutions"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 customer support with dedicated account managers"
    },
    {
      icon: TrendingUp,
      title: "Scalable Growth",
      description: "Solutions that grow with your business needs"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose Thorbis?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our solutions are built with modern businesses in mind, providing 
            the tools you need to succeed in today's competitive market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Latest Products Section with modern ecommerce design
function LatestProducts() {
  const latestProducts = [
    {
      id: "thorbis-pos-pro",
      name: "Thorbis POS Pro",
      brand: "Thorbis",
      price: 1299.00,
      originalPrice: 1599.00,
      image: "/placeholder-business.svg",
      rating: 4.8,
      reviewCount: 127,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "professional-camera-kit",
      name: "Professional 4K Business Camera Kit",
      brand: "ProVision",
      price: 899.00,
      originalPrice: 1299.00,
      image: "/placeholder-camera.svg",
      rating: 4.7,
      reviewCount: 156,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "smart-inventory-scanner",
      name: "AI-Powered Smart Inventory Scanner",
      brand: "ScanTech",
      price: 249.00,
      originalPrice: 349.00,
      image: "/placeholder-scanner.svg",
      rating: 4.8,
      reviewCount: 203,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "wireless-payment-terminal",
      name: "Wireless Payment Terminal with NFC",
      brand: "PayTech",
      price: 149.00,
      originalPrice: 199.00,
      image: "/placeholder-terminal.svg",
      rating: 4.5,
      reviewCount: 298,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "professional-headset",
      name: "Professional Wireless Business Headset",
      brand: "AudioPro",
      price: 89.00,
      originalPrice: 129.00,
      image: "/placeholder-headset.svg",
      rating: 4.7,
      reviewCount: 567,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "premium-label-printer",
      name: "Premium Thermal Label Printer Pro",
      brand: "LabelPro",
      price: 179.00,
      originalPrice: 249.00,
      image: "/placeholder-printer.svg",
      rating: 4.6,
      reviewCount: 432,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    },
    {
      id: "digital-signage-display",
      name: "4K Digital Signage Display 43\"",
      brand: "DisplayTech",
      price: 599.00,
      originalPrice: 799.00,
      image: "/placeholder-display.svg",
      rating: 4.4,
      reviewCount: 189,
      availability: "Available (Limited Stock)",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 2-3 business days"
    },
    {
      id: "thorbis-fleet-tracker",
      name: "Thorbis Fleet Tracker",
      brand: "Thorbis",
      price: 299.00,
      originalPrice: 399.00,
      image: "/placeholder-business.svg",
      rating: 4.6,
      reviewCount: 89,
      availability: "Available",
      shipping: "FREE Shipping",
      shippingTime: "Ships within 1-2 business days"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Latest Products
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Check out our newest business technology and equipment
            </p>
          </div>
          <Button 
            asChild 
            variant="outline" 
            className="hidden sm:flex border-gray-200 dark:border-gray-800"
          >
            <Link href="/store">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {latestProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="group relative h-full flex flex-col border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 rounded-lg my-0.5">
                
                {/* Wishlist Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute z-[1] right-2 top-2 h-9 w-9"
                >
                  <Heart className="h-5 w-5 transition-colors duration-200 fill-secondary stroke-foreground/60 group-hover:stroke-foreground/80" />
                </Button>

                {/* Product Image */}
                <Link href={`/store/product/${product.id}`} className="block shrink-0 w-full">
                  <div className="relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-colors border-0 aspect-square w-full rounded-t-lg">
                    <Image
                      alt={product.name}
                      loading="eager"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      src={product.image}
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col mt-3 flex-1 p-3">
                  <Link href={`/store/product/${product.id}`} className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                    <h2 className="font-medium text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h2>
                    
                    {/* Rating */}
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                      {product.originalPrice && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground line-through">
                            List Price: ${product.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-medium text-blue-600 dark:text-blue-400" aria-label={`Price: $${product.price.toFixed(2)}`}>
                          <span className="text-sm">$</span>
                          <span>{Math.floor(product.price)}</span>
                          <span className="text-sm">.{(product.price % 1).toFixed(2).slice(2)}</span>
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-red-600 font-medium">
                            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 
                            (${(product.originalPrice - product.price).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Availability & Shipping */}
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">Available</span>
                        <span className="text-xs text-muted-foreground">{product.availability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">{product.shipping}</span>
                        <span className="text-xs text-muted-foreground">{product.shippingTime}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="flex items-stretch gap-2 mt-3">
                    <Button className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white border border-foreground/10 hover:border-foreground/20">
                      <div className="flex items-center justify-center w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        <span>Add to Cart</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <Button 
          asChild 
          variant="outline" 
          className="w-full mt-8 sm:hidden border-gray-200 dark:border-gray-800"
        >
          <Link href="/store">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}

// Main store page component
export default function StorePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <StoreHero />
      
      {/* Features Section */}
      <StoreFeatures />
      
      {/* Latest Products Section */}
      <LatestProducts />
      
      {/* Product Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          <Suspense fallback={<StoreSectionSkeleton />}>
            {storeCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </Suspense>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Thorbis for their technology needs. 
            Get started today with our risk-free 30-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              <ShoppingCart className="mr-2 w-5 h-5" />
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <Users className="mr-2 w-5 h-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
