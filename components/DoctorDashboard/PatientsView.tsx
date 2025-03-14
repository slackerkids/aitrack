"use client"

import { useState } from "react"
import { Search, Heart, Activity, FileText, MoreVertical, MessageSquare, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  avatar: string
  lastVisit: string
  condition: string
  riskLevel: "low" | "medium" | "high"
  aiInsights: string[]
}

interface PatientsViewProps {
  onSelectPatient: (patientId: number) => void
}

export default function PatientsView({ onSelectPatient }: PatientsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  // Sample patients data
  const patients: Patient[] = [
    {
      id: 1,
      name: "John Smith",
      age: 58,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      lastVisit: "2025-03-01",
      condition: "Hypertension, Diabetes",
      riskLevel: "high",
      aiInsights: [
        "Blood pressure consistently above target range",
        "Missed medication doses detected",
        "Irregular sleep patterns",
      ],
    },
    {
      id: 2,
      name: "Emily Johnson",
      age: 42,
      gender: "Female",
      avatar: "/placeholder.svg?height=40&width=40",
      lastVisit: "2025-02-15",
      condition: "Arrhythmia",
      riskLevel: "medium",
      aiInsights: ["Heart rate variability improved", "Exercise frequency increased", "Stress levels reduced"],
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 65,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      lastVisit: "2025-03-05",
      condition: "Coronary Artery Disease",
      riskLevel: "high",
      aiInsights: ["Chest pain episodes reported", "Decreased physical activity", "Weight gain of 3kg in past month"],
    },
    {
      id: 4,
      name: "Sarah Wilson",
      age: 35,
      gender: "Female",
      avatar: "/placeholder.svg?height=40&width=40",
      lastVisit: "2025-02-28",
      condition: "Mitral Valve Prolapse",
      riskLevel: "low",
      aiInsights: ["Consistent medication adherence", "Normal vital signs", "Regular exercise routine maintained"],
    },
    {
      id: 5,
      name: "David Lee",
      age: 72,
      gender: "Male",
      avatar: "/placeholder.svg?height=40&width=40",
      lastVisit: "2025-03-10",
      condition: "Heart Failure",
      riskLevel: "medium",
      aiInsights: [
        "Slight increase in fluid retention",
        "Shortness of breath during activity",
        "Medication side effects reported",
      ],
    },
  ]

  // Filter patients based on search query and risk level
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRisk = !selectedRisk || patient.riskLevel === selectedRisk

    return matchesSearch && matchesRisk
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
          <Input
            placeholder="Search patients by name or condition"
            className="pl-10 border-green-200 focus-visible:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedRisk === null ? "default" : "outline"}
            className={selectedRisk === null ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
            onClick={() => setSelectedRisk(null)}
          >
            All
          </Button>
          <Button
            variant={selectedRisk === "low" ? "default" : "outline"}
            className={selectedRisk === "low" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
            onClick={() => setSelectedRisk("low")}
          >
            <Badge className="bg-green-200 text-green-800 mr-1">●</Badge>
            Low Risk
          </Button>
          <Button
            variant={selectedRisk === "medium" ? "default" : "outline"}
            className={
              selectedRisk === "medium" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"
            }
            onClick={() => setSelectedRisk("medium")}
          >
            <Badge className="bg-yellow-200 text-yellow-800 mr-1">●</Badge>
            Medium Risk
          </Button>
          <Button
            variant={selectedRisk === "high" ? "default" : "outline"}
            className={selectedRisk === "high" ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"}
            onClick={() => setSelectedRisk("high")}
          >
            <Badge className="bg-red-200 text-red-800 mr-1">●</Badge>
            High Risk
          </Button>
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="border-green-100 hover:bg-green-50 transition-colors cursor-pointer"
            onClick={() => onSelectPatient(patient.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-green-800 flex items-center gap-2">
                      {patient.name}
                      <Badge
                        className={`ml-2 ${
                          patient.riskLevel === "low"
                            ? "bg-green-100 text-green-800"
                            : patient.riskLevel === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {patient.riskLevel === "low"
                          ? "Low Risk"
                          : patient.riskLevel === "medium"
                            ? "Medium Risk"
                            : "High Risk"}
                      </Badge>
                    </div>
                    <div className="text-sm text-green-600">
                      {patient.age} years • {patient.gender}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      <span className="font-medium">Condition:</span> {patient.condition}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="text-sm text-green-600">
                    <span className="font-medium">Last Visit:</span> {formatDate(patient.lastVisit)}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-100">
                      <Heart className="h-4 w-4 mr-1" />
                      Health Data
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          View Records
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="mt-3 pt-3 border-t border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">AI Health Insights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {patient.aiInsights.map((insight, index) => (
                    <div key={index} className="text-xs bg-green-50 p-2 rounded-md text-green-700">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg border border-green-100">
            <Search className="h-12 w-12 text-green-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-green-800 mb-1">No patients found</h3>
            <p className="text-green-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

