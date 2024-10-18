import React, { useEffect, useState } from "react";
import FormClient from "./FormClient";

const Client = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      const response = await fetch("../data/visits.json");
      const data = await response.json();
      setVisits(data);
    };

    fetchVisits();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <nav className="bg-gray-800 text-white p-4 fixed w-full z-10">
        <h1 className="text-xl font-bold">My Dashboard</h1>
      </nav>

      {/* Main Content with top margin */}
      <div className="p-6 bg-gray-50 mt-16 flex-1 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Other cards... */}

          {/* Visit Log Card */}
          <div className="bg-gray-300 p-6 rounded-lg shadow-custom-light">
            <h3 className="text-lg font-semibold mb-4">Visit Log</h3>
            <div className="space-y-4">
              {/* Individual Visit Entries */}
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

        <div className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-custom-light">
            <h3 className="text-lg font-semibold mb-4">Submit Form</h3>
            <FormClient />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
