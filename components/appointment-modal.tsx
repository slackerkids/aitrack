"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { format, addDays, addMinutes, setHours, setMinutes, isBefore } from "date-fns"
import { CalendarIcon, Clock, MapPin, Video, Loader2, CheckCircle2 } from "lucide-react"
import axiosInstance from "@/app/axios/instance"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  doctorId: number | string
  doctorName: string
  doctorType: string
  chatId?: number | string
}

export default function AppointmentModal({ isOpen, onClose, doctorId, doctorName, doctorType, chatId }: AppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [appointmentType, setAppointmentType] = useState<string>("online")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meetingLink, setMeetingLink] = useState<string | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDate(addDays(new Date(), 1))
      setTimeSlot("")
      setAppointmentType("online")
      setSuccess(false)
      setError(null)
      setMeetingLink(null)
    }
  }, [isOpen])

  // Generate time slots (9 AM to 5 PM, 30 min intervals)
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSubmit = async () => {
    if (!date || !timeSlot) {
      setError("Please select both date and time")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Parse the selected time
      const [hours, minutes] = timeSlot.split(":").map(Number)

      // Create start and end times
      const startTime = setMinutes(setHours(date, hours), minutes)
      const endTime = addMinutes(startTime, 30)

      // Create the appointment
      const response = await axiosInstance.post("/create_appointment/", {
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        doctor_id: Number.parseInt(doctorId.toString()), // Ensure doctor_id is a number
        appointment_type: appointmentType,
      })

      // Confirm the chat is ready for appointment
      if (chatId) {
        try {
          await axiosInstance.post(`/chat_confirm/${chatId}`)
        } catch (confirmError) {
          console.error("Error confirming chat:", confirmError)
          // Continue with success flow even if confirmation fails
        }
      }

      setSuccess(true)
      if (response.data.meeting_link) {
        setMeetingLink(response.data.meeting_link)
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      setError(error.response?.data?.detail || "Failed to create appointment")
    } finally {
      setIsLoading(false)
    }
  }

  // Disable past dates
  const disabledDays = (date: Date) => {
    return isBefore(date, new Date()) || date.getDay() === 0 || date.getDay() === 6
  }

  // Update the onClose handler to refresh the page
  const handleClose = () => {
    onClose()
    // If appointment was successful, refresh the page to update UI
    if (success) {
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    }
  }

  // Replace all instances of onClose with handleClose in the return JSX
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-[#16a07c] to-[#75eea1] text-white">
          <DialogTitle className="text-xl font-bold">Schedule Appointment</DialogTitle>
          <p className="text-white/90 font-medium">
            {doctorName} • {doctorType}
          </p>
        </DialogHeader>

        {!success ? (
          <div className="p-6">
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-[#16a07c]" />
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disabledDays}
                  className="border rounded-md p-3"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#16a07c]" />
                  Select Time
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Appointment Type</Label>
                <RadioGroup value={appointmentType} onValueChange={setAppointmentType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center cursor-pointer">
                      <Video className="h-4 w-4 mr-2 text-[#16a07c]" />
                      Online
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person" className="flex items-center cursor-pointer">
                      <MapPin className="h-4 w-4 mr-2 text-[#16a07c]" />
                      In-Person
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">{error}</div>
              )}
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#16a07c]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointment Confirmed</h3>
              <p className="text-gray-600 mb-4">
                Your appointment with {doctorName} has been scheduled for{" "}
                {date && timeSlot
                  ? format(
                      setMinutes(
                        setHours(date, Number.parseInt(timeSlot.split(":")[0])),
                        Number.parseInt(timeSlot.split(":")[1]),
                      ),
                      "EEEE, MMMM d, yyyy 'at' h:mm a",
                    )
                  : ""}
              </p>

              {meetingLink && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4 w-full">
                  <p className="text-sm text-blue-800 mb-2 font-medium">Online Meeting Link:</p>
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {meetingLink}
                  </a>
                </div>
              )}

              <Button className="bg-[#16a07c] hover:bg-[#138e6e] text-white" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

