"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Heart,
  Activity,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  Pill,
  Clipboard,
  LineChart,
  AlertTriangle,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PatientDetailsProps {
  patientId: number
  onBack: () => void
}

export default function PatientDetails({ patientId, onBack }: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample patient data
  const patient = {
    id: patientId,
    name: "John Smith",
    age: 58,
    gender: "Male",
    avatar: "/placeholder.svg?height=120&width=120",
    dateOfBirth: "1967-05-15",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown, CA 12345",
    condition: "Hypertension, Diabetes",
    riskLevel: "high",
    lastVisit: "2025-03-01",
    nextAppointment: "2025-03-14",
    bloodType: "A+",
    allergies: ["Penicillin", "Sulfa drugs"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime" },
    ],
    vitalSigns: {
      bloodPressure: { current: "145/92", target: "130/80", trend: "up" },
      heartRate: { current: "88", target: "60-80", trend: "up" },
      bloodGlucose: { current: "142", target: "<126", trend: "down" },
      cholesterol: { current: "210", target: "<200", trend: "stable" },
      weight: { current: "92kg", target: "85kg", trend: "stable" },
    },
    aiInsights: [
      "Blood pressure consistently above target range for the past 2 weeks",
      "Missed medication doses detected on weekends",
      "Irregular sleep patterns may be contributing to elevated blood pressure",
      "Physical activity has decreased by 30% compared to previous month",
    ],
    aiRecommendations: [
      "Consider adjusting hypertension medication dosage",
      "Implement medication reminder system for weekends",
      "Evaluate sleep quality and potential sleep apnea",
      "Gradually increase daily step count to previous levels",
    ],
    recentAppointments: [
      { date: "2025-03-01", reason: "Regular checkup", notes: "Blood pressure elevated, medication adjusted" },
      { date: "2025-02-01", reason: "Follow-up", notes: "Diabetes well-controlled, continue current regimen" },
      { date: "2025-01-05", reason: "Chest pain", notes: "ECG normal, stress test scheduled" },
    ],
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Patient Name */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="p-2 text-green-700 hover:bg-green-50 rounded-full" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-green-800">Patient Details</h2>
      </div>

      {/* Patient Profile */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <div className="text-xl font-semibold text-green-800">{patient.name}</div>
              <div className="text-green-600">
                {patient.age} years • {patient.gender}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={
                    patient.riskLevel === "low"
                      ? "bg-green-100 text-green-800"
                      : patient.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {patient.riskLevel === "low"
                    ? "Low Risk"
                    : patient.riskLevel === "medium"
                      ? "Medium Risk"
                      : "High Risk"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-green-600 mb-1">Date of Birth</div>
              <div className="font-medium text-green-800">{formatDate(patient.dateOfBirth)}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Phone</div>
              <div className="font-medium text-green-800">{patient.phone}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Email</div>
              <div className="font-medium text-green-800">{patient.email}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 mb-1">Address</div>
              <div className="font-medium text-green-800">{patient.address}</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Patient Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start p-0 bg-transparent border-b border-green-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="ai-insights"
            className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
          >
            AI Health Report
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger
            value="medical-records"
            className="data-[state=active]:bg-transparent data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-6 py-3"
          >
            Medical Records
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vital Signs */}
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-600">Blood Pressure</div>
                      <div className="font-medium text-green-800 flex items-center">
                        {patient.vitalSigns.bloodPressure.current}
                        {patient.vitalSigns.bloodPressure.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500 ml-1" />
                        ) : patient.vitalSigns.bloodPressure.trend === "down" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-500 ml-1" />
                        ) : null}
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700">Above Target</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-600">Heart Rate</div>
                      <div className="font-medium text-green-800 flex items-center">
                        {patient.vitalSigns.heartRate.current} bpm
                        {patient.vitalSigns.heartRate.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500 ml-1" />
                        ) : patient.vitalSigns.heartRate.trend === "down" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-500 ml-1" />
                        ) : null}
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Elevated</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-600">Blood Glucose</div>
                      <div className="font-medium text-green-800 flex items-center">
                        {patient.vitalSigns.bloodGlucose.current} mg/dL
                        {patient.vitalSigns.bloodGlucose.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500 ml-1" />
                        ) : patient.vitalSigns.bloodGlucose.trend === "down" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-500 ml-1" />
                        ) : null}
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Elevated</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-600">Cholesterol</div>
                      <div className="font-medium text-green-800">{patient.vitalSigns.cholesterol.current} mg/dL</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Elevated</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-600">Weight</div>
                      <div className="font-medium text-green-800">{patient.vitalSigns.weight.current}</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Above Target</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-green-600" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">{medication.name}</div>
                      <div className="text-sm text-green-600">
                        {medication.dosage} • {medication.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* General Information */}
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Clipboard className="h-5 w-5 mr-2 text-green-600" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-green-600">Blood Type</div>
                    <div className="font-medium text-green-800">{patient.bloodType}</div>
                  </div>

                  <div>
                    <div className="text-sm text-green-600">Allergies</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-700">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-green-600">Conditions</div>
                    <div className="font-medium text-green-800">{patient.condition}</div>
                  </div>

                  <div>
                    <div className="text-sm text-green-600">Last Visit</div>
                    <div className="font-medium text-green-800">{formatDate(patient.lastVisit)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-green-600">Next Appointment</div>
                    <div className="font-medium text-green-800">{formatDate(patient.nextAppointment)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Health Report Tab */}
        <TabsContent value="ai-insights" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Health Insights */}
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-green-600" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${index === 0 ? "text-red-500" : "text-yellow-500"}`} />
                      <div className="text-green-700">{insight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-green-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="text-green-700">{recommendation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Trends Visualization */}
            <Card className="border-green-100 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-green-300 mx-auto mb-2" />
                    <div className="text-green-800 font-medium">Health Trend Visualization</div>
                    <div className="text-green-600 text-sm">Interactive charts would appear here</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="pt-6">
          <Card className="border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Recent Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.recentAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <div className="font-medium text-green-800">{formatDate(appointment.date)}</div>
                        </div>
                        <div className="text-sm text-green-600 ml-6 mt-1">Reason: {appointment.reason}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <div className="text-sm text-green-600">Notes:</div>
                      <div className="text-green-700">{appointment.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="medical-records" className="pt-6">
          <div className="text-center py-8 bg-white rounded-lg border border-green-100">
            <FileText className="h-12 w-12 text-green-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-green-800 mb-1">Medical Records</h3>
            <p className="text-green-600">Detailed medical records and history would appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

