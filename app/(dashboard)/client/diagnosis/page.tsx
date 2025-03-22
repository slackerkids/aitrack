"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CoolMode } from "@/components/ui/cool-mode"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Upload, FileText, Camera, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState<string>("")
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
    }
  }, [])

  // Simulate upload progress
  useEffect(() => {
    if (loading && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 90))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loading, uploadProgress])

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
    setLoading(true)
    setUploadProgress(0)

    const formData = new FormData()
    if (imagePreview) {
      const imageFile = await fetch(imagePreview)
        .then((response) => response.blob())
        .then((blob) => new File([blob], "image.png", { type: "image/png" }))
      formData.append("file", imageFile)
    }

    if (pdfFile) {
      formData.append("file", pdfFile)
    }

    formData.append("symptoms", symptoms)

    try {
      const response = await fetch("http://127.0.0.1:8000/submit_request", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setUploadProgress(100)
      const data = await response.json()
      console.log("Success:", data)

      setTimeout(() => {
        router.push("/client/chat")
        toast.success("Request submitted successfully!")
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error submitting request.")
    } finally {
      setTimeout(() => {
        setLoading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  return (
    <div className="h-full py-6 bg-gradient-to-b from-green-50 to-white  pt-[80px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Consultation</h1>
            <p className="text-gray-600">
              Share your symptoms and medical information for a comprehensive AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Info Cards */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md overflow-hidden bg-white">
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
                        <h3 className="font-medium text-gray-800">Upload Information</h3>
                        <p className="text-sm text-gray-600">Share your symptoms and medical documents</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">AI Analysis</h3>
                        <p className="text-sm text-gray-600">Our AI analyzes your information</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Get Insights</h3>
                        <p className="text-sm text-gray-600">Receive personalized health insights</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-gray-800">Privacy Guaranteed</CardTitle>
                  <CardDescription>Your data is secure and confidential</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      End-to-end encryption for all uploads
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      HIPAA compliant storage and processing
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Data is never shared with third parties
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-green-100 bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-gray-800">Health Consultation</CardTitle>
                      <CardDescription>Share your health information for analysis</CardDescription>
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
                          value="symptoms"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                        >
                          Describe Symptoms
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
                        {/* Photo Upload */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                              <Camera className="w-5 h-5 mr-2 text-[#16a07c]" />
                              Upload Photo
                            </h3>
                            {imagePreview && (
                              <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="relative">
                            <label
                              className={`flex flex-col items-center justify-center w-full h-[200px] rounded-xl cursor-pointer transition-all duration-300 ${
                                imagePreview
                                  ? "bg-white"
                                  : "bg-gradient-to-br from-[#16a07c]/5 to-[#75eea1]/5 border-2 border-dashed border-[#16a07c]/30 hover:bg-[#16a07c]/10"
                              }`}
                            >
                              {!imagePreview ? (
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                  <div className="w-16 h-16 mb-4 rounded-full bg-[#16a07c]/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-[#16a07c]" />
                                  </div>
                                  <p className="text-lg font-medium text-gray-700">Upload an image</p>
                                  <p className="mt-2 text-sm text-gray-500">Drag and drop or click to browse</p>
                                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                </div>
                              ) : (
                                <div className="relative w-full h-full">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Image Preview"
                                    className="w-full h-full object-contain rounded-xl"
                                  />
                                </div>
                              )}
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                          </div>
                        </div>

                        {/* PDF Upload */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-[#16a07c]" />
                            Medical Analysis (PDF)
                          </h3>

                          <div
                            className={`relative p-2 rounded-xl transition-all duration-300 ${
                              pdfFile
                                ? "bg-[#16a07c]/5 border border-[#16a07c]/20"
                                : "bg-gradient-to-br from-[#16a07c]/5 to-[#75eea1]/5 border-2 border-dashed border-[#16a07c]/30"
                            }`}
                          >
                            <label className="flex flex-col items-center justify-center w-full cursor-pointer py-3">
                              {!pdfFile ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="w-12 h-12 mb-3 rounded-full bg-[#16a07c]/10 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-[#16a07c]" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700">Upload your medical analysis</p>
                                  <p className="mt-1 text-xs text-gray-500">PDF files up to 10MB</p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between w-full">
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

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => setActiveTab("symptoms")}
                          >
                            Continue
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="symptoms" className="p-6 space-y-6 mt-0">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">Describe Your Symptoms</h3>
                          <p className="text-sm text-gray-600">
                            Please provide detailed information about your symptoms to help our AI provide better
                            insights.
                          </p>

                          <textarea
                            className="w-full h-[300px] p-4 rounded-xl border border-gray-200 focus:border-[#16a07c] focus:outline-none focus:border-green-600 focus:bg-white focus:ring-0 focus:ring-offset-0  transition-all duration-300 resize-none"
                            placeholder="Please describe your symptoms in detail. Include when they started, their severity, and any other relevant information that might help with diagnosis."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                          ></textarea>

                          <div className="text-xs text-gray-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            The more details you provide, the more accurate our analysis will be.
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
                            type="button"
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => setActiveTab("review")}
                          >
                            Continue
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="review" className="p-6 space-y-6 mt-0">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">Review Your Information</h3>

                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                              <div className="space-y-2">
                                {imagePreview && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Camera className="w-4 h-4 text-[#16a07c]" />
                                    <span>Image uploaded</span>
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
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms Description</h4>
                              {symptoms ? (
                                <div className="text-sm text-gray-600 max-h-[150px] overflow-y-auto">{symptoms}</div>
                              ) : (
                                <div className="text-sm text-amber-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  No symptoms described
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#16a07c] text-[#16a07c]"
                            onClick={() => setActiveTab("symptoms")}
                          >
                            Back
                          </Button>
                          <CoolMode>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white px-6"
                              disabled={loading || (!imagePreview && !pdfFile && !symptoms)}
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Consultation
                                </>
                              )}
                            </Button>
                          </CoolMode>
                        </div>
                      </TabsContent>
                    </form>
                  </Tabs>

                  {loading && (
                    <div className="px-6 pb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Uploading and processing...</span>
                          <span className="text-[#16a07c] font-medium">{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-[#16a07c]"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

