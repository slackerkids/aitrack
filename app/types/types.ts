// types.ts
export interface Doctor {
    id: number
    name: string
    type: string
  }
  
  export interface Appointment {
    id: number
    start_time: string
    end_time: string
    status: string
    doctor?: Doctor
    patient?: {
      id: number
      name: string
      avatar?: string
    }
    reason?: string
    notes?: string
    type?: "online" | "in-person"
  }
  