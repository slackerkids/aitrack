"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Mic, StopCircle } from "lucide-react"

interface AiTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
  maxRows?: number
}

export default function AiTextInput({
  value,
  onChange,
  placeholder = "Type your message or click the mic to record...",
  minRows = 3,
  maxRows = 8,
}: AiTextInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"

    const scrollHeight = textarea.scrollHeight
    const lineHeight = Number.parseInt(getComputedStyle(textarea).lineHeight)
    const minHeight = lineHeight * minRows
    const maxHeight = lineHeight * maxRows

    let newHeight = scrollHeight
    if (newHeight < minHeight) newHeight = minHeight
    if (maxHeight && newHeight > maxHeight) newHeight = maxHeight

    textarea.style.height = `${newHeight}px`
  }, [value, minRows, maxRows])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        sendAudioToServer(audioBlob)
      })

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.wav")

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
        onChange(value + (value ? " " : "") + text)
      } else {
        console.error("Error transcribing audio")
      }
    } catch (error) {
      console.error("Error sending audio to server:", error)
    }
  }

  return (
    <div
      className={`relative rounded-lg border transition-all duration-200 ${
        isFocused ? "border-green-500 ring-2 ring-green-500/20" : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-t-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center">
          <Sparkles className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI-Powered Analysis</span>
        </div>
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-1 rounded-full transition-colors duration-200 ${
            isRecording ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white dark:bg-zinc-950 rounded-b-lg resize-none overflow-auto focus:outline-none"
        style={{ minHeight: `${minRows * 24}px` }}
      />

      <div className="absolute bottom-2 right-3 text-xs text-zinc-400">
        {value.length > 0 && `${value.length} characters`}
      </div>
    </div>
  )
}

