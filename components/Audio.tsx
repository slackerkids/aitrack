"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const Audio = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcriptionData, setTranscriptionData] = useState<{ document: string; transcript: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
          sendAudioToServer()
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    initMediaRecorder()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Start recording
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  // Send the audio file to the server
  const sendAudioToServer = async () => {
    if (!audioBlob) return

    const formData = new FormData()
    formData.append("file", audioBlob, "doctor-recording.wav")

    const token = localStorage.getItem("token")
    setIsLoading(true)
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

      const data = await response.json()
      console.log("File uploaded successfully:", data)
      setTranscriptionData(data)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 rounded-xl">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-green-800 dark:text-green-300">Doctor Audio Recorder</h2>

        {/* Audio visualization and recording UI */}
        <div className="flex flex-col items-center justify-center mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
              isRecording
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600",
            )}
            type="button"
          >
            {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
          </button>

          <span
            className={cn(
              "font-mono text-sm mt-3 transition-opacity duration-300",
              isRecording ? "text-green-700 dark:text-green-300" : "text-gray-400",
            )}
          >
            {formatTime(recordingTime)}
          </span>

          <div className="h-4 w-64 flex items-center justify-center gap-0.5 mt-4">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  isRecording
                    ? "bg-gradient-to-t from-green-300 to-teal-500 dark:from-green-500 dark:to-teal-300 animate-pulse"
                    : "bg-gray-200 dark:bg-gray-700 h-1",
                )}
                style={
                  isRecording
                    ? {
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`,
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <p className="h-4 text-sm mt-3 text-gray-600 dark:text-gray-300">
            {isRecording ? "Listening..." : "Click to speak"}
          </p>
        </div>

        {/* Audio player and send button container */}
        {audioBlob && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg">
            <div className="flex items-center">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mr-4 h-10 rounded-lg" />
              <button
                onClick={sendAudioToServer}
                disabled={isLoading}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-full shadow-md disabled:opacity-70"
              >
                {!isLoading ? (
                  <Send className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Transcription results */}
        {transcriptionData && (
          <div className="mt-6 p-5 bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900 rounded-lg shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Transcription:</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                {transcriptionData.transcript}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">AI recommendation:</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                {transcriptionData.document}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Audio