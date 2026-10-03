/**
 * AI Tutor Service — provider-agnostic abstraction.
 * Currently supports Google Gemini via AI_PROVIDER=google.
 * To switch providers, update AI_PROVIDER and implement the adapter below.
 */

import { prisma } from './prisma'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  error?: string
}

const SYSTEM_PROMPT = `You are Lexa AI Tutor, a friendly and knowledgeable educational assistant for Academy Lexa.

You help students with:
- Mathematics (algebra, geometry, calculus, statistics)
- Physics (mechanics, thermodynamics, optics, electricity)
- Chemistry (organic, inorganic, physical chemistry)
- Computer Science (programming, algorithms, data structures)
- General academic topics

When answering:
1. Provide clear, simple explanations suitable for school/college students
2. For math problems: show step-by-step working with formulas
3. For physics: state the formula, identify given values, substitute, calculate, state the answer with units
4. Use examples and analogies where helpful
5. Be encouraging and patient
6. Keep answers focused and not overly lengthy
7. If a question is outside your educational scope, politely redirect

Always maintain a helpful, educational tone.`

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const limit = parseInt(process.env.AI_RATE_LIMIT_PER_DAY || '20', 10)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const count = await prisma.aIMessage.count({
    where: {
      conversation: { userId },
      role: 'user',
      createdAt: { gte: today, lt: tomorrow },
    },
  })

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
  }
}

export async function generateAIResponse(
  messages: ChatMessage[],
  userId: string
): Promise<AIResponse> {
  const provider = process.env.AI_PROVIDER || 'google'
  // Prefer an explicit key; otherwise use the Gemini credentials Netlify AI Gateway injects at runtime.
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY
  const baseUrl = process.env.AI_API_KEY
    ? GEMINI_DEFAULT_BASE_URL
    : (process.env.GOOGLE_GEMINI_BASE_URL || GEMINI_DEFAULT_BASE_URL).replace(/\/$/, '')

  if (!apiKey) {
    return {
      content: '',
      error: 'AI Tutor is not configured. Please contact the academy administrator.',
    }
  }

  try {
    if (provider === 'google') {
      return await callGemini(messages, apiKey, baseUrl)
    }

    return {
      content: '',
      error: `AI provider "${provider}" is not supported yet.`,
    }
  } catch (error: unknown) {
    console.error('AI error:', error)
    return {
      content: '',
      error: 'AI Tutor is temporarily unavailable. Please try again later.',
    }
  }
}

const GEMINI_DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com'
const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash'

async function callGemini(messages: ChatMessage[], apiKey: string, baseUrl: string): Promise<AIResponse> {
  // Gemini 1.x models are retired, so fall back to a current model if one is still configured.
  const configured = process.env.AI_MODEL
  const model = configured && !configured.startsWith('gemini-1.') ? configured : GEMINI_DEFAULT_MODEL

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await fetch(
    `${baseUrl}/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${err}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Empty response from Gemini')
  }

  return { content: text }
}
