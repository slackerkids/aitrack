import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/axios/instance";
import MarkdownRenderer from "./MarkdownRenderer";

interface Patient {
  id: number;
  name: string;
}

interface PatientDetails {
  id: number;
  name: string;
  age: number;
  symptoms: string;
  response: string;
}

const Doctor: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(
    null
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get<Patient[]>("/my_patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchPatientDetails = async (patientId: number) => {
    try {
      const response = await axiosInstance.get<PatientDetails>(
        `/patient_request/${patientId}`
      );
      setSelectedPatient(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleApprove = () => {
    setMessage("Patient approved successfully!");
  };

  const handleDecline = async (patientId: number) => {
    try {
      await axiosInstance.delete(`/patient_request/${patientId}`);
      setMessage("Patient request declined and deleted.");
      setSelectedPatient(null); // Clear the selected patient
      fetchPatients(); // Refresh the patient list
    } catch (error) {
      console.error("Error declining patient:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-base-200 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Patients</h2>
        <ul className="menu bg-base-100 w-56 rounded-box">
          {patients.map((patient) => (
            <li key={patient.id}>
              <a
                onClick={() => fetchPatientDetails(patient.id)}
                className="hover:bg-base-300"
              >
                <p className="text-lg font-medium">{patient.name}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {selectedPatient ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-4">
                {selectedPatient.name}
              </h2>

              <h3 className="text-xl font-bold bg-gradient-to-tr from-purple-500 via-blue-400 to-blue-600 text-transparent bg-clip-text">
                AI Outline
              </h3>
              <p>
                <MarkdownRenderer>{selectedPatient.response}</MarkdownRenderer>
              </p>
              <h3 className="text-xl font-bold bg-gradient-to-tr from-purple-500 via-blue-400 to-blue-600 text-transparent bg-clip-text">
                User symptom
              </h3>
              <p>{selectedPatient.symptoms}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleApprove}
                  className="btn btn-success"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(selectedPatient.id)}
                  className="btn btn-error"
                >
                  Decline
                </button>
              </div>

              {message && <p className="mt-4 text-blue-500">{message}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Select a patient to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctor;
