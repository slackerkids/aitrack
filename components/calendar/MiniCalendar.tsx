"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface MiniCalendarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
}

export default function MiniCalendar({ currentMonth, miniCalendarDays }: MiniCalendarProps) {
  const today = new Date()

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-800 font-medium">{currentMonth}</h3>
        <div className="flex gap-1">
          <button className="p-1 rounded-full hover:bg-green-100">
            <ChevronLeft className="h-4 w-4 text-green-700" />
          </button>
          <button className="p-1 rounded-full hover:bg-green-100">
            <ChevronRight className="h-4 w-4 text-green-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-xs text-green-600 font-medium py-1">
            {day}
          </div>
        ))}

        {miniCalendarDays.map((day, i) => (
          <div
            key={i}
            className={`text-xs rounded-full w-7 h-7 flex items-center justify-center ${
              day === today.getDate() ? "bg-green-500 text-white" : "text-green-800 hover:bg-green-100"
            } ${!day ? "invisible" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

