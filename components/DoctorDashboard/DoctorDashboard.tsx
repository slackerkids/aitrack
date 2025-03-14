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
        {/* Sidebar */}
        <DoctorSidebar doctor={doctor} activeTab={activeTab} setActiveTab={setActiveTab} isLoaded={isLoaded} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* <DoctorHeader doctor={doctor} /> */}

          {/* Main Dashboard Content */}
          <div className="p-3">
            {selectedPatientId ? (
              <PatientDetails patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start p-0 bg-transparent border-b border-green-100">
                  <TabsTrigger
                    value="appointments"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
                  >
                    My Appointments
                  </TabsTrigger>
                  <TabsTrigger
                    value="patients"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
                  >
                    My Patients
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="pt-4">
                  <AppointmentsView />
                </TabsContent>

                <TabsContent value="patients" className="pt-4">
                  <PatientsView onSelectPatient={setSelectedPatientId} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

