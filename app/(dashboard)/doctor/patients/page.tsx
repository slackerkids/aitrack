"use client"
import DoctorDashboard from "@/components/DoctorDashboard/DoctorDashboard"
import { useState, useEffect } from "react"
import PatientsView from "@/components/DoctorDashboard/PatientsView"

export default function DoctorDashboardPage() {
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
    <div className="flex">
      <div className="flex-1 ">
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Main Content */}
      <main className="relative w-full flex">
          {/* Main Content Area */}
          <div
            className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
            style={{ animationDelay: "0.6s" }}
          >
          <div className="p-6">
            <PatientsView />
          </div>
          </div>
        </main>
      </div>
      </div>
    </div>
  )
}
