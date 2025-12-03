import { NextResponse } from 'next/server'
import { query } from '@/lib/database.js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, reason } = body
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    await query('INSERT IGNORE INTO email_unsubscribes (email, reason) VALUES (?, ?)', [email, reason || null])
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
