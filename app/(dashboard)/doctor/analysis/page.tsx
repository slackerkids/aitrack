"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  FileIcon as FilePdf,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Upload,
  Loader2,
  Microscope,
  ClipboardList,
  Send,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Analysis() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [symptoms, setSymptoms] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
  })
  const [analysisType, setAnalysisType] = useState<string>("blood")

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  // Clear status after 5 seconds
  useEffect(() => {
    if (status !== "idle") {
      const timer = setTimeout(() => {
        setStatus("idle")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  // Generate preview URL for PDF
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [pdfFile])

  // Simulate upload progress
  useEffect(() => {
    if (isSubmitting && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 90))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isSubmitting, uploadProgress])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setPdfFile(file)
        setStatus("idle")
      } else {
        setStatus("error")
        setResponseMessage("Please upload a valid PDF file.")
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setPdfFile(file)
        setStatus("idle")
      } else {
        setStatus("error")
        setResponseMessage("Please upload a valid PDF file.")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPdfFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (symptoms.trim() === "") {
      setStatus("error")
      setResponseMessage("Please describe the symptoms before submitting.")
      return
    }

    if (!pdfFile) {
      setStatus("error")
      setResponseMessage("Please upload a PDF file before submitting.")
      return
    }

    setIsSubmitting(true)
    setResponseMessage("")
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("symptoms", symptoms)
    formData.append("file", pdfFile)
    formData.append("analysis_type", analysisType)

    const token = localStorage.getItem("token")

    try {
      // Simulate loading for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setUploadProgress(100)
      const data = await response.json()
      setResponseMessage(data.response || "Analysis submitted successfully!")
      setStatus("success")

      // Reset form on success
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.reset()
        }
        setPdfFile(null)
        setSymptoms("")
        setPatientInfo({ name: "", age: "", gender: "" })
        setIsSubmitting(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      console.error("Error submitting analysis:", error)
      setResponseMessage("Error submitting analysis. Please try again.")
      setStatus("error")
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="h-full py-6 bg-gradient-to-b from-green-50 to-white pt-[80px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Analysis Upload</h1>
            <p className="text-gray-600">
              Upload patient analysis documents and provide symptoms for comprehensive evaluation
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
                        <h3 className="font-medium text-gray-800">Select Analysis Type</h3>
                        <p className="text-sm text-gray-600">Choose the type of medical analysis</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Upload Documents</h3>
                        <p className="text-sm text-gray-600">Share patient's medical documents</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Describe Symptoms</h3>
                        <p className="text-sm text-gray-600">Add detailed symptom information</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-gray-800">Analysis Guidelines</CardTitle>
                  <CardDescription>Best practices for accurate results</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Upload PDF files only, with a maximum size of 10MB
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Ensure all patient information is accurate and complete
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Include detailed symptoms and relevant medical history
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Results will be processed and available in patient's record
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
                      <CardTitle className="text-xl text-gray-800">Patient Analysis</CardTitle>
                      <CardDescription>Upload and process patient medical data</CardDescription>
                    </div>
                    <Badge className="bg-[#16a07c]">Doctor Portal</Badge>
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
                          Analysis Type
                        </TabsTrigger>
                        <TabsTrigger
                          value="document"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                        >
                          Documents
                        </TabsTrigger>
                        <TabsTrigger
                          value="symptoms"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                        >
                          Symptoms
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit}>
                      <TabsContent value="upload" className="p-6 space-y-6 mt-0">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Microscope className="w-5 h-5 mr-2 text-[#16a07c]" />
                            Select Analysis Type
                          </h3>
                          <p className="text-sm text-gray-600">
                            Choose the type of medical analysis you're uploading for this patient
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            {["blood", "urine", "imaging", "pathology"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setAnalysisType(type)}
                                className={`
                                  cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center text-center
                                  transition-all duration-200 hover:bg-[#16a07c]/5
                                  ${
                                    analysisType === type
                                      ? "border-[#16a07c] bg-[#16a07c]/5 ring-2 ring-[#16a07c]/20"
                                      : "border-gray-200"
                                  }
                                `}
                              >
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                    analysisType === type
                                      ? "bg-[#16a07c]/20 text-[#16a07c]"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {type === "blood" && <FileText className="h-6 w-6" />}
                                  {type === "urine" && <FileText className="h-6 w-6" />}
                                  {type === "imaging" && <FileText className="h-6 w-6" />}
                                  {type === "pathology" && <FileText className="h-6 w-6" />}
                                </div>
                                <span className="text-sm font-medium capitalize">{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="button"
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => setActiveTab("patient")}
                          >
                            Continue
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="document" className="p-6 space-y-6 mt-0">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-[#16a07c]" />
                            Upload Analysis Document
                          </h3>
                          <p className="text-sm text-gray-600">
                            Upload the patient's medical analysis document (PDF format)
                          </p>

                          <div
                            className={`
                              relative border-2 border-dashed rounded-lg transition-all duration-200 mt-4
                              ${
                                isDragging
                                  ? "border-[#16a07c] bg-[#16a07c]/5"
                                  : "border-[#16a07c]/30 hover:bg-[#16a07c]/5"
                              }
                              ${pdfFile ? "bg-[#16a07c]/5 border-[#16a07c]/30" : ""}
                            `}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={pdfFile ? undefined : handleClick}
                          >
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                              ref={fileInputRef}
                            />

                            {pdfFile ? (
                              <div className="flex flex-col items-center p-6">
                                <div className="flex items-center justify-between w-full mb-4">
                                  <div className="flex items-center">
                                    <div className="bg-[#16a07c]/20 p-3 rounded-lg mr-3">
                                      <FilePdf className="h-8 w-8 text-[#16a07c]" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-800">{pdfFile.name}</p>
                                      <p className="text-sm text-gray-500">{(pdfFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={togglePreview}
                                      className="p-2 bg-[#16a07c]/10 rounded-md text-[#16a07c] hover:bg-[#16a07c]/20 transition-colors"
                                    >
                                      <FileText className="h-5 w-5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleRemoveFile}
                                      className="p-2 bg-red-100 rounded-md text-red-600 hover:bg-red-200 transition-colors"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>

                                {/* PDF Preview */}
                                {showPreview && previewUrl && (
                                  <div className="w-full mt-4 border rounded-lg overflow-hidden h-[300px]">
                                    <iframe src={previewUrl} className="w-full h-full" title="PDF Preview" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 px-4">
                                <div className="w-16 h-16 mb-4 rounded-full bg-[#16a07c]/10 flex items-center justify-center">
                                  <Upload className="h-8 w-8 text-[#16a07c]" />
                                </div>
                                <p className="text-lg font-medium text-gray-700 mb-1">Upload Analysis Document</p>
                                <p className="text-sm text-gray-500 mb-4 text-center">
                                  Drag and drop your PDF file here, or click to browse
                                </p>
                                <button
                                  type="button"
                                  onClick={handleClick}
                                  className="px-4 py-2 bg-[#16a07c] text-white rounded-md hover:bg-[#138e6e] transition-colors flex items-center"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Select PDF File
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#16a07c] text-[#16a07c]"
                            onClick={() => setActiveTab("patient")}
                          >
                            Back
                          </Button>
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
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2 text-[#16a07c]" />
                            Symptoms & Notes
                          </h3>
                          <p className="text-sm text-gray-600">
                            Describe the patient's symptoms and add any relevant medical notes
                          </p>

                          <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Please describe the patient's symptoms in detail. Include when they started, their severity, and any other relevant information that might help with diagnosis."
                            className="w-full h-[200px] p-4 rounded-xl border border-gray-200 focus:border-[#16a07c] focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 resize-none mt-4"
                            rows={6}
                          />

                          <div className="text-xs text-gray-500 flex items-center mt-2">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            The more details you provide, the more accurate our analysis will be.
                          </div>
                        </div>

                        <div className="space-y-4 mt-6">
                          <h3 className="text-lg font-semibold text-gray-800">Review Submission</h3>

                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Analysis Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Microscope className="w-4 h-4 text-[#16a07c]" />
                                  <span>
                                    Type: <span className="font-medium capitalize">{analysisType}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <ClipboardList className="w-4 h-4 text-[#16a07c]" />
                                  <span>
                                    Patient: <span className="font-medium">{patientInfo.name || "Not specified"}</span>
                                  </span>
                                </div>
                                {pdfFile ? (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="w-4 h-4 text-[#16a07c]" />
                                    <span>{pdfFile.name}</span>
                                  </div>
                                ) : (
                                  <div className="text-sm text-amber-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    No document uploaded
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#16a07c] text-[#16a07c]"
                            onClick={() => setActiveTab("document")}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white px-6"
                            disabled={isSubmitting || (!pdfFile && !symptoms)}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Analysis
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </form>
                  </Tabs>

                  {isSubmitting && (
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

              {/* Response Message */}
              {responseMessage && (
                <div
                  className={`
                  mt-6 p-4 rounded-lg flex items-start space-x-3 animate-fade-in
                  ${
                    status === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : status === "error"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-50 text-gray-800 border border-gray-200"
                  }
                `}
                >
                  {status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : status === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {status === "success" ? "Success" : status === "error" ? "Error" : "Information"}
                    </p>
                    <p className="text-sm">{responseMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

