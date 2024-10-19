"use client";

import React, { useState } from 'react';

const BloodAnalysis = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pdfFile) {
      const formData = new FormData();
      formData.append('file', pdfFile);

      console.log('Submitting PDF file:', pdfFile);
    } else {
      alert('Please upload a PDF file before submitting.'); 
    }
  };

  return (
    <div className="blood-analysis max-w-[90%] mx-auto p-2 bg-white mt-[50px] rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div
          className="mt-1 flex-grow h-[50px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="hidden" // Hide the default file input
          />
          <span className="text-gray-500">Drag and drop your PDF file here</span>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-3 px-4 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BloodAnalysis;
