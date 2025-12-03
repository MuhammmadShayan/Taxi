import { NextResponse } from 'next/server'
import { query } from '@/lib/db.js'
import { sendEmail } from '@/lib/email.js'

export async function POST() {
  try {
    const rows = await query(`
      SELECT r.reservation_id, r.start_date, r.pickup_time, r.total_price,
             u.email as customer_email, u.first_name, u.last_name,
             a.business_name as agency_name, a.business_email as agency_email,
             v.make, v.model
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      WHERE r.status IN ('confirmed','active')
        AND DATE(r.start_date) = DATE(DATE_ADD(NOW(), INTERVAL 1 DAY))
    `)
    let sent = 0
    for (const b of rows) {
      const subject = `Reminder: Your Booking Starts Tomorrow (Ref #${b.reservation_id})`
      const html = `<div style="font-family:Arial,sans-serif"><h2>Booking Reminder</h2><p>Dear ${b.first_name || ''} ${b.last_name || ''},</p><p>Your rental of ${b.make || ''} ${b.model || ''} starts on ${new Date(b.start_date).toLocaleDateString()} at ${b.pickup_time || '09:00'}.</p><p>Agency: ${b.agency_name}</p><p>Total: ${b.total_price} MAD</p><p>Please bring your ID and driver’s license.</p></div>`
      const res1 = await sendEmail({ to: b.customer_email, subject, html, text: `Your booking starts on ${new Date(b.start_date).toLocaleDateString()} at ${b.pickup_time}.` , templateKey: 'booking_reminder' })
      if (res1.success) sent++
      if (b.agency_email) {
        const res2 = await sendEmail({ to: b.agency_email, subject: `Customer Booking Reminder (Ref #${b.reservation_id})`, html: `<div style="font-family:Arial,sans-serif"><h2>Customer Booking Reminder</h2><p>Booking #${b.reservation_id} starts tomorrow.</p><p>Vehicle: ${b.make || ''} ${b.model || ''}</p></div>`, text: `Booking #${b.reservation_id} starts tomorrow.`, templateKey: 'agency_booking_reminder' })
        if (res2.success) sent++
      }
    }
    return NextResponse.json({ success: true, processed: rows.length, sent })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
