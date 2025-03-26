import { useState, useEffect } from "react"
import AppointmentsView from "../DoctorDashboard/AppointmentsView"
import axiosInstance from "@/app/axios/instance"
import { Appointment } from "@/app/types/types"

export default function DoctorDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/my_appointments")
        setAppointments(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments. Please try again later.")
      } finally {
        setLoading(false)
        setIsLoaded(true)
      }
    }

    fetchAppointments()
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
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-green-200 mb-4"></div>
                  <div className="h-4 w-48 bg-green-100 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <AppointmentsView appointments={appointments} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
