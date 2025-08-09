"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Filter, 
  RefreshCw, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Activity,
  Timer,
  Target,
  Wrench,
  Route,
  Bell,
  Settings,
  FileText,
  MapIcon,
  Zap
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfDay } from "date-fns";
import Header from "@components/business/header";

/**
 * Advanced Field Service Scheduling & Dispatch System
 * Features drag-and-drop calendar, resource management, and real-time updates
 */
export default function FieldServiceScheduling({ user, initialJobs = [], initialTechnicians = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // day, week, month
  const [jobs, setJobs] = useState(initialJobs);
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [unassignedJobs, setUnassignedJobs] = useState([]);
  const [draggedJob, setDraggedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Enhanced mock data for demonstration
  const mockJobs = [
    {
      id: "FSM001",
      customer_name: "John Smith",
      service_type: "Emergency Plumbing",
      status: "scheduled",
      priority: "urgent",
      scheduled_time: new Date("2024-01-15T10:00:00"),
      estimated_duration: 120, // minutes
      estimated_price: 150,
      address: "123 Main St, Anytown, CA",
      phone: "(555) 123-4567",
      technician_id: "tech_001",
      skills_required: ["plumbing", "emergency"],
      customer_notes: "Water heater leaking badly, urgent repair needed",
      internal_notes: "Customer has small children, prioritize safety",
    },
    {
      id: "FSM002",
      customer_name: "Sarah Johnson",
      service_type: "HVAC Installation",
      status: "in_progress",
      priority: "high",
      scheduled_time: new Date("2024-01-15T14:00:00"),
      estimated_duration: 240,
      estimated_price: 800,
      address: "456 Oak Ave, Anytown, CA",
      phone: "(555) 987-6543",
      technician_id: "tech_002",
      skills_required: ["hvac", "installation"],
      customer_notes: "Replace entire unit, customer will be home all day",
      internal_notes: "Large job, may need helper",
    },
    {
      id: "FSM003",
      customer_name: "Mike Davis",
      service_type: "Electrical Inspection",
      status: "completed",
      priority: "normal",
      scheduled_time: new Date("2024-01-14T09:00:00"),
      estimated_duration: 60,
      estimated_price: 120,
      address: "789 Pine St, Anytown, CA",
      phone: "(555) 456-7890",
      technician_id: "tech_003",
      skills_required: ["electrical", "inspection"],
      customer_notes: "Annual safety inspection",
      internal_notes: "Regular customer, very satisfied",
    },
    {
      id: "FSM004",
      customer_name: "Emma Wilson",
      service_type: "Drain Cleaning",
      status: "scheduled",
      priority: "normal",
      scheduled_time: new Date("2024-01-15T16:00:00"),
      estimated_duration: 90,
      estimated_price: 95,
      address: "321 Elm St, Anytown, CA",
      phone: "(555) 234-5678",
      technician_id: "tech_001",
      skills_required: ["plumbing"],
      customer_notes: "Kitchen sink backing up",
      internal_notes: "Repeat customer, knows the drill",
    },
    {
      id: "FSM005",
      customer_name: "Robert Chen",
      service_type: "AC Maintenance",
      status: "unassigned",
      priority: "normal",
      scheduled_time: new Date("2024-01-16T11:00:00"),
      estimated_duration: 90,
      estimated_price: 150,
      address: "654 Maple Dr, Anytown, CA",
      phone: "(555) 345-6789",
      technician_id: null,
      skills_required: ["hvac", "maintenance"],
      customer_notes: "Routine maintenance, filters need changing",
      internal_notes: "New customer, be thorough",
    },
  ];

  const mockTechnicians = [
    {
      id: "tech_001",
      name: "Mike Wilson",
      skills: ["plumbing", "emergency", "installation"],
      status: "available",
      phone: "(555) 111-2222",
      current_location: "Base",
      shift_start: "08:00",
      shift_end: "17:00",
      certification_level: "senior",
      hourly_rate: 45,
      avatar: null,
    },
    {
      id: "tech_002",
      name: "David Brown",
      skills: ["hvac", "installation", "maintenance"],
      status: "on_job",
      phone: "(555) 222-3333",
      current_location: "456 Oak Ave",
      shift_start: "07:00",
      shift_end: "16:00",
      certification_level: "expert",
      hourly_rate: 50,
      avatar: null,
    },
    {
      id: "tech_003",
      name: "Lisa Chen",
      skills: ["electrical", "inspection", "troubleshooting"],
      status: "available",
      phone: "(555) 333-4444",
      current_location: "Base",
      shift_start: "09:00",
      shift_end: "18:00",
      certification_level: "expert",
      hourly_rate: 48,
      avatar: null,
    },
    {
      id: "tech_004",
      name: "Tom Garcia",
      skills: ["general", "maintenance", "installation"],
      status: "break",
      phone: "(555) 444-5555",
      current_location: "Downtown",
      shift_start: "08:00",
      shift_end: "17:00",
      certification_level: "intermediate",
      hourly_rate: 38,
      avatar: null,
    },
  ];

  useEffect(() => {
    // Initialize with mock data for demonstration
    setJobs(mockJobs);
    setTechnicians(mockTechnicians);
    setUnassignedJobs(mockJobs.filter(job => !job.technician_id));
  }, []);

  // Calendar navigation
  const navigateDate = useCallback((direction) => {
    const amount = viewMode === "day" ? 1 : viewMode === "week" ? 7 : 30;
    setCurrentDate(prev => direction === "next" ? addDays(prev, amount) : subDays(prev, amount));
  }, [viewMode]);

  // Get calendar days for current view
  const getCalendarDays = useCallback(() => {
    if (viewMode === "day") {
      return [currentDate];
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else {
      // Month view implementation would go here
      const start = startOfWeek(currentDate);
      const end = addDays(start, 34); // 5 weeks
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, viewMode]);

  // Get jobs for specific technician and day
  const getJobsForTechnicianAndDay = useCallback((technicianId, day) => {
    return jobs.filter(job => 
      job.technician_id === technicianId && 
      isSameDay(new Date(job.scheduled_time), day)
    );
  }, [jobs]);

  // Status color helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "in_progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "unassigned": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "text-red-600 dark:text-red-400";
      case "high": return "text-orange-600 dark:text-orange-400";
      case "normal": return "text-blue-600 dark:text-blue-400";
      case "low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTechnicianStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "on_job": return "bg-blue-500";
      case "traveling": return "bg-yellow-500";
      case "break": return "bg-orange-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, technicianId, day) => {
    e.preventDefault();
    if (draggedJob) {
      // Update job assignment
      const updatedJobs = jobs.map(job =>
        job.id === draggedJob.id
          ? { ...job, technician_id: technicianId, scheduled_time: startOfDay(day) }
          : job
      );
      setJobs(updatedJobs);
      setUnassignedJobs(prev => prev.filter(job => job.id !== draggedJob.id));
      setDraggedJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Business Header Component */}
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Scheduling Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Scheduling & Dispatch</h1>
              <p className="text-muted-foreground">Manage job scheduling, technician assignments, and field operations</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Route className="w-4 h-4 mr-2" />
                Optimize Routes
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Job
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Jobs</p>
                    <p className="text-2xl font-bold">
                      {jobs.filter(j => isSameDay(new Date(j.scheduled_time), new Date())).length}
                    </p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                    <p className="text-2xl font-bold text-red-600">{unassignedJobs.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {jobs.filter(j => j.status === 'in_progress').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Techs</p>
                    <p className="text-2xl font-bold text-green-600">
                      {technicians.filter(t => t.status === 'available').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-bold text-purple-600">87%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Navigation */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate("prev")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateDate("next")}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold">
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                  >
                    Day
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Calendar Grid */}
              <div className="space-y-4">
                {/* Calendar Header - Days */}
                <div className="grid grid-cols-8 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="p-2">Technician</div>
                  {getCalendarDays().slice(0, 7).map(day => (
                    <div key={day.toISOString()} className="p-2 text-center">
                      <div>{format(day, "EEE")}</div>
                      <div className="text-lg font-semibold text-foreground">
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technician Rows */}
                <div className="space-y-2">
                  {technicians.map(technician => (
                    <div key={technician.id} className="grid grid-cols-8 gap-2">
                      {/* Technician Info */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTechnicianStatusColor(technician.status)}`} />
                          <div>
                            <p className="font-medium">{technician.name}</p>
                            <p className="text-xs text-muted-foreground">{technician.certification_level}</p>
                            <p className="text-xs text-muted-foreground">
                              {technician.skills.slice(0, 2).join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Daily Schedule */}
                      {getCalendarDays().slice(0, 7).map(day => (
                        <div
                          key={`${technician.id}-${day.toISOString()}`}
                          className="min-h-[120px] p-2 border-2 border-dashed border-muted rounded-lg hover:border-muted-foreground/50 transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, technician.id, day)}
                        >
                          <div className="space-y-2">
                            {getJobsForTechnicianAndDay(technician.id, day).map(job => (
                              <div
                                key={job.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, job)}
                                className="p-2 bg-background border rounded cursor-move hover:shadow-md transition-shadow"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowJobModal(true);
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <Badge className={getStatusColor(job.status)} size="sm">
                                    {job.status}
                                  </Badge>
                                  <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                                    {job.priority}
                                  </span>
                                </div>
                                <p className="text-sm font-medium truncate">{job.customer_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{job.service_type}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(job.scheduled_time), "HH:mm")} 
                                    ({Math.round(job.estimated_duration / 60)}h)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Unassigned Jobs & Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Team Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {technicians.map(tech => (
                      <div key={tech.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${getTechnicianStatusColor(tech.status)}`} />
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-xs text-muted-foreground">{tech.certification_level}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{tech.current_location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{tech.shift_start} - {tech.shift_end}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            <span>{tech.skills.slice(0, 2).join(", ")}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {tech.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Unassigned Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Unassigned Jobs
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {unassignedJobs.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unassignedJobs.map(job => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job)}
                      className="p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority} priority
                        </span>
                        <span className="text-xs text-muted-foreground">#{job.id}</span>
                      </div>
                      <p className="font-medium">{job.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{job.service_type}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(job.scheduled_time), "MMM d, HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          <span>{Math.round(job.estimated_duration / 60)}h</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Skills: {job.skills_required?.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {unassignedJobs.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>All jobs assigned!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dispatch Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Dispatch Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Route className="w-4 h-4 mr-2" />
                    Auto-Assign Jobs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapIcon className="w-4 h-4 mr-2" />
                    Route Optimization
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Daily Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Schedule Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
