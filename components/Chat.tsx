"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Bot,
  User,
  Send,
  MoreVertical,
  Clock,
  Heart,
  Brain,
  Activity,
  Pill,
  Stethoscope,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
}

// Chat message type
interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  agentId?: string
}

// Chat session type
interface ChatSession {
  id: string
  agentId: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<string>("recent")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null)
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  // Initialize chat sessions
  useEffect(() => {
    // Simulated chat history
    const sampleChatSessions: ChatSession[] = [
      {
        id: "chat-1",
        agentId: "general-md",
        lastMessage: "Based on your symptoms, I recommend scheduling an appointment with your doctor.",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unread: 1,
      },
      {
        id: "chat-2",
        agentId: "cardio-md",
        lastMessage: "Your heart rate readings look normal. Continue monitoring and maintain your exercise routine.",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unread: 0,
      },
      {
        id: "chat-3",
        agentId: "wellness-md",
        lastMessage:
          "I've prepared a personalized nutrition plan based on your goals. Let me know if you have questions!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unread: 2,
      },
    ]

    setChatSessions(sampleChatSessions)
  }, [])

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const agent = agents.find((a) => a.id === selectedChat.agentId)
      setSelectedAgent(agent || null)

      // Simulated message history
      const sampleMessages: Message[] = [
        {
          id: "msg-1",
          content: "Hello! How can I help you with your health today?",
          sender: "agent",
          timestamp: new Date(Date.now() - 1000 * 60 * 35),
          agentId: selectedChat.agentId,
        },
        {
          id: "msg-2",
          content: "I've been experiencing headaches and fatigue for the past few days.",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 33),
        },
        {
          id: "msg-3",
          content:
            "I'm sorry to hear that. Can you tell me more about your headaches? Where is the pain located, and how would you describe the intensity?",
          sender: "agent",
          timestamp: new Date(Date.now() - 1000 * 60 * 31),
          agentId: selectedChat.agentId,
        },
        {
          id: "msg-4",
          content:
            "It's mostly in the front of my head, and it's a dull, constant pain. Not severe but annoying. I've also been feeling more tired than usual.",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 29),
        },
        {
          id: "msg-5",
          content:
            "Based on your symptoms, I recommend scheduling an appointment with your doctor. In the meantime, ensure you're staying hydrated, getting enough rest, and you might try over-the-counter pain relievers like acetaminophen or ibuprofen if appropriate for you.",
          sender: "agent",
          timestamp: new Date(Date.now() - 1000 * 60 * 27),
          agentId: selectedChat.agentId,
        },
      ]

      setMessages(sampleMessages)

      // Mark as read
      setChatSessions((prev) => prev.map((chat) => (chat.id === selectedChat.id ? { ...chat, unread: 0 } : chat)))
    }
  }, [selectedChat])

  // Start a new chat with an agent
  const startNewChat = (agent: Agent) => {
    const newChatId = `chat-new-${Date.now()}`
    const newChat: ChatSession = {
      id: newChatId,
      agentId: agent.id,
      lastMessage: "Hello! How can I help you with your health today?",
      lastMessageTime: new Date(),
      unread: 0,
    }

    setChatSessions((prev) => [newChat, ...prev])
    setSelectedChat(newChat)
    setSelectedAgent(agent)
    setMessages([
      {
        id: `msg-${Date.now()}`,
        content: "Hello! How can I help you with your health today?",
        sender: "agent",
        timestamp: new Date(),
        agentId: agent.id,
      },
    ])
    setIsMobileMenuOpen(false)
  }

  // Send a message
  const sendMessage = () => {
    if (!message.trim() || !selectedAgent) return

    // Add user message
    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Based on what you've shared, I recommend monitoring your symptoms for the next 24 hours.",
        "Thank you for providing that information. It helps me better understand your situation.",
        "That's important to know. Have you noticed any other symptoms or changes recently?",
        "I'd suggest tracking these symptoms in a journal to identify any patterns or triggers.",
        "Based on your description, this could be related to several factors. Let's explore this further.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const agentMessage: Message = {
        id: `msg-agent-${Date.now()}`,
        content: randomResponse,
        sender: "agent",
        timestamp: new Date(),
        agentId: selectedAgent.id,
      }

      setMessages((prev) => [...prev, agentMessage])

      // Update chat session
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat?.id
            ? {
                ...chat,
                lastMessage: randomResponse,
                lastMessageTime: new Date(),
              }
            : chat,
        ),
      )

      setIsLoading(false)
    }, 1500)
  }

  // Format time for display
  const formatTime = (date: Date) => {
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
    <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat List */}
        <div
          className={`w-80 border-r border-green-100 bg-white flex-shrink-0 flex flex-col ${isMobileMenuOpen ? "block" : "hidden"} md:block`}
        >
          <div className="p-4 border-b border-green-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-gray-50 border-gray-200 focus:border-[#16a07c] focus:ring focus:ring-[#16a07c]/20"
              />
            </div>
          </div>

          <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-2 border-b border-green-100">
              <TabsList className="w-full grid grid-cols-2 bg-transparent h-12">
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] rounded-none"
                >
                  Recent Chats
                </TabsTrigger>
                <TabsTrigger
                  value="agents"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a07c] data-[state=active]:text-[#16a07c] rounded-none"
                >
                  AI Agents
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="recent" className="m-0 py-2">
                {chatSessions.length > 0 ? (
                  <div className="space-y-1">
                    {chatSessions.map((chat) => {
                      const agent = agents.find((a) => a.id === chat.agentId)
                      if (!agent) return null

                      return (
                        <div
                          key={chat.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50 ${selectedChat?.id === chat.id ? "bg-green-50" : ""}`}
                          onClick={() => setSelectedChat(chat)}
                        >
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback style={{ backgroundColor: agent.color }} className="text-white">
                              {agent.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
                              <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unread > 0 && (
                            <Badge className="bg-[#16a07c] h-5 w-5 flex items-center justify-center p-0 rounded-full">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Bot className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700">No conversations yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Start a chat with one of our AI health agents</p>
                    <Button className="mt-4 bg-[#16a07c] hover:bg-[#138e6e]" onClick={() => setActiveTab("agents")}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Conversation
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="agents" className="m-0 py-2">
                <div className="space-y-3 p-3">
                  {agents.map((agent) => (
                    <Card
                      key={agent.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                      onClick={() => startNewChat(agent)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={agent.avatar} alt={agent.name} />
                              <AvatarFallback style={{ backgroundColor: agent.color }} className="text-white">
                                {agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{agent.name}</h3>
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: `${agent.color}20`,
                                  color: agent.color,
                                  borderColor: `${agent.color}40`,
                                }}
                                variant="outline"
                              >
                                {agent.specialty}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{agent.role}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{agent.description}</p>
                          </div>
                          <agent.icon className="h-5 w-5" style={{ color: agent.color }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>

            <div className="p-4 border-t border-green-100 bg-gray-50">
              <Button className="w-full bg-[#16a07c] hover:bg-[#138e6e]" onClick={() => setActiveTab("agents")}>
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </Tabs>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {selectedAgent ? (
            <div className="h-16 border-b border-green-100 flex items-center justify-between px-4 bg-white">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                  <AvatarFallback style={{ backgroundColor: selectedAgent.color }} className="text-white">
                    {selectedAgent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-xs text-gray-500">{selectedAgent.role}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Agent Info</DropdownMenuItem>
                  <DropdownMenuItem>Clear Conversation</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">End Conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="h-16 border-b border-green-100 flex items-center px-4 bg-white">
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-medium text-gray-900">Health AI Chat</h2>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50/50 to-white">
            {selectedAgent ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {msg.sender === "agent" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                          <AvatarFallback style={{ backgroundColor: selectedAgent.color }} className="text-white">
                            {selectedAgent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {msg.sender === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === "user" ? "bg-[#16a07c] text-white" : "bg-white border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
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
                        <AvatarFallback style={{ backgroundColor: selectedAgent.color }} className="text-white">
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
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 rounded-full bg-[#16a07c]/10 flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-[#16a07c]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Health AI Chat</h2>
                <p className="text-gray-600 max-w-md mb-6">
                  Select an existing conversation or start a new chat with one of our specialized AI health agents.
                </p>
                <Button className="bg-[#16a07c] hover:bg-[#138e6e]" onClick={() => setActiveTab("agents")}>
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
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border-gray-200 focus:border-[#16a07c] focus:ring focus:ring-[#16a07c]/20"
                />
                <Button
                  className="bg-[#16a07c] hover:bg-[#138e6e]"
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
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

