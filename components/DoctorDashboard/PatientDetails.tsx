"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Heart,
  Activity,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  Pill,
  Clipboard,
  LineChart,
  AlertTriangle,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  CornerDownLeft,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosInstance from "@/app/axios/instance"

interface PatientDetailsProps {
  patientId: number
  onBack: () => void
}

interface Appointment {
  id: number
  start_time: string
  end_time: string
  appointment_type: string
  status: string
  meeting_link: string
}

interface Conversation {
  id: number
  request_id: number
  created_at: string
  confirmed: boolean
  chat_title: string
  symptoms: string
  chat_history: {
    role: string
    text: string
  }[]
}

interface Request {
  id: number
  date: string
  symptoms: string
  response: string
  status: boolean
  chat_title: string
}

interface Patient {
  id: number
  name: string
  email: string
  role: string
  personal_info: {
    gender: string
    dateOfBirth: string
    age: number | null
    phone: string
    address: string
  }
  medical_info: {
    condition: string
    riskLevel: string
    lastVisit: string | null
    bloodType: string
  }
  requests: Request[]
  appointments: Appointment[]
  conversations: Conversation[]
  avatar?: string
  age?: number
  gender?: string
  dateOfBirth?: string
  phone?: string
  address?: string
  riskLevel?: string
}

export default function PatientDetails({ patientId, onBack }: PatientDetailsProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [isConversationDropdownOpen, setIsConversationDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/patient_info/${patientId}`)
        
        // Process the data to match our component structure
        const patientData = response.data
        
        // Add convenience properties at the top level
        patientData.gender = patientData.personal_info.gender
        patientData.age = patientData.personal_info.age || 
          calculateAge(patientData.personal_info.dateOfBirth)
        patientData.dateOfBirth = patientData.personal_info.dateOfBirth
        patientData.phone = patientData.personal_info.phone
        patientData.address = patientData.personal_info.address
        patientData.riskLevel = patientData.medical_info.riskLevel
        
        setPatient(patientData)
      } catch (error) {
        console.error("Error fetching patient details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientDetails()
  }, [patientId])

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age
    }
    
    return age
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get the selected conversation
  const selectedConversation = patient?.conversations?.find(
    (conversation) => conversation.id === selectedConversationId
  )

  // Set the first conversation as selected by default when conversations are loaded
  useEffect(() => {
    if (patient?.conversations && patient.conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(patient.conversations[0].id)
    }
  }, [patient?.conversations, selectedConversationId])

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
      </div>
    )
  }

  if (!patient) {
    return <div className="p-8">Patient not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header and back button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-green-700 border-green-200" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
        <div className="text-sm text-green-600">Patient ID: {patient.id}</div>
      </div>

      {/* Patient Bio */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <div className="text-xl font-semibold text-green-800">{patient.name}</div>
              <div className="text-green-600">
                {patient.age} years • {patient.gender}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={
                    patient.riskLevel?.toLowerCase() === "low"
                      ? "bg-green-100 text-green-800"
                      : patient.riskLevel?.toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {patient.riskLevel}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-green-600 mb-1">Date of Birth</div>
              <div className="font-medium text-green-800">{formatDate(patient.dateOfBirth || '')}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Phone</div>
              <div className="font-medium text-green-800">{patient.phone}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Email</div>
              <div className="font-medium text-green-800">{patient.email}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Address</div>
              <div className="font-medium text-green-800">{patient.address}</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-green-100 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger
            value="conversations"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
          >
            Conversations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-100">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-green-800 text-lg">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-green-600 mb-1">Condition</div>
                    <div className="font-medium text-green-800">{patient.medical_info.condition || "None specified"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600 mb-1">Blood Type</div>
                    <div className="font-medium text-green-800">{patient.medical_info.bloodType || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600 mb-1">Last Visit</div>
                    <div className="font-medium text-green-800">
                      {patient.medical_info.lastVisit ? formatDate(patient.medical_info.lastVisit) : "No visits recorded"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-green-800 text-lg">Recent Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {patient.requests && patient.requests.length > 0 ? (
                  <div className="space-y-3">
                    {patient.requests.map((request) => (
                      <div key={request.id} className="bg-green-50 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-green-800">{request.chat_title}</div>
                          <Badge className="bg-green-100 text-green-800">
                            {request.status ? "Answered" : "Pending"}
                          </Badge>
                        </div>
                        <div className="text-xs text-green-700">{formatDate(request.date)}</div>
                        <div className="text-sm text-green-700 mt-2">{request.symptoms}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-green-600">No recent requests</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-green-800 text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {patient.appointments && patient.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {patient.appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="bg-green-50 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-green-700 mr-2" />
                            <div className="text-sm font-medium text-green-800">{formatDate(appointment.start_time)}</div>
                          </div>
                          <Badge className={`${appointment.appointment_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {appointment.appointment_type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-green-700">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-green-600">No upcoming appointments</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6">
          <Card className="border-green-100">
            <CardHeader className="pb-2 border-b border-green-100">
              <CardTitle className="text-green-800">Appointment History</CardTitle>
              <CardDescription>All scheduled appointments for this patient</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {patient.appointments && patient.appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{formatDate(appointment.start_time)}</TableCell>
                        <TableCell>
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${appointment.appointment_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {appointment.appointment_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' : appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {appointment.appointment_type === 'online' && (
                              <Button variant="outline" size="sm" className="h-8 text-blue-700 border-blue-200 hover:bg-blue-50">
                                Join Meeting
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 text-green-700 hover:bg-green-50">
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-green-600">No appointments found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-6">
          <Card className="border-green-100">
            <CardHeader className="pb-2 border-b border-green-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-800">Conversation History</CardTitle>
                
                {/* Conversation selector dropdown */}
                {patient && patient.conversations && Array.isArray(patient.conversations) && patient.conversations.length > 0 && (
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1 border-green-200 text-green-700"
                      onClick={() => setIsConversationDropdownOpen(!isConversationDropdownOpen)}
                    >
                      Select Conversation
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {isConversationDropdownOpen && patient && patient.conversations && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-green-100 rounded-md shadow-md z-10 w-64">
                        {patient.conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            className={`w-full px-4 py-2 text-left hover:bg-green-50 flex items-center justify-between ${
                              selectedConversationId === conversation.id ? "bg-green-50 text-green-800" : "text-green-700"
                            }`}
                            onClick={() => {
                              setSelectedConversationId(conversation.id)
                              setIsConversationDropdownOpen(false)
                            }}
                          >
                            <div className="truncate">{conversation.chat_title}</div>
                            {selectedConversationId === conversation.id && (
                              <CornerDownLeft className="h-4 w-4 ml-2 text-green-700" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <CardDescription>Chat history with this patient</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {patient?.conversations && patient.conversations.length > 0 ? (
                <div className="space-y-6">
                  {selectedConversation ? (
                    <div key={selectedConversation.id} className="border border-green-100 rounded-lg overflow-hidden">
                      <div className="bg-green-50 p-4 border-b border-green-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-700" />
                            <h3 className="font-medium text-green-800">{selectedConversation.chat_title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-green-700">{formatDate(selectedConversation.created_at)}</div>
                            <Badge className="bg-green-100 text-green-800">
                              {selectedConversation.confirmed ? "Confirmed" : "Open"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-green-700">
                          <span className="font-medium">Initial symptoms:</span> {selectedConversation.symptoms}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {selectedConversation.chat_history.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.role === "user"
                                    ? "bg-green-100 text-green-800"
                                    : message.role === "bot"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {message.text.includes("END_OF_CONSULTATION_MARKER") ? (
                                  <div>
                                    {message.text.replace("END_OF_CONSULTATION_MARKER", "")}
                                    <Badge className="ml-2 bg-yellow-100 text-yellow-800">Consultation Ended</Badge>
                                  </div>
                                ) : (
                                  message.text
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-green-600">
                      Select a conversation to view
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-green-600">No conversations found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

