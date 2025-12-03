import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get('session')?.value || req.cookies.get('holikey_session')?.value
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const user = await verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const conversationId = params.id

    const isParticipant = await query(
      'SELECT conversation_id FROM chat_participants WHERE conversation_id = ? AND user_id = ? AND is_active = 1',
      [conversationId, user.user_id]
    )
    if (isParticipant.length === 0) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    await query('UPDATE chat_participants SET is_active = 0 WHERE conversation_id = ? AND user_id = ?', [conversationId, user.user_id])
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to archive conversation' }, { status: 500 })
  }
}
