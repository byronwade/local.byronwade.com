import { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  CheckCircle, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  BarChart3,
  Shield,
  Smartphone,
  Globe,
  Heart,
  Award,
  Target,
  DollarSign
} from "lucide-react";

export const metadata = {
  title: "Restaurant Management Platform - Complete Solutions for Restaurant Owners | Local Business Directory",
  description: "Comprehensive restaurant management platform with POS, online ordering, table management, inventory tracking, and marketing tools. Grow your restaurant business with our all-in-one solution.",
  keywords: "restaurant management, POS system, online ordering, table management, restaurant marketing, inventory management, restaurant owners, food service management",
  openGraph: {
    title: "Restaurant Management Platform - Complete Solutions for Restaurant Owners",
    description: "Comprehensive restaurant management platform with POS, online ordering, table management, and marketing tools for restaurant success.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Management Platform - Complete Solutions for Restaurant Owners",
    description: "Comprehensive restaurant management platform with POS, online ordering, and table management.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/restaurant-owners",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Restaurant Management Platform",
  "description": "Comprehensive restaurant management platform with POS, online ordering, table management, inventory tracking, and marketing tools.",
  "url": "/restaurant-owners",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "Restaurant Management Platform",
    "applicationCategory": "BusinessApplication",
    "description": "Complete restaurant management solution with POS, ordering, and marketing tools",
    "operatingSystem": "Web-based",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available"
    },
    "features": [
      "Point of Sale System",
      "Online Ordering",
      "Table Management", 
      "Inventory Tracking",
      "Marketing Tools",
      "Analytics Dashboard"
    ]
  }
};

// Sample data - replace with real data from your CMS/API
const features = [
  {
    icon: CreditCard,
    title: "Advanced POS System",
    description: "Lightning-fast point of sale with integrated payments, split bills, and real-time reporting.",
    benefits: ["Faster checkout", "Inventory sync", "Payment processing"]
  },
  {
    icon: Smartphone,
    title: "Online Ordering",
    description: "Custom-branded online ordering platform with delivery and pickup options.",
    benefits: ["Increase revenue", "Customer convenience", "Zero commission"]
  },
  {
    icon: Users,
    title: "Table Management",
    description: "Smart table reservation system with waitlist management and customer preferences.",
    benefits: ["Optimize seating", "Reduce wait times", "Better service"]
  },
  {
    icon: BarChart3,
    title: "Inventory Management",
    description: "Track ingredients, manage suppliers, and automate reordering with smart alerts.",
    benefits: ["Reduce waste", "Cost control", "Stock optimization"]
  },
  {
    icon: Target,
    title: "Marketing Suite",
    description: "Customer loyalty programs, email campaigns, and social media integration.",
    benefits: ["Customer retention", "Repeat business", "Brand awareness"]
  },
  {
    icon: Shield,
    title: "Analytics Dashboard",
    description: "Real-time insights into sales, customer behavior, and operational efficiency.",
    benefits: ["Data-driven decisions", "Performance tracking", "Growth insights"]
  }
];

const successStories = [
  {
    name: "Mario's Italian Kitchen",
    location: "Downtown Portland",
    growth: "45% revenue increase",
    story: "Streamlined operations and improved customer experience with integrated POS and online ordering.",
    rating: 4.8,
    reviews: 324
  },
  {
    name: "Sunrise Café",
    location: "Seattle, WA",
    growth: "60% online orders",
    story: "Launched delivery service and reduced wait times with smart table management.",
    rating: 4.9,
    reviews: 567
  },
  {
    name: "The Local Bistro",
    location: "Austin, TX",
    growth: "30% profit margin",
    story: "Optimized inventory management and reduced food waste by 40% with smart tracking.",
    rating: 4.7,
    reviews: 892
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "49",
    period: "month",
    description: "Perfect for small cafés and quick-service restaurants",
    features: [
      "Basic POS System",
      "Online Menu",
      "Payment Processing",
      "Basic Analytics",
      "Email Support",
      "Up to 2 Locations"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "99",
    period: "month", 
    description: "Ideal for full-service restaurants and growing businesses",
    features: [
      "Advanced POS System",
      "Online Ordering Platform",
      "Table Management",
      "Inventory Tracking",
      "Customer Loyalty Program",
      "Priority Support",
      "Up to 5 Locations",
      "Advanced Analytics"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "199",
    period: "month",
    description: "Complete solution for restaurant chains and franchises",
    features: [
      "Everything in Professional",
      "Multi-location Management",
      "Custom Integrations",
      "Dedicated Account Manager",
      "Advanced Reporting",
      "API Access",
      "Unlimited Locations",
      "24/7 Phone Support"
    ],
    popular: false
  }
];

export default function RestaurantOwnersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
              <Utensils className="w-4 h-4 mr-2" />
              Restaurant Management Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything Your Restaurant Needs to{" "}
              <span className="text-orange-600">Succeed</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete restaurant management platform with POS, online ordering, table management, 
              and marketing tools. Join thousands of successful restaurant owners growing their business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "5,000+", label: "Restaurants" },
                { number: "45%", label: "Average Revenue Growth" },
                { number: "30%", label: "Cost Reduction" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Complete Restaurant Management Suite
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to run and grow your restaurant business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-orange-600 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Restaurant Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                See how restaurant owners are growing their business with our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Utensils className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{story.name}</CardTitle>
                    <CardDescription className="flex items-center justify-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {story.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{story.growth}</div>
                    <p className="text-gray-600 mb-4">{story.story}</p>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{story.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">({story.reviews} reviews)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Choose the plan that fits your restaurant's needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-orange-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold">
                      <span className="text-lg">$</span>{plan.price}
                      <span className="text-lg text-gray-500">/{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-orange-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful restaurant owners. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call Sales: (555) 123-4567
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              No credit card required • 30-day free trial • Setup assistance included
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
