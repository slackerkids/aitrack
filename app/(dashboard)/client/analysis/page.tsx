"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Info,
  Calendar,
  FileText,
  BarChart3,
  History,
  Download,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample blood test data
const bloodTestData = {
  current: {
    date: "2023-10-15",
    markers: [
      {
        id: 1,
        name: "Hemoglobin",
        value: 14.2,
        unit: "g/dL",
        normalRange: "13.5-17.5",
        status: "normal",
        change: "+0.3",
        description: "Protein in red blood cells that carries oxygen throughout the body",
        recommendations: "Your hemoglobin levels are within normal range, indicating good oxygen-carrying capacity.",
      },
      {
        id: 2,
        name: "White Blood Cells",
        value: 6.8,
        unit: "10³/µL",
        normalRange: "4.5-11.0",
        status: "normal",
        change: "-0.2",
        description: "Cells that help fight infections and other diseases",
        recommendations: "Your white blood cell count is normal, suggesting a healthy immune system.",
      },
      {
        id: 3,
        name: "Platelets",
        value: 140,
        unit: "10³/µL",
        normalRange: "150-450",
        status: "low",
        change: "-15",
        description: "Cell fragments that help with blood clotting",
        recommendations:
          "Your platelet count is slightly below the normal range. Consider discussing with your healthcare provider.",
      },
      {
        id: 4,
        name: "Glucose",
        value: 105,
        unit: "mg/dL",
        normalRange: "70-99",
        status: "high",
        change: "+8",
        description: "Sugar in the blood that provides energy to cells",
        recommendations:
          "Your glucose level is elevated. Consider dietary changes and regular exercise to help manage blood sugar levels.",
      },
      {
        id: 5,
        name: "Cholesterol (Total)",
        value: 185,
        unit: "mg/dL",
        normalRange: "125-200",
        status: "normal",
        change: "-10",
        description: "Fatty substance found in the blood",
        recommendations:
          "Your total cholesterol is within normal range. Continue maintaining a healthy diet and regular exercise.",
      },
      {
        id: 6,
        name: "HDL Cholesterol",
        value: 62,
        unit: "mg/dL",
        normalRange: ">40",
        status: "normal",
        change: "+4",
        description: "Good cholesterol that helps remove other forms of cholesterol from the bloodstream",
        recommendations: "Your HDL cholesterol is at a healthy level, which helps protect against heart disease.",
      },
      {
        id: 7,
        name: "LDL Cholesterol",
        value: 110,
        unit: "mg/dL",
        normalRange: "<100",
        status: "high",
        change: "-5",
        description: "Bad cholesterol that can build up in your arteries",
        recommendations:
          "Your LDL cholesterol is slightly elevated. Consider dietary changes to reduce saturated fat intake.",
      },
      {
        id: 8,
        name: "Triglycerides",
        value: 120,
        unit: "mg/dL",
        normalRange: "<150",
        status: "normal",
        change: "-15",
        description: "Type of fat found in the blood",
        recommendations: "Your triglyceride levels are within normal range. Continue maintaining a healthy lifestyle.",
      },
    ],
  },
  history: [
    {
      date: "2023-07-15",
      markers: [
        { id: 1, name: "Hemoglobin", value: 13.9, unit: "g/dL" },
        { id: 2, name: "White Blood Cells", value: 7.0, unit: "10³/µL" },
        { id: 3, name: "Platelets", value: 155, unit: "10³/µL" },
        { id: 4, name: "Glucose", value: 97, unit: "mg/dL" },
        { id: 5, name: "Cholesterol (Total)", value: 195, unit: "mg/dL" },
        { id: 6, name: "HDL Cholesterol", value: 58, unit: "mg/dL" },
        { id: 7, name: "LDL Cholesterol", value: 115, unit: "mg/dL" },
        { id: 8, name: "Triglycerides", value: 135, unit: "mg/dL" },
      ],
    },
    {
      date: "2023-04-10",
      markers: [
        { id: 1, name: "Hemoglobin", value: 14.0, unit: "g/dL" },
        { id: 2, name: "White Blood Cells", value: 6.5, unit: "10³/µL" },
        { id: 3, name: "Platelets", value: 160, unit: "10³/µL" },
        { id: 4, name: "Glucose", value: 95, unit: "mg/dL" },
        { id: 5, name: "Cholesterol (Total)", value: 190, unit: "mg/dL" },
        { id: 6, name: "HDL Cholesterol", value: 55, unit: "mg/dL" },
        { id: 7, name: "LDL Cholesterol", value: 120, unit: "mg/dL" },
        { id: 8, name: "Triglycerides", value: 140, unit: "mg/dL" },
      ],
    },
  ],
}

export default function BloodAnalysis() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      case "low":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-amber-600" />
      case "high":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) {
      return <TrendingUp className="h-4 w-4 text-red-600" />
    } else if (change.startsWith("-")) {
      return <TrendingDown className="h-4 w-4 text-green-600" />
    }
    return null
  }

  const filteredMarkers = bloodTestData.current.markers.filter((marker) => {
    if (filterStatus === "all") return true
    return marker.status === filterStatus
  })

  const abnormalCount = bloodTestData.current.markers.filter((marker) => marker.status !== "normal").length
  const normalCount = bloodTestData.current.markers.filter((marker) => marker.status === "normal").length

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-green-50 to-white transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <div className="container mx-auto px-6 py-8 pt-[80px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Analysis</h1>
          <p className="text-gray-600">Comprehensive analysis of your blood test results with personalized insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Summary and Filters */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 border-b border-green-100 bg-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-gray-800">Test Summary</CardTitle>
                  <Badge className="bg-green-600">{bloodTestData.current.date}</Badge>
                </div>
                <CardDescription>Overview of your latest blood test results</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-700">Overall Health Score</span>
                    </div>
                    <Badge className="bg-green-600">85/100</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Health Indicators</span>
                      <span className="text-green-600 font-medium">
                        {normalCount} of {bloodTestData.current.markers.length} normal
                      </span>
                    </div>
                    <Progress
                      value={(normalCount / bloodTestData.current.markers.length) * 100}
                      className="h-2 bg-gray-100"
                      indicatorClassName="bg-green-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{normalCount}</div>
                      <div className="text-xs text-gray-600">Normal</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">{abnormalCount}</div>
                      <div className="text-xs text-gray-600">Abnormal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated: {bloodTestData.current.date}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
                  <FileText className="h-4 w-4 mr-1" />
                  View PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-lg text-gray-800">Filter Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-green-200 focus:ring-green-300 bg-white">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Results</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
                    <Select defaultValue={bloodTestData.current.date}>
                      <SelectTrigger className="border-green-200 focus:ring-green-300 bg-white">
                        <SelectValue placeholder="Select test date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={bloodTestData.current.date}>
                          {bloodTestData.current.date} (Latest)
                        </SelectItem>
                        {bloodTestData.history.map((test, index) => (
                          <SelectItem key={index} value={test.date}>
                            {test.date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-lg text-gray-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Doctor
                  </Button>
                  <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="results">
              <TabsList className="bg-green-50 p-1">
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600"
                >
                  Test Results
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600"
                >
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="mt-4">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-white">
                    <CardTitle className="text-xl text-gray-800">Blood Test Results</CardTitle>
                    <CardDescription>
                      Detailed breakdown of your blood markers from {bloodTestData.current.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Marker</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Result</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Normal Range</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredMarkers.map((marker) => (
                            <tr
                              key={marker.id}
                              className={`hover:bg-gray-50 cursor-pointer ${selectedMarker?.id === marker.id ? "bg-green-50" : ""}`}
                              onClick={() => setSelectedMarker(marker)}
                            >
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium">{marker.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {marker.value} {marker.unit}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{marker.normalRange}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={getStatusColor(marker.status)}>
                                  <span className="flex items-center">
                                    {getStatusIcon(marker.status)}
                                    <span className="ml-1 capitalize">{marker.status}</span>
                                  </span>
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center">
                                  {getChangeIcon(marker.change)}
                                  <span
                                    className={`ml-1 ${marker.change.startsWith("+") ? "text-red-600" : "text-green-600"}`}
                                  >
                                    {marker.change}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {selectedMarker && (
                  <Card className="border-0 shadow-md overflow-hidden mt-6">
                    <CardHeader className="pb-2 border-b border-green-100">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-gray-800">{selectedMarker.name} Details</CardTitle>
                        <Badge variant="outline" className={getStatusColor(selectedMarker.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(selectedMarker.status)}
                            <span className="ml-1 capitalize">{selectedMarker.status}</span>
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                          <p className="text-sm text-gray-600">{selectedMarker.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Current Value</h4>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-800">{selectedMarker.value}</span>
                            <span className="ml-1 text-gray-600">{selectedMarker.unit}</span>
                            <div className="ml-3 flex items-center">
                              {getChangeIcon(selectedMarker.change)}
                              <span
                                className={`ml-1 ${selectedMarker.change.startsWith("+") ? "text-red-600" : "text-green-600"}`}
                              >
                                {selectedMarker.change} from previous
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Normal Range</h4>
                          <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {selectedMarker.normalRange} {selectedMarker.unit}
                            </div>
                            <div
                              className="absolute top-0 bottom-0 bg-green-200 opacity-70"
                              style={{
                                left: "25%",
                                right: "25%",
                              }}
                            ></div>
                            <div
                              className="absolute top-0 bottom-0 w-2 bg-green-600"
                              style={{
                                left: `${50 + (selectedMarker.value / Number.parseFloat(selectedMarker.normalRange.split("-")[1])) * 50}%`,
                                transform: "translateX(-50%)",
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
                          <p className="text-sm text-gray-600">{selectedMarker.recommendations}</p>
                        </div>

                        <div className="pt-2">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <Info className="h-4 w-4 mr-2" />
                            Learn More About {selectedMarker.name}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="trends" className="mt-4">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-gradient-to-r from-green-50 to-white">
                    <CardTitle className="text-xl text-gray-800">Blood Marker Trends</CardTitle>
                    <CardDescription>Track how your blood markers have changed over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Marker</label>
                        <Select defaultValue="1">
                          <SelectTrigger className="border-green-200 focus:ring-green-300 bg-white">
                            <SelectValue placeholder="Select marker to view" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTestData.current.markers.map((marker) => (
                              <SelectItem key={marker.id} value={marker.id.toString()}>
                                {marker.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="h-[300px] w-full">
                        {/* This would be replaced with an actual chart component */}
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-green-200 mx-auto mb-2" />
                            <p className="text-gray-500">Chart visualization would appear here</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Trend Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Your hemoglobin levels have been stable over the past 3 tests, showing a slight improvement.
                          Continue with your current diet and exercise routine to maintain these healthy levels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-gradient-to-r from-green-50 to-white">
                    <CardTitle className="text-xl text-gray-800">Personalized Recommendations</CardTitle>
                    <CardDescription>
                      Based on your blood test results, here are some recommendations to improve your health
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-red-100 text-red-800 border-red-200 mr-3">Attention Needed</Badge>
                            <span>Manage Blood Glucose Levels</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-gray-600">
                              Your glucose level is elevated at 105 mg/dL (normal range: 70-99 mg/dL). Here are some
                              recommendations to help manage your blood sugar:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Limit intake of refined carbohydrates and sugary foods</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Increase physical activity to at least 150 minutes per week</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include more fiber-rich foods in your diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay hydrated by drinking plenty of water</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-green-600 hover:bg-green-700">View Detailed Plan</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 mr-3">
                              Monitoring Advised
                            </Badge>
                            <span>Improve Platelet Count</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-gray-600">
                              Your platelet count is slightly below the normal range at 140 10³/µL (normal range:
                              150-450 10³/µL). Consider these recommendations:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include more foods rich in vitamin K, such as leafy greens and broccoli</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Consider foods with iron, vitamin B12, and folate</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay hydrated and maintain a balanced diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Schedule a follow-up test in 4-6 weeks to monitor progress</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-green-600 hover:bg-green-700">Learn More</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-red-100 text-red-800 border-red-200 mr-3">Attention Needed</Badge>
                            <span>Lower LDL Cholesterol</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-gray-600">
                              Your LDL cholesterol is slightly elevated at 110 mg/dL (normal range: &lt;100 mg/dL). Here
                              are some recommendations to help lower your LDL cholesterol:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Reduce intake of saturated and trans fats</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Increase consumption of soluble fiber from oats, beans, and fruits</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include plant sterols and stanols in your diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Exercise regularly and maintain a healthy weight</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-green-600 hover:bg-green-700">View Heart Health Plan</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-800 border-green-200 mr-3">Maintain</Badge>
                            <span>Continue Healthy Habits</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-gray-600">
                              Many of your markers are within normal ranges. Continue these healthy habits:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Maintain a balanced diet rich in fruits, vegetables, and whole grains</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay physically active with at least 30 minutes of exercise daily</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Get adequate sleep (7-9 hours per night)</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>Manage stress through relaxation techniques</span>
                              </li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

