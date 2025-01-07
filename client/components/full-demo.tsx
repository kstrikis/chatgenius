'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User, Users, Send, Paperclip } from 'lucide-react'

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

type FullDemoProps = {
  initialMessage: string;
}

export function FullDemo({ initialMessage }: FullDemoProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [username, setUsername] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const simulateResponse = useCallback((userMessage: Message) => {
    setTimeout(() => {
      const responseMessage: Message = {
        id: Date.now(),
        sender: 'AI Assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
        isAI: true,
      }
      setMessages(prevMessages => [...prevMessages, responseMessage])
    }, 1000)
  }, [])

  useEffect(() => {
    const newUsername = `Guest${Math.floor(Math.random() * 1000)}`
    setUsername(newUsername)
    
    const welcomeMessage: Message = {
      id: Date.now(),
      sender: 'AI Assistant',
      content: 'Welcome to ChatGenius! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
      isAI: true,
    }
    const initialUserMessage: Message = {
      id: Date.now() + 1,
      sender: newUsername,
      content: initialMessage,
      timestamp: new Date(),
      isAI: false,
    }
    setMessages([welcomeMessage, initialUserMessage])
    simulateResponse(initialUserMessage)
  }, [initialMessage, simulateResponse])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        sender: username,
        content: inputMessage,
        timestamp: new Date(),
        isAI: false,
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputMessage('')
      simulateResponse(newMessage)
    }
  }

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      `That's an interesting point about "${userMessage}". Can you elaborate?`,
      `I understand you're talking about "${userMessage}". How can I assist you further?`,
      `"${userMessage}" is a complex topic. What specific aspect would you like to explore?`,
      `Thanks for sharing your thoughts on "${userMessage}". What's your main concern?`,
      `I see you're interested in "${userMessage}". What would you like to know more about?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  return (
    <div className="w-full max-w-4xl h-[600px] flex">
      <Card className="flex-grow flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">ChatGenius</CardTitle>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={username} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </CardHeader>
        <Separator />
        <CardContent className="flex-grow overflow-hidden pt-4">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-2 ${message.isAI ? 'justify-start' : 'justify-end'}`}>
                  {message.isAI && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${message.isAI ? 'items-start' : 'items-end'}`}>
                    <span className="font-bold text-sm">{message.sender}</span>
                    <div className={`mt-1 rounded-lg p-2 ${message.isAI ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p>{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {!message.isAI && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <Separator />
        <CardFooter className="pt-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }} 
            className="flex w-full space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="outline">
              <Paperclip className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Card className="w-64 ml-4 hidden md:flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={username} />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <span>{username}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Invite Others
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

