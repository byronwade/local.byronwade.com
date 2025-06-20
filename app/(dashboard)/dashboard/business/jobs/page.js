"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Progress } from "@components/ui/progress";
import { Search, Filter, Calendar, MapPin, Star, MessageSquare, Briefcase, Clock, Eye, Phone, Mail, User, Zap, Target, AlertCircle, CheckCircle, XCircle, ExternalLink, Download, Share2, Bookmark, DollarSign, Users, Home, Tool, Wrench, ChevronLeft, ChevronRight } from "react-feather";

export default function Jobs() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterMatchScore, setFilterMatchScore] = useState("all");
	const [selectedJob, setSelectedJob] = useState(null);
	const [viewMode, setViewMode] = useState("grid"); // grid or list
	const [currentPage, setCurrentPage] = useState(1);
	const [expiredPage, setExpiredPage] = useState(1);
	const jobsPerPage = 12;

	// Mock jobs data - in real app this would come from API with algorithm matching
	const jobs = useMemo(
		() => [
			{
				id: "job_001",
				title: "Kitchen Remodel - Complete Renovation",
				description: "Looking for a professional contractor to completely remodel our kitchen. Need new cabinets, countertops, flooring, and appliances. Budget is flexible for quality work.",
				customer: {
					id: "cust_001",
					name: "Sarah Johnson",
					email: "sarah.johnson@email.com",
					phone: "(555) 123-4567",
					avatar: "/placeholder.svg",
					rating: 4.8,
					reviewCount: 12,
					verified: true,
					location: "Downtown Area",
					address: "123 Main St, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Kitchen Remodel",
				budget: {
					min: 15000,
					max: 25000,
					currency: "USD",
				},
				location: {
					address: "123 Main St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "2.3 miles",
				},
				status: "active",
				matchScore: 95,
				urgency: "high",
				postedDate: "2024-01-15T10:30:00Z",
				expiresDate: "2024-01-22T10:30:00Z",
				applications: 8,
				views: 24,
				requirements: ["Licensed contractor", "Insurance required", "5+ years experience", "Kitchen remodeling expertise"],
				preferences: ["Local business preferred", "References required", "Detailed quote needed", "Timeline: 4-6 weeks"],
				attachments: [
					{ name: "Kitchen Layout.pdf", type: "pdf", size: "2.3 MB" },
					{ name: "Inspiration Photos.zip", type: "zip", size: "15.7 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "high",
			},
			{
				id: "job_002",
				title: "Website Design for Local Restaurant",
				description: "Need a modern, responsive website for our new restaurant. Should include online ordering, menu display, and reservation system. Looking for clean, professional design.",
				customer: {
					id: "cust_002",
					name: "Michael Chen",
					email: "michael@tasteofhome.com",
					phone: "(555) 987-6543",
					avatar: "/placeholder.svg",
					rating: 4.6,
					reviewCount: 8,
					verified: true,
					location: "Business District",
					address: "456 Oak Ave, City, State 12345",
				},
				category: "Technology",
				subcategory: "Web Development",
				budget: {
					min: 3000,
					max: 8000,
					currency: "USD",
				},
				location: {
					address: "456 Oak Ave, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "1.8 miles",
				},
				status: "active",
				matchScore: 87,
				urgency: "medium",
				postedDate: "2024-01-14T14:20:00Z",
				expiresDate: "2024-01-21T14:20:00Z",
				applications: 5,
				views: 18,
				requirements: ["Web development experience", "Portfolio required", "E-commerce knowledge", "Mobile responsive design"],
				preferences: ["Restaurant industry experience", "SEO optimization", "Content management system", "Timeline: 3-4 weeks"],
				attachments: [
					{ name: "Brand Guidelines.pdf", type: "pdf", size: "1.8 MB" },
					{ name: "Menu Items.docx", type: "docx", size: "0.5 MB" },
				],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_003",
				title: "Emergency Plumbing Repair",
				description: "Burst pipe in basement causing water damage. Need immediate repair and cleanup. Available for emergency service today.",
				customer: {
					id: "cust_003",
					name: "David Rodriguez",
					email: "david.rodriguez@email.com",
					phone: "(555) 456-7890",
					avatar: "/placeholder.svg",
					rating: 4.9,
					reviewCount: 15,
					verified: true,
					location: "Suburban Area",
					address: "789 Pine Rd, City, State 12345",
				},
				category: "Plumbing",
				subcategory: "Emergency Repair",
				budget: {
					min: 500,
					max: 2000,
					currency: "USD",
				},
				location: {
					address: "789 Pine Rd, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "4.1 miles",
				},
				status: "urgent",
				matchScore: 92,
				urgency: "critical",
				postedDate: "2024-01-15T08:15:00Z",
				expiresDate: "2024-01-16T08:15:00Z",
				applications: 3,
				views: 12,
				requirements: ["Licensed plumber", "Emergency service available", "Insurance required", "Water damage experience"],
				preferences: ["Available today", "24/7 emergency service", "Cleanup included", "Immediate response"],
				attachments: [{ name: "Damage Photos.jpg", type: "jpg", size: "3.2 MB" }],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "critical",
			},
			{
				id: "job_004",
				title: "Landscaping Design and Installation",
				description: "Complete landscaping project for new home. Need design consultation, hardscaping, and plant installation. Large backyard with potential for outdoor living space.",
				customer: {
					id: "cust_004",
					name: "Jennifer Williams",
					email: "jennifer@email.com",
					phone: "(555) 321-6547",
					avatar: "/placeholder.svg",
					rating: 4.7,
					reviewCount: 6,
					verified: true,
					location: "Rural Area",
					address: "321 Garden Ln, City, State 12345",
				},
				category: "Landscaping",
				subcategory: "Design & Installation",
				budget: {
					min: 8000,
					max: 15000,
					currency: "USD",
				},
				location: {
					address: "321 Garden Ln, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "6.7 miles",
				},
				status: "active",
				matchScore: 78,
				urgency: "low",
				postedDate: "2024-01-13T16:45:00Z",
				expiresDate: "2024-01-27T16:45:00Z",
				applications: 12,
				views: 31,
				requirements: ["Landscape design experience", "Hardscaping skills", "Plant knowledge", "Project management"],
				preferences: ["Native plants", "Sustainable design", "Outdoor living features", "Timeline: 6-8 weeks"],
				attachments: [
					{ name: "Property Survey.pdf", type: "pdf", size: "4.1 MB" },
					{ name: "Inspiration Board.pdf", type: "pdf", size: "8.9 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "low",
			},
			// Add more active jobs
			{
				id: "job_007",
				title: "Bathroom Remodel - Modern Design",
				description: "Complete bathroom renovation with modern fixtures, walk-in shower, and luxury finishes. Looking for experienced contractor.",
				customer: {
					id: "cust_007",
					name: "Emma Thompson",
					email: "emma.thompson@email.com",
					phone: "(555) 222-3333",
					avatar: "/placeholder.svg",
					rating: 4.4,
					reviewCount: 7,
					verified: true,
					location: "Downtown Area",
					address: "888 Luxury Ave, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Bathroom Remodel",
				budget: {
					min: 12000,
					max: 20000,
					currency: "USD",
				},
				location: {
					address: "888 Luxury Ave, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "1.2 miles",
				},
				status: "active",
				matchScore: 89,
				urgency: "medium",
				postedDate: "2024-01-16T09:00:00Z",
				expiresDate: "2024-01-23T09:00:00Z",
				applications: 6,
				views: 22,
				requirements: ["Licensed contractor", "Bathroom remodeling experience", "Insurance required", "Luxury finishes experience"],
				preferences: ["Modern design expertise", "References required", "Timeline: 4-5 weeks"],
				attachments: [{ name: "Design Inspiration.pdf", type: "pdf", size: "5.2 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_008",
				title: "Mobile App Development",
				description: "Need iOS and Android app for fitness tracking. Should include user profiles, workout tracking, and social features.",
				customer: {
					id: "cust_008",
					name: "Alex Kim",
					email: "alex@fitnessapp.com",
					phone: "(555) 444-5555",
					avatar: "/placeholder.svg",
					rating: 4.9,
					reviewCount: 18,
					verified: true,
					location: "Tech District",
					address: "999 Innovation Dr, City, State 12345",
				},
				category: "Technology",
				subcategory: "Mobile Development",
				budget: {
					min: 25000,
					max: 50000,
					currency: "USD",
				},
				location: {
					address: "999 Innovation Dr, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "0.8 miles",
				},
				status: "active",
				matchScore: 96,
				urgency: "high",
				postedDate: "2024-01-16T11:30:00Z",
				expiresDate: "2024-01-30T11:30:00Z",
				applications: 15,
				views: 45,
				requirements: ["Mobile app development", "iOS/Android experience", "Fitness app portfolio", "API integration"],
				preferences: ["React Native experience", "Backend development", "Timeline: 8-12 weeks"],
				attachments: [
					{ name: "App Requirements.pdf", type: "pdf", size: "3.8 MB" },
					{ name: "UI Mockups.zip", type: "zip", size: "12.5 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "high",
			},
			{
				id: "job_009",
				title: "HVAC System Installation",
				description: "New HVAC system installation for commercial building. Need energy-efficient system with smart controls.",
				customer: {
					id: "cust_009",
					name: "Robert Martinez",
					email: "robert@commercialbuildings.com",
					phone: "(555) 666-7777",
					avatar: "/placeholder.svg",
					rating: 4.6,
					reviewCount: 11,
					verified: true,
					location: "Industrial Area",
					address: "555 Business Blvd, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "HVAC",
				budget: {
					min: 35000,
					max: 60000,
					currency: "USD",
				},
				location: {
					address: "555 Business Blvd, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "3.5 miles",
				},
				status: "active",
				matchScore: 82,
				urgency: "medium",
				postedDate: "2024-01-15T13:45:00Z",
				expiresDate: "2024-01-29T13:45:00Z",
				applications: 8,
				views: 28,
				requirements: ["Licensed HVAC contractor", "Commercial experience", "Energy-efficient systems", "Smart controls"],
				preferences: ["Local business", "Maintenance contract", "Timeline: 6-8 weeks"],
				attachments: [{ name: "Building Plans.pdf", type: "pdf", size: "7.1 MB" }],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_010",
				title: "Garden Maintenance Service",
				description: "Weekly garden maintenance for residential property. Includes mowing, trimming, weeding, and seasonal cleanup.",
				customer: {
					id: "cust_010",
					name: "Maria Garcia",
					email: "maria.garcia@email.com",
					phone: "(555) 888-9999",
					avatar: "/placeholder.svg",
					rating: 4.3,
					reviewCount: 5,
					verified: false,
					location: "Suburban Area",
					address: "777 Garden St, City, State 12345",
				},
				category: "Landscaping",
				subcategory: "Maintenance",
				budget: {
					min: 200,
					max: 400,
					currency: "USD",
				},
				location: {
					address: "777 Garden St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "4.8 miles",
				},
				status: "active",
				matchScore: 75,
				urgency: "low",
				postedDate: "2024-01-16T14:20:00Z",
				expiresDate: "2024-01-23T14:20:00Z",
				applications: 4,
				views: 16,
				requirements: ["Garden maintenance experience", "Own equipment", "Reliable transportation", "Weekly availability"],
				preferences: ["Organic practices", "Local business", "Long-term contract"],
				attachments: [{ name: "Property Photos.jpg", type: "jpg", size: "2.8 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "low",
			},
			{
				id: "job_011",
				title: "Electrical Panel Upgrade",
				description: "Upgrade electrical panel to 200 amp service. Need licensed electrician for safe and code-compliant installation.",
				customer: {
					id: "cust_011",
					name: "James Wilson",
					email: "james.wilson@email.com",
					phone: "(555) 111-2222",
					avatar: "/placeholder.svg",
					rating: 4.7,
					reviewCount: 9,
					verified: true,
					location: "Residential Area",
					address: "444 Electric Ave, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Electrical",
				budget: {
					min: 3000,
					max: 6000,
					currency: "USD",
				},
				location: {
					address: "444 Electric Ave, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "2.1 miles",
				},
				status: "urgent",
				matchScore: 91,
				urgency: "high",
				postedDate: "2024-01-16T07:30:00Z",
				expiresDate: "2024-01-18T07:30:00Z",
				applications: 2,
				views: 8,
				requirements: ["Licensed electrician", "Panel upgrade experience", "Code compliance", "Insurance required"],
				preferences: ["Available this week", "Local business", "Permit handling"],
				attachments: [{ name: "Current Panel Photo.jpg", type: "jpg", size: "1.5 MB" }],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "high",
			},
			{
				id: "job_012",
				title: "E-commerce Website Development",
				description: "Full e-commerce website with payment processing, inventory management, and admin dashboard.",
				customer: {
					id: "cust_012",
					name: "Lisa Chen",
					email: "lisa@onlineboutique.com",
					phone: "(555) 333-4444",
					avatar: "/placeholder.svg",
					rating: 4.8,
					reviewCount: 14,
					verified: true,
					location: "Business District",
					address: "222 Commerce St, City, State 12345",
				},
				category: "Technology",
				subcategory: "Web Development",
				budget: {
					min: 15000,
					max: 30000,
					currency: "USD",
				},
				location: {
					address: "222 Commerce St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "1.5 miles",
				},
				status: "active",
				matchScore: 88,
				urgency: "medium",
				postedDate: "2024-01-15T16:00:00Z",
				expiresDate: "2024-01-29T16:00:00Z",
				applications: 12,
				views: 35,
				requirements: ["E-commerce development", "Payment gateway integration", "Inventory management", "Admin dashboard"],
				preferences: ["Shopify/WooCommerce experience", "SEO optimization", "Mobile responsive", "Timeline: 6-8 weeks"],
				attachments: [
					{ name: "Product Catalog.xlsx", type: "xlsx", size: "0.8 MB" },
					{ name: "Brand Guidelines.pdf", type: "pdf", size: "2.1 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_013",
				title: "Deck Construction",
				description: "Build new wooden deck with composite materials. Include stairs, railing, and lighting. Large backyard space available.",
				customer: {
					id: "cust_013",
					name: "Tom Anderson",
					email: "tom.anderson@email.com",
					phone: "(555) 555-6666",
					avatar: "/placeholder.svg",
					rating: 4.5,
					reviewCount: 6,
					verified: true,
					location: "Suburban Area",
					address: "333 Deck Lane, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Deck Construction",
				budget: {
					min: 8000,
					max: 15000,
					currency: "USD",
				},
				location: {
					address: "333 Deck Lane, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "5.2 miles",
				},
				status: "active",
				matchScore: 79,
				urgency: "low",
				postedDate: "2024-01-16T10:15:00Z",
				expiresDate: "2024-01-30T10:15:00Z",
				applications: 7,
				views: 25,
				requirements: ["Deck construction experience", "Composite materials", "Permit knowledge", "Insurance required"],
				preferences: ["Local business", "References required", "Timeline: 3-4 weeks"],
				attachments: [{ name: "Backyard Layout.pdf", type: "pdf", size: "3.4 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "low",
			},
			{
				id: "job_014",
				title: "Water Heater Replacement",
				description: "Replace old water heater with new tankless system. Need professional installation and proper venting setup.",
				customer: {
					id: "cust_014",
					name: "Patricia Moore",
					email: "patricia.moore@email.com",
					phone: "(555) 777-8888",
					avatar: "/placeholder.svg",
					rating: 4.2,
					reviewCount: 3,
					verified: false,
					location: "Residential Area",
					address: "666 Water St, City, State 12345",
				},
				category: "Plumbing",
				subcategory: "Water Heater",
				budget: {
					min: 2000,
					max: 4000,
					currency: "USD",
				},
				location: {
					address: "666 Water St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "3.8 miles",
				},
				status: "active",
				matchScore: 84,
				urgency: "medium",
				postedDate: "2024-01-16T12:45:00Z",
				expiresDate: "2024-01-23T12:45:00Z",
				applications: 5,
				views: 19,
				requirements: ["Licensed plumber", "Tankless water heater experience", "Venting expertise", "Insurance required"],
				preferences: ["Energy-efficient models", "Local business", "Warranty included"],
				attachments: [{ name: "Current Setup Photos.jpg", type: "jpg", size: "2.2 MB" }],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_015",
				title: "Tree Removal and Stump Grinding",
				description: "Remove large oak tree and grind stump. Tree is near house and power lines. Need experienced arborist.",
				customer: {
					id: "cust_015",
					name: "Frank Johnson",
					email: "frank.johnson@email.com",
					phone: "(555) 999-0000",
					avatar: "/placeholder.svg",
					rating: 4.6,
					reviewCount: 8,
					verified: true,
					location: "Rural Area",
					address: "111 Tree Farm Rd, City, State 12345",
				},
				category: "Landscaping",
				subcategory: "Tree Services",
				budget: {
					min: 1500,
					max: 3000,
					currency: "USD",
				},
				location: {
					address: "111 Tree Farm Rd, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "7.3 miles",
				},
				status: "active",
				matchScore: 76,
				urgency: "medium",
				postedDate: "2024-01-15T15:30:00Z",
				expiresDate: "2024-01-22T15:30:00Z",
				applications: 6,
				views: 21,
				requirements: ["Licensed arborist", "Tree removal experience", "Stump grinding", "Insurance required"],
				preferences: ["Local business", "Cleanup included", "Available this week"],
				attachments: [{ name: "Tree Photos.jpg", type: "jpg", size: "4.1 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			// Add some expired jobs for demonstration
			{
				id: "job_005",
				title: "Bathroom Remodel - Expired",
				description: "Complete bathroom renovation including new fixtures, tile work, and plumbing updates.",
				customer: {
					id: "cust_005",
					name: "Robert Smith",
					email: "robert.smith@email.com",
					phone: "(555) 111-2222",
					avatar: "/placeholder.svg",
					rating: 4.5,
					reviewCount: 9,
					verified: true,
					location: "Downtown Area",
					address: "555 Elm St, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Bathroom Remodel",
				budget: {
					min: 8000,
					max: 12000,
					currency: "USD",
				},
				location: {
					address: "555 Elm St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "3.2 miles",
				},
				status: "expired",
				matchScore: 85,
				urgency: "medium",
				postedDate: "2024-01-01T10:00:00Z",
				expiresDate: "2024-01-08T10:00:00Z",
				applications: 6,
				views: 19,
				requirements: ["Licensed contractor", "Bathroom remodeling experience", "Insurance required"],
				preferences: ["Local business", "References required", "Timeline: 3-4 weeks"],
				attachments: [{ name: "Bathroom Layout.pdf", type: "pdf", size: "1.5 MB" }],
				photos: ["/placeholder.svg"],
				canApply: false,
				canContact: false,
				priority: "low",
			},
			{
				id: "job_006",
				title: "Roof Repair - Expired",
				description: "Minor roof repair and gutter cleaning needed after recent storm damage.",
				customer: {
					id: "cust_006",
					name: "Lisa Brown",
					email: "lisa.brown@email.com",
					phone: "(555) 333-4444",
					avatar: "/placeholder.svg",
					rating: 4.3,
					reviewCount: 4,
					verified: false,
					location: "Suburban Area",
					address: "777 Maple Dr, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Roofing",
				budget: {
					min: 1500,
					max: 3000,
					currency: "USD",
				},
				location: {
					address: "777 Maple Dr, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "5.1 miles",
				},
				status: "expired",
				matchScore: 72,
				urgency: "low",
				postedDate: "2024-01-02T14:30:00Z",
				expiresDate: "2024-01-09T14:30:00Z",
				applications: 4,
				views: 15,
				requirements: ["Licensed roofer", "Storm damage experience", "Insurance required"],
				preferences: ["Local business", "Quick turnaround", "Cleanup included"],
				attachments: [{ name: "Damage Assessment.pdf", type: "pdf", size: "2.1 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: false,
				canContact: false,
				priority: "low",
			},
			// Add more expired jobs
			{
				id: "job_016",
				title: "Fence Installation - Expired",
				description: "Install privacy fence around backyard. Need professional installation with quality materials.",
				customer: {
					id: "cust_016",
					name: "Carlos Rodriguez",
					email: "carlos.rodriguez@email.com",
					phone: "(555) 123-4567",
					avatar: "/placeholder.svg",
					rating: 4.4,
					reviewCount: 6,
					verified: true,
					location: "Suburban Area",
					address: "444 Fence St, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Fencing",
				budget: {
					min: 3000,
					max: 6000,
					currency: "USD",
				},
				location: {
					address: "444 Fence St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "4.2 miles",
				},
				status: "expired",
				matchScore: 81,
				urgency: "low",
				postedDate: "2024-01-03T11:00:00Z",
				expiresDate: "2024-01-10T11:00:00Z",
				applications: 5,
				views: 18,
				requirements: ["Fence installation experience", "Quality materials", "Permit knowledge", "Insurance required"],
				preferences: ["Local business", "References required", "Timeline: 2-3 weeks"],
				attachments: [{ name: "Property Layout.pdf", type: "pdf", size: "2.8 MB" }],
				photos: ["/placeholder.svg"],
				canApply: false,
				canContact: false,
				priority: "low",
			},
			{
				id: "job_017",
				title: "Appliance Repair - Expired",
				description: "Repair refrigerator and dishwasher. Both appliances are under warranty but need professional diagnosis.",
				customer: {
					id: "cust_017",
					name: "Susan Davis",
					email: "susan.davis@email.com",
					phone: "(555) 987-6543",
					avatar: "/placeholder.svg",
					rating: 4.7,
					reviewCount: 12,
					verified: true,
					location: "Residential Area",
					address: "222 Appliance Ave, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Appliance Repair",
				budget: {
					min: 200,
					max: 800,
					currency: "USD",
				},
				location: {
					address: "222 Appliance Ave, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "2.7 miles",
				},
				status: "expired",
				matchScore: 68,
				urgency: "medium",
				postedDate: "2024-01-04T13:15:00Z",
				expiresDate: "2024-01-11T13:15:00Z",
				applications: 3,
				views: 11,
				requirements: ["Appliance repair experience", "Warranty knowledge", "Diagnostic skills", "Parts availability"],
				preferences: ["Same-day service", "Local business", "Warranty work"],
				attachments: [{ name: "Appliance Models.pdf", type: "pdf", size: "0.9 MB" }],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: false,
				canContact: false,
				priority: "low",
			},
		],
		[]
	);

	// Separate active and expired jobs
	const activeJobs = useMemo(() => {
		return jobs.filter((job) => job.status !== "expired");
	}, [jobs]);

	const expiredJobs = useMemo(() => {
		return jobs.filter((job) => job.status === "expired");
	}, [jobs]);

	const filteredActiveJobs = useMemo(() => {
		return activeJobs.filter((job) => {
			const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = filterStatus === "all" || job.status === filterStatus;
			const matchesCategory = filterCategory === "all" || job.category === filterCategory;
			const matchesMatchScore = filterMatchScore === "all" || (filterMatchScore === "high" && job.matchScore >= 90) || (filterMatchScore === "medium" && job.matchScore >= 70 && job.matchScore < 90) || (filterMatchScore === "low" && job.matchScore < 70);

			return matchesSearch && matchesStatus && matchesCategory && matchesMatchScore;
		});
	}, [activeJobs, searchTerm, filterStatus, filterCategory, filterMatchScore]);

	const filteredExpiredJobs = useMemo(() => {
		return expiredJobs.filter((job) => {
			const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory = filterCategory === "all" || job.category === filterCategory;
			const matchesMatchScore = filterMatchScore === "all" || (filterMatchScore === "high" && job.matchScore >= 90) || (filterMatchScore === "medium" && job.matchScore >= 70 && job.matchScore < 90) || (filterMatchScore === "low" && job.matchScore < 70);

			return matchesSearch && matchesCategory && matchesMatchScore;
		});
	}, [expiredJobs, searchTerm, filterCategory, filterMatchScore]);

	// Pagination for active jobs
	const totalActivePages = Math.ceil(filteredActiveJobs.length / jobsPerPage);
	const paginatedActiveJobs = filteredActiveJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

	// Pagination for expired jobs
	const totalExpiredPages = Math.ceil(filteredExpiredJobs.length / jobsPerPage);
	const paginatedExpiredJobs = filteredExpiredJobs.slice((expiredPage - 1) * jobsPerPage, expiredPage * jobsPerPage);

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
		setExpiredPage(1);
	}, [searchTerm, filterStatus, filterCategory, filterMatchScore]);

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "urgent":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "expired":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
			default:
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
		}
	};

	const getUrgencyColor = (urgency) => {
		switch (urgency) {
			case "critical":
				return "bg-red-500";
			case "high":
				return "bg-orange-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getCategoryIcon = (category) => {
		switch (category) {
			case "Home Improvement":
				return Home;
			case "Technology":
				return Zap;
			case "Plumbing":
				return Wrench;
			case "Landscaping":
				return Tool;
			default:
				return Briefcase;
		}
	};

	const renderCategoryIcon = (category, className = "w-5 h-5 text-primary") => {
		try {
			const IconComponent = getCategoryIcon(category);
			if (!IconComponent || typeof IconComponent !== "function") {
				return <Briefcase className={className} />;
			}
			return <IconComponent className={className} />;
		} catch (error) {
			console.warn(`Failed to render icon for category: ${category}`, error);
			return <Briefcase className={className} />;
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString();
	};

	const formatExpiry = (expiresDate) => {
		const expiry = new Date(expiresDate);
		const now = new Date();
		const diffTime = expiry - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return "Expired";
		if (diffDays === 0) return "Expires today";
		if (diffDays === 1) return "Expires tomorrow";
		return `Expires in ${diffDays} days`;
	};

	const formatBudget = (budget) => {
		return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
	};

	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between space-x-6">
				<div>
					<h1 className="text-4xl font-bold">Matched Jobs</h1>
					<p className="text-muted-foreground mt-2">Algorithmically matched opportunities for your business</p>
				</div>
				<div className="flex items-center gap-x-3">
					<Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
						{viewMode === "grid" ? "List View" : "Grid View"}
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Matches</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.length}</div>
						<p className="text-xs text-muted-foreground">Algorithm matched</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">High Match Score</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.filter((j) => j.matchScore >= 90).length}</div>
						<p className="text-xs text-muted-foreground">90%+ match rate</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Urgent Jobs</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.filter((j) => j.urgency === "critical" || j.urgency === "high").length}</div>
						<p className="text-xs text-muted-foreground">Need immediate attention</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg. Budget</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${Math.round(jobs.reduce((acc, j) => acc + (j.budget.min + j.budget.max) / 2, 0) / jobs.length).toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Per project</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filter Jobs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input placeholder="Search jobs, customers, or descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
							</div>
						</div>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="urgent">Urgent</SelectItem>
								<SelectItem value="expired">Expired</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterCategory} onValueChange={setFilterCategory}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="Home Improvement">Home Improvement</SelectItem>
								<SelectItem value="Technology">Technology</SelectItem>
								<SelectItem value="Plumbing">Plumbing</SelectItem>
								<SelectItem value="Landscaping">Landscaping</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterMatchScore} onValueChange={setFilterMatchScore}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by match score" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Scores</SelectItem>
								<SelectItem value="high">High (90%+)</SelectItem>
								<SelectItem value="medium">Medium (70-89%)</SelectItem>
								<SelectItem value="low">Low (&lt;70%)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Jobs List */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Available Jobs</h2>
					<p className="text-sm text-muted-foreground">
						{filteredActiveJobs.length} of {activeJobs.length} jobs
					</p>
				</div>

				{filteredActiveJobs.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Search className="w-12 h-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">No jobs found</h3>
							<p className="text-muted-foreground text-center">Try adjusting your search or filters to find what you&apos;re looking for.</p>
						</CardContent>
					</Card>
				) : (
					<div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
						{paginatedActiveJobs.map((job) => {
							return (
								<Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
									<CardContent className="p-4">
										{/* Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<div className="flex items-center space-x-2 mb-1">
													{renderCategoryIcon(job.category)}
													<h3 className="text-base font-semibold">{job.title}</h3>
													<Badge className={`text-xs ${getStatusColor(job.status)}`}>{job.status}</Badge>
													<div className={`w-2 h-2 rounded-full ${getUrgencyColor(job.urgency)}`} title={`${job.urgency} urgency`}></div>
												</div>

												<div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
													<div className="flex items-center space-x-1">
														<MapPin className="w-3 h-3" />
														<span>{job.location.distance}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Calendar className="w-3 h-3" />
														<span>{formatDate(job.postedDate)}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Clock className="w-3 h-3" />
														<span>{formatExpiry(job.expiresDate)}</span>
													</div>
												</div>
											</div>

											<div className="flex items-center space-x-1">
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Bookmark className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Share2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										{/* Match Score */}
										<div className="mb-3">
											<div className="flex items-center justify-between mb-1">
												<span className="text-xs font-medium">Match Score</span>
												<span className="text-xs font-bold text-primary">{job.matchScore}%</span>
											</div>
											<Progress value={job.matchScore} className="h-1.5" />
										</div>

										{/* Customer Info */}
										<div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
											<Avatar className="w-8 h-8">
												<AvatarImage src={job.customer.avatar} />
												<AvatarFallback className="text-sm">
													{job.customer.name
														.split(" ")
														.map((word) => word[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-1">
													<h4 className="font-medium text-sm truncate">{job.customer.name}</h4>
													{job.customer.verified && (
														<Badge variant="outline" className="text-xs px-1 py-0">
															Verified
														</Badge>
													)}
												</div>
												<div className="flex items-center space-x-1 text-xs text-muted-foreground">
													<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
													<span>{job.customer.rating}</span>
													<span>({job.customer.reviewCount})</span>
													<span>•</span>
													<span className="truncate">{job.customer.location}</span>
												</div>
											</div>
										</div>

										{/* Budget and Stats */}
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-1">
												<DollarSign className="w-4 h-4 text-green-600" />
												<span className="font-semibold text-green-600 text-sm">{formatBudget(job.budget)}</span>
											</div>
											<div className="flex items-center space-x-3 text-xs text-muted-foreground">
												<span>{job.applications} applications</span>
												<span>{job.views} views</span>
											</div>
										</div>

										{/* Description Preview */}
										<p className="text-muted-foreground text-xs mb-3 line-clamp-2">{job.description}</p>

										{/* Photos Gallery */}
										{job.photos && job.photos.length > 0 && (
											<div className="mb-3">
												<h5 className="text-xs font-medium mb-1">Photos ({job.photos.length})</h5>
												<div className="grid grid-cols-4 gap-0.5">
													{job.photos.slice(0, 4).map((photo, index) => (
														<div key={index} className="aspect-[4/3] rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
															<img
																src={photo}
																alt={`Job photo ${index + 1}`}
																className="w-full h-full object-cover"
																onError={(e) => {
																	e.target.src = "/placeholder.svg";
																}}
															/>
														</div>
													))}
													{job.photos.length > 4 && (
														<div className="aspect-[4/3] rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
															<span className="text-xs text-muted-foreground">+{job.photos.length - 4}</span>
														</div>
													)}
												</div>
											</div>
										)}

										{/* Requirements Preview */}
										<div className="mb-3">
											<h5 className="text-xs font-medium mb-1">Key Requirements:</h5>
											<div className="flex flex-wrap gap-1">
												{job.requirements.slice(0, 2).map((req, index) => (
													<Badge key={index} variant="secondary" className="text-xs px-1 py-0">
														{req}
													</Badge>
												))}
												{job.requirements.length > 2 && (
													<Badge variant="outline" className="text-xs px-1 py-0">
														+{job.requirements.length - 2} more
													</Badge>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												{job.canContact ? (
													<>
														<Button size="sm" className="h-7 text-xs">
															<MessageSquare className="w-3 h-3 mr-1" />
															Contact
														</Button>
														<Button variant="outline" size="sm" className="h-7 text-xs">
															<Eye className="w-3 h-3 mr-1" />
															View Details
														</Button>
													</>
												) : (
													<>
														<Button variant="outline" size="sm" disabled className="h-7 text-xs">
															<Clock className="w-3 h-3 mr-1" />
															Expired
														</Button>
														<Button variant="outline" size="sm" className="h-7 text-xs">
															<Eye className="w-3 h-3 mr-1" />
															View Details
														</Button>
													</>
												)}
											</div>
											<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
												<ExternalLink className="w-3 h-3" />
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>

			{/* Active Jobs Pagination */}
			{totalActivePages > 1 && (
				<div className="flex items-center justify-center space-x-2 mt-6">
					<Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
						<ChevronLeft className="w-4 h-4" />
						Previous
					</Button>
					<div className="flex items-center space-x-1">
						{Array.from({ length: totalActivePages }, (_, i) => i + 1).map((page) => (
							<Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8">
								{page}
							</Button>
						))}
					</div>
					<Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalActivePages, currentPage + 1))} disabled={currentPage === totalActivePages}>
						Next
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			)}

			{/* Expired Jobs Section */}
			{filteredExpiredJobs.length > 0 && (
				<div className="mt-12">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-xl font-semibold text-muted-foreground">Expired Jobs</h2>
							<p className="text-sm text-muted-foreground">These jobs have expired and contact information is no longer available</p>
						</div>
						<p className="text-sm text-muted-foreground">{filteredExpiredJobs.length} expired jobs</p>
					</div>

					<div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
						{paginatedExpiredJobs.map((job) => {
							return (
								<Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer opacity-75" onClick={() => setSelectedJob(job)}>
									<CardContent className="p-4">
										{/* Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<div className="flex items-center space-x-2 mb-1">
													{renderCategoryIcon(job.category)}
													<h3 className="text-base font-semibold text-muted-foreground">{job.title}</h3>
													<Badge variant="secondary" className="text-xs">
														Expired
													</Badge>
													<div className="w-2 h-2 rounded-full bg-gray-400" title="expired"></div>
												</div>

												<div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
													<div className="flex items-center space-x-1">
														<MapPin className="w-3 h-3" />
														<span>{job.location.distance}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Calendar className="w-3 h-3" />
														<span>{formatDate(job.postedDate)}</span>
													</div>
													<div className="flex items-center space-x-1">
														<Clock className="w-3 h-3" />
														<span>Expired {formatDate(job.expiresDate)}</span>
													</div>
												</div>
											</div>

											<div className="flex items-center space-x-1">
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Bookmark className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Share2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										{/* Match Score */}
										<div className="mb-3">
											<div className="flex items-center justify-between mb-1">
												<span className="text-xs font-medium">Match Score</span>
												<span className="text-xs font-bold text-muted-foreground">{job.matchScore}%</span>
											</div>
											<Progress value={job.matchScore} className="h-1.5 opacity-50" />
										</div>

										{/* Customer Info - No Contact Details */}
										<div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
											<Avatar className="w-8 h-8">
												<AvatarImage src={job.customer.avatar} />
												<AvatarFallback className="text-sm">
													{job.customer.name
														.split(" ")
														.map((word) => word[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-1">
													<h4 className="font-medium text-sm text-muted-foreground truncate">{job.customer.name}</h4>
													{job.customer.verified && (
														<Badge variant="outline" className="text-xs px-1 py-0">
															Verified
														</Badge>
													)}
												</div>
												<div className="flex items-center space-x-1 text-xs text-muted-foreground">
													<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
													<span>{job.customer.rating}</span>
													<span>({job.customer.reviewCount})</span>
													<span>•</span>
													<span className="truncate">{job.customer.location}</span>
												</div>
												<div className="text-xs text-muted-foreground mt-1">Contact information no longer available</div>
											</div>
										</div>

										{/* Budget and Stats */}
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-1">
												<DollarSign className="w-4 h-4 text-muted-foreground" />
												<span className="font-semibold text-muted-foreground text-sm">{formatBudget(job.budget)}</span>
											</div>
											<div className="flex items-center space-x-3 text-xs text-muted-foreground">
												<span>{job.applications} applications</span>
												<span>{job.views} views</span>
											</div>
										</div>

										{/* Description Preview */}
										<p className="text-muted-foreground text-xs mb-3 line-clamp-2">{job.description}</p>

										{/* Photos Gallery */}
										{job.photos && job.photos.length > 0 && (
											<div className="mb-3">
												<h5 className="text-xs font-medium mb-1">Photos ({job.photos.length})</h5>
												<div className="grid grid-cols-4 gap-0.5">
													{job.photos.slice(0, 4).map((photo, index) => (
														<div key={index} className="aspect-[4/3] rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
															<img
																src={photo}
																alt={`Job photo ${index + 1}`}
																className="w-full h-full object-cover"
																onError={(e) => {
																	e.target.src = "/placeholder.svg";
																}}
															/>
														</div>
													))}
													{job.photos.length > 4 && (
														<div className="aspect-[4/3] rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
															<span className="text-xs text-muted-foreground">+{job.photos.length - 4}</span>
														</div>
													)}
												</div>
											</div>
										)}

										{/* Requirements Preview */}
										<div className="mb-3">
											<h5 className="text-xs font-medium mb-1">Key Requirements:</h5>
											<div className="flex flex-wrap gap-1">
												{job.requirements.slice(0, 2).map((req, index) => (
													<Badge key={index} variant="secondary" className="text-xs px-1 py-0 opacity-75">
														{req}
													</Badge>
												))}
												{job.requirements.length > 2 && (
													<Badge variant="outline" className="text-xs px-1 py-0 opacity-75">
														+{job.requirements.length - 2} more
													</Badge>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Button variant="outline" size="sm" disabled className="h-7 text-xs">
													<Clock className="w-3 h-3 mr-1" />
													Expired
												</Button>
												<Button variant="outline" size="sm" className="h-7 text-xs">
													<Eye className="w-3 h-3 mr-1" />
													View Details
												</Button>
											</div>
											<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
												<ExternalLink className="w-3 h-3" />
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Expired Jobs Pagination */}
					{totalExpiredPages > 1 && (
						<div className="flex items-center justify-center space-x-2 mt-6">
							<Button variant="outline" size="sm" onClick={() => setExpiredPage(Math.max(1, expiredPage - 1))} disabled={expiredPage === 1}>
								<ChevronLeft className="w-4 h-4" />
								Previous
							</Button>
							<div className="flex items-center space-x-1">
								{Array.from({ length: totalExpiredPages }, (_, i) => i + 1).map((page) => (
									<Button key={page} variant={page === expiredPage ? "default" : "outline"} size="sm" onClick={() => setExpiredPage(page)} className="w-8 h-8">
										{page}
									</Button>
								))}
							</div>
							<Button variant="outline" size="sm" onClick={() => setExpiredPage(Math.min(totalExpiredPages, expiredPage + 1))} disabled={expiredPage === totalExpiredPages}>
								Next
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Job Details Dialog */}
			<Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					{selectedJob && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center space-x-2">
									{renderCategoryIcon(selectedJob.category)}
									<span>{selectedJob.title}</span>
								</DialogTitle>
								<DialogDescription>
									Posted by {selectedJob.customer.name} • {formatDate(selectedJob.postedDate)} • {formatExpiry(selectedJob.expiresDate)}
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-6">
								{/* Match Score and Status */}
								<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div className="flex items-center space-x-4">
										<div>
											<div className="flex items-center space-x-2 mb-1">
												<span className="text-sm font-medium">Match Score</span>
												<span className="text-lg font-bold text-primary">{selectedJob.matchScore}%</span>
											</div>
											<Progress value={selectedJob.matchScore} className="h-2 w-32" />
										</div>
										<div className="flex items-center space-x-2">
											<Badge className={getStatusColor(selectedJob.status)}>{selectedJob.status}</Badge>
											<div className={`w-3 h-3 rounded-full ${getUrgencyColor(selectedJob.urgency)}`} title={`${selectedJob.urgency} urgency`}></div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-green-600">{formatBudget(selectedJob.budget)}</div>
										<div className="text-sm text-muted-foreground">Budget Range</div>
									</div>
								</div>

								{/* Customer Information */}
								<div className="p-4 border rounded-lg">
									<h3 className="text-lg font-semibold mb-3">Customer Information</h3>
									<div className="flex items-start space-x-4">
										<Avatar className="w-16 h-16">
											<AvatarImage src={selectedJob.customer.avatar} />
											<AvatarFallback className="text-lg">
												{selectedJob.customer.name
													.split(" ")
													.map((word) => word[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<h4 className="text-lg font-medium">{selectedJob.customer.name}</h4>
												{selectedJob.customer.verified && <Badge variant="outline">Verified Customer</Badge>}
											</div>
											<div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span>
													{selectedJob.customer.rating} ({selectedJob.customer.reviewCount} reviews)
												</span>
												<span>•</span>
												<span>{selectedJob.customer.location}</span>
											</div>
											{selectedJob.canContact ? (
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<Mail className="w-4 h-4 text-muted-foreground" />
														<span className="text-sm">{selectedJob.customer.email}</span>
													</div>
													<div className="flex items-center space-x-2">
														<Phone className="w-4 h-4 text-muted-foreground" />
														<span className="text-sm">{selectedJob.customer.phone}</span>
													</div>
													<div className="flex items-center space-x-2">
														<MapPin className="w-4 h-4 text-muted-foreground" />
														<span className="text-sm">{selectedJob.customer.address}</span>
													</div>
												</div>
											) : (
												<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
													<div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
														<AlertCircle className="w-4 h-4" />
														<span className="text-sm font-medium">Job Expired</span>
													</div>
													<p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">This job has expired and contact information is no longer available to protect customer privacy.</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Job Details */}
								<div className="space-y-4">
									<div>
										<h3 className="text-lg font-semibold mb-2">Project Description</h3>
										<p className="text-muted-foreground">{selectedJob.description}</p>
									</div>

									{/* Photos Gallery */}
									{selectedJob.photos && selectedJob.photos.length > 0 && (
										<div>
											<h4 className="font-medium mb-3">Project Photos ({selectedJob.photos.length})</h4>
											<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
												{selectedJob.photos.map((photo, index) => (
													<div key={index} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
														<img
															src={photo}
															alt={`Project photo ${index + 1}`}
															className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
															onError={(e) => {
																e.target.src = "/placeholder.svg";
															}}
														/>
													</div>
												))}
											</div>
										</div>
									)}

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<h4 className="font-medium mb-2">Requirements</h4>
											<ul className="space-y-1">
												{selectedJob.requirements.map((req, index) => (
													<li key={index} className="flex items-center space-x-2 text-sm">
														<CheckCircle className="w-4 h-4 text-green-500" />
														<span>{req}</span>
													</li>
												))}
											</ul>
										</div>
										<div>
											<h4 className="font-medium mb-2">Preferences</h4>
											<ul className="space-y-1">
												{selectedJob.preferences.map((pref, index) => (
													<li key={index} className="flex items-center space-x-2 text-sm">
														<Star className="w-4 h-4 text-yellow-500" />
														<span>{pref}</span>
													</li>
												))}
											</ul>
										</div>
									</div>

									{/* Attachments */}
									{selectedJob.attachments.length > 0 && (
										<div>
											<h4 className="font-medium mb-2">Attachments</h4>
											<div className="space-y-2">
												{selectedJob.attachments.map((file, index) => (
													<div key={index} className="flex items-center justify-between p-2 border rounded">
														<div className="flex items-center space-x-2">
															<Download className="w-4 h-4 text-muted-foreground" />
															<span className="text-sm">{file.name}</span>
															<span className="text-xs text-muted-foreground">({file.size})</span>
														</div>
														<Button variant="ghost" size="sm">
															<Download className="w-4 h-4" />
														</Button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>

								{/* Actions */}
								<div className="flex items-center justify-between pt-4 border-t">
									<div className="flex items-center space-x-2">
										{selectedJob.canContact ? (
											<>
												<Button>
													<MessageSquare className="w-4 h-4 mr-2" />
													Contact Customer
												</Button>
												<Button variant="outline">
													<Phone className="w-4 h-4 mr-2" />
													Call Now
												</Button>
											</>
										) : (
											<>
												<Button variant="outline" disabled>
													<Clock className="w-4 h-4 mr-2" />
													Job Expired
												</Button>
												<Button variant="outline" disabled>
													<AlertCircle className="w-4 h-4 mr-2" />
													Contact Unavailable
												</Button>
											</>
										)}
									</div>
									<div className="flex items-center space-x-2">
										<Button variant="outline" size="sm">
											<Bookmark className="w-4 h-4 mr-2" />
											Save Job
										</Button>
										<Button variant="outline" size="sm">
											<Share2 className="w-4 h-4 mr-2" />
											Share
										</Button>
									</div>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
