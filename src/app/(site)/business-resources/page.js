import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Video, 
  BookOpen, 
  Target,
  CheckCircle,
  ArrowRight,
  Calendar,
  BarChart3,
  Shield,
  Utensils,
  Coffee
} from 'lucide-react';

export const metadata = {
  title: 'Business Resources - Tools, Guides & Success Stories | Local Business Directory',
  description: 'Comprehensive resources for business owners including certification, success stories, marketing tools, and specialized support for restaurants and service businesses.',
  keywords: 'business resources, business certification, success stories, restaurant tools, business support, marketing guides, local business growth',
  openGraph: {
    title: 'Business Resources - Tools, Guides & Success Stories',
    description: 'Comprehensive resources for business owners including certification, success stories, marketing tools, and specialized support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Resources - Tools, Guides & Success Stories',
    description: 'Comprehensive resources for business owners including certification, success stories, marketing tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/business-resources',
  },
};

const certificationPrograms = [
  {
    icon: Award,
    title: "Local Business Certification",
    description: "Official verification that builds customer trust",
    benefits: ["Verified badge on listing", "Higher search ranking", "Customer trust boost"],
    duration: "2-3 business days",
    requirements: ["Business license verification", "Address confirmation", "Phone verification"]
  },
  {
    icon: Shield,
    title: "Safety & Health Certification",
    description: "Show customers you prioritize safety",
    benefits: ["Safety badge display", "Health protocol verification", "Customer confidence"],
    duration: "1-2 weeks",
    requirements: ["Health permits", "Safety protocols", "Staff training documentation"]
  },
  {
    icon: Star,
    title: "Excellence Certification",
    description: "Premium recognition for outstanding businesses",
    benefits: ["Premium badge", "Featured placement", "Marketing materials"],
    duration: "2-4 weeks",
    requirements: ["4.5+ star rating", "50+ reviews", "Compliance history"]
  }
];

const successStories = [
  {
    business: "Tony's Pizza Palace",
    category: "Restaurant",
    growth: "300% increase in online orders",
    story: "After joining our platform and getting certified, Tony's saw a massive boost in visibility and customer engagement.",
    metrics: {
      "Online Orders": "+300%",
      "New Customers": "+250%",
      "Monthly Revenue": "+180%"
    },
    image: "/api/placeholder/400/250"
  },
  {
    business: "Green Thumb Landscaping",
    category: "Service Business",
    growth: "5x more leads per month",
    story: "By optimizing their listing and using our marketing tools, Green Thumb became the top landscaping service in their area.",
    metrics: {
      "Monthly Leads": "+500%",
      "Service Area": "+200%",
      "Customer Retention": "+85%"
    },
    image: "/api/placeholder/400/250"
  },
  {
    business: "Bella's Boutique",
    category: "Retail",
    growth: "Doubled foot traffic",
    story: "Through strategic use of our promotional tools and customer engagement features, Bella's transformed their local presence.",
    metrics: {
      "Foot Traffic": "+100%",
      "Social Engagement": "+400%",
      "Average Sale": "+45%"
    },
    image: "/api/placeholder/400/250"
  }
];

const businessTools = [
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your performance with detailed insights",
    features: ["Customer engagement metrics", "Search performance", "Review analytics", "Competitor insights"]
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Build relationships with your customers",
    features: ["Customer profiles", "Communication tools", "Loyalty programs", "Feedback management"]
  },
  {
    icon: TrendingUp,
    title: "Marketing Suite",
    description: "Promote your business effectively",
    features: ["Promotional campaigns", "Social media integration", "Email marketing", "Event promotion"]
  },
  {
    icon: Calendar,
    title: "Booking & Scheduling",
    description: "Manage appointments and reservations",
    features: ["Online booking", "Calendar integration", "Automated reminders", "Capacity management"]
  }
];

const restaurantFeatures = [
  {
    icon: Utensils,
    title: "Digital Menu Management",
    description: "Create and manage your digital menu",
    benefits: ["Easy menu updates", "Photo galleries", "Dietary information", "Pricing management"]
  },
  {
    icon: Coffee,
    title: "Table Management System",
    description: "Optimize your dining room operations",
    benefits: ["Real-time availability", "Reservation management", "Wait time optimization", "Customer flow"]
  },
  {
    icon: TrendingUp,
    title: "Order Analytics",
    description: "Understand your customers' preferences",
    benefits: ["Popular items tracking", "Peak time analysis", "Customer behavior insights", "Revenue optimization"]
  }
];

const videoContent = [
  {
    title: "Getting Started: Setting Up Your Business Profile",
    duration: "5:30",
    views: "12.5K",
    description: "Complete walkthrough of creating an optimized business profile that attracts customers."
  },
  {
    title: "Success Story: How Maria Grew Her Cafe by 200%",
    duration: "8:15",
    views: "8.9K",
    description: "Real business owner shares her journey from struggling cafe to community favorite."
  },
  {
    title: "Marketing Masterclass: Social Media Integration",
    duration: "12:45",
    views: "15.2K",
    description: "Learn how to leverage social media to drive foot traffic and online engagement."
  },
  {
    title: "Restaurant Special: Menu Optimization Strategies",
    duration: "10:20",
    views: "6.7K",
    description: "Specific strategies for restaurant owners to optimize their digital presence."
  }
];

function ResourcesHero() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Business Resources Hub
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Everything you need to grow your business, build customer trust, and succeed in your local market
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary">
            Get Certified <Award className="h-5 w-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
            Watch Success Stories <Video className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CertificationSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Business Certification Programs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Build customer trust and stand out from competitors with our official certification programs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {certificationPrograms.map((program, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <program.icon className="h-8 w-8 text-green-600" />
                  <CardTitle>{program.title}</CardTitle>
                </div>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {program.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Timeline:</h4>
                    <Badge variant="outline">{program.duration}</Badge>
                  </div>
                  
                  <Button className="w-full">
                    Start Certification
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real businesses, real results. See how our platform has helped local businesses thrive
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{story.business}</CardTitle>
                  <Badge variant="secondary">{story.category}</Badge>
                </div>
                <CardDescription className="text-green-600 font-semibold">
                  {story.growth}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{story.story}</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.entries(story.metrics).map(([metric, value]) => (
                    <div key={metric} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-green-600">{value}</div>
                      <div className="text-xs text-gray-500">{metric}</div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full">
                  Read Full Story <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessToolsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Business Management Tools</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive suite of tools to manage and grow your business online presence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessTools.map((tool, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <tool.icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecializedSupport() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Specialized Support</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Industry-specific tools and resources tailored to your business type
          </p>
        </div>
        
        <Tabs defaultValue="restaurants" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="restaurants">Restaurants & Food</TabsTrigger>
            <TabsTrigger value="services">Service Businesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="restaurants" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6">
              {restaurantFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <feature.icon className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Service Business Tools</CardTitle>
                  <CardDescription>
                    Specialized features for service-based businesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Service area mapping</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Quote request management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Before/after photo galleries</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Certification showcase</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Emergency service flags</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Generation</CardTitle>
                  <CardDescription>
                    Advanced tools to capture and convert leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lead tracking dashboard</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Automated follow-up sequences</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Conversion rate analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Customer acquisition cost tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function VideoLibrary() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Video Learning Library</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch and learn from successful business owners and marketing experts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {videoContent.map((video, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <Badge className="absolute top-2 right-2">
                  {video.duration}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{video.views} views</span>
                  <Button size="sm">
                    Watch Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BusinessResourcesPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Business Resources Hub",
            "description": "Comprehensive resources for business owners including certification, success stories, marketing tools, and specialized support.",
            "url": "/business-resources",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Business Resources",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Service",
                    "name": "Business Certification",
                    "description": "Official verification programs for local businesses"
                  }
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "item": {
                    "@type": "Service",
                    "name": "Marketing Tools",
                    "description": "Comprehensive marketing suite for business growth"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "item": {
                    "@type": "Service", 
                    "name": "Business Analytics",
                    "description": "Performance tracking and insights dashboard"
                  }
                }
              ]
            }
          })
        }}
      />
      
      <ResourcesHero />
      <CertificationSection />
      <SuccessStoriesSection />
      <BusinessToolsSection />
      <SpecializedSupport />
      <VideoLibrary />
    </div>
  );
}

