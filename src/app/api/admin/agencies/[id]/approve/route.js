import { NextResponse } from 'next/server';
import { query } from '../../../../../../lib/db';
import { sendEmail } from '../../../../../../utils/emailService';
import { agencyApprovalNotification } from '../../../../../../utils/emailTemplates';

export async function PUT(request, { params }) {
  try {
    const agencyId = params.id;
    const { approved, rejection_reason } = await request.json();

    console.log(`📋 Processing agency ${approved ? 'approval' : 'rejection'} for ID:`, agencyId);

    // Get agency details
    const agencyDetails = await query(`
      SELECT a.*, u.first_name, u.last_name, u.email 
      FROM agencies a 
      LEFT JOIN users u ON a.user_id = u.user_id 
      WHERE a.agency_id = ?
    `, [agencyId]);

    if (agencyDetails.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Agency not found' },
        { status: 404 }
      );
    }

    const agency = agencyDetails[0];

    // Update agency status
    const newStatus = approved ? 'active' : 'rejected';
    await query(
      'UPDATE agencies SET status = ?, updated_at = NOW() WHERE agency_id = ?',
      [newStatus, agencyId]
    );

    // Update user status
    const userStatus = approved ? 'active' : 'suspended';
    await query(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE user_id = ?',
      [userStatus, agency.user_id]
    );

    // Store rejection reason if applicable
    if (!approved && rejection_reason) {
      try {
        await query(`
          INSERT INTO agency_rejections (agency_id, reason, rejected_at, rejected_by)
          VALUES (?, ?, NOW(), 'admin')
        `, [agencyId, rejection_reason]);
      } catch (logError) {
        console.warn('Failed to log rejection reason:', logError);
      }
    }

    // Send email notification to agency
    console.log('📧 Sending approval/rejection email to agency...');
    try {
      const agencyData = {
        contact_full_name: `${agency.first_name} ${agency.last_name}`.trim(),
        agency_name: agency.business_name,
        contact_email: agency.email || agency.business_email
      };

      const emailResult = await sendEmail(
        agencyData.contact_email,
        approved ? 'Agency Application Approved - KIRASTAY' : 'Agency Application Update - KIRASTAY',
        agencyApprovalNotification(agencyData, approved)
      );

      console.log('Agency approval email result:', emailResult.success ? '✅ Sent' : '❌ Failed');

    } catch (emailError) {
      console.error('📧 Failed to send approval email:', emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Agency ${approved ? 'approved' : 'rejected'} successfully`,
      agency_id: agencyId,
      new_status: newStatus
    });

  } catch (error) {
    console.error('Error processing agency approval:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process agency approval' },
      { status: 500 }
    );
  }
}
