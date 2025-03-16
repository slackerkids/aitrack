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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/app/axios/instance"

interface UserData {
  id: number
  name: string
  email: string
  role: string
  gender: string
  dateOfBirth: string
  phone: string
  address: string
  condition: string
  riskLevel: string
  bloodType: string
  lastVisit: string | null
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
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Error loading user data</div>
  }

  return (
    <div className="flex h-screen bg-green-50/50">
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
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
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
          <Button className="bg-green-600 hover:bg-green-700 text-white">
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
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{userData.name}</h3>
                  <p className="text-sm text-green-600">{userData.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{userData.date}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                    <Clock className="w-3 h-3 mr-1" />
                    30 min
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-green-100 pt-4 flex justify-between">
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
              >
                Reschedule
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Join Video Call</Button>
            </CardFooter>
          </Card>

          {/* Tabs for Appointments and Tests */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-50/70">
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
              >
                Upcoming Appointments
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
              >
                Recent Tests
              </TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {userData.upcomingAppointments?.map((appointment, index) => (
                      <div key={index} className="flex items-center p-3 rounded-lg hover:bg-green-50">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={appointment.avatar} alt={appointment.doctor} />
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {appointment.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{appointment.doctor}</h4>
                          <p className="text-xs text-gray-500">{appointment.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.date}</p>
                          <p className="text-xs text-gray-500">{appointment.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                    )) || <p>No upcoming appointments</p>}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-green-100 pt-4">
                  <Button variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="tests">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {userData.recentTests?.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${test.result === "Normal" ? "bg-green-100" : "bg-amber-100"}`}
                          >
                            <FileText
                              className={`h-5 w-5 ${test.result === "Normal" ? "text-green-600" : "text-amber-600"}`}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium">{test.name}</h4>
                            <p className="text-xs text-gray-500">{test.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className={`mr-3 ${
                              test.result === "Normal"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }`}
                          >
                            {test.result}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-700 hover:text-green-800 hover:bg-green-50"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) || <p>No recent tests</p>}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-green-100 pt-4">
                  <Button variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">
                    View All Test Results
                  </Button>
                </CardFooter>
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
                  <AvatarImage src={userData.avatar} alt={userData.name} />
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

          {/* Medications Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.medications?.map((medication, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{medication.name}</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">{medication.dosage}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{medication.frequency}</p>
                    <p className="text-xs text-gray-500">{medication.time}</p>
                  </div>
                )) || <p>No current medications</p>}
              </div>
            </CardContent>
            <CardFooter className="border-t border-green-100 pt-4">
              <Button variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">
                Medication History
              </Button>
            </CardFooter>
          </Card>

          {/* Health Tips Card */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle>Health Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Stay Active</h4>
                    <p className="text-xs text-gray-600">Aim for at least 30 minutes of moderate activity daily.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Take Medications</h4>
                    <p className="text-xs text-gray-600">Remember to take your medications as prescribed.</p>
                  </div>
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

