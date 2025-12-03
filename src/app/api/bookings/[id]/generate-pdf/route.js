import puppeteer from 'puppeteer';
import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
  port: process.env.DB_PORT || 3306,
};

export async function GET(request, { params }) {
  const { id } = (await params);
  
  console.log('📄 PDF Generation: Starting for booking ID:', id);

  try {
    // Fetch booking details from database
    console.log('🔌 Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected');
    
    const [bookingRows] = await connection.execute(`
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
        v.images,
        vc.name AS category_name,
        pl_pickup.location_name AS pickup_location_name,
        pl_pickup.address AS pickup_location_address,
        pl_dropoff.location_name AS dropoff_location_name,
        pl_dropoff.address AS dropoff_location_address,
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
    
    console.log('✅ Database query successful, found', bookingRows.length, 'booking(s)');

    await connection.end();

    if (bookingRows.length === 0) {
      console.error('❌ Booking not found:', id);
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingRows[0];
    console.log('📋 Booking details retrieved:', {
      id: booking.reservation_id,
      customer: booking.customer_first_name,
      vehicle: `${booking.make} ${booking.model}`
    });

    // Generate PDF HTML content
    console.log('📝 Generating HTML content...');
    const htmlContent = generatePDFHTML(booking);
    console.log('✅ HTML content generated');

    // Launch Puppeteer to generate PDF
    console.log('🚀 Launching Puppeteer...');
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
      console.log('✅ Puppeteer launched successfully');
    } catch (puppeteerError) {
      console.error('🔥 Puppeteer launch failed:', puppeteerError.message);
      console.error('💡 Puppeteer may not be installed or configured properly');
      throw new Error('PDF generation service unavailable. Please ensure Puppeteer is installed.');
    }
    
    console.log('📄 Creating new page...');
    const page = await browser.newPage();
    
    console.log('🎨 Setting HTML content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    console.log('🖨️ Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    console.log('🧹 Closing browser...');
    await browser.close();
    console.log('✅ Browser closed');

    // Return PDF as response
    console.log('🎉 Returning PDF response');
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate PDF';
    let helpMessage = '';
    
    if (error.message.includes('Puppeteer')) {
      errorMessage = 'PDF generation service unavailable';
      helpMessage = 'Puppeteer is not properly installed. Run: npm install puppeteer';
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ER_')) {
      errorMessage = 'Database connection failed';
      helpMessage = 'Please ensure MySQL is running and database credentials are correct';
    } else if (error.message.includes('protocol error')) {
      errorMessage = 'PDF generation failed';
      helpMessage = 'Chrome/Chromium may not be installed or accessible';
    }
    
    console.error('💡 Help:', helpMessage || 'Check the error details above');
    
    return NextResponse.json({ 
      message: errorMessage,
      error: error.message,
      help: helpMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

function generatePDFHTML(booking) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const bookingRef = `BK${booking.reservation_id}${Date.now().toString().slice(-6)}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Confirmation - ${bookingRef}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.2;
            color: #333;
            margin: 0;
            padding: 10px;
            font-size: 11px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .logo {
            font-size: 22px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 3px;
        }
        .tagline {
            color: #666;
            font-size: 11px;
        }
        .confirmation-title {
            font-size: 18px;
            color: #333;
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
        }
        .booking-ref {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            text-align: center;
            border: 2px solid #007bff;
        }
        .booking-ref h3 {
            margin: 0;
            color: #007bff;
            font-size: 14px;
        }
        .section {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
            padding-bottom: 3px;
        }
        .row {
            display: flex;
            margin-bottom: 8px;
        }
        .col-50 {
            width: 50%;
            padding-right: 10px;
        }
        .col-33 {
            width: 33.33%;
            padding-right: 10px;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
        }
        .info-value {
            color: #333;
        }
        .price-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .total-row {
            border-top: 2px solid #007bff;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-confirmed {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .car-details {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .car-info {
            margin-left: 15px;
        }
        .car-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">KIRASTAY</div>
        <div class="tagline">Premium Car Rental Services</div>
    </div>

    <div class="confirmation-title">BOOKING CONFIRMATION</div>

    <div class="booking-ref">
        <h3>Booking Reference: ${bookingRef}</h3>
        <p>Booking Date: ${new Date(booking.created_at).toLocaleString()}</p>
        <span class="status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
            ${booking.status ? booking.status.replace('_', ' ').toUpperCase() : 'PENDING'}
        </span>
    </div>

    <div class="section">
        <h3 class="section-title">Car Details</h3>
        <div class="car-details">
            <div class="car-info">
                <div class="car-title">${booking.make || 'N/A'} ${booking.model || 'N/A'}</div>
                <div class="info-item">
                    <span class="info-label">Category:</span> 
                    <span class="info-value">${booking.category_name || booking.category || 'Standard'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Rental Duration:</span> 
                    <span class="info-value">${booking.total_days} day${booking.total_days > 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- First Row: Rental Period & Customer Information -->
    <div class="row">
        <div class="col-50">
            <div class="section">
                <h3 class="section-title">Rental Period</h3>
                <div class="row">
                    <div class="col-50">
                        <h4>Pick-up Details</h4>
                        <div class="info-item">
                            <span class="info-label">Date:</span> 
                            <span class="info-value">${formatDate(booking.start_date)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Time:</span> 
                            <span class="info-value">${booking.pickup_time || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Location:</span> 
                            <span class="info-value">${booking.pickup_location_name || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-50">
                        <h4>Drop-off Details</h4>
                        <div class="info-item">
                            <span class="info-label">Date:</span> 
                            <span class="info-value">${formatDate(booking.end_date)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Time:</span> 
                            <span class="info-value">${booking.dropoff_time || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Location:</span> 
                            <span class="info-value">${booking.dropoff_location_name || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-50">
            <div class="section">
                <h3 class="section-title">Customer Information</h3>
                <div class="row">
                    <div class="col-50">
                        <div class="info-item">
                            <span class="info-label">Name:</span><br>
                            <span class="info-value">${booking.customer_first_name || 'N/A'} ${booking.customer_last_name || ''}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span><br>
                            <span class="info-value">${booking.customer_email || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phone:</span><br>
                            <span class="info-value">${booking.customer_phone || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-50">
                        <div class="info-item">
                            <span class="info-label">City:</span><br>
                            <span class="info-value">${booking.customer_city || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Country:</span><br>
                            <span class="info-value">${booking.customer_country || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Address:</span><br>
                            <span class="info-value">${booking.customer_address || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                ${booking.special_requests ? `
                <div class="info-item" style="margin-top: 10px;">
                    <span class="info-label">Special Requests:</span><br>
                    <span class="info-value">${booking.special_requests}</span>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    
    <!-- Second Row: Payment Summary & Agency Information -->
    <div class="row">
        <div class="col-50">
            <div class="section">
                <h3 class="section-title">Payment Summary</h3>
                <div class="price-section">
                    <div class="price-row">
                        <span>Car rental (${booking.total_days} day${booking.total_days > 1 ? 's' : ''})</span>
                        <span>$${booking.subtotal || '0.00'}</span>
                    </div>
                    ${booking.extras_total > 0 ? `
                    <div class="price-row">
                        <span>Additional Services</span>
                        <span>$${booking.extras_total}</span>
                    </div>
                    ` : ''}
                    ${booking.tax_amount > 0 ? `
                    <div class="price-row">
                        <span>Tax</span>
                        <span>$${booking.tax_amount}</span>
                    </div>
                    ` : ''}
                    <div class="price-row total-row">
                        <span>Total Paid</span>
                        <span>$${booking.total_price || '0.00'}</span>
                    </div>
                    <div class="price-row" style="margin-top: 8px;">
                        <span>Payment Status:</span>
                        <span class="status-badge ${booking.payment_status === 'completed' ? 'status-confirmed' : 'status-pending'}">
                            ${booking.payment_status ? booking.payment_status.toUpperCase() : 'PENDING'}
                        </span>
                    </div>
                    <div class="price-row">
                        <span>Payment Method:</span>
                        <span>${booking.payment_method ? booking.payment_method.replace('_', ' ').toUpperCase() : 'CASH'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-50">
            ${booking.agency_name ? `
            <div class="section">
                <h3 class="section-title">Agency Information</h3>
                <div class="info-item">
                    <span class="info-label">Agency Name:</span><br>
                    <span class="info-value">${booking.agency_name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Contact Email:</span><br>
                    <span class="info-value">${booking.agency_email || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Contact Phone:</span><br>
                    <span class="info-value">${booking.agency_phone || 'N/A'}</span>
                </div>
            </div>
            ` : `
            <div class="section">
                <h3 class="section-title">Agency Information</h3>
                <div class="info-item">
                    <span class="info-value">Direct booking - No agency information available</span>
                </div>
            </div>
            `}
        </div>
    </div>

    <div class="row">
        <div class="col-50">
            <div class="section">
                <h3 class="section-title">Customer Support</h3>
                <div class="contact-item"><strong>Phone:</strong> +41 78 214 97 95</div>
                <div class="contact-item"><strong>Email:</strong> support@kirastay.com</div>
                <div class="contact-item"><strong>Website:</strong> www.kirastay.com</div>
            </div>
        </div>
        <div class="col-50">
            <div class="section">
                <h3 class="section-title">Important Information</h3>
                <ul style="margin: 0; padding-left: 15px; font-size: 10px;">
                    <li>Please arrive 15 minutes before pick-up time</li>
                    <li>Bring valid driver's license and credit card</li>
                    <li>Contact us for any changes to booking</li>
                    <li>Cancellation allowed up to 24 hours before</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div style="margin-top: 15px; text-align: center; color: #888; font-size: 10px;">
        This is an automatically generated document. Generated on ${new Date().toLocaleString()}
    </div>
</body>
</html>
  `;
}
