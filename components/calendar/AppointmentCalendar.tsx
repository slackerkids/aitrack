"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Doctor } from "./types"

interface AppointmentCalendarProps {
  doctor: Doctor
  weekDates: Date[]
  weekDays: string[]
  selectedSlot: { date: Date; startTime: string; endTime: string } | null
  setSelectedSlot: (slot: { date: Date; startTime: string; endTime: string } | null) => void
  setShowAppointmentModal: (show: boolean) => void
}

export default function AppointmentCalendar({
  doctor,
  weekDates,
  weekDays,
  selectedSlot,
  setSelectedSlot,
  setShowAppointmentModal,
}: AppointmentCalendarProps) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-md border border-green-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-green-100 text-green-800">
              {doctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-green-800">{doctor.name}</h3>
            <p className="text-sm text-green-600">{doctor.specialization}</p>
          </div>
        </div>
      </div>

      <h4 className="font-medium text-green-800 mb-3">Available Time Slots</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {weekDates.map((date, dayIndex) => {
          const doctorAvailability = doctor.availability.find((a) => a.day === dayIndex + 1)
          const slots = doctorAvailability?.slots || []

          return (
            <div key={dayIndex} className="bg-green-50 rounded-lg p-3">
              <div className="text-center mb-2">
                <div className="text-xs text-green-600">{weekDays[dayIndex]}</div>
                <div className="text-sm font-medium text-green-800">{date.getDate()}</div>
              </div>

              {slots.length > 0 ? (
                <div className="space-y-2">
                  {slots.map((slot, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={`w-full text-xs py-1 px-2 ${
                        selectedSlot &&
                        selectedSlot.date.getDate() === date.getDate() &&
                        selectedSlot.startTime === slot.startTime
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-white text-green-700 hover:bg-green-100"
                      }`}
                      onClick={() => {
                        setSelectedSlot({
                          date: new Date(date),
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        })
                        setShowAppointmentModal(true)
                      }}
                    >
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-center text-green-500 py-2">No availability</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

