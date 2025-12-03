import { NextResponse } from 'next/server'
import { query } from '@/lib/database.js'
import { validateApiSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const auth = await validateApiSession(request)
    if (auth.error || auth.user.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const templates = await query('SELECT template_key, subject, html, updated_at FROM email_templates ORDER BY template_key ASC')
    return NextResponse.json({ templates })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const auth = await validateApiSession(request)
    if (auth.error || auth.user.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { template_key, subject, html } = body
    if (!template_key || !subject || !html) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
    }
    const existing = await query('SELECT id FROM email_templates WHERE template_key = ? LIMIT 1', [template_key])
    if (existing.length > 0) {
      await query('UPDATE email_templates SET subject = ?, html = ? WHERE template_key = ?', [subject, html, template_key])
    } else {
      await query('INSERT INTO email_templates (template_key, subject, html) VALUES (?, ?, ?)', [template_key, subject, html])
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}
