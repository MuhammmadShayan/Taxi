import { sendEmail } from './lib/email.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    
    const result = await sendEmail({
      to: 'hr291@smartestdevelopers.com',
      subject: 'HOLIKEY Email Test',
      html: '<h1>Test Email</h1><p>If you receive this, email configuration is working!</p>',
      text: 'Test Email - If you receive this, email configuration is working!'
    });
    
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmail();
