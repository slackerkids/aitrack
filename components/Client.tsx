import React, { useEffect, useState } from "react";
import FormClient from "./FormClient";
import visitsData from "../data/data.json";

interface Visit {
  name: string;
  date: string;
  reason: string;
}

const Client = () => {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    setVisits(visitsData);
  }, []);

  return (
    <div className="p-6 bg-gray-50 max-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-green-500 p-6 rounded-lg shadow-custom-light">
          <h3 className="text-lg font-semibold mb-4">Latest Updates</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>New feature release on 12th October</li>
            <li>System maintenance scheduled for 20th October</li>
          </ul>
        </div>

        <div className="bg-purple-500 p-6 rounded-lg shadow-custom-light">
          <h3 className="text-lg font-semibold mb-4">Medical Statistics</h3>
          <p>Total Patients: 500</p>
          <p>Appointments Today: 25</p>
          <p>Active Cases: 120</p>
        </div>

        {/* Health Metrics Card */}
        <div className="bg-yellow-500 p-6 rounded-lg shadow-custom-light">
          <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
          <p>Avg. Blood Pressure: 120/80 mmHg</p>
          <p>Avg. Heart Rate: 75 bpm</p>
          <p>Recent Checkups: 30</p>
        </div>
      </div>

      {/* Visit Log Card */}
      <div className="mt-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Visit Log</h3>
        <div className="space-y-4">
          {visits.map((visit, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-custom-light">
              <h4 className="font-semibold">{visit.name}</h4>
              <p>Date: {visit.date}</p>
              <p>Reason: {visit.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Client;
