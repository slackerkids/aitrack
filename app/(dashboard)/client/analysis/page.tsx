"use client"
import BloodAnalysis from '@/components/analysis/blood-analysis-page';
export default function Dashboard() {
  return (
    <div className="flex">
      <div className="flex-1 pt-[50px]">
        <BloodAnalysis />
      </div>
    </div>
  )
}