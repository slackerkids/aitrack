"use client"

import { useState } from "react"
import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Doctor } from "./types"

interface DoctorListProps {
  onSelectDoctor: (doctor: Doctor) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredDoctors: Doctor[]
}

export default function DoctorList({ onSelectDoctor, searchQuery, setSearchQuery, filteredDoctors }: DoctorListProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  // Get unique specialties for filter
  const specialties = [...new Set(filteredDoctors.map((doctor) => doctor.specialization))]

  // Filter doctors based on specialty
  const displayedDoctors = filteredDoctors.filter((doctor) => {
    const matchesSpecialty = !selectedSpecialty || doctor.specialization === selectedSpecialty
    return matchesSpecialty
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
          <Input
            placeholder="Search doctors by name or specialty"
            className="pl-10 border-green-200 focus-visible:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedSpecialty === null ? "default" : "outline"}
            className={
              selectedSpecialty === null ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"
            }
            onClick={() => setSelectedSpecialty(null)}
          >
            All
          </Button>
          {specialties.map((specialty, index) => (
            <Button
              key={index}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              className={
                selectedSpecialty === specialty ? "bg-green-600 hover:bg-green-700" : "text-green-700 border-green-200"
              }
              onClick={() => setSelectedSpecialty(specialty)}
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden border-green-100">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-green-800">{doctor.name}</h3>
                    <p className="text-sm text-green-600">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {doctor.experience} years exp.
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {doctor.rating}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={() => onSelectDoctor(doctor)}
              >
                View Availability
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {displayedDoctors.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg border border-green-100">
          <Search className="h-12 w-12 text-green-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-800 mb-1">No doctors found</h3>
          <p className="text-green-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

