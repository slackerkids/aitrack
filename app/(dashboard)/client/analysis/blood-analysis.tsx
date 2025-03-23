"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Info,
  Calendar,
  Download,
  Share2,
  AlertCircle,
  Target,
  Award,
  Zap,
  Heart,
  Brain,
  Droplet,
  Thermometer,
  Shield,
  Sun,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        category: "blood",
        icon: Droplet,
        color: "#e74c3c",
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
        category: "immune",
        icon: Shield,
        color: "#3498db",
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
        category: "blood",
        icon: Droplet,
        color: "#e74c3c",
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
        category: "metabolic",
        icon: Zap,
        color: "#f39c12",
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
        category: "heart",
        icon: Heart,
        color: "#e74c3c",
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
        category: "heart",
        icon: Heart,
        color: "#e74c3c",
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
        category: "heart",
        icon: Heart,
        color: "#e74c3c",
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
        category: "heart",
        icon: Heart,
        color: "#e74c3c",
      },
      {
        id: 9,
        name: "Vitamin D",
        value: 28,
        unit: "ng/mL",
        normalRange: "30-100",
        status: "low",
        change: "+3",
        description: "Essential for bone health and immune function",
        recommendations: "Your vitamin D levels are slightly low. Consider supplementation or more sun exposure.",
        category: "vitamins",
        icon: Sun,
        color: "#f1c40f",
      },
      {
        id: 10,
        name: "Thyroid Stimulating Hormone",
        value: 2.1,
        unit: "mIU/L",
        normalRange: "0.4-4.0",
        status: "normal",
        change: "-0.3",
        description: "Controls thyroid hormone production",
        recommendations: "Your thyroid function appears normal based on TSH levels.",
        category: "hormones",
        icon: Thermometer,
        color: "#9b59b6",
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

// Health score calculation
const calculateHealthScore = () => {
  const markers = bloodTestData.current.markers
  const normalCount = markers.filter((m) => m.status === "normal").length
  const lowCount = markers.filter((m) => m.status === "low").length
  const highCount = markers.filter((m) => m.status === "high").length

  // Simple weighted calculation
  return Math.round(((normalCount * 10 + lowCount * 5) / markers.length) * 10)
}

// Missing imports
// const Shield = Activity; // Placeholder for Shield icon
// const Sun = Activity; // Placeholder for Sun icon

export default function BloodAnalysis() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeInsightIndex, setActiveInsightIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const healthScore = calculateHealthScore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setShowConfetti(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Confetti effect
  useEffect(() => {
    if (showConfetti && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const confettiPieces: any[] = []
      const colors = ["#16a07c", "#75eea1", "#3498db", "#f1c40f", "#e74c3c"]

      for (let i = 0; i < 100; i++) {
        confettiPieces.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 3 + 2,
          angle: Math.random() * 2 * Math.PI,
          rotation: Math.random() * 0.2 - 0.1,
          opacity: 1,
        })
      }

      let animationFrame: number
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let stillFalling = false
        confettiPieces.forEach((piece) => {
          ctx.save()
          ctx.translate(piece.x, piece.y)
          ctx.rotate(piece.angle)
          ctx.globalAlpha = piece.opacity
          ctx.fillStyle = piece.color
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
          ctx.restore()

          piece.y += piece.speed
          piece.angle += piece.rotation

          if (piece.y < canvas.height) {
            stillFalling = true
          } else {
            piece.opacity -= 0.01
            if (piece.opacity <= 0) {
              piece.y = -piece.size
              piece.opacity = 1
            }
          }
        })

        if (stillFalling) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          setShowConfetti(false)
        }
      }

      animate()

      setTimeout(() => {
        cancelAnimationFrame(animationFrame)
        setShowConfetti(false)
      }, 3000)

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [showConfetti])

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
    const statusMatch = filterStatus === "all" || marker.status === filterStatus
    const categoryMatch = filterCategory === "all" || marker.category === filterCategory
    return statusMatch && categoryMatch
  })

  const abnormalCount = bloodTestData.current.markers.filter((marker) => marker.status !== "normal").length
  const normalCount = bloodTestData.current.markers.filter((marker) => marker.status === "normal").length

  // Key insights based on the blood test results
  const keyInsights = [
    {
      title: "Cardiovascular Health",
      description: "Your cholesterol levels indicate good heart health, but LDL is slightly elevated.",
      icon: Heart,
      color: "#e74c3c",
      score: 85,
    },
    {
      title: "Metabolic Function",
      description: "Your glucose levels are slightly elevated. Consider dietary adjustments.",
      icon: Zap,
      color: "#f39c12",
      score: 75,
    },
    {
      title: "Immune System",
      description: "Your white blood cell count is normal, indicating a healthy immune system.",
      icon: Shield,
      color: "#3498db",
      score: 90,
    },
    {
      title: "Brain Health",
      description: "Your markers related to brain health are within optimal ranges.",
      icon: Brain,
      color: "#9b59b6",
      score: 95,
    },
  ]

  // Auto-rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsightIndex((prev) => (prev + 1) % keyInsights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [keyInsights.length])

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "blood", name: "Blood Health", icon: Droplet },
    { id: "heart", name: "Heart Health", icon: Heart },
    { id: "metabolic", name: "Metabolism", icon: Zap },
    { id: "immune", name: "Immune System", icon: Shield },
    { id: "vitamins", name: "Vitamins & Minerals", icon: Sun },
    { id: "hormones", name: "Hormones", icon: Thermometer },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-green-50 to-white transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {showConfetti && <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />}

      <div className="container mx-auto px-6 py-8 pt-[80px]">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Health Insights</h1>
              <p className="text-gray-600">AI-powered analysis of your blood test from {bloodTestData.current.date}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-200 to-green-500 animate-pulse"></div>
                  <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                    <div className="text-2xl font-bold text-green-600">{healthScore}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Health Score</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {healthScore >= 90
                      ? "Excellent"
                      : healthScore >= 80
                        ? "Very Good"
                        : healthScore >= 70
                          ? "Good"
                          : healthScore >= 60
                            ? "Fair"
                            : "Needs Attention"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights Carousel */}
        <div className="mb-8 overflow-hidden rounded-xl shadow-lg border border-green-100">
          <div className="relative bg-gradient-to-r from-[#16a07c]/10 to-white p-6">
            <div className="absolute top-0 right-0 p-4">
              <Badge className="bg-[#16a07c]">AI Insight</Badge>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#16a07c]/10 flex items-center justify-center">
                {React.createElement(keyInsights[activeInsightIndex].icon, {
                  className: "w-8 h-8",
                  style: { color: keyInsights[activeInsightIndex].color },
                })}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{keyInsights[activeInsightIndex].title}</h2>
                <p className="text-gray-600">{keyInsights[activeInsightIndex].description}</p>

                <div className="mt-3 flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-700">Health Score:</div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16a07c]"
                      style={{ width: `${keyInsights[activeInsightIndex].score}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-[#16a07c]">{keyInsights[activeInsightIndex].score}/100</div>
                </div>
              </div>

              <div className="flex-shrink-0 flex gap-1">
                {keyInsights.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === activeInsightIndex ? "bg-[#16a07c]" : "bg-gray-300"}`}
                    onClick={() => setActiveInsightIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Category Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 border-b border-green-100 bg-white">
                <CardTitle className="text-xl text-gray-800">Health Categories</CardTitle>
                <CardDescription>Explore your results by category</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-green-50 ${
                        filterCategory === category.id ? "bg-green-50 border-l-4 border-green-500" : ""
                      }`}
                      onClick={() => setFilterCategory(category.id)}
                    >
                      {category.icon && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <category.icon className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      <span className="font-medium text-gray-700">{category.name}</span>
                      {category.id !== "all" && (
                        <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                          {bloodTestData.current.markers.filter((m) => m.category === category.id).length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>


            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 border-b border-green-100">
                <CardTitle className="text-lg text-gray-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <Button className="w-full bg-[#16a07c] hover:bg-[#138e6e] text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="w-full border-[#16a07c] text-[#16a07c] hover:bg-[#16a07c]/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Doctor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <Tabs defaultValue="dashboard">
              <TabsList className="bg-[#16a07c]/10 p-1">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#16a07c]"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#16a07c]"
                >
                  Detailed Results
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:text-[#16a07c]">
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#16a07c]"
                >
                  Action Plan
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Normal Markers</div>
                          <div className="text-2xl font-bold text-gray-800">
                            {normalCount} of {bloodTestData.current.markers.length}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Need Attention</div>
                          <div className="text-2xl font-bold text-gray-800">{abnormalCount} markers</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Next Test Due</div>
                          <div className="text-2xl font-bold text-gray-800">Jan 15, 2024</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Radar Chart */}
                <Card className="border-0 shadow-md overflow-hidden mb-6">
                  <CardHeader className="pb-2 border-b border-green-100 bg-white">
                    <CardTitle className="text-xl text-gray-800">Health Radar</CardTitle>
                    <CardDescription>Overview of your health categories</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="relative h-[300px] w-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[250px] h-[250px] relative">
                          {/* Radar Chart Background */}
                          <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-20"></div>
                          <div className="absolute inset-[20%] rounded-full border-2 border-gray-100 opacity-40"></div>
                          <div className="absolute inset-[40%] rounded-full border-2 border-gray-100 opacity-60"></div>
                          <div className="absolute inset-[60%] rounded-full border-2 border-gray-100 opacity-80"></div>
                          <div className="absolute inset-[80%] rounded-full border-2 border-gray-100"></div>

                          {/* Radar Chart Lines */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[2px] bg-gray-100"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
                            <div className="w-full h-[2px] bg-gray-100"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
                            <div className="w-full h-[2px] bg-gray-100"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center transform rotate-135">
                            <div className="w-full h-[2px] bg-gray-100"></div>
                          </div>

                          {/* Radar Chart Data Points */}
                          <div className="absolute inset-0">
                            {/* Heart Health - 85% */}
                            <div className="absolute top-[7.5%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                              Heart
                            </div>

                            {/* Immune System - 90% */}
                            <div className="absolute top-1/2 right-[5%] transform translate-y-[-50%] w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="absolute top-1/2 right-[10%] transform translate-y-[-50%] text-xs font-medium text-gray-700">
                              Immune
                            </div>

                            {/* Metabolism - 75% */}
                            <div className="absolute bottom-[12.5%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                              Metabolism
                            </div>

                            {/* Blood Health - 80% */}
                            <div className="absolute top-1/2 left-[10%] transform translate-y-[-50%] w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div className="absolute top-1/2 left-[3%] transform translate-y-[-50%] text-xs font-medium text-gray-700">
                              Blood
                            </div>

                            {/* Connect the dots */}
                            <svg className="absolute inset-0" viewBox="0 0 100 100">
                              <polygon
                                points="50,7.5 95,50 50,87.5 10,50"
                                fill="rgba(22, 160, 124, 0.2)"
                                stroke="#16a07c"
                                strokeWidth="1"
                              />
                            </svg>
                          </div>

                          {/* Center Point */}
                          <div className="absolute inset-[48%] rounded-full bg-[#16a07c]"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Abnormal Markers */}
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-white">
                    <CardTitle className="text-xl text-gray-800">Markers Needing Attention</CardTitle>
                    <CardDescription>Focus on these markers to improve your health</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {bloodTestData.current.markers
                        .filter((m) => m.status !== "normal")
                        .map((marker) => (
                          <div key={marker.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${marker.color}20` }}
                                >
                                  <marker.icon className="h-4 w-4" style={{ color: marker.color }} />
                                </div>
                                <span className="font-medium text-gray-800">{marker.name}</span>
                              </div>
                              <Badge variant="outline" className={getStatusColor(marker.status)}>
                                <span className="flex items-center">
                                  {getStatusIcon(marker.status)}
                                  <span className="ml-1 capitalize">{marker.status}</span>
                                </span>
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl font-bold text-gray-800">{marker.value}</div>
                              <div className="text-sm text-gray-600">{marker.unit}</div>
                              <div className="text-xs text-gray-500 ml-2">Normal: {marker.normalRange}</div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{marker.recommendations}</p>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#16a07c] border-[#16a07c] hover:bg-[#16a07c]/10"
                            >
                              View Details
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Detailed Results Tab */}
              <TabsContent value="details" className="mt-4">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-gray-800">Blood Test Results</CardTitle>
                        <CardDescription>
                          Detailed breakdown of your blood markers from {bloodTestData.current.date}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[130px] border-[#16a07c]/20 focus:ring-[#16a07c]/20">
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
                    </div>
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
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${marker.color}20` }}
                                  >
                                    <marker.icon className="h-3 w-3" style={{ color: marker.color }} />
                                  </div>
                                  {marker.name}
                                </div>
                              </td>
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
                    <CardHeader className="pb-2 border-b border-green-100 bg-gradient-to-r from-[#16a07c]/5 to-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${selectedMarker.color}20` }}
                          >
                            <selectedMarker.icon className="h-5 w-5" style={{ color: selectedMarker.color }} />
                          </div>
                          <CardTitle className="text-xl text-gray-800">{selectedMarker.name}</CardTitle>
                        </div>
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
                          <Button className="w-full bg-[#16a07c] hover:bg-[#138e6e]">
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
                  <CardHeader className="pb-2 border-b border-green-100 bg-gradient-to-r from-[#16a07c]/5 to-white">
                    <CardTitle className="text-xl text-gray-800">Health Trends</CardTitle>
                    <CardDescription>Track how your health markers have changed over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Marker</label>
                        <Select defaultValue="1">
                          <SelectTrigger className="border-[#16a07c]/20 focus:ring-[#16a07c]/20 bg-white">
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

                      <div className="h-[300px] w-full bg-white p-4 rounded-lg border border-gray-100">
                        <div className="h-full flex flex-col">
                          <div className="flex-1 relative">
                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                              <div>Apr 2023</div>
                              <div>Jul 2023</div>
                              <div>Oct 2023</div>
                            </div>

                            {/* Y-axis grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                              <div className="border-b border-gray-100 h-0"></div>
                              <div className="border-b border-gray-100 h-0"></div>
                              <div className="border-b border-gray-100 h-0"></div>
                              <div className="border-b border-gray-100 h-0"></div>
                            </div>

                            {/* Data line */}
                            <svg
                              className="absolute inset-0 mt-4 mb-6"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <path d="M0,70 L50,60 L100,30" fill="none" stroke="#16a07c" strokeWidth="2" />
                              <circle cx="0" cy="70" r="2" fill="#16a07c" />
                              <circle cx="50" cy="60" r="2" fill="#16a07c" />
                              <circle cx="100" cy="30" r="2" fill="#16a07c" />
                            </svg>

                            {/* Gradient area under line */}
                            <svg
                              className="absolute inset-0 mt-4 mb-6"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#16a07c" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#16a07c" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d="M0,70 L50,60 L100,30 L100,100 L0,100 Z" fill="url(#gradient)" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#16a07c]/10 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Trend Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Your hemoglobin levels have been steadily improving over the past 3 tests, showing a positive
                          trend. Continue with your current diet and exercise routine to maintain these healthy levels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 border-b border-green-100 bg-gradient-to-r from-[#16a07c]/5 to-white">
                    <CardTitle className="text-xl text-gray-800">Your Personalized Health Plan</CardTitle>
                    <CardDescription>
                      Based on your blood test results, here are tailored recommendations to improve your health
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:bg-[#16a07c]/5 px-4 py-3 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-red-100 text-red-800 border-red-200 mr-3">Priority</Badge>
                            <span className="font-medium">Manage Blood Glucose Levels</span>
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
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Limit intake of refined carbohydrates and sugary foods</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Increase physical activity to at least 150 minutes per week</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include more fiber-rich foods in your diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay hydrated by drinking plenty of water</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-[#16a07c] hover:bg-[#138e6e]">View Detailed Plan</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="hover:bg-[#16a07c]/5 px-4 py-3 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 mr-3">Monitoring</Badge>
                            <span className="font-medium">Improve Platelet Count</span>
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
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include more foods rich in vitamin K, such as leafy greens and broccoli</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Consider foods with iron, vitamin B12, and folate</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay hydrated and maintain a balanced diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Schedule a follow-up test in 4-6 weeks to monitor progress</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-[#16a07c] hover:bg-[#138e6e]">Learn More</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="hover:bg-[#16a07c]/5 px-4 py-3 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-red-100 text-red-800 border-red-200 mr-3">Priority</Badge>
                            <span className="font-medium">Lower LDL Cholesterol</span>
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
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Reduce intake of saturated and trans fats</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Increase consumption of soluble fiber from oats, beans, and fruits</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Include plant sterols and stanols in your diet</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Exercise regularly and maintain a healthy weight</span>
                              </li>
                            </ul>
                            <div className="pt-2">
                              <Button className="bg-[#16a07c] hover:bg-[#138e6e]">View Heart Health Plan</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger className="hover:bg-[#16a07c]/5 px-4 py-3 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-800 border-green-200 mr-3">Maintain</Badge>
                            <span className="font-medium">Continue Healthy Habits</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-gray-600">
                              Many of your markers are within normal ranges. Continue these healthy habits:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Maintain a balanced diet rich in fruits, vegetables, and whole grains</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Stay physically active with at least 30 minutes of exercise daily</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
                                <span>Get adequate sleep (7-9 hours per night)</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-[#16a07c] mr-2 flex-shrink-0 mt-0.5" />
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

