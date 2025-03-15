"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import axiosInstance from "@/app/axios/instance"
import { toast } from "react-toastify"

const commonStyles = {
  inputIcon: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
  input:
    "block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white caret-blue-600",
  button:
    "inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-[#16a07c] to-[#75eea1] focus:outline-none hover:opacity-80 focus:opacity-80",
  secondaryButton:
    "inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none",
  link: "font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline",
}

interface PatientRegistrationProps {
  onToggleForm: () => void;
}

const PatientRegistration = ({ onToggleForm }: PatientRegistrationProps) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    gender: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    condition: "",
    riskLevel: "No",
    bloodType: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateStep = (currentStep: number) => {
    setError("")

    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill in all required fields")
        return false
      }
    } else if (currentStep === 2) {
      if (!formData.gender || !formData.dateOfBirth || !formData.phone) {
        setError("Please fill in all required fields")
        return false
      }
    }

    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateStep(step)) {
      return
    }

    setIsSubmitting(true)

    try {
      const { confirmPassword, ...dataToSend } = formData

      const response = await axiosInstance.post("/register/", dataToSend)
      setSuccess("Successfully registered! Redirecting to login...")
      toast.success("Registration successful")

      // Saving JWT Token to localStorage if provided in response
      if (response.data.access_token) {
        const token = response.data.access_token
        localStorage.setItem("token", token)

        // Save role
        const role = response.data.role || "patient"
        localStorage.setItem("role", role)

        // Redirect to patient dashboard
        setTimeout(() => {
          router.push("/client")
        }, 2000)
      } else {
        // If no token is provided, redirect to login
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
      toast.error("Registration failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-xl font-semibold">Account Information</h3>
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div className={commonStyles.inputIcon}>
                    <FaUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={commonStyles.input}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div className={commonStyles.inputIcon}>
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={commonStyles.input}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div className={commonStyles.inputIcon}>
                    <FaLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="Create a password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={commonStyles.input}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full py-4 px-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="block w-full py-4 px-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={commonStyles.input}
                  required
                />
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter your address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full py-4 px-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white"
                  rows={2}
                  required
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center px-4 bg-white sm:px-6 lg:px-8  overflow-y-auto">
      <div className="xl:w-full xl:max-w-md 2xl:max-w-lg xl:mx-auto  flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                <>Sign up to </>
                <span className="text-4xl font-bold bg-gradient-to-tr from-green-500 via-green-400 to-green-600 text-transparent bg-clip-text">
                  HealHunter
                </span>
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onToggleForm}
                  className={commonStyles.link}
                >
                  Login
                </button>
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between">
              <div className={`text-sm ${step >= 1 ? "text-green-600 font-medium" : "text-gray-500"}`}>Account</div>
              <div className={`text-sm ${step >= 2 ? "text-green-600 font-medium" : "text-gray-500"}`}>Personal</div>
            </div>
            <div className="mt-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 bg-gradient-to-r from-[#16a07c] to-[#75eea1]"
                style={{ width: `${((step - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className={commonStyles.secondaryButton}>
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              )}

              {step < 2 ? (
                <button type="button" onClick={nextStep} className={commonStyles.button}>
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className={commonStyles.button}>
                  {isSubmitting ? "Registering..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientRegistration

