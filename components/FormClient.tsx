"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CoolMode } from "@/components/ui/cool-mode"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Upload, FileText, Camera, Send, Loader2 } from "lucide-react"

export default function FormClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState<string>("")
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
    }
  }, [])

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

      const data = await response.json()
      console.log("Success:", data)
      router.push("/client/chat")
      toast.success("Request submitted successfully!")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error submitting request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full mx-auto ">
      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Health Consultation</h2>
          <p className="text-gray-600">Share your symptoms and medical information for analysis</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8" onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div className="space-y-4">
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
                className={`flex flex-col items-center justify-center w-full h-[560px] rounded-xl cursor-pointer transition-all duration-300 ${
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

          {/* Symptoms and PDF Section */}
          <div className="space-y-6">
            {/* PDF Upload */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#16a07c]" />
                Medical Analysis (PDF)
              </h3>

              <div
                className={`relative p-4 rounded-xl transition-all duration-300 ${
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
                          <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{pdfName}</p>
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
                  <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Symptoms Textarea */}
            <div className="space-y-3 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">Describe Your Symptoms</h3>

              <textarea
                className="w-full h-[260px] p-4 rounded-xl border border-gray-200 focus:border-[#16a07c] focus:ring focus:ring-[#16a07c]/20 transition-all duration-300 resize-none"
                placeholder="Please describe your symptoms in detail. Include when they started, their severity, and any other relevant information that might help with diagnosis."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <CoolMode>
              <Button
                className="w-full h-14 mt-4 bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Consultation
                  </>
                )}
              </Button>
            </CoolMode>
          </div>
        </form>
      </div>
    </div>
  )
}

