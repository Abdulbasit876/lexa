import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, generateAIResponse } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId } = await req.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Rate limit check
    const limit = await checkRateLimit(session.user.id)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Daily message limit reached (20 messages/day). Please try again tomorrow.' },
        { status: 429 }
      )
    }

    // Find or create conversation
    let convId = conversationId
    if (!convId) {
      const newConv = await prisma.aIConversation.create({
        data: { userId: session.user.id },
      })
      convId = newConv.id
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: 'user',
        content: message.trim(),
      },
    })

    // Fetch message history
    const history = await prisma.aIMessage.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    })

    const formattedMessages = history.map((h: { role: string; content: any }) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }))

    // Generate AI response
    const aiResult = await generateAIResponse(formattedMessages, session.user.id)

    if (aiResult.error) {
      return NextResponse.json({ error: aiResult.error }, { status: 500 })
    }

    // Save assistant message
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: 'assistant',
        content: aiResult.content,
      },
    })

    return NextResponse.json({
      conversationId: convId,
      message: assistantMsg,
      remaining: limit.remaining - 1,
    })
  } catch (error: any) {
    console.error('AI Route Error:', error)
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's conversation history
    const conversation = await prisma.aIConversation.findFirst({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ conversation })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
