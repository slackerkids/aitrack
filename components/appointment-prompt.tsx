"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarClock } from "lucide-react"
import AppointmentModal from "@/components/appointment-modal"
import { useRouter } from "next/navigation"

interface AppointmentPromptProps {
  doctorId: number
  doctorName: string
  doctorType: string
  chatId: number
}

export default function AppointmentPrompt({ doctorId, doctorName, doctorType, chatId }: AppointmentPromptProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleModalClose = () => {
    setIsModalOpen(false)
    // Refresh the page to update the UI after appointment is created
    router.refresh()
  }

  return (
    <>
      <div className="bg-[#16a07c]/10 border border-[#16a07c]/20 rounded-lg p-4 my-4">
        <div className="flex items-start gap-4">
          <div className="bg-[#16a07c] rounded-full p-2 text-white">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#16a07c] font-medium mb-1">Schedule a follow-up appointment</h3>
            <p className="text-sm text-gray-600 mb-3">
              Based on your consultation, we recommend scheduling an appointment with {doctorName}.
            </p>
            <Button className="bg-[#16a07c] hover:bg-[#138e6e] text-white" onClick={() => setIsModalOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        doctorId={doctorId}
        doctorName={doctorName}
        doctorType={doctorType}
        chatId={chatId}
      />
    </>
  )
}

