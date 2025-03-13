"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import FileUploader from "./file-uploader"
import AiTextInput from "./ai-text-input"

const BloodAnalysis = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [symptoms, setSymptoms] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (file: File) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Please upload a valid PDF file.")
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

    const formData = new FormData()
    formData.append("symptoms", symptoms)
    formData.append("file", pdfFile)

    const token = localStorage.getItem("token")

    setIsLoading(true)
    setStatus("idle")

    try {
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

      const data = await response.json()
      setResponseMessage(data.response || "Analysis completed successfully!")
      setStatus("success")
    } catch (error) {
      console.error("Error submitting symptoms:", error)
      setResponseMessage("Error submitting analysis. Please try again.")
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Blood Analysis Assistant</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-zinc-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload Blood Test Results</h3>
              <FileUploader
                onFileSelected={handleFileChange}
                accept="application/pdf"
                maxSize={10}
                ref={fileInputRef}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Describe Your Symptoms</h3>
              <AiTextInput
                value={symptoms}
                onChange={setSymptoms}
                placeholder="Describe any symptoms or concerns you're experiencing..."
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Results"}
            </Button>
          </form>
        </CardContent>

        {responseMessage && (
          <CardFooter className="p-6 pt-0 bg-gradient-to-b from-white to-green-50 dark:from-zinc-900 dark:to-green-900/20">
            <div
              className={`w-full p-4 rounded-lg ${
                status === "success"
                  ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                  : status === "error"
                    ? "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-800 dark:bg-zinc-900/20 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-start gap-3">
                {status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                ) : status === "error" ? (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
                ) : null}
                <div className="flex-1">
                  <p className="whitespace-pre-line">{responseMessage}</p>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default BloodAnalysis

