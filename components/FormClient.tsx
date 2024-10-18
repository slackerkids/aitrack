"use client";

import React, { useState } from "react";

export default function FormClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <form className="space-y-4">
        {/* Photo Upload Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Photo
          </label>
          <div className="mt-1">
            <label
              className="flex items-center justify-center w-full h-48 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              {!imagePreview ? (
                <span className="text-gray-500">Click to upload a photo</span>
              ) : (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Prompt Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prompt
          </label>
          <textarea
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md 
                       shadow-sm focus:border-blue-500 focus:ring-blue-500 
                       sm:text-sm"
            rows={4}
            placeholder="Write your prompt here..."
          ></textarea>
        </div>

        {/* PDF Upload Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-100"
          />
        </div>
      </form>
    </div>
  );
}