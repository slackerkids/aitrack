"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Doctor from '@/components/Doctor';
import Client from '@/components/Client';


export default function Dashboard() {
  const [activeView, setActiveView] = useState<'doctor' | 'client'>('doctor');
  return (
    <div className="flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1">
        {activeView === 'doctor' ? <Doctor /> : <Client />}
      </div>
    </div>
  );
}