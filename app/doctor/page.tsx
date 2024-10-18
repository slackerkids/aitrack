"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Doctor from '@/components/Doctor';


export default function Dashboard() {
  const [activeView, setActiveView] = useState<'doctor' | 'client'>('doctor');
  return (
    <div className="flex">
      <div className="flex-1">
        <Doctor/>
      </div>
    </div>
  );
}