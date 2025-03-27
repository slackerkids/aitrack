"use client"

import { useState, useEffect, useRef } from "react"
import {
  Mic,
  Square,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileAudio,
  AudioWaveformIcon as Waveform,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CoolMode } from "@/components/ui/cool-mode"

// Custom Audio Player with waveform visualization
const CustomAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      const value = (audio.currentTime / audio.duration) * 100 || 0
      setProgress(value)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative bg-white p-3 rounded-md border border-gray-200">
      {/* Hidden audio element for controlling playback */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={togglePlayback}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
            ${isPlaying 
              ? "bg-red-100 hover:bg-red-200 text-red-500" 
              : "bg-[#16a07c]/10 hover:bg-[#16a07c]/20 text-[#16a07c]"
            }`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        
        <div className="text-xs font-medium text-gray-700">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Clickable waveform with progress */}
      <div 
        className="relative h-12 w-full cursor-pointer overflow-hidden rounded-md bg-gray-50"
        onClick={(e) => {
          if (!audioRef.current) return;
          // Calculate position click
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = x / rect.width;
          // Set the current time
          audioRef.current.currentTime = percentage * audioRef.current.duration;
        }}
      >
        {/* Progress overlay */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-[#16a07c]/20 z-0 pointer-events-none transition-all"
          style={{ width: `${progress}%` }}
        />

        {/* Waveform bars */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="flex items-center space-x-0.5 h-full px-2 w-full">
            {[...Array(95)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#16a07c]/60 rounded-full relative z-10"
                style={{ 
                  height: `${Math.sin(i / 5) * 20 + 30}%`,
                  opacity: i % 3 === 0 ? 0.9 : i % 2 === 0 ? 0.7 : 0.5
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-center text-gray-500">
        Click on the waveform to seek
      </div>
    </div>
  )
}

// Добавим новый интерфейс для пациентов
interface Patient {
  id: number;
  name: string;
  status?: string;
  risk_level?: string;
}

const AudioTranscription = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcriptionData, setTranscriptionData] = useState<{ document: string; transcript: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("record")
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  // Новые состояния для управления пациентами
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  // Получение списка пациентов
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/my_patients/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };
    
    fetchPatients();
  }, []);

  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        console.log("Requesting microphone access...")
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log("Microphone access granted")

        // Create audio context for visualization
        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        source.connect(analyser)

        // Создаем переменную для сохранения чанков в замыкании
        const chunks: Blob[] = []

        // Set up MediaRecorder with audio/webm mime type (more widely supported)
        const recorder = new MediaRecorder(stream)
        console.log("MediaRecorder created with mime type:", recorder.mimeType)
        setMediaRecorder(recorder)
        setErrorMessage(null)

        recorder.ondataavailable = (event) => {
          console.log("Data available event - data size:", event.data.size)
          if (event.data.size > 0) {
            // Сохраняем чанк в локальной переменной
            chunks.push(event.data)
            console.log("Added chunk, total chunks:", chunks.length)

            // Также обновляем состояние для отображения в UI
            setAudioChunks((currentChunks) => [...currentChunks, event.data])
          }
        }

        recorder.onstop = () => {
          console.log("Recording stopped, processing chunks...")
          if (recordingInterval) {
            clearInterval(recordingInterval)
            setRecordingInterval(null)
          }

          console.log("Processing recorded chunks:", chunks.length)

          if (chunks.length === 0) {
            console.error("No audio chunks collected!")
            setErrorMessage("No audio data was recorded. Please check your microphone permissions.")
            return
          }

          // Create the final audio blob from collected chunks
          try {
            const audioBlob = new Blob(chunks, { type: recorder.mimeType })
            console.log("Audio blob created, size:", audioBlob.size, "bytes")
            setAudioBlob(audioBlob)
            setAudioChunks(chunks) // Обновляем состояние для соответствия

            // Create URL for audio playback
            const url = URL.createObjectURL(audioBlob)
            setAudioUrl(url)

            setActiveTab("review")
          } catch (error) {
            console.error("Error creating audio blob:", error)
            setErrorMessage(`Error creating audio blob: ${error instanceof Error ? error.message : String(error)}`)
          }
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
        setErrorMessage(`Microphone access error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    initMediaRecorder()

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval)
      }
      // Clean up audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [])

  // Reset audio chunks when starting a new recording
  useEffect(() => {
    if (isRecording) {
      setAudioChunks([])
      setAudioBlob(null)
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
      setErrorMessage(null)
    }
  }, [isRecording, audioUrl])

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
      try {
        console.log("Starting recording...")
        // Очищаем предыдущие данные
        setAudioChunks([])
        setAudioBlob(null)
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
          setAudioUrl(null)
        }
        setErrorMessage(null)

        // Запускаем запись
        // Используем меньший timeslice для более частого получения данных
        mediaRecorder.start(500)
        console.log("MediaRecorder state:", mediaRecorder.state)
        setIsRecording(true)
        setRecordingDuration(0)

        const interval = setInterval(() => {
          setRecordingDuration((prev) => prev + 1)
        }, 1000)

        setRecordingInterval(interval)
      } catch (error) {
        console.error("Error starting recording:", error)
        setErrorMessage(`Error starting recording: ${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      setErrorMessage("MediaRecorder not initialized. Please refresh the page and try again.")
    }
  }

  const stopRecording = () => {
    console.log("Trying to stop recording. MediaRecorder state:", mediaRecorder?.state)
    if (mediaRecorder) {
      try {
        if (mediaRecorder.state === "recording") {
          console.log("Stopping active recording...")
          mediaRecorder.stop()
        } else {
          console.log("MediaRecorder not in recording state, current state:", mediaRecorder.state)
        }
        setIsRecording(false)
        if (recordingInterval) {
          clearInterval(recordingInterval)
          setRecordingInterval(null)
        }
      } catch (error) {
        console.error("Error stopping recording:", error)
        setErrorMessage(`Error stopping recording: ${error instanceof Error ? error.message : String(error)}`)
        setIsRecording(false)
      }
    } else {
      console.error("No MediaRecorder instance available")
      setIsRecording(false)
    }
  }

  const sendAudioToServer = async () => {
    if (!audioBlob) return
    if (!selectedPatientId) {
      setErrorMessage("Please select a patient before submitting");
      return;
    }

    setIsLoading(true)
    setProcessingProgress(0)

    const formData = new FormData()
    formData.append("file", audioBlob, "doctor-recording.wav")

    const token = localStorage.getItem("token")

    try {
      // Call the API endpoint with patient_id as a query parameter
      const response = await fetch(`http://127.0.0.1:8000/transcribe?patient_id=${selectedPatientId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload audio")
      }

      const data = await response.json()
      console.log("File uploaded successfully:", data)
      setTranscriptionData(data)
      setProcessingProgress(100)
      setIsLoading(false)
      setActiveTab("results")
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsLoading(false)
      setErrorMessage(`Upload error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetRecording = () => {
    setAudioChunks([])
    setAudioBlob(null)
    setTranscriptionData(null)
    setActiveTab("record")
    setProcessingProgress(0)
  }

  return (
    <div className="h-full py-6 bg-gradient-to-b from-green-50 to-white pt-[80px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Voice Transcription</h1>
            <p className="text-gray-600">
              Record your voice notes and get AI-powered transcription and medical recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Info Cards */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md overflow-hidden bg-white">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-[#16a07c] flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Record Audio</h3>
                        <p className="text-sm text-gray-600">Speak clearly into your microphone</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">AI Transcription</h3>
                        <p className="text-sm text-gray-600">Our AI converts speech to text</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#16a07c] text-white flex items-center justify-center font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Get Recommendations</h3>
                        <p className="text-sm text-gray-600">Receive AI-powered medical insights</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2 border-b border-green-100">
                  <CardTitle className="text-gray-800">Best Practices</CardTitle>
                  <CardDescription>For optimal transcription results</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Speak clearly and at a moderate pace
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Minimize background noise when recording
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Include all relevant medical information
                    </p>
                    <p className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#16a07c] mr-2 mt-0.5" />
                      Review the transcription for accuracy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-green-100 bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-gray-800">Medical Voice Assistant</CardTitle>
                      <CardDescription>Record and transcribe your medical notes</CardDescription>
                    </div>
                    <Badge className="bg-[#16a07c]">AI-Powered</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs defaultValue="record" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b border-green-100">
                      <TabsList className="w-full rounded-none bg-transparent border-b border-green-100 p-0">
                        <TabsTrigger
                          value="record"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                          disabled={isLoading}
                        >
                          Record
                        </TabsTrigger>
                        <TabsTrigger
                          value="review"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                          disabled={isLoading}
                        >
                          Review
                        </TabsTrigger>
                        <TabsTrigger
                          value="results"
                          className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] data-[state=active]:shadow-none py-3"
                          disabled={isLoading}
                        >
                          Results
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="record" className="p-6 space-y-6 mt-0">
                      <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <div
                          className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-50 animate-pulse" : "bg-[#16a07c]/10"}`}
                        >
                          <div
                            className={`w-24 h-24 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100" : "bg-[#16a07c]/20"}`}
                          >
                            <Mic className={`w-12 h-12 ${isRecording ? "text-red-500" : "text-[#16a07c]"}`} />
                          </div>
                        </div>

                        {isRecording ? (
                          <div className="space-y-2">
                            <div className="text-xl font-semibold text-gray-800">Recording in progress</div>
                            <div className="text-3xl font-bold text-[#16a07c]">{formatTime(recordingDuration)}</div>
                            <div className="flex justify-center">
                              <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1.5 h-6 bg-[#16a07c] rounded-full animate-pulse"
                                    style={{
                                      animationDelay: `${i * 0.15}s`,
                                      height: `${Math.random() * 24 + 12}px`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Speak clearly into your microphone</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-xl font-semibold text-gray-800">Ready to Record</div>
                            <p className="text-sm text-gray-600">
                              Click the button below to start recording your medical notes
                            </p>
                          </div>
                        )}

                        <div className="pt-4 flex flex-col items-center space-y-3">
                          {!isRecording ? (
                            <>
                              <Button
                                onClick={startRecording}
                                className="bg-[#16a07c] hover:bg-[#138e6e] text-white rounded-full h-16 w-16 flex items-center justify-center"
                              >
                                <Mic className="h-6 w-6" />
                              </Button>
                              <Button variant="link" className="text-[#16a07c]" onClick={() => setActiveTab("record")}>
                                Start Recording
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={stopRecording}
                              variant="destructive"
                              className="rounded-full h-16 w-16 flex items-center justify-center"
                            >
                              <Square className="h-6 w-6" />
                            </Button>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 flex items-center pt-4">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Your recording will be processed securely and confidentially
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="review" className="p-6 space-y-6 mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FileAudio className="w-5 h-5 mr-2 text-[#16a07c]" />
                          Review Your Recording
                        </h3>

                        {errorMessage && (
                          <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            {errorMessage}
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-gray-700">Audio Recording</div>
                            <div className="text-xs text-gray-500">
                              {formatTime(recordingDuration)} •
                              {audioBlob ? ` ${(audioBlob.size / 1024).toFixed(1)} KB` : " No data"}
                            </div>
                          </div>

                          <div className="relative bg-white rounded-md">
                            {audioUrl ? (
                              <div className="">
                                <CustomAudioPlayer audioUrl={audioUrl} />
                              </div>
                            ) : (
                              <div className="mt-3 text-amber-600 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                No audio data available. Try recording again.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Patient selection section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Patient</h4>
                          
                          {isLoadingPatients ? (
                            <div className="flex justify-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin text-[#16a07c]" />
                            </div>
                          ) : patients.length > 0 ? (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                Select the patient for whom this transcription is being created:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {patients.map((patient) => (
                                  <div 
                                    key={patient.id}
                                    className={`
                                      p-3 rounded-md border cursor-pointer transition-colors
                                      ${selectedPatientId === patient.id 
                                        ? 'bg-[#16a07c]/10 border-[#16a07c]' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                      }
                                    `}
                                    onClick={() => setSelectedPatientId(patient.id)}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-3 h-3 rounded-full mr-2 ${
                                        selectedPatientId === patient.id ? 'bg-[#16a07c]' : 'bg-gray-300'
                                      }`} />
                                      <div>
                                        <p className="font-medium text-gray-800">{patient.name}</p>
                                        {patient.status && (
                                          <p className="text-xs text-gray-500">{patient.status}</p>
                                        )}
                                      </div>
                                      {patient.risk_level && (
                                        <Badge 
                                          className={`ml-auto ${
                                            patient.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                                            patient.risk_level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                            'bg-green-100 text-green-800'
                                          }`}
                                        >
                                          {patient.risk_level}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-amber-800 text-sm">
                              <AlertCircle className="w-4 h-4 inline mr-2" />
                              No patients available. Please add patients first.
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            Please review your recording before submitting for transcription. You can re-record if
                            needed or proceed to get AI-powered transcription and recommendations.
                          </p>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100">
                          <p className="font-medium">Troubleshooting Tips:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Ensure your microphone is properly connected and working</li>
                            <li>Check browser permissions for microphone access</li>
                            <li>Try refreshing the page or using a different browser</li>
                            <li>Make sure you're speaking loud enough for your microphone to detect</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[#16a07c] text-[#16a07c]"
                          onClick={() => setActiveTab("record")}
                        >
                          Re-record
                        </Button>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="link"
                            className="text-[#16a07c]"
                            onClick={() => {
                              setActiveTab("record")
                            }}
                          >
                            Back to Recording
                          </Button>
                          <CoolMode>
                            <Button
                              onClick={sendAudioToServer}
                              className="bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white px-6"
                              disabled={isLoading || !audioBlob || !selectedPatientId || (audioBlob && audioBlob.size < 100)}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Transcribe Audio
                                </>
                              )}
                            </Button>
                          </CoolMode>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="results" className="p-6 space-y-6 mt-0">
                      {transcriptionData ? (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Transcription Results</h3>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Transcribed Text</h4>
                              <div className="bg-white p-4 rounded-md border border-gray-200 text-gray-800">
                                {transcriptionData.transcript.split("\n\n").map((part, index) => {
                                  if (part.startsWith("Dr.")) {
                                    return (
                                      <div key={index} className="mb-3">
                                        <p className="font-medium text-[#16a07c]">{part.split(":")[0]}:</p>
                                        <p className="pl-4">{part.split(":").slice(1).join(":").trim()}</p>
                                      </div>
                                    )
                                  } else if (part.startsWith("Patient:")) {
                                    return (
                                      <div key={index} className="mb-3">
                                        <p className="font-medium text-gray-700">{part.split(":")[0]}:</p>
                                        <p className="pl-4">{part.split(":").slice(1).join(":").trim()}</p>
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <p key={index} className="mb-3">
                                        {part}
                                      </p>
                                    )
                                  }
                                })}
                              </div>
                            </div>

                            <div className="bg-[#16a07c]/5 p-4 rounded-lg border border-[#16a07c]/20">
                              <h4 className="text-sm font-medium text-[#16a07c] mb-2">AI Medical Recommendation</h4>
                              <div className="bg-white p-4 rounded-md border border-[#16a07c]/10 text-gray-800 whitespace-pre-line">
                                {transcriptionData.document}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center pt-4">
                            <Button onClick={resetRecording} className="bg-[#16a07c] hover:bg-[#138e6e] text-white">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Record New Audio
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Transcription Results Yet</h3>
                            <p className="text-gray-600 mb-4">Record audio to see results</p>
                          </div>
                          <Button
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => setActiveTab("record")}
                          >
                            <Mic className="w-4 h-4 mr-2" />
                            Record Audio
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {isLoading && (
                    <div className="px-6 pb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Processing audio...</span>
                          <span className="text-[#16a07c] font-medium">{Math.round(processingProgress)}%</span>
                        </div>
                        <Progress
                          value={processingProgress}
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-[#16a07c]"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioTranscription

