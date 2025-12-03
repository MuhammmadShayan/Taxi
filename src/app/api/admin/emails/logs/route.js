import { NextResponse } from 'next/server'
import { query } from '@/lib/database.js'
import { validateApiSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await validateApiSession(request)
    if (auth.error || auth.user.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const logs = await query('SELECT * FROM email_logs ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset])
    const [{ total }] = await query('SELECT COUNT(*) as total FROM email_logs')
    return NextResponse.json({ logs, pagination: { page, limit, total } })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 })
  }
}
