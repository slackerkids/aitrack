"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, MapPin, Search, CalendarIcon, Video, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import axiosInstance from "@/app/axios/instance"
import { Calendar } from "@/components/ui/calendar"

interface Doctor {
  id: number
  name: string
  type: string
  doctor_type?: string
  avatar?: string
  rating?: number
  location?: string
  availability?: string
}

const CreateAppointment = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("")
  const [appointmentType, setAppointmentType] = useState<"online" | "in-person">("online")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
  ]

  const specialties = ["Dermatologist", "Therapist", "Cardiologist", "Neurologist", "Pediatrician"]

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctors")
        setDoctors(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleBackToDoctors = () => {
    setSelectedDoctor(null)
  }

  const handleSubmit = async () => {
    if (!selectedDoctor || !date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor, date, and time slot",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Parse the time slot to create a proper datetime
      const [time, period] = timeSlot.split(" ")
      const [hours, minutes] = time.split(":")
      let hour = Number.parseInt(hours)

      if (period === "PM" && hour !== 12) {
        hour += 12
      } else if (period === "AM" && hour === 12) {
        hour = 0
      }

      const appointmentDate = new Date(date)
      appointmentDate.setHours(hour, Number.parseInt(minutes), 0)

      // End time is 30 minutes after start time
      const endTime = new Date(appointmentDate)
      endTime.setMinutes(endTime.getMinutes() + 30)

      // Format dates in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const seconds = String(date.getSeconds()).padStart(2, "0")
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      }

      const startTime = formatDate(appointmentDate)
      const endTimeFormatted = formatDate(endTime)

      // Send request to create appointment
      await axiosInstance.post("/create_appointment/", {
        start_time: startTime,
        end_time: endTimeFormatted,
        doctor_id: selectedDoctor.id,
        appointment_type: appointmentType,
      })

      toast({
        title: "Success!",
        description: "Appointment created successfully",
      })

      router.push("/client")
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  const openConfirmDialog = () => {
    if (!selectedDoctor || !date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor, date, and time slot",
        variant: "destructive",
      })
      return
    }
    setShowConfirmDialog(true)
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = specialtyFilter && specialtyFilter !== "all" ? doctor.type === specialtyFilter : true
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="h-full bg-gradient-to-b from-green-50 to-white pt-[60px]">
      <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <Button
              variant="ghost"
              className="text-green-700 hover:text-green-800 hover:bg-green-50 mb-4 group transition-all duration-200"
              onClick={() => router.push("/client")}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />{" "}
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
            <p className="text-gray-600">Select a doctor and choose a convenient time for your visit</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-[44%] transform -translate-y-1/2 text-green-500" />
                <Input
                  placeholder="Search doctors..."
                  className="pl-10 border-green-200 focus:border-green-300 focus:ring-green-300 bg-white/80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="border-green-200 focus:ring-green-300 bg-white/80">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-white/80"
                onClick={() => {
                  setSearchQuery("")
                  setSpecialtyFilter("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctors List Section */}
            <Card className="lg:col-span-1 shadow-lg border-0 overflow-hidden h-[550px]">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-6 border-b border-green-100 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Available Doctors</h2>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {filteredDoctors.length} Available
                    </Badge>
                  </div>
                </div>

                {loading ? (
                  <div className="p-6 text-center">Loading doctors...</div>
                ) : (
                  <ul className="flex-1 overflow-y-auto">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <li
                          key={doctor.id}
                          className={`p-2 cursor-pointer transition-all duration-300 ${
                            selectedDoctor?.id === doctor.id
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "hover:bg-green-50/50"
                          }`}
                          onClick={() => handleDoctorClick(doctor)}
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                              <AvatarImage src={doctor.avatar} alt={doctor.name} />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                                {doctor.rating && (
                                  <div className="flex items-center text-amber-500">
                                    <span className="text-sm font-medium">{doctor.rating}</span>
                                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <p className="text-green-600 font-medium mt-1">{doctor.doctor_type}</p>

                              {doctor.location && (
                                <div className="flex items-center mt-2 text-gray-500 text-sm">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{doctor.location}</span>
                                </div>
                              )}

                              {doctor.availability && (
                                <div className="mt-3">
                                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                    {doctor.availability}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-6 text-center text-gray-500">No doctors found matching your criteria</li>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Appointment Details Section */}
            <Card className="lg:col-span-2 shadow-lg border-0 overflow-hidden h-[550px]">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-6 border-b border-green-100 bg-white">
                  <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {!selectedDoctor ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                          <User className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Doctor</h3>
                        <p className="text-gray-500 max-w-md">
                          Please choose a doctor from the list to schedule your appointment
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6">
                        <button
                          onClick={handleBackToDoctors}
                          className="flex items-center text-green-600 hover:text-green-800 transition-colors mb-4"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          <span>Back to doctors</span>
                        </button>

                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm mr-4">
                            <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                            <AvatarFallback className="bg-green-100 text-green-800">
                              {selectedDoctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedDoctor.name}</h2>
                            <p className="text-green-600">{selectedDoctor.doctor_type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Date Selection */}
                        <div>
                          <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                          </Label>
                          <div className="relative border border-green-200 rounded-md p-3 bg-white">
                            <Calendar 
                              mode="single" 
                              selected={date} 
                              onSelect={setDate} 
                              className="rounded-md border"
                            />
                          </div>

                        </div>

                        {/* Time Selection */}
                        <div>
                          <Label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Time
                          </Label>
                          <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                            <SelectTrigger
                              id="time"
                              className="border-green-200 hover:bg-green-50/50 focus:ring-green-200"
                            >
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent className="border-green-200 max-h-[300px]">
                              <div className="p-2 bg-gradient-to-b from-green-50/50 to-white border-b border-green-100">
                                <p className="text-sm font-medium text-gray-700">Available time slots</p>
                              </div>
                              <div className="grid grid-cols-2 gap-1 p-2">
                                {timeSlots.map((slot) => (
                                  <SelectItem
                                    key={slot}
                                    value={slot}
                                    className="rounded-md cursor-pointer hover:bg-green-50 focus:bg-green-50 data-[state=checked]:bg-green-100 data-[state=checked]:text-green-800"
                                  >
                                    {slot}
                                  </SelectItem>
                                ))}
                              </div>
                              <div className="p-2 bg-gradient-to-b from-white to-green-50/50 border-t border-green-100">
                                <p className="text-xs text-gray-500">Each slot is 30 minutes long</p>
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Appointment Type Selection */}
                      <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</Label>
                        <RadioGroup
                          value={appointmentType}
                          onValueChange={(value) => setAppointmentType(value as "online" | "in-person")}
                          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <div
                            className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer border transition ${
                              appointmentType === "online"
                                ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                                : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                            }`}
                            onClick={() => setAppointmentType("online")}
                          >
                            <RadioGroupItem value="online" id="online" className="hidden" />
                            <Label htmlFor="online" className="flex items-center cursor-pointer">
                              <Video className="w-4 h-4 mr-2" />
                              <span>Video Call</span>
                            </Label>
                          </div>

                          <div
                            className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer border transition ${
                              appointmentType === "in-person"
                                ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                                : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                            }`}
                            onClick={() => setAppointmentType("in-person")}
                          >
                            <RadioGroupItem value="in-person" id="in-person" className="hidden" />
                            <Label htmlFor="in-person" className="flex items-center cursor-pointer">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>In-Person Visit</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          disabled={!selectedDoctor || !date || !timeSlot}
                          onClick={openConfirmDialog}
                        >
                          Confirm Appointment
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Appointment</DialogTitle>
            <DialogDescription>Please review your appointment details before confirming.</DialogDescription>
          </DialogHeader>

          {selectedDoctor && date && timeSlot && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {selectedDoctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedDoctor.name}</h3>
                  <p className="text-sm text-green-600">{selectedDoctor.doctor_type}</p>
                  <div className="flex items-center mt-1">
                    <Badge
                      className={cn(
                        "text-xs",
                        appointmentType === "online"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-purple-100 text-purple-700 border-purple-200",
                      )}
                    >
                      {appointmentType === "online" ? (
                        <span className="flex items-center">
                          <Video className="w-3 h-3 mr-1" />
                          Online
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          In-Person
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{format(date, "PPP")}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">{timeSlot}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">
                  {appointmentType === "online"
                    ? "Video consultation (link will be sent via email)"
                    : selectedDoctor.location || "Medical Center"}
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-sm text-green-700">
                  {appointmentType === "online"
                    ? "Please ensure you have a stable internet connection for your video consultation."
                    : "Please arrive 15 minutes before your appointment time."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 sm:w-auto w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateAppointment

