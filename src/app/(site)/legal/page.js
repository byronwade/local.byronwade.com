import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  Eye, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';

export const metadata = {
  title: 'Legal Information - Terms, Privacy & Community Guidelines | Local Business Directory',
  description: 'Complete legal information including terms of service, privacy policy, community guidelines, content policies, and trust & safety measures.',
  keywords: 'terms of service, privacy policy, community guidelines, content guidelines, trust safety, legal information, user agreement',
  openGraph: {
    title: 'Legal Information - Terms, Privacy & Community Guidelines',
    description: 'Complete legal information including terms of service, privacy policy, community guidelines, and safety measures.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Information - Terms, Privacy & Community Guidelines',
    description: 'Complete legal information including terms of service, privacy policy, and community guidelines.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/legal',
  },
};

const lastUpdated = {
  terms: "December 15, 2024",
  privacy: "December 10, 2024",
  community: "November 28, 2024",
  content: "December 1, 2024",
  trust: "December 5, 2024"
};

const quickLinks = [
  {
    icon: Scale,
    title: "Terms of Service",
    description: "User agreement and platform rules",
    lastUpdated: lastUpdated.terms,
    section: "terms"
  },
  {
    icon: Shield,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data",
    lastUpdated: lastUpdated.privacy,
    section: "privacy"
  },
  {
    icon: Users,
    title: "Community Guidelines",
    description: "Rules for respectful community interaction",
    lastUpdated: lastUpdated.community,
    section: "community"
  },
  {
    icon: FileText,
    title: "Content Guidelines",
    description: "Standards for user-generated content",
    lastUpdated: lastUpdated.content,
    section: "content"
  },
  {
    icon: Lock,
    title: "Trust & Safety",
    description: "Our commitment to user safety and security",
    lastUpdated: lastUpdated.trust,
    section: "trust"
  }
];

const termsHighlights = [
  {
    title: "User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
  },
  {
    title: "Business Listings",
    content: "Business owners must provide accurate information and have the right to claim and manage their business listings."
  },
  {
    title: "User Content",
    content: "You retain ownership of content you submit but grant us license to use it in connection with our services."
  },
  {
    title: "Prohibited Uses",
    content: "Users may not engage in illegal activities, spam, harassment, or misrepresentation of businesses or services."
  },
  {
    title: "Limitation of Liability",
    content: "Our liability is limited to the maximum extent permitted by law. We provide the service 'as is' without warranties."
  }
];

const privacyHighlights = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly, automatically through your use of our services, and from third-party sources."
  },
  {
    title: "How We Use Information",
    content: "We use your information to provide services, improve our platform, communicate with you, and ensure security."
  },
  {
    title: "Information Sharing",
    content: "We don't sell personal information. We may share information with service providers, for legal compliance, or with your consent."
  },
  {
    title: "Data Security",
    content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access."
  },
  {
    title: "Your Rights",
    content: "You have rights to access, update, delete, and port your data, as well as opt-out of certain communications."
  }
];

const communityRules = [
  {
    title: "Be Respectful",
    description: "Treat all users with respect. No harassment, discrimination, or hate speech.",
    icon: Users
  },
  {
    title: "Be Honest",
    description: "Provide accurate information in reviews and business listings. No fake reviews or misleading content.",
    icon: CheckCircle
  },
  {
    title: "Be Safe",
    description: "Don't share personal information publicly. Report suspicious or harmful behavior.",
    icon: Shield
  },
  {
    title: "Follow Laws",
    description: "All content and activities must comply with applicable laws and regulations.",
    icon: Scale
  }
];

const contentStandards = [
  {
    category: "Reviews",
    standards: [
      "Based on genuine experiences",
      "Relevant to the business",
      "Free from promotional content",
      "Respectful language only"
    ]
  },
  {
    category: "Business Information",
    standards: [
      "Accurate and up-to-date",
      "Properly categorized",
      "Appropriate photos only",
      "Complete contact details"
    ]
  },
  {
    category: "User Profiles",
    standards: [
      "Real names preferred",
      "Appropriate profile photos",
      "Accurate location information",
      "Professional communication"
    ]
  }
];

const trustMeasures = [
  {
    icon: Shield,
    title: "Identity Verification",
    description: "Multi-step verification process for business owners and active reviewers"
  },
  {
    icon: Eye,
    title: "Content Moderation",
    description: "AI-powered and human moderation to ensure content quality and safety"
  },
  {
    icon: AlertTriangle,
    title: "Fraud Detection",
    description: "Advanced systems to detect and prevent fake reviews and fraudulent activities"
  },
  {
    icon: Lock,
    title: "Data Protection",
    description: "Enterprise-grade security measures to protect your personal and business data"
  }
];

function LegalHero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Legal Information
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Transparency is important to us. Find all our legal documents, policies, and guidelines in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary">
            Download PDF <FileText className="h-5 w-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
            Contact Legal Team <Mail className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuickNavigation() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Quick Navigation</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <link.icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription className="text-sm">{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="text-xs">
                  Updated {link.lastUpdated}
                </Badge>
                <Button variant="ghost" className="w-full mt-3" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalContent() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="trust">Trust & Safety</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Scale className="h-6 w-6 text-blue-600" />
                      <span>Terms of Service</span>
                    </CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {lastUpdated.terms}
                    </Badge>
                  </div>
                  <CardDescription>
                    These terms govern your use of our platform and services. Please read them carefully.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {termsHighlights.map((section, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold mb-2">{section.title}</h3>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    ))}
                    
                    <div className="bg-gray-50 p-6 rounded-lg mt-8">
                      <h3 className="font-semibold mb-3">Key Points:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>You must be 18 or older to use our services</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Business information must be accurate and current</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>We reserve the right to terminate accounts for violations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Terms may be updated with 30 days notice</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-6 w-6 text-green-600" />
                      <span>Privacy Policy</span>
                    </CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {lastUpdated.privacy}
                    </Badge>
                  </div>
                  <CardDescription>
                    Learn how we collect, use, and protect your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {privacyHighlights.map((section, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-semibold mb-2">{section.title}</h3>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    ))}
                    
                    <div className="bg-green-50 p-6 rounded-lg mt-8">
                      <h3 className="font-semibold mb-3 text-green-800">Your Data Rights:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Access and download your data</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Correct inaccurate information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Delete your account and data</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Opt-out of marketing communications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="community" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-purple-600" />
                      <span>Community Guidelines</span>
                    </CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {lastUpdated.community}
                    </Badge>
                  </div>
                  <CardDescription>
                    Guidelines for creating a positive and respectful community environment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {communityRules.map((rule, index) => (
                      <Card key={index} className="border-l-4 border-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <rule.icon className="h-6 w-6 text-purple-600 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">{rule.title}</h3>
                              <p className="text-gray-600 text-sm">{rule.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-purple-800">Enforcement:</h3>
                    <p className="text-purple-700 mb-3">
                      Violations of community guidelines may result in:
                    </p>
                    <ul className="space-y-1 text-purple-700">
                      <li>• Warning and content removal</li>
                      <li>• Temporary account suspension</li>
                      <li>• Permanent account termination</li>
                      <li>• Legal action for severe violations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-orange-600" />
                      <span>Content Guidelines</span>
                    </CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {lastUpdated.content}
                    </Badge>
                  </div>
                  <CardDescription>
                    Standards and requirements for all user-generated content on our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {contentStandards.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold mb-4 text-orange-600">
                          {category.category} Standards
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {category.standards.map((standard, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{standard}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-3 text-orange-800">Prohibited Content:</h3>
                      <div className="grid md:grid-cols-2 gap-2 text-orange-700">
                        <div>• Spam or irrelevant content</div>
                        <div>• Fake or misleading information</div>
                        <div>• Offensive or inappropriate material</div>
                        <div>• Copyright-infringing content</div>
                        <div>• Personal attacks or harassment</div>
                        <div>• Promotional or advertising content</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trust" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="h-6 w-6 text-red-600" />
                      <span>Trust & Safety</span>
                    </CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {lastUpdated.trust}
                    </Badge>
                  </div>
                  <CardDescription>
                    Our comprehensive approach to ensuring user safety and platform integrity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {trustMeasures.map((measure, index) => (
                      <Card key={index} className="border-l-4 border-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <measure.icon className="h-6 w-6 text-red-600 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">{measure.title}</h3>
                              <p className="text-gray-600 text-sm">{measure.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-red-800">Report Issues:</h3>
                    <p className="text-red-700 mb-4">
                      If you encounter any safety issues, inappropriate content, or suspicious activity:
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="mr-2">
                        Report Content
                      </Button>
                      <Button variant="outline" size="sm" className="mr-2">
                        Report User
                      </Button>
                      <Button variant="outline" size="sm">
                        Emergency Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Legal Information",
            "description": "Complete legal information including terms of service, privacy policy, community guidelines, content policies, and trust & safety measures.",
            "url": "/legal",
            "publisher": {
              "@type": "Organization",
              "name": "Local Business Directory"
            },
            "dateModified": "2024-12-15T00:00:00Z",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Legal Documents",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Article",
                    "name": "Terms of Service",
                    "dateModified": "2024-12-15T00:00:00Z"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "Article",
                    "name": "Privacy Policy",
                    "dateModified": "2024-12-10T00:00:00Z"
                  }
                }
              ]
            }
          })
        }}
      />
      
      <LegalHero />
      <QuickNavigation />
      <LegalContent />
    </div>
  );
}

