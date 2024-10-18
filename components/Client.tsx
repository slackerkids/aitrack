import React, { useEffect, useState } from "react";
import FormClient from "./FormClient";
import visitsData from "../data/data.json";
import Map from "./Map";

interface Visit {
  name: string;
  date: string;
  reason: string;
}

const Client = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null); // State for the clicked visit

  useEffect(() => {
    setVisits(visitsData);
  }, []);

  // Function to handle click on a visit and set it as selected
  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  // Function to close the popup
  const closePopup = () => {
    setSelectedVisit(null);
  };

  return (
    <div className="p-6 bg-gray-50 max-h-screen relative">
      {/* Map with hospital label */}
      <div className="relative mt-2 rounded-lg z-10">
        <Map center={[50.293483169889384, 57.158443679418326]} zoom={16} />
        {/* Nearest hospital text */}
        <div className="absolute top-5 right-5 bg-white p-2 rounded-lg shadow-md" style={{zIndex: "50"}}>
          <p className="text-blue-500 font-semibold">
            Nearest Hospital: 542.5 m <br/>
            <a href="https://2gis.kz/aktobe/search/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0%20%D1%81%D0%BA%D0%BE%D1%80%D0%BE%D0%B9%20%D0%BC%D0%B5%D0%B4%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%B8%20(%D0%91%D0%A1%D0%9C%D0%9F)/firm/70000001032078108/57.147897%2C50.29872?m=57.158607%2C50.294055%2F15.29">
            Больница скорой медицинской помощи (БСМП)
            </a>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[50px]">
        <div className="bg-base-500 p-6 rounded-lg shadow-custom-light">
          <h3 className="text-lg font-semibold mb-4">Latest Updates</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>New feature release on 12th October</li>
            <li>System maintenance scheduled for 20th October</li>
          </ul>
        </div>

        <div className="bg-base-500 p-6 rounded-lg shadow-custom-light">
          <h3 className="text-lg font-semibold mb-4">Medical Statistics</h3>
          <p>Total Patients: 500</p>
          <p>Appointments Today: 25</p>
          <p>Active Cases: 120</p>
        </div>

        <div className="bg-base-500 p-6 rounded-lg shadow-custom-light">
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
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-custom-light cursor-pointer"
              onClick={() => handleVisitClick(visit)} // Trigger popup on click
            >
              <h4 className="font-semibold">{visit.name}</h4>
              <p>Date: {visit.date}</p>
              <p>Reason: {visit.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popup for selected visit */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Visit Details</h3>
            <p><strong>Name:</strong> {selectedVisit.name}</p>
            <p><strong>Date:</strong> {selectedVisit.date}</p>
            <p><strong>Reason:</strong> {selectedVisit.reason}</p>

            <button
              onClick={closePopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;
