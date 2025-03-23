import React, { useState, useEffect } from "react";

const Audio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<{ document: string; transcript: string } | null>(null); // State for transcription data
  const [isLoading, setIsLoading] = useState(false); // State for loading feedback

  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioBlob(event.data)
          }
        }

        recorder.onstop = () => {
          sendAudioToServer(); // Automatically send audio to server when recording stops
        };
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    initMediaRecorder();
  }, []);

  // Simulate processing progress
  useEffect(() => {
    if (isLoading && processingProgress < 90) {
      const timer = setTimeout(() => {
        setProcessingProgress((prev) => Math.min(prev + Math.random() * 15, 90))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, processingProgress])

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)

      setRecordingInterval(interval)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }

  const sendAudioToServer = async () => {
    if (!audioBlob) return

    const formData = new FormData();
    formData.append("file", audioBlob, "doctor-recording.wav");

    const token = localStorage.getItem("token"); // Get the token from local storage
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload audio")
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);

      // Set the transcription state with the response
      setTranscriptionData(data); // Store the full transcription data

    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Set loading state back to false after upload
    }
  };

  return (
    <div className="flex flex-col justify-between h-[100%] p-6 bg-gray-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Doctor Audio Recorder</h2>

        {/* Displaying the transcription data */}
        

        {/* Audio player and send button container */}
        {audioBlob && (
          <div className="mt-4 flex items-center">
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mr-4" />
            <button
              onClick={sendAudioToServer}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
            { !isLoading ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-white w-[25px] py-[5px]">
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
            ) : (
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )
                
            }
              
            </button>
          </div>
        )}

        {transcriptionData && (
          <div className="mt-4">
            <p className="font-semibold">Transcription:</p>
            <p>{transcriptionData.transcript}</p> <br/>
            <p className="font-semibold">AI recommendation:</p>
            <p>{transcriptionData.document}</p>
          </div>
        )}

        {/* Loading Indicator */}
        
      </div>

      <div className="rounded-lg mt-4">
        <div className="flex flex-col items-center mb-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center bg-green-500 text-white rounded-full p-3 px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-[30px] fill-white"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/></svg>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-[30px] fill-white">
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Audio;
