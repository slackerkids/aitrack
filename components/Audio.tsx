"use client"

import { useState, useEffect } from "react"
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

  // Sample transcription data for demonstration
  const sampleTranscription = {
    transcript:
      "Dr. Berdyshev: What brings you in today?\n\nPatient: I've been having these headaches for about two weeks now.\n\nDr. Berdyshev: Can you describe the pain and where it's located?\n\nPatient: It's mostly in the front of my head. The pain is throbbing, I'd rate it around 7 out of 10.\n\nDr. Berdyshev: Are you experiencing any nausea or visual changes with these headaches?\n\nPatient: No, just the pain.\n\nDr. Berdyshev: Have you tried any medication?\n\nPatient: I've been taking ibuprofen, but it's not helping much.",
    document:
      "Assessment: Tension headache, possibly migraine.\n\nPlan:\n1) Complete neurological examination\n2) Consider prescription-strength analgesics\n3) Recommend stress reduction techniques\n4) Follow-up in two weeks if symptoms persist\n5) Consider referral to neurology if no improvement with treatment.",
  }

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
          if (recordingInterval) {
            clearInterval(recordingInterval)
            setRecordingInterval(null)
          }
          setActiveTab("review")
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    initMediaRecorder()

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval)
      }
    }
  }, [recordingInterval])

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
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingDuration(0)

      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)

      setRecordingInterval(interval)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const sendAudioToServer = async () => {
    if (!audioBlob) return

    setIsLoading(true)
    setProcessingProgress(0)

    // For demo purposes, use the sample data instead of making an actual API call
    const formData = new FormData()
    formData.append("file", audioBlob, "doctor-recording.wav")

    const token = localStorage.getItem("token")

    try {
      // Simulate API delay
      setTimeout(() => {
        setTranscriptionData(sampleTranscription)
        setProcessingProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setActiveTab("results")
        }, 500)
      }, 3000)

      // Uncomment for actual API call
      /*
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
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
      */
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetRecording = () => {
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
                    
                    <div className="bg-[#16a07c]/5 px-6 py-2 flex justify-end">
                      <Button
                        variant="link"
                        className="text-[#16a07c] text-sm p-0 h-auto"
                        onClick={() => {
                          setTranscriptionData(sampleTranscription)
                          setActiveTab("results")
                        }}
                      >
                        View Results →
                      </Button>
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
                              <Button 
                                variant="link" 
                                className="text-[#16a07c]"
                                onClick={() => {
                                  setTranscriptionData(sampleTranscription)
                                  setActiveTab("results")
                                }}
                              >
                                View Sample Results
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

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-gray-700">Audio Recording</div>
                            <div className="text-xs text-gray-500">{formatTime(recordingDuration)}</div>
                          </div>

                          <div className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <Waveform className="h-5 w-5 text-[#16a07c]" />
                              <div className="h-10 flex-1 flex items-center space-x-0.5">
                                {[...Array(40)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-[#16a07c]/60 rounded-full"
                                    style={{ height: `${Math.sin(i / 3) * 16 + 20}px` }}
                                  />
                                ))}
                              </div>
                            </div>

                            {audioBlob && (
                              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mt-3" />
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            Please review your recording before submitting for transcription. You can re-record if
                            needed or proceed to get AI-powered transcription and recommendations.
                          </p>
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
                              setTranscriptionData(sampleTranscription)
                              setActiveTab("results")
                            }}
                          >
                            View Sample Results
                          </Button>
                          <CoolMode>
                            <Button
                              onClick={sendAudioToServer}
                              className="bg-gradient-to-r from-[#16a07c] to-[#75eea1] hover:from-[#138e6e] hover:to-[#5ed889] text-white px-6"
                              disabled={isLoading || !audioBlob}
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
                                {transcriptionData.transcript.split('\n\n').map((part, index) => {
                                  if (part.startsWith('Dr.')) {
                                    return (
                                      <div key={index} className="mb-3">
                                        <p className="font-medium text-[#16a07c]">{part.split(':')[0]}:</p>
                                        <p className="pl-4">{part.split(':').slice(1).join(':').trim()}</p>
                                      </div>
                                    );
                                  } else if (part.startsWith('Patient:')) {
                                    return (
                                      <div key={index} className="mb-3">
                                        <p className="font-medium text-gray-700">{part.split(':')[0]}:</p>
                                        <p className="pl-4">{part.split(':').slice(1).join(':').trim()}</p>
                                      </div>
                                    );
                                  } else {
                                    return <p key={index} className="mb-3">{part}</p>;
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
                            <p className="text-gray-600 mb-4">Record audio or view a sample to see results</p>
                          </div>
                          <Button 
                            className="bg-[#16a07c] hover:bg-[#138e6e] text-white"
                            onClick={() => {
                              setTranscriptionData(sampleTranscription)
                              setActiveTab("results")
                            }}
                          >
                            <FileAudio className="w-4 h-4 mr-2" />
                            View Sample Results
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

