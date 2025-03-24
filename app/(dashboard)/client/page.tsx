"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  User,
  Home,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Heart,
  Pill,
  Droplet,
  Plus,
  ArrowUpRight,
  Leaf,
  Video,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/app/axios/instance"

interface Doctor {
  id: number;
  name: string;
  type: string;
}

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  doctor: Doctor;
  status: "upcoming" | "past";
  appointment_type?: "online" | "in-person";
  meeting_link?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  condition: string;
  riskLevel: string;
  bloodType: string;
  lastVisit: string | null;
}

interface DashboardContentProps {
  userData: UserData;
}

const PatientDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/me")
        console.log(response)
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardContent userData={userData!} />
      case "appointments":
        return <div className="p-6">Appointments content would load here</div>
      case "messages":
        return <div className="p-6">Messages content would load here</div>
      case "records":
        return <div className="p-6">Medical Records content would load here</div>
      case "analysis":
        return <div className="p-6">Blood Analysis content would load here</div>
      default:
        return <DashboardContent userData={userData!} />
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>
  }

  if (!userData) {
    return <div className="h-full flex items-center justify-center">Error loading user data</div>
  }

  return (
    <div className="h-full flex flex-col bg-green-50/50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{renderContent()}</div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 z-10">
        <div className="grid grid-cols-5">
          <MobileNavItem
            icon={<Home />}
            label="Home"
            isActive={activeNav === "dashboard"}
            onClick={() => setActiveNav("dashboard")}
          />
          <MobileNavItem
            icon={<Calendar />}
            label="Appointments"
            isActive={activeNav === "appointments"}
            onClick={() => setActiveNav("appointments")}
          />
          <MobileNavItem
            icon={<MessageSquare />}
            label="Messages"
            isActive={activeNav === "messages"}
            onClick={() => setActiveNav("messages")}
            badge="3"
          />
          <MobileNavItem
            icon={<FileText />}
            label="Records"
            isActive={activeNav === "records"}
            onClick={() => setActiveNav("records")}
          />
          <MobileNavItem
            icon={<User />}
            label="Profile"
            isActive={activeNav === "profile"}
            onClick={() => setActiveNav("profile")}
          />
        </div>
      </div>
    </div>
  )
}

// Dashboard Content Component
const DashboardContent: React.FC<DashboardContentProps> = ({ userData }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<string>("dashboard");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/my_appointments");
        // Sort appointments by start time (earliest first)
        const sortedAppointments = [...response.data].sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Find the next upcoming appointment
  const nextAppointment = appointments.find(app => app.status === "upcoming");

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center b pt-[60px]">
        <div className="pb-4 ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {userData.name}</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your health</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.location.href = "/client/appointment"}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          icon={<Heart className="h-5 w-5 text-red-500" />}
          title="Blood Type"
          value={userData.bloodType || "Not specified"}
          bgColor="bg-red-50"
        />
        <QuickStatCard
          icon={<Activity className="h-5 w-5 text-green-500" />}
          title="Risk Level"
          value={userData.riskLevel === "No" ? "No Risk" : userData.riskLevel}
          bgColor="bg-green-50"
        />
        <QuickStatCard
          icon={<Droplet className="h-5 w-5 text-green-600" />}
          title="Last Visit"
          value={userData.lastVisit ? new Date(userData.lastVisit).toLocaleDateString() : "No visits yet"}
          bgColor="bg-green-50"
        />
        <QuickStatCard
          icon={<Pill className="h-5 w-5 text-green-500" />}
          title="Condition"
          value={userData.condition || "No conditions"}
          bgColor="bg-green-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Appointment */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {nextAppointment.doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{nextAppointment.doctor.name}</h3>
                    <p className="text-sm text-green-600">{nextAppointment.doctor.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(nextAppointment.start_time).toLocaleDateString()}
                    </p>
                    <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(nextAppointment.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </CardContent>
            {nextAppointment && (
              <CardFooter className="border-t border-green-100 pt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  Reschedule
                </Button>
                
                {nextAppointment.appointment_type === "online" && nextAppointment.meeting_link ? (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(nextAppointment.meeting_link, "_blank")}
                  >
                    Join Video Call
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700 text-white">View Details</Button>
                )}
              </CardFooter>
            )}
          </Card>

          {/* Tabs for Appointments */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-50/70">
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
              >
                Upcoming Appointments
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
              >
                Past Appointments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {appointments
                      .filter(app => app.status === "upcoming")
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center p-3 rounded-lg hover:bg-green-50">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-green-100 text-green-800">
                              {appointment.doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{appointment.doctor.name}</h4>
                            <p className="text-xs text-gray-500">
                              {appointment.doctor.type}
                              {appointment.appointment_type && (
                                <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                                  {appointment.appointment_type}
                                </Badge>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(appointment.start_time).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {appointment.appointment_type === "online" && appointment.meeting_link ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(appointment.meeting_link, "_blank");
                              }}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                          )}
                        </div>
                      ))}
                    {appointments.filter(app => app.status === "upcoming").length === 0 && (
                      <p className="text-center text-gray-500">No upcoming appointments</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="past">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {appointments
                      .filter(app => app.status === "past")
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center p-3 rounded-lg hover:bg-green-50">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-green-100 text-green-800">
                              {appointment.doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{appointment.doctor.name}</h4>
                            <p className="text-xs text-gray-500">{appointment.doctor.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(appointment.start_time).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                        </div>
                      ))}
                    {appointments.filter(app => app.status === "past").length === 0 && (
                      <p className="text-center text-gray-500">No past appointments</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Patient Profile Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">{userData.name}</h3>
                <p className="text-gray-500 mb-4">Patient ID: {userData.id}</p>
                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-medium">{userData.gender}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-medium">{new Date(userData.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                <div className="w-full p-2 bg-green-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transcription Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                Latest Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-4">
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription Overview</h4>
                  <p className="text-sm text-gray-600">
                    Patient presents with recurring headaches for the past two weeks, primarily in the frontal region. 
                    Pain described as throbbing (7/10). No nausea or visual disturbances reported.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-green-600 mb-2">Doctor's Assessment</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium">Tension headache, possibly migraine</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 font-medium">Recommended Plan:</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 pl-1">
                        <li>Complete neurological examination</li>
                        <li>Consider prescription-strength analgesics</li>
                        <li>Stress reduction techniques</li>
                        <li>Follow-up in two weeks if symptoms persist</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">May 15, 2024</span>
                  <Button variant="link" className="p-0 h-auto text-green-600">
                    View Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Navigation Item Component
interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  badge?: string
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
  return (
    <button
      className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
        isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-green-50/50"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <Badge className="bg-green-100 text-green-700 border-green-200">{badge}</Badge>}
    </button>
  )
}

// Mobile Navigation Item Component
const MobileNavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center py-2 text-xs ${
        isActive ? "text-green-600" : "text-gray-500"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="mt-1">{label}</span>
    </button>
  )
}

// Quick Stat Card Component
interface QuickStatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  trend?: string
  bgColor: string
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ icon, title, value, trend, bgColor }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-full ${bgColor}`}>{icon}</div>
          {trend && (
            <Badge
              className={
                trend === "normal"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-amber-100 text-amber-700 border-amber-200"
              }
            >
              {trend}
            </Badge>
          )}
        </div>
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default PatientDashboard

