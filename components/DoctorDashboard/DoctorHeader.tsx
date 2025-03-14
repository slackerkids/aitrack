"use client"

import { Bell, Calendar, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DoctorHeaderProps {
  doctor: {
    name: string
    avatar: string
  }
}

export default function DoctorHeader({ doctor }: DoctorHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-green-100 bg-white/80 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-green-800">Doctor Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
          <Input
            placeholder="Search patients..."
            className="pl-10 border-green-200 focus-visible:ring-green-500 w-64"
          />
        </div>

        <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-full">
          <Calendar className="h-5 w-5" />
        </Button>

        <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-green-100 text-green-800">
              {doctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-green-800">{doctor.name}</span>
        </div>
      </div>
    </div>
  )
}

