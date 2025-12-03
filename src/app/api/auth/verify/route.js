import { NextResponse } from 'next/server'
import tokenStorage from '@/lib/reset-tokens.js'
import { query } from '@/lib/db.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })
    const data = tokenStorage.useToken(token)
    if (!data) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    const email = data.email
    try {
      await query('UPDATE users SET updated_at = NOW() WHERE email = ?', [email])
    } catch {}
    return NextResponse.json({ success: true, email })
  } catch (e) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
