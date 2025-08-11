import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const metadata = {
  title: 'Help Center - Get Support & Find Answers | Local Business Directory',
  description: 'Find answers to your questions, get support, and learn how to make the most of our local business platform. FAQ, guides, and contact options.',
  keywords: 'help center, support, FAQ, contact support, customer service, business help, local directory help',
  openGraph: {
    title: 'Help Center - Get Support & Find Answers',
    description: 'Find answers to your questions, get support, and learn how to make the most of our local business platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center - Get Support & Find Answers',
    description: 'Find answers to your questions, get support, and learn how to make the most of our local business platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/help',
  },
};

// Consolidated FAQ data
const faqData = {
  general: [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top navigation. We support email registration as well as social login options."
    },
    {
      question: "Is the platform free to use?",
      answer: "Yes, basic features are free. We also offer premium plans for businesses that want advanced features like priority listing, analytics, and promotional tools."
    },
    {
      question: "How do I search for businesses?",
      answer: "Use the search bar at the top of any page. You can search by business name, category, or location. Use filters to narrow down your results."
    },
    {
      question: "Can I save my favorite businesses?",
      answer: "Yes, create an account and use the heart icon on any business listing to save it to your favorites for easy access later."
    }
  ],
  business: [
    {
      question: "How do I claim my business listing?",
      answer: "If your business already appears in our directory, you can claim it by searching for your business and clicking 'Claim This Business'. You'll need to verify ownership."
    },
    {
      question: "How do I add my business to the directory?",
      answer: "Click 'Add Business' in the navigation menu. Fill out your business information, upload photos, and verify your listing. It's free to get started."
    },
    {
      question: "How long does business verification take?",
      answer: "Business verification typically takes 1-3 business days. We'll send you updates via email throughout the process."
    },
    {
      question: "Can I manage multiple business locations?",
      answer: "Yes, our business dashboard allows you to manage multiple locations from a single account. Each location can have its own listing and information."
    }
  ],
  technical: [
    {
      question: "Why can't I log in to my account?",
      answer: "Try resetting your password first. If you're still having issues, clear your browser cache or try a different browser. Contact support if problems persist."
    },
    {
      question: "The website is loading slowly. What should I do?",
      answer: "Try refreshing the page or clearing your browser cache. If the issue persists, it might be a temporary server issue. Check our status page or contact support."
    },
    {
      question: "How do I update my account information?",
      answer: "Log in to your account and go to Settings. You can update your personal information, password, and notification preferences there."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for detailed information about data handling."
    }
  ]
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@localbusiness.com",
    responseTime: "Within 24 hours"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available 9 AM - 6 PM EST",
    responseTime: "Usually within minutes"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with a support specialist",
    contact: "1-800-LOCAL-BIZ",
    responseTime: "Monday-Friday, 9 AM - 6 PM EST"
  }
];

const helpCategories = [
  {
    icon: Users,
    title: "For Users",
    description: "Finding and reviewing businesses",
    topics: ["Account Management", "Search & Discovery", "Reviews & Ratings", "Favorites & Lists"]
  },
  {
    icon: BookOpen,
    title: "For Business Owners",
    description: "Managing your business presence",
    topics: ["Claiming Your Business", "Managing Listings", "Customer Engagement", "Analytics & Insights"]
  },
  {
    icon: Zap,
    title: "Platform Features",
    description: "Making the most of our tools",
    topics: ["Mobile App", "Notifications", "Integration", "Advanced Features"]
  }
];

function HelpHero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          How can we help you?
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find answers, get support, and learn how to make the most of our platform
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            placeholder="Search for help topics..." 
            className="pl-10 py-3 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

function QuickHelp() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Quick Help</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <category.icon className="h-8 w-8 text-blue-600" />
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{topic}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  Explore {category.title} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="business">For Businesses</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-8">
              <div className="space-y-6">
                {faqData.general.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-start space-x-2">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>{faq.question}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="mt-8">
              <div className="space-y-6">
                {faqData.business.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-start space-x-2">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>{faq.question}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="mt-8">
              <div className="space-y-6">
                {faqData.technical.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-start space-x-2">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>{faq.question}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function ContactSupport() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Support</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Choose Your Preferred Contact Method</h3>
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <method.icon className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{method.title}</h4>
                        <p className="text-gray-600 mb-2">{method.description}</p>
                        <p className="text-blue-600 font-medium">{method.contact}</p>
                        <Badge variant="secondary" className="mt-2">
                          {method.responseTime}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Please describe your issue or question in detail..."
                    rows={5}
                  />
                </div>
                <Button className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              ...faqData.general,
              ...faqData.business,
              ...faqData.technical
            ].map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      
      <HelpHero />
      <QuickHelp />
      <FAQSection />
      <ContactSupport />
    </div>
  );
}

