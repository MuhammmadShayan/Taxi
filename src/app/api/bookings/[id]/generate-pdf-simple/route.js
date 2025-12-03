import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  
  console.log('📄 Simple PDF: Fetching booking ID:', id);

  try {
    // Fetch booking details from database
    console.log('🔌 Connecting to database...');
    
    const bookingRows = await query(`
      SELECT 
        r.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone,
        v.brand as make, 
        v.model, 
        v.type as category,
        vc.name as category_name,
        pl_pickup.location_name as pickup_location_name,
        pl_dropoff.location_name as dropoff_location_name,
        a.name as agency_name,
        a.contact_email as agency_email,
        a.contact_phone as agency_phone,
        DATEDIFF(r.end_date, r.start_date) as total_days
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN agency_vehicles v ON r.vehicle_id = v.vehicle_id
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.category_id
      LEFT JOIN pickup_locations pl_pickup ON r.pickup_location_id = pl_pickup.location_id
      LEFT JOIN pickup_locations pl_dropoff ON r.dropoff_location_id = pl_dropoff.location_id
      LEFT JOIN agencies a ON v.agency_id = a.agency_id
      WHERE r.reservation_id = ?
    `, [id]);
    
    console.log('✅ Query successful, found', bookingRows.length, 'booking(s)');

    if (bookingRows.length === 0) {
      console.error('❌ Booking not found:', id);
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingRows[0];
    console.log('📋 Booking retrieved:', booking.reservation_id);

    // Generate printable HTML page
    const htmlContent = generatePrintableHTML(booking);

    // Return HTML response that will trigger browser's print dialog
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
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

function generatePrintableHTML(booking) {
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
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
        }
        .tagline {
            color: #666;
            font-size: 14px;
        }
        .confirmation-title {
            font-size: 24px;
            color: #333;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
        }
        .booking-ref {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #007bff;
        }
        .booking-ref h3 {
            margin: 0 0 10px 0;
            color: #007bff;
            font-size: 18px;
        }
        .section {
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
        }
        .info-row {
            display: flex;
            margin-bottom: 12px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            min-width: 150px;
        }
        .info-value {
            color: #333;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
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
        .price-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .total-row {
            border-top: 3px solid #007bff;
            padding-top: 15px;
            margin-top: 15px;
            font-weight: bold;
            font-size: 20px;
        }
        .btn-container {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            padding: 12px 30px;
            margin: 0 10px;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
    </style>
    <script>
        // Auto-print on load
        window.onload = function() {
            // Give time for page to render
            setTimeout(function() {
                // Uncomment this line to auto-print:
                // window.print();
            }, 500);
        };
        
        function printDocument() {
            window.print();
        }
        
        function closeWindow() {
            window.close();
        }
    </script>
</head>
<body>
    <div class="no-print btn-container">
        <button class="btn btn-primary" onclick="printDocument()">🖨️ Print / Save as PDF</button>
        <button class="btn btn-secondary" onclick="closeWindow()">✖ Close</button>
    </div>

    <div class="header">
        <div class="logo">🚗 KIRASTAY</div>
        <div class="tagline">Premium Car Rental Services</div>
    </div>

    <div class="confirmation-title">BOOKING CONFIRMATION</div>

    <div class="booking-ref">
        <h3>Booking Reference: ${bookingRef}</h3>
        <p>Booking Date: ${new Date(booking.created_at || new Date()).toLocaleString()}</p>
        <span class="status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
            ${(booking.status || 'pending').replace('_', ' ').toUpperCase()}
        </span>
    </div>

    <div class="section">
        <h3 class="section-title">🚗 Vehicle Details</h3>
        <div class="info-row">
            <span class="info-label">Vehicle:</span>
            <span class="info-value">${booking.make || 'N/A'} ${booking.model || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Category:</span>
            <span class="info-value">${booking.category_name || booking.category || 'Standard'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Rental Duration:</span>
            <span class="info-value">${booking.total_days} day${booking.total_days > 1 ? 's' : ''}</span>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">📅 Rental Period</h3>
        <div class="info-row">
            <span class="info-label">Pick-up Date:</span>
            <span class="info-value">${formatDate(booking.start_date)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Pick-up Location:</span>
            <span class="info-value">${booking.pickup_location_name || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Drop-off Date:</span>
            <span class="info-value">${formatDate(booking.end_date)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Drop-off Location:</span>
            <span class="info-value">${booking.dropoff_location_name || 'N/A'}</span>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">👤 Customer Information</h3>
        <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${booking.customer_first_name || 'N/A'} ${booking.customer_last_name || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${booking.customer_email || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${booking.customer_phone || 'N/A'}</span>
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">💰 Payment Summary</h3>
        <div class="price-section">
            <div class="price-row">
                <span>Car rental (${booking.total_days} day${booking.total_days > 1 ? 's' : ''})</span>
                <span>$${booking.total_price || '0.00'}</span>
            </div>
            <div class="price-row total-row">
                <span>Total Paid</span>
                <span>$${booking.total_price || '0.00'}</span>
            </div>
            <div class="info-row" style="margin-top: 15px;">
                <span class="info-label">Payment Status:</span>
                <span class="status-badge ${booking.payment_status === 'completed' ? 'status-confirmed' : 'status-pending'}">
                    ${(booking.payment_status || 'pending').toUpperCase()}
                </span>
            </div>
        </div>
    </div>

    ${booking.agency_name ? `
    <div class="section">
        <h3 class="section-title">🏢 Agency Information</h3>
        <div class="info-row">
            <span class="info-label">Agency Name:</span>
            <span class="info-value">${booking.agency_name}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Contact Email:</span>
            <span class="info-value">${booking.agency_email || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Contact Phone:</span>
            <span class="info-value">${booking.agency_phone || 'N/A'}</span>
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h3 class="section-title">📞 Customer Support</h3>
        <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">+41 78 214 97 95</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">support@kirastay.com</span>
        </div>
        <div class="info-row">
            <span class="info-label">Website:</span>
            <span class="info-value">www.kirastay.com</span>
        </div>
    </div>

    <div style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
        This is an automatically generated document. Generated on ${new Date().toLocaleString()}
    </div>

    <div class="no-print btn-container">
        <button class="btn btn-primary" onclick="printDocument()">🖨️ Print / Save as PDF</button>
        <button class="btn btn-secondary" onclick="closeWindow()">✖ Close</button>
    </div>
</body>
</html>
  `;
}
