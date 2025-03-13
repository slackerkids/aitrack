"use client"

import { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Doctor, Appointment } from "./types"
import DoctorList from "./DoctorList"
import AppointmentCalendar from "./AppointmentCalendar"
import MiniCalendar from "./MiniCalendar"
import UpcomingAppointments from "./UpcomingAppointments"
import AppointmentModal from "./AppointmentModal"
import AppointmentsTab from "./AppointmentsTab"

export default function AppointmentsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentView, setCurrentView] = useState("week")
  const [currentMonth, setCurrentMonth] = useState("March 2025")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; startTime: string; endTime: string } | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  // Add a new state for tracking appointment type
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("video")

  // Sample doctors data
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      avatar: "/placeholder.svg?height=80&width=80",
      availability: [
        {
          day: 1,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "10:00", endTime: "10:30" },
            { startTime: "11:00", endTime: "11:30" },
          ],
        },
        {
          day: 2,
          slots: [
            { startTime: "13:00", endTime: "13:30" },
            { startTime: "14:00", endTime: "14:30" },
          ],
        },
        {
          day: 4,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "10:00", endTime: "10:30" },
          ],
        },
      ],
      rating: 4.8,
      experience: 12,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Dermatologist",
      avatar: "/placeholder.svg?height=80&width=80",
      availability: [
        {
          day: 1,
          slots: [
            { startTime: "14:00", endTime: "14:30" },
            { startTime: "15:00", endTime: "15:30" },
          ],
        },
        {
          day: 3,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "10:00", endTime: "10:30" },
            { startTime: "11:00", endTime: "11:30" },
          ],
        },
        {
          day: 5,
          slots: [
            { startTime: "13:00", endTime: "13:30" },
            { startTime: "14:00", endTime: "14:30" },
          ],
        },
      ],
      rating: 4.9,
      experience: 8,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Neurologist",
      avatar: "/placeholder.svg?height=80&width=80",
      availability: [
        {
          day: 2,
          slots: [
            { startTime: "09:00", endTime: "09:30" },
            { startTime: "10:00", endTime: "10:30" },
          ],
        },
        {
          day: 4,
          slots: [
            { startTime: "13:00", endTime: "13:30" },
            { startTime: "14:00", endTime: "14:30" },
            { startTime: "15:00", endTime: "15:30" },
          ],
        },
      ],
      rating: 4.7,
      experience: 10,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Psychiatrist",
      avatar: "/placeholder.svg?height=80&width=80",
      availability: [
        {
          day: 1,
          slots: [
            { startTime: "11:00", endTime: "11:30" },
            { startTime: "12:00", endTime: "12:30" },
          ],
        },
        {
          day: 3,
          slots: [
            { startTime: "14:00", endTime: "14:30" },
            { startTime: "15:00", endTime: "15:30" },
          ],
        },
        {
          day: 5,
          slots: [
            { startTime: "10:00", endTime: "10:30" },
            { startTime: "11:00", endTime: "11:30" },
          ],
        },
      ],
      rating: 4.6,
      experience: 15,
    },
  ]

  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctorId: 1,
      patientName: "John Smith",
      date: "2025-03-05",
      startTime: "09:00",
      endTime: "09:30",
      status: "upcoming",
      type: "video",
    },
    {
      id: 2,
      doctorId: 3,
      patientName: "John Smith",
      date: "2025-03-07",
      startTime: "14:00",
      endTime: "14:30",
      status: "upcoming",
      type: "in-person",
    },
    {
      id: 3,
      doctorId: 2,
      patientName: "John Smith",
      date: "2025-02-28",
      startTime: "10:00",
      endTime: "10:30",
      status: "completed",
      type: "video",
    },
  ])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "upcoming") return appointment.status === "upcoming"
    if (activeTab === "completed") return appointment.status === "completed"
    if (activeTab === "cancelled") return appointment.status === "cancelled"
    return true
  })

  // Week days and dates
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const getWeekDates = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day

    return Array(7)
      .fill(0)
      .map((_, i) => {
        const newDate = new Date(date)
        newDate.setDate(diff + i)
        return newDate
      })
  }

  const weekDates = getWeekDates(currentDate)

  // Sample calendar for mini calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonthIndex = today.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonthIndex)

  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // Update the handleBookAppointment function to use the selected appointment type
  const handleBookAppointment = () => {
    if (selectedDoctor && selectedSlot) {
      // Format the date to YYYY-MM-DD
      const formattedDate = selectedSlot.date.toISOString().split("T")[0]

      // Create new appointment
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        doctorId: selectedDoctor.id,
        patientName: "John Smith", // This would come from user context in a real app
        date: formattedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: "upcoming",
        type: appointmentType,
      }

      // Add to appointments
      setAppointments([...appointments, newAppointment])

      // Close modal
      setShowAppointmentModal(false)
      setSelectedSlot(null)
    }
  }

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: "cancelled" } : appointment,
      ),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Main Content */}
      <main className="relative w-full flex">
        {/* Sidebar */}
        <div
          className={`w-64 h-[calc(100vh-0rem)] bg-white/80 backdrop-blur-lg p-4 shadow-lg border-r border-green-100 opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col`}
          style={{ animationDelay: "0.4s" }}
        >
          <Button className="mb-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-white w-full hover:from-green-600 hover:to-emerald-700">
            <Plus className="h-5 w-5" />
            <span>New Appointment</span>
          </Button>

          {/* Mini Calendar */}
          <MiniCalendar currentMonth={currentMonth} miniCalendarDays={miniCalendarDays} />

          {/* Upcoming Appointments */}
          <UpcomingAppointments appointments={appointments} doctors={doctors} formatDate={formatDate} />
        </div>

        {/* Main Calendar View */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-green-100">
            <div className="flex items-center gap-4">
              <Button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700">Today</Button>
              <div className="flex">
                <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-l-md">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-r-md">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold text-green-800">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
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

          {/* Tabs for Doctors and Appointments */}
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="w-full justify-start p-0 bg-transparent border-b border-green-100">
              <TabsTrigger
                value="doctors"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
              >
                Find Doctors
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
              >
                My Appointments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="p-4">
              <DoctorList
                onSelectDoctor={setSelectedDoctor}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredDoctors={filteredDoctors}
              />

              {selectedDoctor && (
                <AppointmentCalendar
                  doctor={selectedDoctor}
                  weekDates={weekDates}
                  weekDays={weekDays}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  setShowAppointmentModal={setShowAppointmentModal}
                />
              )}
            </TabsContent>

            <TabsContent value="appointments" className="p-4">
              <AppointmentsTab
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                filteredAppointments={filteredAppointments}
                doctors={doctors}
                formatDate={formatDate}
                handleCancelAppointment={handleCancelAppointment}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Appointment Booking Modal */}
      <AnimatePresence>
        {showAppointmentModal && selectedDoctor && selectedSlot && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AppointmentModal
              selectedDoctor={selectedDoctor}
              selectedSlot={selectedSlot}
              setShowAppointmentModal={setShowAppointmentModal}
              handleBookAppointment={handleBookAppointment}
              appointmentType={appointmentType}
              setAppointmentType={setAppointmentType}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

