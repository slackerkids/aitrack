"use client"
import DoctorDashboard from "@/components/DoctorDashboard/DoctorDashboard"
import { useState, useEffect } from "react"

export default function DoctorDashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex">
      <div className="flex-1 ">
      <DoctorDashboard />

      </div>
    </div>
  )
}
