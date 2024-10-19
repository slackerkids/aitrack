"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CoolMode } from "@/components/ui/cool-mode";
import { toast } from "react-toastify"; // Import toast
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function FormClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const formData = new FormData();
    if (imagePreview) {
      const imageFile = await fetch(imagePreview)
        .then(response => response.blob())
        .then(blob => new File([blob], 'image.png', { type: 'image/png' }));
      formData.append("file", imageFile);
    }

    if (pdfFile) {
      formData.append("file", pdfFile); // Append the PDF file
    }

    formData.append("symptoms", symptoms); // Append the symptoms text

    try {
      const response = await fetch("http://127.0.0.1:8000/submit_request", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      console.log("Success:", data);
      router.push("/client"); // Redirect to /client
      toast.success("Request submitted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting request."); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="form max-w-[90%] mx-auto p-6 bg-white rounded-lg shadow-md h-[80vh] ">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Photo Upload Input */}
        <div className="h-[80%]">
          <label className="block text-sm font-medium text-gray-700">
            Upload Photo
          </label>
          <div className="mt-1">
            <label className="flex items-center justify-center w-full h-[68vh] bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300">
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

        {/* Other Inputs (Prompt and PDF) */}
        <div className="space-y-4 h-full">
          {/* PDF Upload Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload your analysis
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Describe your symptoms
            </label>
            <textarea
              className="textarea textarea-bordered mt-1 block w-full h-[53vh] resize-none p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              rows={4}
              placeholder="Describe your symptoms here..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            ></textarea>
          </div>

          <CoolMode>
            <Button className="w-full mt-[30px] bg-gradient-to-r from-[#16a07c] to-[#75eea1]" disabled={loading}>
              {loading ? 
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                : "Send"} {/* Show spinner when loading */}
            </Button>
          </CoolMode>
        </div>
      </form>
    </div>
  );
}
