"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import MyCalendar from '@/components/Calendar';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

const Home: React.FC = () => {
  const [doctors] = useState<Doctor[]>([
    { id: 1, name: 'Dr. Alice Johnson', specialization: 'Cardiologist' },
    { id: 2, name: 'Dr. Bob Williams', specialization: 'Dermatologist' },
    { id: 3, name: 'Dr. Clara Smith', specialization: 'Neurologist' },
    { id: 4, name: 'Dr. David Brown', specialization: 'Pediatrician' },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsCalendarVisible(true);
  };

  const handleBackToDoctors = () => {
    setIsCalendarVisible(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="h-[92.6vh] flex flex-col justify-center bg-gray-100">

        <div className="w-full flex p-4 ">
        {/* Doctors List Section */}
            <div className="flex-shrink-0 w-full  w-1/3 p-4 h-[85vh] bg-white shadow-md rounded-lg mr-4"> {/* Add margin-right to separate from calendar */}
                <h2 className="text-lg font-bold mb-4">Avaible Doctors</h2>
                <ul className="space-y-2">
                    {doctors.map((doctor) => (
                    <li
                        key={doctor.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                        selectedDoctor?.id === doctor.id ? 'bg-blue-100 border-blue-400' : 'bg-gray-50'
                        } hover:bg-gray-200`}
                        onClick={() => handleDoctorClick(doctor)}
                    >
                        <h3 className="text-md font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </li>
                    ))}
                </ul>
            </div>

        {/* Calendar Section with Framer Motion Animation */}
        <motion.div
          className="w-full p-4 bg-white shadow-md rounded-lg"
          initial={{ opacity: 0, x: 200 }} // Initial state
          animate={isCalendarVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 200 }} // Animation
          transition={{ duration: 0.5 }} // Animation duration
        >
          {isCalendarVisible && <MyCalendar />}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
