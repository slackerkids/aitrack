"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Client from '@/components/Client';


export default function Dashboard() {
  const [activeView, setActiveView] = useState<'doctor' | 'client'>('doctor');
  return (
    <div className="flex">
      <div className="flex-1">
        <Client/>
      </div>
    </div>
  );
}