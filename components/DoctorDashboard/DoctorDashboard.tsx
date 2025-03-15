"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DoctorSidebar from "../DoctorDashboard/DoctorSidebar"
import AppointmentsView from "../DoctorDashboard/AppointmentsView"
import PatientsView from "../DoctorDashboard/PatientsView"
import PatientDetails from "../DoctorDashboard/PatientDetails"

export default function DoctorDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)

  const doctor = {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    avatar: "/placeholder.svg?height=120&width=120",
    hospital: "MediConnect General Hospital",
    experience: 12,
    patients: 248,
    rating: 4.8,
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Main Content */}
      <main className="relative w-full flex">
        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
        <div className="p-6">
          <AppointmentsView />
        </div>
        </div>
      </main>
    </div>
  )
}

