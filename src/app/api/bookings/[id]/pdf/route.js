import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import PDFDocument from 'pdfkit';

export async function GET(request, { params }) {
  const { id } = await params;
  
  console.log('📄 PDF Generation: Starting for booking ID:', id);

  try {
    // Fetch booking details from database
    console.log('🔌 Connecting to database...');
    
    const bookingRows = await query(`
      SELECT 
        r.*,
        u.first_name AS customer_first_name,
        u.last_name AS customer_last_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        u.address AS customer_address,
        u.city AS customer_city,
        u.country AS customer_country,
        v.brand AS make,
        v.model,
        v.type AS category,
        vc.name AS category_name,
        pl_pickup.location_name AS pickup_location_name,
        pl_dropoff.location_name AS dropoff_location_name,
        a.business_name AS agency_name,
        a.business_email AS agency_email,
        a.business_phone AS agency_phone,
        DATEDIFF(r.end_date, r.start_date) AS total_days
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles v ON r.vehicle_id = v.vehicle_id
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.category_id
      LEFT JOIN pickup_locations pl_pickup ON r.pickup_location_id = pl_pickup.location_id
      LEFT JOIN pickup_locations pl_dropoff ON r.dropoff_location_id = pl_dropoff.location_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      WHERE r.reservation_id = ?
    `, [id]);
    
    console.log('✅ Query successful, found', bookingRows.length, 'booking(s)');

    if (bookingRows.length === 0) {
      console.error('❌ Booking not found:', id);
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingRows[0];
    console.log('📋 Booking retrieved:', booking.reservation_id);

    // Generate PDF
    console.log('🖨️ Generating PDF document...');
    const pdfBuffer = await generatePDF(booking);
    console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="booking-confirmation-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('🔥 Error generating PDF:', error);
    console.error('🔥 Error stack:', error.stack);
    
    return NextResponse.json({ 
      message: 'Failed to generate PDF',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

function generatePDF(booking) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Collect PDF data in chunks
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const bookingRef = `BK${booking.reservation_id}${Date.now().toString().slice(-6)}`;
      
      // Header
      doc.fillColor('#007bff')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('KIRASTAY', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Premium Car Rental Services', { align: 'center' });
      
      doc.moveDown();
      doc.strokeColor('#007bff')
         .lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke();
      
      doc.moveDown(2);

      // Title
      doc.fillColor('#333333')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('BOOKING CONFIRMATION', { align: 'center' });
      
      doc.moveDown(1.5);

      // Booking Reference Box
      const boxY = doc.y;
      doc.rect(50, boxY, 495, 80)
         .fillAndStroke('#f8f9fa', '#007bff');
      
      doc.fillColor('#007bff')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text(`Booking Reference: ${bookingRef}`, 60, boxY + 15);
      
      doc.fillColor('#333333')
         .fontSize(11)
         .font('Helvetica')
         .text(`Booking Date: ${new Date(booking.created_at || new Date()).toLocaleString()}`, 60, boxY + 40);
      
      doc.fillColor(booking.status === 'confirmed' ? '#155724' : '#856404')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text((booking.status || 'pending').toUpperCase(), 60, boxY + 60);
      
      doc.y = boxY + 90;
      doc.moveDown(1);

      // Vehicle Details Section
      addSection(doc, '🚗 VEHICLE DETAILS');
      addInfoRow(doc, 'Vehicle:', `${booking.make || 'N/A'} ${booking.model || 'N/A'}`);
      addInfoRow(doc, 'Category:', booking.category_name || booking.category || 'Standard');
      addInfoRow(doc, 'Rental Duration:', `${booking.total_days} day${booking.total_days > 1 ? 's' : ''}`);
      doc.moveDown(1);

      // Rental Period Section
      addSection(doc, '📅 RENTAL PERIOD');
      addInfoRow(doc, 'Pick-up Date:', formatDate(booking.start_date));
      addInfoRow(doc, 'Pick-up Location:', booking.pickup_location_name || 'N/A');
      addInfoRow(doc, 'Drop-off Date:', formatDate(booking.end_date));
      addInfoRow(doc, 'Drop-off Location:', booking.dropoff_location_name || 'N/A');
      doc.moveDown(1);

      // Customer Information Section
      addSection(doc, '👤 CUSTOMER INFORMATION');
      addInfoRow(doc, 'Name:', `${booking.customer_first_name || 'N/A'} ${booking.customer_last_name || ''}`);
      addInfoRow(doc, 'Email:', booking.customer_email || 'N/A');
      addInfoRow(doc, 'Phone:', booking.customer_phone || 'N/A');
      doc.moveDown(1);

      // Payment Summary Section
      addSection(doc, '💰 PAYMENT SUMMARY');
      const summaryBoxY = doc.y;
      doc.rect(60, summaryBoxY, 485, 90)
         .fillAndStroke('#f8f9fa', '#e0e0e0');
      
      doc.fillColor('#333333')
         .fontSize(11)
         .font('Helvetica')
         .text(`Car rental (${booking.total_days} day${booking.total_days > 1 ? 's' : ''})`, 70, summaryBoxY + 15);
      doc.text(`$${booking.total_price || '0.00'}`, 450, summaryBoxY + 15, { align: 'right' });
      
      doc.strokeColor('#007bff')
         .lineWidth(2)
         .moveTo(70, summaryBoxY + 45)
         .lineTo(535, summaryBoxY + 45)
         .stroke();
      
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Total Paid', 70, summaryBoxY + 55);
      doc.text(`$${booking.total_price || '0.00'}`, 450, summaryBoxY + 55, { align: 'right' });
      
      doc.y = summaryBoxY + 95;
      doc.moveDown(0.5);

      // Agency Information (if available)
      if (booking.agency_name) {
        addSection(doc, '🏢 AGENCY INFORMATION');
        addInfoRow(doc, 'Agency Name:', booking.agency_name);
        addInfoRow(doc, 'Contact Email:', booking.agency_email || 'N/A');
        addInfoRow(doc, 'Contact Phone:', booking.agency_phone || 'N/A');
        doc.moveDown(1);
      }

      // Customer Support Section
      addSection(doc, '📞 CUSTOMER SUPPORT');
      addInfoRow(doc, 'Phone:', '+41 78 214 97 95');
      addInfoRow(doc, 'Email:', 'support@kirastay.com');
      addInfoRow(doc, 'Website:', 'www.kirastay.com');
      doc.moveDown(2);

      // Footer
      doc.fontSize(9)
         .fillColor('#888888')
         .font('Helvetica')
         .text(`This is an automatically generated document. Generated on ${new Date().toLocaleString()}`, {
           align: 'center'
         });

      // Finalize the PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

function addSection(doc, title) {
  doc.fillColor('#333333')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text(title, { underline: false });
  
  doc.strokeColor('#e0e0e0')
     .lineWidth(1)
     .moveTo(50, doc.y + 5)
     .lineTo(545, doc.y + 5)
     .stroke();
  
  doc.moveDown(0.8);
}

function addInfoRow(doc, label, value) {
  const y = doc.y;
  doc.fillColor('#555555')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text(label, 60, y, { width: 150, continued: false });
  
  doc.fillColor('#333333')
     .font('Helvetica')
     .text(value, 220, y, { width: 315 });
  
  doc.moveDown(0.5);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
