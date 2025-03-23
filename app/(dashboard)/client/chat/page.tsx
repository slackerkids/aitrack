"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/app/axios/instance"
import ReactMarkdown from "react-markdown"
import { Search, Plus, User, Send, Paperclip, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import AppointmentPrompt from "@/components/appointment-prompt"

// Update the interfaces to match API response
interface ChatSession {
  chat_id: number
  request_id: number
  title: string
  color: string
  doctor_name: string
  created_at: string
  last_message: string
}

interface ChatMessage {
  role: string
  text: string
}

interface ChatDetail {
  chat_id: number
  request_id: number
  doctor_name: string
  doctor_id?: number
  doctor_type?: string
  title: string
  color: string
  created_at: string
  chat_history: ChatMessage[]
  consultation_complete?: boolean
}

export default function Dashboard() {
  const [prompt, setPrompt] = useState<string>("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true)
  const [showAppointmentPrompt, setShowAppointmentPrompt] = useState<boolean>(false)

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch chat sessions from API
  useEffect(() => {
    const fetchChatSessions = async () => {
      setIsLoadingChats(true)
      try {
        const response = await axiosInstance.get("/my_chats")
        setChatSessions(response.data)

        // If chats exist, load the first one by default
        if (response.data.length > 0) {
          loadChatDetail(response.data[0].chat_id)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      } finally {
        setIsLoadingChats(false)
      }
    }

    fetchChatSessions()
  }, [])

  // Modify the loadChatDetail function to check for the confirmed field
  const loadChatDetail = async (chatId: number) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/chat/${chatId}`)

      // Check if any message in chat history contains the END_OF_CONSULTATION_MARKER
      const hasEndMarker = response.data.chat_history.some((msg: ChatMessage) =>
        msg.text.includes("END_OF_CONSULTATION_MARKER"),
      )

      // Clean the marker from all messages
      const cleanedChatHistory = response.data.chat_history.map((msg: ChatMessage) => ({
        ...msg,
        text: msg.text.replace("END_OF_CONSULTATION_MARKER", ""),
      }))

      // Set the chat with cleaned messages and consultation_complete flag
      setSelectedChat({
        ...response.data,
        chat_history: cleanedChatHistory,
        consultation_complete: hasEndMarker,
      })

      // Show appointment prompt if marker was found AND chat is not confirmed
      setShowAppointmentPrompt(hasEndMarker && !response.data.confirmed)
    } catch (error) {
      console.error(`Error fetching chat ${chatId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChat])

  // Handle sending a message
  const handlePromptSend = async () => {
    if (prompt.trim() && selectedChat) {
      // Add user message to chat history
      const userMessage: ChatMessage = {
        role: "user",
        text: prompt,
      }

      setSelectedChat({
        ...selectedChat,
        chat_history: [...selectedChat.chat_history, userMessage],
      })

      setPrompt("")
      setIsLoading(true)

      try {
        const response = await axiosInstance.post(`/chatbot/${selectedChat.chat_id}`, {
          user_message: prompt,
        })

        setTimeout(() => {
          if (response.data && response.data.bot_reply) {
            // Check if the message contains the end marker
            const hasEndMarker = response.data.bot_reply.includes("END_OF_CONSULTATION_MARKER")
            const cleanedReply = response.data.bot_reply.replace("END_OF_CONSULTATION_MARKER", "")

            const botReply: ChatMessage = {
              role: "bot",
              text: cleanedReply,
            }

            setSelectedChat((prev) => {
              if (!prev) return null
              return {
                ...prev,
                chat_history: [...prev.chat_history, botReply],
                consultation_complete: hasEndMarker || prev.consultation_complete,
                doctor_id: response.data.doctor_id || prev.doctor_id,
                doctor_type: response.data.doctor_type || prev.doctor_type,
              }
            })

            // Show appointment prompt if end marker is detected
            if (hasEndMarker) {
              setShowAppointmentPrompt(true)
            }
          }
          setIsLoading(false)
        }, 100)
      } catch (error) {
        console.error("Error sending message:", error)
        setIsLoading(false)
      }
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handlePromptSend()
    }
  }

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Uploaded file:", file)
      // Additional file handling logic would go here
    }
  }

  // Load chat session
  const loadChatSession = (session: ChatSession) => {
    loadChatDetail(session.chat_id)
    setIsMobileMenuOpen(false)
  }

  // Format time for display
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-white overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Custom Sidebar - No shadcn dependency */}
        <div
          className={`w-80 border-r border-green-100 bg-white flex-shrink-0 pt-14 flex flex-col ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:block z-20 `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-green-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-gray-50 border-gray-200 focus:border-green-600 focus:ring focus:ring-green-600/20"
              />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
              <div className="flex flex-col items-center justify-center h-40 p-4">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-500">Loading your conversations...</p>
              </div>
            ) : chatSessions.length > 0 ? (
              <div className="space-y-1">
                {chatSessions.map((chat) => (
                  <div
                    key={chat.chat_id}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedChat?.chat_id === chat.chat_id ? "bg-green-50 border-l-4 border-green-500" : ""
                    }`}
                    onClick={() => loadChatSession(chat)}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback style={{ backgroundColor: chat.color }} className="text-white">
                        {chat.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate">{chat.title.replace("-", " ")}</h3>
                        <span className="text-xs text-gray-500">{formatTime(chat.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
                <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
                <h3 className="text-base font-medium text-gray-700">No conversations yet</h3>
                <p className="text-sm text-gray-500 mt-1">Your consultations will appear here</p>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-green-100">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/client/appointment")}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {selectedChat && (
            <div className="hidden md:flex h-16 border-b border-green-100 items-center justify-between px-4 bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback style={{ backgroundColor: selectedChat.color }} className="text-white">
                    {selectedChat.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedChat.title}</h3>
                  <p className="text-xs text-gray-500">Doctor: {selectedChat.doctor_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Online</span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50/50 to-white"
          >
            {selectedChat ? (
              <div className="space-y-4">
                {selectedChat.chat_history.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {msg.role === "bot" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback style={{ backgroundColor: selectedChat.color }} className="text-white">
                            {selectedChat.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {msg.role === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.role === "user" ? "bg-green-600 text-white" : "bg-white border border-gray-200"
                          }`}
                        >
                          <ReactMarkdown className="text-sm">{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Appointment Prompt */}
                {showAppointmentPrompt && selectedChat.doctor_id && (
                  <AppointmentPrompt
                    doctorId={Number.parseInt(selectedChat.doctor_id.toString())}
                    doctorName={selectedChat.doctor_name}
                    doctorType={selectedChat.doctor_type || "Specialist"}
                    chatId={selectedChat.chat_id}
                  />
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback style={{ backgroundColor: selectedChat.color }} className="text-white">
                          {selectedChat.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="p-3 rounded-lg bg-white border border-gray-200">
                          <div className="flex space-x-2">
                            <div
                              className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                              style={{ animationDelay: "600ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={lastMessageRef}></div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 rounded-full bg-green-600/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Medical Consultations</h2>
                <p className="text-gray-600 max-w-md mb-6">
                  Select a conversation from the sidebar or book a new appointment to start a consultation.
                </p>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/client/appointment")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Button>
              </div>
            )}
          </div>

          {/* Message Input */}
          {selectedChat && (
            <div className="p-4 border-t border-green-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-green-600 focus:bg-white focus:ring-0 focus:ring-offset-0 min-h-[44px] max-h-[120px]"
                    placeholder="Type your message..."
                    rows={1}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <input type="file" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 h-[44px] w-[44px] p-0"
                  onClick={handlePromptSend}
                  disabled={!prompt.trim() || isLoading}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Your consultation history with healthcare professionals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

