"use client"

import { Calendar, Users, FileText, MessageSquare, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DoctorSidebarProps {
  doctor: {
    name: string
    specialization: string
    avatar: string
    hospital: string
    experience: number
    patients: number
    rating: number
  }
  activeTab: string
  setActiveTab: (tab: string) => void
  isLoaded: boolean
}

export default function DoctorSidebar({ doctor, activeTab, setActiveTab, isLoaded }: DoctorSidebarProps) {
  return (
    <div
      className={`w-64 h-[calc(100vh-0rem)] bg-white/80 backdrop-blur-lg p-4 shadow-lg border-r border-green-100 opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col`}
      style={{ animationDelay: "0.4s" }}
    >
      {/* Doctor Profile */}
      <div className="flex flex-col items-center mb-6 pt-4">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={doctor.avatar} alt={doctor.name} />
          <AvatarFallback className="bg-green-100 text-green-800 text-xl">
            {doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold text-green-800">{doctor.name}</h2>
        <p className="text-sm text-green-600 mb-2">{doctor.specialization}</p>
        <p className="text-xs text-green-500">{doctor.hospital}</p>

        <div className="flex gap-3 mt-3 w-full">
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor.experience}</div>
            <div className="text-xs text-green-600">Years</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor.patients}</div>
            <div className="text-xs text-green-600">Patients</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
            <div className="text-lg font-semibold text-green-800">{doctor.rating}</div>
            <div className="text-xs text-green-600">Rating</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "appointments" ? "bg-green-100 text-green-800" : "text-green-700 hover:bg-green-50"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Appointments
            <Badge className="ml-auto bg-green-500">3</Badge>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "patients" ? "bg-green-100 text-green-800" : "text-green-700 hover:bg-green-50"
            }`}
            onClick={() => setActiveTab("patients")}
          >
            <Users className="h-5 w-5 mr-3" />
            Patients
          </Button>

          <Button variant="ghost" className="w-full justify-start text-green-700 hover:bg-green-50">
            <FileText className="h-5 w-5 mr-3" />
            Medical Records
          </Button>

          <Button variant="ghost" className="w-full justify-start text-green-700 hover:bg-green-50">
            <MessageSquare className="h-5 w-5 mr-3" />
            Messages
            <Badge className="ml-auto bg-red-500">5</Badge>
          </Button>
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

          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

