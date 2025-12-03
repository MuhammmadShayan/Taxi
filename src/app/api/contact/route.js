import { NextResponse } from 'next/server';
import { sendEmail, sendAdminEmail } from '../../../lib/email.js';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const subject = (body.subject || '').toString().trim();
    const message = (body.message || '').toString().trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    }

    const appName = process.env.APP_NAME || 'KIRASTAY';
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    // 1) Send acknowledgment email to the user who contacted
    const userSubject = `We received your message — ${appName}`;
    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${userSubject}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #2d3748; }
          .container { max-width: 620px; margin: 0 auto; padding: 24px; }
          .header { background: #2c5aa0; color: #fff; padding: 18px; border-radius: 6px 6px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px; }
          .block { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0; }
          .muted { color: #718096; font-size: 12px; }
          .label { color: #4a5568; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${appName}</h2>
            <p style="margin:0">We’ve received your message</p>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thanks for getting in touch. We’ve received your message and a member of our team will get back to you shortly.</p>
            <div class="block">
              <p><span class="label">Subject:</span> ${subject}</p>
              <p><span class="label">Message:</span></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p class="muted">If you need to add anything, you can reply to this email. Visit us at <a href="${appUrl}">${appUrl}</a>.</p>
            <p>Best regards,<br/>The ${appName} Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const userText = `Hi ${name},\n\nThanks for getting in touch with ${appName}. We’ve received your message and will get back to you shortly.\n\nSubject: ${subject}\nMessage: ${message}\n\nBest regards,\nThe ${appName} Team\n${appUrl}`;

    const userEmailResult = await sendEmail({
      to: email,
      subject: userSubject,
      html: userHtml,
      text: userText
    });

    if (!userEmailResult.success) {
      console.error('Failed sending user acknowledgment email:', userEmailResult.error);
    }

    // 2) Send notification email to superadmin
    const adminSubject = `New contact message — ${appName}`;
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${adminSubject}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #2d3748; }
          .container { max-width: 620px; margin: 0 auto; padding: 24px; }
          .header { background: #2c5aa0; color: #fff; padding: 18px; border-radius: 6px 6px 0 0; }
          .content { background: #eff6ff; padding: 20px; border: 1px solid #bfdbfe; border-top: none; border-radius: 0 0 6px 6px; }
          .label { font-weight: 600; color: #374151; }
          .block { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin-top: 12px; }
          .table { width: 100%; border-collapse: collapse; }
          .table td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          .table td.label-cell { width: 30%; color: #374151; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Submission</h2>
          </div>
          <div class="content">
            <table class="table" role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                <td class="label-cell">Name</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td class="label-cell">Email</td>
                <td><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td class="label-cell">Subject</td>
                <td>${subject}</td>
              </tr>
            </table>
            <div class="block">
              <div class="label" style="margin-bottom:6px;">Message</div>
              <div style="white-space: pre-wrap;">${message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    const adminText = `New contact message on ${appName}\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

    const adminEmailResult = await sendAdminEmail(adminSubject, adminHtml, adminText);
    if (!adminEmailResult.success) {
      console.error('Failed sending admin notification email:', adminEmailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you shortly.'
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Unable to send your message at the moment.' }, { status: 500 });
  }
}
