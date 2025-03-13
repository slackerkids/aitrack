export interface Doctor {
    id: number
    name: string
    specialization: string
    avatar: string
    availability: {
      day: number
      slots: {
        startTime: string
        endTime: string
      }[]
    }[]
    rating: number
    experience: number
  }
  
  export interface Appointment {
    id: number
    doctorId: number
    patientName: string
    date: string
    startTime: string
    endTime: string
    status: "upcoming" | "completed" | "cancelled"
    type: "video" | "in-person"
  }
  
  export interface TimeSlot {
    time: string
    available: boolean
  }
  
  