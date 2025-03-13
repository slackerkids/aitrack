"use client"

import { Video, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Appointment, Doctor } from "./types"

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
  doctors: Doctor[]
  formatDate: (dateString: string) => string
}

export default function UpcomingAppointments({ appointments, doctors, formatDate }: UpcomingAppointmentsProps) {
  return (
    <div className="mt-6 flex-grow">
      <h3 className="text-green-800 text-lg font-medium mb-3">Upcoming Appointments</h3>
      <div className="space-y-2">
        {appointments
          .filter((app) => app.status === "upcoming")
          .slice(0, 3)
          .map((appointment, i) => {
            const doctor = doctors.find((d) => d.id === appointment.doctorId)
            return (
              <div
                key={i}
                className="p-3 bg-white rounded-lg border border-green-100 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Video className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{doctor?.name}</span>
                </div>
                <div className="text-xs text-green-600 ml-6">
                  {formatDate(appointment.date)} • {appointment.startTime} - {appointment.endTime}
                </div>
              </div>
            )
          })}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  )
}

