import jsPDF from 'jspdf';

export const generateBookingPDF = (booking) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let y = 15;

  // Helper function to add text with word wrap - more compact
  const addText = (text, x, y, maxWidth = pageWidth - 30, fontSize = 9) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4); // Reduced line spacing
  };

  // Header
  pdf.setFillColor(0, 123, 255);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KIRASTAY', pageWidth / 2, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Premium Car Rental Services', pageWidth / 2, 22, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  y = 45;

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BOOKING CONFIRMATION', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Booking Reference Box
  const bookingRef = `BK${booking.reservation_id}${Date.now().toString().slice(-6)}`;
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, y, pageWidth - 40, 20, 'F');
  pdf.setDrawColor(0, 123, 255);
  pdf.setLineWidth(2);
  pdf.rect(20, y, pageWidth - 40, 20, 'S');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 123, 255);
  pdf.text(`Booking Reference: ${bookingRef}`, pageWidth / 2, y + 8, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Booking Date: ${new Date(booking.created_at).toLocaleString()}`, pageWidth / 2, y + 15, { align: 'center' });
  y += 35;

  // Helper function for sections - more compact
  const addSection = (title, content) => {
    // Don't add new page - force everything on one page
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    y = addText(title, 15, y, pageWidth - 30, 12);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, y + 1, pageWidth - 15, y + 1);
    y += 5;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    y = addText(content, 15, y);
    y += 8; // Reduced spacing
    
    return y;
  };

  // Car Details Section
  const carDetails = `
Vehicle: ${booking.make || 'N/A'} ${booking.model || 'N/A'}
Category: ${booking.category || 'Standard'}
Rental Duration: ${booking.total_days} day${booking.total_days > 1 ? 's' : ''}
  `.trim();
  
  y = addSection('CAR DETAILS', carDetails);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // First Row: Rental Period & Customer Information (Two Columns)
  const leftColumnY = y;
  
  // Left Column - Rental Period
  const rentalPeriod = `
PICK-UP DETAILS:
Date: ${formatDate(booking.start_date)}
Time: ${booking.pickup_time || 'N/A'}
Location: ${booking.pickup_location_name || 'N/A'}

DROP-OFF DETAILS:
Date: ${formatDate(booking.end_date)}
Time: ${booking.dropoff_time || 'N/A'}
Location: ${booking.dropoff_location_name || 'N/A'}
  `.trim();
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RENTAL PERIOD', 15, y);
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(15, y + 2, (pageWidth / 2) - 5, y + 2);
  y += 8;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const rentalLines = pdf.splitTextToSize(rentalPeriod, (pageWidth / 2) - 25);
  pdf.text(rentalLines, 15, y);
  
  // Right Column - Customer Information
  const rightY = leftColumnY;
  const customerInfo = `
Name: ${booking.customer_first_name || 'N/A'} ${booking.customer_last_name || ''}
Email: ${booking.customer_email || 'N/A'}
Phone: ${booking.customer_phone || 'N/A'}
City: ${booking.customer_city || 'N/A'}
Country: ${booking.customer_country || 'N/A'}
Address: ${booking.customer_address || 'N/A'}
${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
  `.trim();
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CUSTOMER INFORMATION', (pageWidth / 2) + 5, rightY);
  pdf.line((pageWidth / 2) + 5, rightY + 2, pageWidth - 15, rightY + 2);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const customerLines = pdf.splitTextToSize(customerInfo, (pageWidth / 2) - 25);
  pdf.text(customerLines, (pageWidth / 2) + 5, rightY + 8);
  
  // Calculate y position for next row
  y = Math.max(y + (rentalLines.length * 9 * 0.4), rightY + 8 + (customerLines.length * 9 * 0.4)) + 15;

  // Second Row: Payment Summary & Agency Information (Two Columns)
  const secondRowY = y;
  
  // Left Column - Payment Summary
  let paymentSummary = `Car rental (${booking.total_days} day${booking.total_days > 1 ? 's' : ''}): $${booking.subtotal || '0.00'}`;
  
  if (booking.extras_total > 0) {
    paymentSummary += `\nAdditional Services: $${booking.extras_total}`;
  }
  
  if (booking.tax_amount > 0) {
    paymentSummary += `\nTax: $${booking.tax_amount}`;
  }
  
  paymentSummary += `\n\nTOTAL PAID: $${booking.total_price || '0.00'}`;
  paymentSummary += `\nPayment Status: ${booking.payment_status ? booking.payment_status.toUpperCase() : 'PENDING'}`;
  paymentSummary += `\nPayment Method: ${booking.payment_method ? booking.payment_method.replace('_', ' ').toUpperCase() : 'CASH'}`;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT SUMMARY', 15, y);
  pdf.line(15, y + 2, (pageWidth / 2) - 5, y + 2);
  y += 8;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const paymentLines = pdf.splitTextToSize(paymentSummary, (pageWidth / 2) - 25);
  pdf.text(paymentLines, 15, y);
  
  // Right Column - Agency Information
  const agencyY = secondRowY;
  if (booking.agency_name) {
    const agencyInfo = `
Agency Name: ${booking.agency_name}
Contact Email: ${booking.agency_email || 'N/A'}
Contact Phone: ${booking.agency_phone || 'N/A'}
    `.trim();
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AGENCY INFORMATION', (pageWidth / 2) + 5, agencyY);
    pdf.line((pageWidth / 2) + 5, agencyY + 2, pageWidth - 15, agencyY + 2);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const agencyLines = pdf.splitTextToSize(agencyInfo, (pageWidth / 2) - 25);
    pdf.text(agencyLines, (pageWidth / 2) + 5, agencyY + 8);
  } else {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AGENCY INFORMATION', (pageWidth / 2) + 5, agencyY);
    pdf.line((pageWidth / 2) + 5, agencyY + 2, pageWidth - 15, agencyY + 2);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Direct booking - No agency information available', (pageWidth / 2) + 5, agencyY + 8);
  }
  
  // Calculate y position for footer content
  y = Math.max(y + (paymentLines.length * 9 * 0.4), agencyY + 8 + 20) + 15;

  // Customer Support Section
  const supportInfo = `
Phone: +41 78 214 97 95
Email: support@kirastay.com
Website: www.kirastay.com
  `.trim();
  
  y = addSection('CUSTOMER SUPPORT', supportInfo);

  // Important Information Section
  const importantInfo = `
• Please arrive at the pick-up location 15 minutes before your scheduled time
• Bring a valid driver's license and credit card for security deposit  
• Contact us immediately if you need to make any changes to your booking
• Cancellation is allowed up to 24 hours before pick-up time
  `.trim();
  
  y = addSection('IMPORTANT INFORMATION', importantInfo);

  // Footer
  if (y > pageHeight - 40) {
    pdf.addPage();
    y = 20;
  }
  
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `This is an automatically generated document. Generated on ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );

  return pdf;
};

export const downloadBookingPDF = (booking, filename) => {
  try {
    const pdf = generateBookingPDF(booking);
    pdf.save(filename || `booking-confirmation-${booking.reservation_id}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

// Client-side PDF generation function for fallback
export const generateBookingPDFClientSide = async (booking) => {
  try {
    const success = downloadBookingPDF(booking);
    if (!success) {
      throw new Error('Failed to generate PDF on client side');
    }
    return { success: true };
  } catch (error) {
    console.error('Client-side PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};
