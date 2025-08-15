"use client";

import React, { useState } from "react";
import {
  Building2,
  Bell,
  Plug,
  BarChart3,
  Clock,
  Shield,
  Users,
  Menu,
  X,
  Settings,
  CreditCard,
  Lock,
  FileText,
  UserCheck,
  Receipt,
  MapPin,
  Phone,
  Ticket,
  DollarSign,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Textarea } from "@components/ui/textarea";
import { Badge } from "@components/ui/badge";
import { useIntegrations } from "@lib/hooks/business/use-integrations";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("business");
  const { pendingChanges, filteredFeatures, handleFeatureToggle, saveChanges, getFeatureStatus } = useIntegrations();
  const [integrations, setIntegrations] = useState({
    voip: true,
    email: false,
    sms: true,
    crm: true,
    analytics: false,
    payment: true,
    inventory: false,
    shipping: true,
    accounting: false,
    marketing: true,
  });

  const toggleIntegration = (key) => {
    setIntegrations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { id: "business", label: "Business Profile", icon: Building2 },
    { id: "field-service", label: "Field Service", icon: MapPin },
    { id: "communications", label: "Communications", icon: Phone },
    { id: "ticketing", label: "Ticketing System", icon: Ticket },
    { id: "invoicing", label: "Invoicing & Estimates", icon: FileText },
    { id: "employee", label: "Employee Management", icon: UserCheck },
    { id: "payroll", label: "Payroll & Commissions", icon: DollarSign },
    { id: "time-tracking", label: "Time Tracking", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "billing", label: "Billing & Payments", icon: CreditCard },
    { id: "team", label: "Team Management", icon: Users },
    { id: "operations", label: "Operations", icon: Settings },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Dashboard Header - consistent with other pages */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
          <p className="text-muted-foreground">Manage your business preferences and configuration</p>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-bold">Settings</h1>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Manage your business preferences</p>
            </div>

            <nav className="flex-1 p-4 lg:p-6 space-y-2 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="font-medium text-sm lg:text-base">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border lg:hidden">
            <div className="flex items-center gap-4 p-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold capitalize">{sections.find((s) => s.id === activeSection)?.label}</h2>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
              {/* Business Profile Section */}
              {activeSection === "business" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Business Profile</h2>
                    <p className="text-muted-foreground">Manage your business details and branding.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Building2 className="h-5 w-5" />
                        Company Information
                      </CardTitle>
                      <CardDescription>Update your business details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name *</Label>
                          <Input id="company-name" placeholder="Acme Corporation" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="legal-name">Legal Business Name</Label>
                          <Input id="legal-name" placeholder="Acme Corporation LLC" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="hospitality">Hospitality</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-size">Company Size</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of your business, products, and services..."
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Primary Phone *</Label>
                          <Input id="phone" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Business Email *</Label>
                          <Input id="email" type="email" placeholder="contact@company.com" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" placeholder="https://www.company.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax ID / EIN</Label>
                          <Input id="tax-id" placeholder="12-3456789" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Business Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="123 Business St, Suite 100, City, State 12345, Country"
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Notifications</h2>
                    <p className="text-muted-foreground">Configure notification preferences and alerts.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Bell className="h-5 w-5" />
                        Email Notifications
                      </CardTitle>
                      <CardDescription>Choose which emails you want to receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">New Reviews</Label>
                            <p className="text-sm text-muted-foreground">Get notified when customers leave reviews</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Job Applications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications for new job applications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Partnership Requests</Label>
                            <p className="text-sm text-muted-foreground">Get notified about partnership opportunities</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Platform Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Phone className="h-5 w-5" />
                        Push Notifications
                      </CardTitle>
                      <CardDescription>Manage your browser and mobile notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Browser Notifications</Label>
                            <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Sound Alerts</Label>
                            <p className="text-sm text-muted-foreground">Play sounds for new notifications</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Security & Privacy</h2>
                    <p className="text-muted-foreground">Protect your business data and manage access controls.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Lock className="h-5 w-5" />
                        Account Security
                      </CardTitle>
                      <CardDescription>Manage your account security settings and authentication</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" placeholder="Enter current password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" placeholder="Enter new password" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">SMS Authentication</div>
                            <div className="text-sm text-muted-foreground">Receive codes via text message</div>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">Authenticator App</div>
                            <div className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Integrations Section */}
              {activeSection === "integrations" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Integrations</h2>
                    <p className="text-muted-foreground">Connect and manage third-party integrations.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Plug className="h-5 w-5" />
                        Third-Party Integrations
                      </CardTitle>
                      <CardDescription>Connect your business tools and services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(integrations).map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                              <div className="text-sm text-muted-foreground">
                                {key === 'voip' && 'Voice over IP calling system'}
                                {key === 'email' && 'Email marketing and automation'}
                                {key === 'sms' && 'SMS messaging and notifications'}
                                {key === 'crm' && 'Customer relationship management'}
                                {key === 'analytics' && 'Advanced analytics and reporting'}
                                {key === 'payment' && 'Payment processing and billing'}
                                {key === 'inventory' && 'Inventory management system'}
                                {key === 'shipping' && 'Shipping and logistics'}
                                {key === 'accounting' && 'Accounting and bookkeeping'}
                                {key === 'marketing' && 'Marketing automation tools'}
                              </div>
                            </div>
                            <Switch checked={enabled} onCheckedChange={() => toggleIntegration(key)} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Plug className="h-5 w-5" />
                        Legacy Integrations
                      </CardTitle>
                      <CardDescription>Enable or disable modular capabilities for your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFeatures.map(([key, feature]) => {
                          const status = getFeatureStatus(key);
                          return (
                            <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{feature.title}</span>
                                  {feature.beta && <Badge variant="secondary">Beta</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                              </div>
                              <Switch checked={status.enabled} onCheckedChange={() => handleFeatureToggle(key)} />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === "billing" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Billing & Payments</h2>
                    <p className="text-muted-foreground">Manage your subscription, payment methods, and billing preferences.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <CreditCard className="h-5 w-5" />
                        Payment Methods
                      </CardTitle>
                      <CardDescription>Manage your payment methods and billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Saved Payment Methods</h4>
                          <Button variant="outline" size="sm">
                            Add New Method
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                VISA
                              </div>
                              <div>
                                <div className="font-medium">•••• •••• •••• 4242</div>
                                <div className="text-sm text-muted-foreground">Expires 12/25</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Primary</Badge>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                MC
                              </div>
                              <div>
                                <div className="font-medium">•••• •••• •••• 8888</div>
                                <div className="text-sm text-muted-foreground">Expires 08/26</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Receipt className="h-5 w-5" />
                        Subscription & Usage
                      </CardTitle>
                      <CardDescription>View your current plan and usage details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Current Plan</span>
                              <Badge variant="default">Professional</Badge>
                            </div>
                            <div className="text-2xl font-bold">$49/month</div>
                            <div className="text-sm text-muted-foreground">Billed monthly</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Next billing date</span>
                              <span>March 15, 2024</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Payment method</span>
                              <span>•••• 4242</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Usage This Month</h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>API Calls</span>
                                <span>8,432 / 10,000</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "84%" }}></div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Storage</span>
                                <span>2.1 GB / 5 GB</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Change Plan
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Usage History
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Download Invoices
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Team Management Section */}
              {activeSection === "team" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="hidden lg:block">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Team Management</h2>
                    <p className="text-muted-foreground">Manage team members, roles, and permissions.</p>
                  </div>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                        <Users className="h-5 w-5" />
                        Team Members
                      </CardTitle>
                      <CardDescription>Manage your team members and their access levels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">3 of 5 team members</div>
                        <Button size="sm">Invite Member</Button>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            name: "John Doe",
                            email: "john@company.com",
                            role: "Owner",
                            status: "Active",
                            lastActive: "2 hours ago",
                          },
                          {
                            name: "Sarah Wilson",
                            email: "sarah@company.com",
                            role: "Admin",
                            status: "Active",
                            lastActive: "1 day ago",
                          },
                          {
                            name: "Mike Johnson",
                            email: "mike@company.com",
                            role: "Editor",
                            status: "Pending",
                            lastActive: "Never",
                          },
                        ].map((member, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-medium">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                                <div className="text-xs text-muted-foreground">Last active: {member.lastActive}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={member.status === "Active" ? "secondary" : "outline"}>
                                {member.status}
                              </Badge>
                              <Badge variant="outline">{member.role}</Badge>
                              {member.role !== "Owner" && (
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Save Button - Always visible and responsive */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 sticky bottom-4 lg:static bg-background/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-4 lg:p-0 -mx-4 lg:mx-0 border-t lg:border-t-0">
                <Button size="lg" className="flex-1 sm:flex-initial sm:px-8">
                  Save Changes
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-initial sm:px-8 bg-transparent">
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


