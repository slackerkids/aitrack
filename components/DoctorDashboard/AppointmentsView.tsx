"use client"

import { useState } from "react"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MapPin,
  MoreVertical,
  FileText,
  MessageSquare,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Updated interface to match the actual API response
interface Doctor {
  id: number
  name: string
  type: string
}

interface Appointment {
  id: number
  start_time: string
  end_time: string
  status: string
  doctor?: Doctor
  patient?: {
    id: number
    name: string
    avatar?: string
  }
  reason?: string
  notes?: string
  type?: "video" | "in-person"
}

interface AppointmentsViewProps {
  appointments?: Appointment[]
}

export default function AppointmentsView({ appointments = [] }: AppointmentsViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Navigate to previous/next day
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  // Get time slots for the day
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 8 // Start at 8 AM
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Process appointments to extract date and time information
  const processedAppointments = appointments.map((appointment) => {
    try {
      // Extract date and time from start_time and end_time
      const startDateTime = new Date(appointment.start_time)
      const endDateTime = new Date(appointment.end_time)

      // Format date as YYYY-MM-DD
      const date = startDateTime.toISOString().split("T")[0]

      // Format times as HH:MM
      const startTime = startDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      const endTime = endDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      return {
        ...appointment,
        date,
        startTime,
        endTime,
        // Default to video if type is not specified
        type: appointment.type || "video",
      }
    } catch (error) {
      console.error("Error processing appointment:", error, appointment)
      return appointment
    }
  })

  // Filter appointments for the current date
  const currentDateStr = currentDate.toISOString().split("T")[0]
  const todayAppointments = processedAppointments.filter((app) => {
    try {
      return app.date === currentDateStr
    } catch (error) {
      console.error("Error filtering appointment:", error, app)
      return false
    }
  })

  // Group appointments by time
  const appointmentsByTime: Record<string, Appointment[]> = {}
  todayAppointments.forEach((app) => {
    if (!app.startTime) return

    const timeKey = app.startTime
    if (!appointmentsByTime[timeKey]) {
      appointmentsByTime[timeKey] = []
    }
    appointmentsByTime[timeKey].push(app)
  })

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <Button
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <div className="flex">
            <Button
              variant="ghost"
              className="p-2 text-green-700 hover:bg-green-50 rounded-l-md"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="p-2 text-green-700 hover:bg-green-50 rounded-r-md"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-green-800">{formatDate(currentDate)}</h2>
        </div>

        <div className="flex items-center gap-2 bg-green-50 rounded-md p-1">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("day")}
            className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white shadow-sm" : ""} text-green-700 text-sm hover:bg-white`}
          >
            Day
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("week")}
            className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white shadow-sm" : ""} text-green-700 text-sm hover:bg-white`}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentView("month")}
            className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white shadow-sm" : ""} text-green-700 text-sm hover:bg-white`}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Day View */}
      {currentView === "day" && (
        <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
              Schedule
            </h3>
            <Badge className="bg-green-600">{todayAppointments.length} Appointments</Badge>
          </div>

          <div className="space-y-4">
            {timeSlots.map((time, index) => {
              const hour = Number.parseInt(time.split(":")[0])
              const appointmentsAtTime = appointmentsByTime[`${hour.toString().padStart(2, "0")}:00`] || []
              const appointmentsAtHalfHour = appointmentsByTime[`${hour.toString().padStart(2, "0")}:30`] || []
              const hasAppointments = appointmentsAtTime.length > 0 || appointmentsAtHalfHour.length > 0

              return (
                <div key={index} className={`p-3 rounded-lg ${hasAppointments ? "bg-green-50" : "bg-gray-50"}`}>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">{time}</span>
                  </div>

                  {/* Appointments at this hour */}
                  {appointmentsAtTime.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="mb-2 border-green-100 hover:bg-green-100/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={appointment.patient?.avatar || "/placeholder.svg?height=40&width=40"}
                                alt={appointment.patient?.name || "Patient"}
                              />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {(appointment.patient?.name || "P")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-green-800">{appointment.patient?.name || "Patient"}</div>
                              <div className="text-xs text-green-600">
                                {appointment.startTime} - {appointment.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                appointment.type === "video"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }
                            >
                              {appointment.type === "video" ? (
                                <Video className="h-3 w-3 mr-1" />
                              ) : (
                                <MapPin className="h-3 w-3 mr-1" />
                              )}
                              {appointment.type === "video" ? "Video" : "In-person"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-red-600">
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Appointment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Appointments at half past this hour */}
                  {appointmentsAtHalfHour.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="mb-2 border-green-100 hover:bg-green-100/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={appointment.patient?.avatar || "/placeholder.svg?height=40&width=40"}
                                alt={appointment.patient?.name || "Patient"}
                              />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {(appointment.patient?.name || "P")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-green-800">{appointment.patient?.name || "Patient"}</div>
                              <div className="text-xs text-green-600">
                                {appointment.startTime} - {appointment.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                appointment.type === "video"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }
                            >
                              {appointment.type === "video" ? (
                                <Video className="h-3 w-3 mr-1" />
                              ) : (
                                <MapPin className="h-3 w-3 mr-1" />
                              )}
                              {appointment.type === "video" ? "Video" : "In-person"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-red-600">
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Appointment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {!hasAppointments && <div className="text-sm text-green-500 italic">No appointments scheduled</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-800">Appointment Details</h3>
              <Button
                variant="ghost"
                className="text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                onClick={() => setSelectedAppointment(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedAppointment.patient?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={selectedAppointment.patient?.name || "Patient"}
                  />
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {(selectedAppointment.patient?.name || "P")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-medium text-green-800">
                    {selectedAppointment.patient?.name || "Patient"}
                  </h4>
                  <p className="text-sm text-green-600">Patient ID: #{selectedAppointment.patient?.id || "N/A"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={
                        selectedAppointment.type === "video"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }
                    >
                      {selectedAppointment.type === "video" ? (
                        <Video className="h-3 w-3 mr-1" />
                      ) : (
                        <MapPin className="h-3 w-3 mr-1" />
                      )}
                      {selectedAppointment.type === "video" ? "Video Call" : "In-person Visit"}
                    </Badge>
                    <div className="text-xs text-green-600">
                      {new Date(selectedAppointment.start_time).toLocaleDateString()} • {selectedAppointment.startTime}{" "}
                      - {selectedAppointment.endTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Reason for Visit</h5>
                  <p className="text-green-700">{selectedAppointment.reason || "Skin irritation and red spots on my back."}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Doctor Information</h5>
                  <div className="space-y-2">
                    <p className="text-green-700">
                      <span className="font-medium">Name:</span> {selectedAppointment.doctor?.name || "Berdyshev Kerey"}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Specialty:</span>{" "}
                      {selectedAppointment.doctor?.type || "Dermatologist"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">AI Recommendations</h5>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    Wash with fragrance-free soap and avoid excessive sweating.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    If your skin is dry or irritated, using a hypoallergenic moisturizer might help.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    Try switching to a mild, fragrance-free detergent and wearing loose, breathable clothing.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    An over-the-counter hydrocortisone cream or calamine lotion might help with the itchiness.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Doctor's Notes</h5>
                <textarea
                  className="w-full p-3 rounded-md border border-green-200 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                  placeholder="Add your notes here..."
                  defaultValue={selectedAppointment.notes || ""}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                className="text-green-700 border-green-200 hover:bg-green-50"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Week View Placeholder */}
      {currentView === "week" && (
        <div className="text-center py-8 bg-white rounded-lg border border-green-100">
          <CalendarIcon className="h-12 w-12 text-green-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-1">Week View</h3>
          <p className="text-green-600">Weekly schedule view is under development</p>
        </div>
      )}

      {/* Month View Placeholder */}
      {currentView === "month" && (
        <div className="text-center py-8 bg-white rounded-lg border border-green-100">
          <CalendarIcon className="h-12 w-12 text-green-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-1">Month View</h3>
          <p className="text-green-600">Monthly calendar view is under development</p>
        </div>
      )}
    </div>
  )
}

