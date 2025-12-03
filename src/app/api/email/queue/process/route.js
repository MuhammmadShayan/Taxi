import { NextResponse } from 'next/server'
import { processEmailQueue } from '@/lib/email.js'

export async function POST() {
  try {
    const processed = await processEmailQueue(50)
    return NextResponse.json({ success: true, processed })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
