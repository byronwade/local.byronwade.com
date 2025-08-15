"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Wrench, Calendar, MapPin, User, Clock, DollarSign, Search, Filter, Plus, CheckCircle, AlertCircle, Phone, FileText, Camera, Truck } from "lucide-react";
import { cn } from "@utils";
import { IntegrationVisibility } from "@components/dashboard/business/integrations/IntegrationVisibility";

export default function FieldServiceJobsWidget() {
    return (
        <IntegrationVisibility featureKey="field_management">
            <FieldServiceJobsModule />
        </IntegrationVisibility>
    );
}

function FieldServiceJobsModule() {
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");

    const jobsData = {
        overview: {
            activeJobs: 28,
            scheduledToday: 12,
            completedThisWeek: 45,
            totalRevenue: 125000,
            averageJobValue: 2500,
            completionRate: 94,
        },
        jobs: [
            { id: "JOB-001", title: "HVAC System Maintenance", customer: "ABC Corporation", address: "123 Business Ave, New York, NY", technician: "John Smith", scheduledDate: "2024-01-16", scheduledTime: "09:00 AM", estimatedDuration: 3, priority: "high", status: "scheduled", value: 850, description: "Annual HVAC maintenance and filter replacement", equipment: ["Unit #1", "Unit #2"], tags: ["maintenance", "hvac", "commercial"] },
            { id: "JOB-002", title: "Plumbing Repair - Emergency", customer: "Smith Residence", address: "456 Oak Street, Los Angeles, CA", technician: "Sarah Johnson", scheduledDate: "2024-01-16", scheduledTime: "02:00 PM", estimatedDuration: 2, priority: "urgent", status: "in_progress", value: 450, description: "Burst pipe in basement requiring immediate attention", equipment: ["Main water line"], tags: ["emergency", "plumbing", "residential"] },
            { id: "JOB-003", title: "Electrical Panel Upgrade", customer: "Downtown Restaurant", address: "789 Main St, Chicago, IL", technician: "Mike Wilson", scheduledDate: "2024-01-17", scheduledTime: "10:00 AM", estimatedDuration: 6, priority: "medium", status: "scheduled", value: 3200, description: "Upgrade electrical panel to support new kitchen equipment", equipment: ["200A Panel", "Circuit breakers"], tags: ["electrical", "upgrade", "commercial"] },
            { id: "JOB-004", title: "Roof Inspection", customer: "Johnson Property Management", address: "321 Pine Ave, Miami, FL", technician: "David Brown", scheduledDate: "2024-01-15", scheduledTime: "08:00 AM", estimatedDuration: 2, priority: "low", status: "completed", value: 300, description: "Routine roof inspection for property management company", equipment: ["Inspection tools"], tags: ["inspection", "roofing", "routine"] },
        ],
    };

    const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    const getStatusColor = (status) => ({
        scheduled: "bg-blue-100 text-blue-800",
        in_progress: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        on_hold: "bg-gray-100 text-gray-800",
    }[status] || "bg-gray-100 text-gray-800");

    const getPriorityColor = (priority) => ({
        urgent: "bg-red-100 text-red-800",
        high: "bg-orange-100 text-orange-800",
        medium: "bg-yellow-100 text-yellow-800",
        low: "bg-green-100 text-green-800",
    }[priority] || "bg-gray-100 text-gray-800");

    const filteredJobs = jobsData.jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.toLowerCase().includes(searchTerm.toLowerCase()) || job.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "all" || (activeTab === "active" && ["scheduled", "in_progress"].includes(job.status)) || (activeTab === "completed" && job.status === "completed") || (activeTab === "urgent" && job.priority === "urgent");
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Wrench className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{jobsData.overview.activeJobs}</div>
                        <p className="text-xs text-muted-foreground">{jobsData.overview.scheduledToday} scheduled today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{jobsData.overview.completedThisWeek}</div>
                        <p className="text-xs text-muted-foreground">{jobsData.overview.completionRate}% completion rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(jobsData.overview.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Avg: {formatCurrency(jobsData.overview.averageJobValue)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
                            <Input placeholder="Search jobs by title, customer, or job ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 w-4 h-4" />
                            Advanced Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="active">Active Jobs</TabsTrigger>
                    <TabsTrigger value="urgent">Urgent</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    <div className="grid gap-4">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-lg font-semibold">{job.title}</h3>
                                                        <Badge className={cn("text-xs", getStatusColor(job.status))}>{job.status.replace("_", " ")}</Badge>
                                                        <Badge className={cn("text-xs", getPriorityColor(job.priority))}>{job.priority}</Badge>
                                                    </div>
                                                    <p className="mt-1 text-sm text-muted-foreground">Job ID: {job.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-semibold text-green-600">{formatCurrency(job.value)}</p>
                                                    <p className="text-sm text-muted-foreground">Est. {job.estimatedDuration}h</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <User className="mr-2 w-4 h-4" />
                                                        Customer: {job.customer}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <MapPin className="mr-2 w-4 h-4" />
                                                        {job.address}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Truck className="mr-2 w-4 h-4" />
                                                        Technician: {job.technician}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="mr-2 w-4 h-4" />
                                                        {job.scheduledDate} at {job.scheduledTime}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Clock className="mr-2 w-4 h-4" />
                                                        Duration: {job.estimatedDuration} hours
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {job.equipment.map((item, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {item}
                                                    </Badge>
                                                ))}
                                                {job.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex pt-2 space-x-2">
                                                <Button size="sm" variant="outline">
                                                    <Phone className="mr-2 w-4 h-4" />
                                                    Call Customer
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <MapPin className="mr-2 w-4 h-4" />
                                                    Directions
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <FileText className="mr-2 w-4 h-4" />
                                                    View Details
                                                </Button>
                                                {job.status === "in_progress" && (
                                                    <Button size="sm">
                                                        <CheckCircle className="mr-2 w-4 h-4" />
                                                        Complete Job
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Wrench className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                                <p className="text-gray-500 dark:text-gray-400">{searchTerm ? "Try adjusting your search terms." : "Create your first job to get started."}</p>
                                {!searchTerm && (
                                    <Button className="mt-4">
                                        <Plus className="mr-2 w-4 h-4" />
                                        Create New Job
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common job management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Button variant="outline" className="flex flex-col h-20">
                            <Calendar className="mb-2 w-6 h-6" />
                            Schedule Job
                        </Button>
                        <Button variant="outline" className="flex flex-col h-20">
                            <AlertCircle className="mb-2 w-6 h-6" />
                            Emergency Call
                        </Button>
                        <Button variant="outline" className="flex flex-col h-20">
                            <FileText className="mb-2 w-6 h-6" />
                            Job Templates
                        </Button>
                        <Button variant="outline" className="flex flex-col h-20">
                            <Camera className="mb-2 w-6 h-6" />
                            Photo Upload
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
