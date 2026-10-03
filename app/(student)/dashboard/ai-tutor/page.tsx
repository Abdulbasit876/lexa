'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Bot, Send, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function LexaAITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am Lexa AI Tutor 👋 Ask me any questions on Mathematics, Physics, Chemistry, or Computer Science! I will explain step-by-step with formulas and examples.',
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load past conversation
  useEffect(() => {
    fetch('/api/ai/chat')
      .then((res) => res.json())
      .then((data) => {
        if (data.conversation) {
          setConversationId(data.conversation.id)
          if (data.conversation.messages && data.conversation.messages.length > 0) {
            setMessages(
              data.conversation.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
              }))
            )
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    setInput('')
    setError('')

    const tempUserMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: userText,
    }

    setMessages((prev) => [...prev, tempUserMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to get AI response')
        setIsLoading(false)
        return
      }

      setConversationId(data.conversationId)
      if (data.remaining !== undefined) setRemaining(data.remaining)

      setMessages((prev) => [
        ...prev,
        {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
        },
      ])
    } catch (err: any) {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600" /> Lexa AI Tutor
          </h2>
          <p className="text-xs text-slate-500">24/7 interactive learning assistant for Math, Physics, and CS.</p>
        </div>

        <div className="flex items-center gap-2">
          {remaining !== null && (
            <Badge variant="info" size="sm">
              {remaining} Msgs Left Today
            </Badge>
          )}
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-900/95 text-slate-100 border-slate-800 shadow-2xl">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md'
                }`}
              >
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Bot className="h-4 w-4 animate-bounce text-indigo-400" />
              <span>Lexa AI Tutor is thinking step-by-step...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask a question (e.g., Explain Newton's 2nd Law or Solve 2x + 5 = 15)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !input.trim()}
            icon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}
