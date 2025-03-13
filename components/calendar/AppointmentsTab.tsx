"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Appointment, Doctor } from "./types"

interface AppointmentsTabProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  filteredAppointments: Appointment[]
  doctors: Doctor[]
  formatDate: (dateString: string) => string
  handleCancelAppointment: (appointmentId: number) => void
}

export default function AppointmentsTab({
  activeTab,
  setActiveTab,
  filteredAppointments,
  doctors,
  formatDate,
  handleCancelAppointment,
}: AppointmentsTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          className={activeTab === "upcoming" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === "completed" ? "default" : "outline"}
          className={activeTab === "completed" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </Button>
        <Button
          variant={activeTab === "cancelled" ? "default" : "outline"}
          className={activeTab === "cancelled" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => {
            const doctor = doctors.find((d) => d.id === appointment.doctorId)
            return (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {doctor?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-green-800">{doctor?.name}</div>
                    <div className="text-sm text-green-600">{doctor?.specialization}</div>
                    <div className="text-xs text-green-500">
                      {formatDate(appointment.date)} • {appointment.startTime} - {appointment.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`
                    ${appointment.type === "video" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}
                  `}
                  >
                    {appointment.type === "video" ? "Video Call" : "In-person"}
                  </Badge>
                  {appointment.status === "upcoming" && (
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-green-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-1">No appointments found</h3>
          <p className="text-green-600">You don't have any {activeTab} appointments.</p>
        </div>
      )}
    </div>
  )
}

