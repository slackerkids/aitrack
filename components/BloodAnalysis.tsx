"use client";

import React, { useState, useRef } from 'react';

const BloodAnalysis = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>(''); // State for the response message
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') { // Accept only PDF files
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') { // Accept only PDF files
      setPdfFile(file);
    } else {
      alert('Please drop a valid PDF file.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (symptoms.trim() === '') {
      alert('Please describe the symptoms before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('symptoms', symptoms); 
    if (pdfFile) {
      formData.append('file', pdfFile); 
    } else {
      alert('Please upload a PDF file before submitting.');
      return;
    }

    const token = localStorage.getItem('token');

    console.log('Submitting symptoms:', symptoms);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      console.log('Response from server:', data);
      setResponseMessage(data.response || 'Symptoms submitted successfully!'); // Set response message
    } catch (error) {
      console.error('Error submitting symptoms:', error);
      setResponseMessage('Error submitting symptoms. Please try again.'); // Set error message
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the hidden input
    }
  };

  return (
    <div className="blood-analysis max-w-[90%] mx-auto p-2 bg-white mt-[50px] rounded-lg shadow-md ">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div
          className="mt-1 flex-grow h-[50px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick} // Allow clicking the drop area to open file dialog
        >
          <input
            type="file"
            accept="application/pdf" // Accept only PDF files
            onChange={handleFileChange}
            className="hidden" // Hide the default file input
            ref={fileInputRef} // Attach ref to input
          />
          {pdfFile ? (
            <span className="text-gray-500">Uploaded PDF: {pdfFile.name}</span>
          ) : (
            <span className="text-gray-500">Drag and drop your PDF file here or click to select</span>
          )}
        </div>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe the symptoms here..."
          className="border-2 border-gray-300 rounded-lg p-2 h-24"
        />
        <button type="submit" className="bg-blue-600 text-white py-3 px-4 rounded-lg">
          Submit
        </button>
      </form>
      {responseMessage && ( // Conditionally render the response message
        <div className="mt-4 p-2 border rounded-lg bg-gray-100 text-gray-700">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default BloodAnalysis;
