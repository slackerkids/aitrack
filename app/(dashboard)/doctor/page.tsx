"use client"
import Doctor from '@/components/Doctor';


export default function Dashboard() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Doctor/>
      </div>
    </div>
  );
}