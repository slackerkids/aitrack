"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/app/axios/instance"
import ReactMarkdown from "react-markdown"
import {
  Search,
  Plus,
  Bot,
  User,
  Send,
  ArrowLeft,
  Paperclip,
  Heart,
  Brain,
  Activity,
  Pill,
  Stethoscope,
  MessageSquare,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: number
  user_message?: string
  bot_reply?: string
  user_id: number
  created_at?: string
}

// AI Agent types
interface Agent {
  id: string
  name: string
  avatar: string
  role: string
  description: string
  specialty: string
  icon: React.ElementType
  color: string
  active?: boolean
}

// Chat session type
interface ChatSession {
  id: string
  agentId: string
  title: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
  symptoms?: string
  color?: string
}

// Request type from API
interface ChatRequest {
  title: string
  color: string
  createdAt: string
  symptoms: string
  response: string
}

export default function Dashboard() {
  const [prompt, setPrompt] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true)
  const [selectedChatColor, setSelectedChatColor] = useState<string | null>(null)

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Sample AI agents
  const agents: Agent[] = [
    {
      id: "general-md",
      name: "Dr. Health AI",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "General Practitioner",
      description: "Your primary healthcare assistant for general medical advice and triage.",
      specialty: "General Medicine",
      icon: Stethoscope,
      color: "#16a07c",
      active: true,
    },
    {
      id: "cardio-md",
      name: "CardioBot",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "Cardiology Assistant",
      description: "Specialized in heart health, cardiovascular conditions, and preventive care.",
      specialty: "Cardiology",
      icon: Heart,
      color: "#e05252",
    },
    {
      id: "neuro-md",
      name: "NeuroAssist",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "Neurology Assistant",
      description: "Focused on neurological conditions, brain health, and cognitive function.",
      specialty: "Neurology",
      icon: Brain,
      color: "#5271e0",
    },
    {
      id: "wellness-md",
      name: "WellnessGuide",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "Wellness Coach",
      description: "Helps with lifestyle, nutrition, fitness, and preventive health measures.",
      specialty: "Wellness",
      icon: Activity,
      color: "#e0cb52",
    },
    {
      id: "pharma-md",
      name: "MedInfoBot",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "Medication Information",
      description: "Provides information about medications, side effects, and interactions.",
      specialty: "Pharmacology",
      icon: Pill,
      color: "#9952e0",
    },
  ]

  // Fetch chat requests from API
  useEffect(() => {
    const fetchChatRequests = async () => {
      setIsLoadingChats(true)
      try {
        const response = await axiosInstance.get("/my_requests")
        const chatRequests: ChatRequest[] = response.data

        // Transform chat requests into chat sessions
        const sessions: ChatSession[] = chatRequests.map((req, index) => {
          // Assign a random agent for each chat
          const randomAgentIndex = Math.floor(Math.random() * agents.length)
          const agent = agents[randomAgentIndex]

          return {
            id: `chat-${index + 1}`,
            agentId: agent.id,
            title: req.title,
            lastMessage: "Continue your consultation...",
            lastMessageTime: new Date(req.createdAt),
            unread: Math.floor(Math.random() * 2), // Random unread count (0 or 1)
            symptoms: req.symptoms,
            color: req.color,
          }
        })

        setChatSessions(sessions)

        // Set the default selected agent
        if (sessions.length > 0) {
          const firstSession = sessions[0]
          const agent = agents.find((a) => a.id === firstSession.agentId)
          setSelectedAgent(agent || agents.find((agent) => agent.active) || agents[0])
          setSelectedChatColor(firstSession.color || null)

          // Fetch messages for this chat
          fetchMessages()
        } else {
          // If no chat sessions, set default agent
          setSelectedAgent(agents.find((agent) => agent.active) || agents[0])
        }
      } catch (error) {
        console.error("Error fetching chat requests:", error)
        // Fallback to default agent if API call fails
        setSelectedAgent(agents.find((agent) => agent.active) || agents[0])
      } finally {
        setIsLoadingChats(false)
      }
    }

    fetchChatRequests()
  }, [])

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("/messages")
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a message
  const handlePromptSend = async () => {
    if (prompt.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        user_message: prompt,
        user_id: 1,
        created_at: new Date().toISOString(),
      }

      // Add user message to chat
      setMessages((prev) => [...prev, newMessage])
      setPrompt("")
      setIsLoading(true)

      try {
        const response = await axiosInstance.post("/chatbot", {
          user_message: prompt,
        })

        const botReply: string = response.data.bot_reply

        // Add bot reply after a short delay
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              bot_reply: botReply,
              user_id: 2,
              created_at: new Date().toISOString(),
            },
          ])
          setIsLoading(false)
        }, 500)
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

  // Start a new chat with an agent
  const startNewChat = (agent: Agent) => {
    setSelectedAgent(agent)
    setSelectedChatColor(null)
    setMessages([
      {
        id: Date.now(),
        bot_reply: `Hello! I'm ${agent.name}, your ${agent.role}. How can I help you today?`,
        user_id: 2,
        created_at: new Date().toISOString(),
      },
    ])
    setIsMobileMenuOpen(false)
  }

  // Load chat session
  const loadChatSession = (session: ChatSession) => {
    const agent = agents.find((a) => a.id === session.agentId)
    if (agent) {
      setSelectedAgent(agent)
      setSelectedChatColor(session.color || null)

      // Fetch messages for this chat
      fetchMessages()

      // Mark as read
      setChatSessions((prev) => prev.map((chat) => (chat.id === session.id ? { ...chat, unread: 0 } : chat)))

      setIsMobileMenuOpen(false)
    }
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
      {/* Header for mobile */}
      <div className="md:hidden h-16 border-b border-green-100 flex items-center justify-between px-4 bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-medium text-gray-900">Health AI Chat</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Custom Sidebar - No shadcn dependency */}
        <div
          className={`w-80 border-r border-green-100 bg-white flex-shrink-0 flex flex-col ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:block z-20`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Health AI Chat</h2>
              <Badge className="bg-green-600">Beta</Badge>
            </div>
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
                {chatSessions.map((chat) => {
                  const agent = agents.find((a) => a.id === chat.agentId)
                  if (!agent) return null

                  return (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedAgent?.id === agent.id ? "bg-green-50 border-l-4 border-green-500" : ""
                      }`}
                      onClick={() => loadChatSession(chat)}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback style={{ backgroundColor: chat.color || agent.color }} className="text-white">
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900 truncate">{chat.title || agent.name}</h3>
                          <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <Badge className="bg-green-600 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
                <Bot className="h-10 w-10 text-gray-300 mb-2" />
                <h3 className="text-base font-medium text-gray-700">No conversations yet</h3>
                <p className="text-sm text-gray-500 mt-1">Start a chat with one of our AI health agents</p>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-green-100 bg-gray-50">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => startNewChat(agents[0])}>
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {selectedAgent && (
            <div className="hidden md:flex h-16 border-b border-green-100 items-center justify-between px-4 bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                  <AvatarFallback
                    style={{ backgroundColor: selectedChatColor || selectedAgent.color }}
                    className="text-white"
                  >
                    {selectedAgent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-xs text-gray-500">{selectedAgent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">AI Assistant Online</span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50/50 to-white"
          >
            {selectedAgent ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.user_id === 1 ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${msg.user_id === 1 ? "flex-row-reverse" : ""}`}
                    >
                      {msg.user_id === 2 && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                          <AvatarFallback
                            style={{ backgroundColor: selectedChatColor || selectedAgent.color }}
                            className="text-white"
                          >
                            {selectedAgent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {msg.user_id === 1 && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.user_id === 1 ? "bg-green-600 text-white" : "bg-white border border-gray-200"
                          }`}
                        >
                          <ReactMarkdown className="text-sm">
                            {msg.user_id === 1
                              ? msg.user_message || ""
                              : (msg.bot_reply || "").replace(/12345678!!!/g, "").trim()}
                          </ReactMarkdown>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{formatTime(msg.created_at || new Date())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                        <AvatarFallback
                          style={{ backgroundColor: selectedChatColor || selectedAgent.color }}
                          className="text-white"
                        >
                          {selectedAgent.name.charAt(0)}
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
                  <Bot className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Health AI Chat</h2>
                <p className="text-gray-600 max-w-md mb-6">
                  Select an existing conversation or start a new chat with one of our specialized AI health agents.
                </p>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => startNewChat(agents[0])}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            )}
          </div>

          {/* Message Input */}
          {selectedAgent && (
            <div className="p-4 border-t border-green-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-md resize-none focus:border-green-600 focus:ring focus:ring-green-600/20 min-h-[44px] max-h-[120px]"
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
                AI responses are for informational purposes only and should not replace professional medical advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

