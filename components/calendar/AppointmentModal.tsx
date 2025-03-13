"use client"

import { motion } from "framer-motion"
import { X, Video, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Doctor } from "./types"

interface AppointmentModalProps {
  selectedDoctor: Doctor
  selectedSlot: { date: Date; startTime: string; endTime: string }
  setShowAppointmentModal: (show: boolean) => void
  handleBookAppointment: () => void
  appointmentType: "video" | "in-person"
  setAppointmentType: (type: "video" | "in-person") => void
}

export default function AppointmentModal({
  selectedDoctor,
  selectedSlot,
  setShowAppointmentModal,
  handleBookAppointment,
  appointmentType,
  setAppointmentType,
}: AppointmentModalProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-green-800">Confirm Appointment</h3>
        <Button
          variant="ghost"
          className="text-green-700 hover:bg-green-50 h-8 w-8 p-0"
          onClick={() => setShowAppointmentModal(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
            <AvatarFallback className="bg-green-100 text-green-800">
              {selectedDoctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-green-800">{selectedDoctor.name}</h4>
            <p className="text-sm text-green-600">{selectedDoctor.specialization}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Date</div>
            <div className="font-medium text-green-800">
              {selectedSlot.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Time</div>
            <div className="font-medium text-green-800">
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </div>
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Appointment Type</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`flex-1 ${
                appointmentType === "video"
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
              onClick={() => setAppointmentType("video")}
            >
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${
                appointmentType === "in-person"
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
              onClick={() => setAppointmentType("in-person")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              In-person
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
          onClick={() => setShowAppointmentModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          onClick={handleBookAppointment}
        >
          Confirm Booking
        </Button>
      </div>
    </motion.div>
  )
}

