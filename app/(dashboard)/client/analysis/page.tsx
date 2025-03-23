"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  Camera,
  Send,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  FileUp,
  Dna,
  Microscope,
  Sparkles,
  Zap,
  Brain,
  Heart,
  Pill,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BloodAnalysis from "./blood-analysis"

export default function AnalysisPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [analysisReady, setAnalysisReady] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [processingStage, setProcessingStage] = useState<number>(0)
  const [processingText, setProcessingText] = useState<string>("Initializing analysis...")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isLoading && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 90))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, uploadProgress])

  useEffect(() => {
    if (isLoading) {
      const stages = [
        "Initializing analysis...",
        "Extracting data from documents...",
        "Identifying blood markers...",
        "Comparing with reference ranges...",
        "Generating health insights...",
        "Creating personalized recommendations...",
        "Finalizing your health report...",
      ]

      let currentStage = 0
      const interval = setInterval(() => {
        if (currentStage < stages.length - 1 && uploadProgress > (currentStage + 1) * 15) {
          currentStage++
          setProcessingStage(currentStage)
          setProcessingText(stages[currentStage])
        }

        if (uploadProgress >= 90) {
          setProcessingStage(stages.length - 1)
          setProcessingText(stages[stages.length - 1])
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isLoading, uploadProgress])

  // DNA animation
  useEffect(() => {
    if (isLoading && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      const particles: any[] = []
      const colors = ["#16a07c", "#75eea1", "#3498db", "#f1c40f"]
      const particleCount = 100

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          opacity: Math.random() * 0.5 + 0.5,
        })
      }

      let animationFrame: number

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw DNA helix
        const time = Date.now() * 0.001
        const amplitude = 50
        const frequency = 0.05
        const spacing = 15

        ctx.strokeStyle = "#16a07c"
        ctx.lineWidth = 2

        // First strand
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin(x * frequency + time) * amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Second strand
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin(x * frequency + time + Math.PI) * amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Connecting lines
        for (let x = 0; x < canvas.width; x += spacing) {
          const y1 = canvas.height / 2 + Math.sin(x * frequency + time) * amplitude
          const y2 = canvas.height / 2 + Math.sin(x * frequency + time + Math.PI) * amplitude

          ctx.beginPath()
          ctx.moveTo(x, y1)
          ctx.lineTo(x, y2)
          ctx.strokeStyle = `rgba(22, 160, 124, ${0.3 + Math.sin(x * frequency + time) * 0.2})`
          ctx.stroke()
        }

        // Draw particles
        particles.forEach((particle) => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle =
            particle.color +
            Math.floor(particle.opacity * 255)
              .toString(16)
              .padStart(2, "0")
          ctx.fill()

          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

          // Random opacity changes
          particle.opacity += (Math.random() - 0.5) * 0.02
          if (particle.opacity < 0.2) particle.opacity = 0.2
          if (particle.opacity > 0.8) particle.opacity = 0.8
        })

        animationFrame = requestAnimationFrame(animate)
      }

      animate()

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isLoading])

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setPdfName(file.name)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadProgress(0)
    setProcessingStage(0)
    setProcessingText("Initializing analysis...")

    // Simulate processing
    setTimeout(() => {
      setUploadProgress(100)

      setTimeout(() => {
        setIsLoading(false)
        setAnalysisReady(true)
      }, 1000)
    }, 12000) // Longer processing time to show the animation
  }

  if (analysisReady) {
    return <BloodAnalysis />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background canvas for DNA animation */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[Dna, Microscope, Heart, Brain, Pill, Zap].map((Icon, index) => (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1 + Math.random() * 0.2,
              }}
            >
              <Icon size={30 + Math.random() * 40} />
            </div>
          ))}
        </div>

        <div className="z-10 max-w-md w-full px-4 py-8 ">
          <div className="text-center mb-8 ">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#16a07c] to-[#75eea1] mb-4 relative ">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Analyzing Your Health</h1>
            <p className="text-gray-300 max-w-sm mx-auto">
              Our AI is processing your medical data to provide personalized insights
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">{processingText}</span>
                <span className="text-[#75eea1] font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#16a07c] to-[#75eea1] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                "Extracting data from documents",
                "Identifying blood markers",
                "Comparing with reference ranges",
                "Generating health insights",
                "Creating personalized recommendations",
                "Finalizing your health report",
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      processingStage > index
                        ? "bg-[#16a07c]"
                        : processingStage === index
                          ? "bg-gray-700 border-2 border-[#16a07c] animate-pulse"
                          : "bg-gray-700"
                    }`}
                  >
                    {processingStage > index && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div
                    className={`text-sm ${
                      processingStage > index
                        ? "text-gray-300"
                        : processingStage === index
                          ? "text-white font-medium"
                          : "text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
              <p>This usually takes less than a minute</p>
              <p className="mt-1">We're preparing a comprehensive analysis of your health data</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-xs text-gray-400">
              <Dna className="w-4 h-4 mr-1" />
              Powered by HealthHunter AI
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-green-50 to-white pt-[90px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Analysis</h1>
            <p className="text-gray-600">Upload your medical test results for a comprehensive AI-powered analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Info Cards */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-[#16a07c]/10 to-white">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-[#16a07c] flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Upload Medical Tests</h3>
                        <p className="text-sm text-gray-600">Share your blood test results or medical documents</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">AI Analysis</h3>
                        <p className="text-sm text-gray-600">Our AI analyzes your test results</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Get Detailed Insights</h3>
                        <p className="text-sm text-gray-600">
                          Receive personalized health insights and recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-gray-800">Supported Test Types</CardTitle>
                  <CardDescription>We can analyze the following medical tests</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Complete Blood Count (CBC)
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Comprehensive Metabolic Panel (CMP)
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Lipid Panel (Cholesterol)
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Thyroid Function Tests
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Vitamin and Mineral Panels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-green-100 bg-gradient-to-r from-[#16a07c]/5 to-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-gray-800">Upload Medical Tests</CardTitle>
                      <CardDescription>Share your test results for AI analysis</CardDescription>
                    </div>
                    <Badge className="bg-[#16a07c]">AI-Powered</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b border-green-100">
                      <TabsList className="w-full rounded-none bg-transparent border-b border-green-100 p-0">
                        <TabsTrigger
                          value="upload"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                        >
                          Upload Files
                        </TabsTrigger>
                        <TabsTrigger
                          value="review"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                        >
                          Review & Submit
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <TabsContent value="upload" className="p-6 space-y-6 mt-0">
                        {/* PDF Upload */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-[#16a07c]" />
                            Blood Test Results (PDF)
                          </h3>

                          <div
                            className={`relative p-4 rounded-xl transition-all duration-300 ${
                              pdfFile
                                ? "bg-[#16a07c]/5 border border-[#16a07c]/20"
                                : "bg-gradient-to-br from-[#16a07c]/5 to-[#75eea1]/5 border-2 border-dashed border-[#16a07c]/30"
                            }`}
                          >
                            <label className="flex flex-col items-center justify-center w-full cursor-pointer py-[100px]">
                              {!pdfFile ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="w-12 h-12 mb-3 rounded-full bg-[#16a07c]/10 flex items-center justify-center">
                                    <FileUp className="w-6 h-6 text-[#16a07c]" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700">Upload your blood test results</p>
                                  <p className="mt-1 text-xs text-gray-500">PDF files up to 10MB</p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between w-full ">
                                  <div className="flex items-center">
                                    <FileText className="w-8 h-8 text-[#16a07c] mr-3" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                        {pdfName}
                                      </p>
                                      <p className="text-xs text-gray-500">PDF document</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPdfFile(null)
                                      setPdfName(null)
                                    }}
                                    className="text-sm text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>


                        <div className="flex justify-end pt-4">
                          <Button
                            type="button"
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => setActiveTab("review")}
                            disabled={!pdfFile && !imagePreview}
                          >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="review" className="p-6 space-y-6 mt-0">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">Review Your Files</h3>

                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                              <div className="space-y-2">
                                {imagePreview && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Camera className="w-4 h-4 text-[#16a07c]" />
                                    <span>Image of test results uploaded</span>
                                  </div>
                                )}
                                {pdfFile && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="w-4 h-4 text-[#16a07c]" />
                                    <span>{pdfName}</span>
                                  </div>
                                )}
                                {!imagePreview && !pdfFile && (
                                  <div className="text-sm text-amber-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    No files uploaded
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">What Happens Next</h4>
                              <p className="text-sm text-gray-600">
                                After submitting your files, our AI will analyze your test results and provide:
                              </p>
                              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>Detailed breakdown of all test markers</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>Comparison with normal ranges</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>Personalized health recommendations</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>Trend analysis if you've uploaded previous tests</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#16a07c] text-[#16a07c]"
                            onClick={() => setActiveTab("upload")}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white px-6"
                            disabled={isLoading || (!imagePreview && !pdfFile)}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit for Analysis
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </form>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

