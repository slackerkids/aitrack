"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import axiosInstance from "@/app/axios/instance"
import { Calendar, Users, FileText, MessageSquare, Settings, HelpCircle, LogOut, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DoctorSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axiosInstance.get("/me")
      .then((response) => {
        setDoctor(response.data)
      })
      .catch((err) => {
        console.error("Error fetching doctor data:", err)
        setError("Failed to load data")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  const navItems = [
    { name: "Appointments", icon: Calendar, path: "/doctor/appointments", badge: 3 },
    { name: "Patients", icon: Users, path: "/doctor/patients" },
    { name: "Medical Records", icon: FileText, path: "/doctor/records" },
    { name: "Analysis", icon: BarChart, path: "/doctor/analysis"},
    { name: "Messages", icon: MessageSquare, path: "/doctor/messages", badge: 5 },
  ]

  if (loading) {
    return <div className="w-64 h-screen flex items-center justify-center text-green-800">Loading...</div>
  }

  if (error) {
    return <div className="w-64 h-screen flex items-center justify-center text-red-600">{error}</div>
  }

  return (
    <div className="w-64 h-screen bg-white backdrop-blur-lg p-4 shadow-lg border-r border-green-100 flex flex-col">
      {/* Doctor Profile */}
      <div className="flex flex-col items-center mb-6 pt-4">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={doctor?.avatar || ""} alt={doctor?.name} />
          <AvatarFallback className="bg-green-100 text-green-800 text-xl">
            {doctor?.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold text-green-800">{doctor?.name}</h2>
        <p className="text-sm text-green-600 mb-2">{doctor?.doctor_type}</p>
        <p className="text-xs text-green-500">{doctor?.hospital || "Unknown Hospital"}</p>

        <div className="flex gap-3 mt-3 w-full">
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor?.experience}</div>
            <div className="text-xs text-green-600">Years</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor?.patient_count}</div>
            <div className="text-xs text-green-600">Patients</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor?.rating}</div>
            <div className="text-xs text-green-600">Rating</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          {navItems.map(({ name, icon: Icon, path, badge }) => (
            <Button
              key={name}
              variant="ghost"
              className={`w-full justify-start ${
                pathname === path ? "bg-green-100 text-green-800" : "text-green-700 hover:bg-green-50"
              }`}
              onClick={() => router.push(path)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {name}
              {badge && <Badge className="ml-auto bg-green-500">{badge}</Badge>}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-green-100 mt-4">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-green-700 hover:bg-green-50">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>

          <Button variant="ghost" className="w-full justify-start text-green-700 hover:bg-green-50">
            <HelpCircle className="h-5 w-5 mr-3" />
            Help & Support
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
