import { Suspense } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Printer, 
  Wifi, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Package,
  Settings,
  BarChart3,
  Users,
  MapPin,
  Clock
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
  const IconComponent = product.icon || Package;
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-900">
      <CardHeader className="pb-3">
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.badge && (
              <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700 text-white">
                {product.badge}
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {product.rating}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({product.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full space-y-2">
          <Button 
            asChild 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!product.inStock}
          >
            <Link href={`/store/product/${product.id}`}>
              View Details
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
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
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Hero section component
function StoreHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
              <Package className="mr-2 w-4 h-4" />
              Official Thorbis Store
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Business Solutions
              <span className="block text-blue-600 dark:text-blue-400">
                Built for Growth
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover our complete range of POS systems, fleet management devices, 
              and business software designed to transform your operations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <ShoppingCart className="mr-2 w-5 h-5" />
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3">
              <BarChart3 className="mr-2 w-5 h-5" />
              Compare Products
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">30-Day</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Money Back</div>
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
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Thorbis?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main store page component
export default function StorePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <StoreHero />
      
      {/* Features Section */}
      <StoreFeatures />
      
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
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
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
