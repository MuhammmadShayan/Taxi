const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_travel_app'
};

async function seedNotifications() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🗄️ Connected to database');
    
    // Sample notifications for admin user (user_id = 1)
    const notifications = [
      {
        user_id: 1,
        type: 'booking',
        title: 'New Reservation Received',
        message: 'A new reservation has been made for Toyota Corolla by John Smith',
        data: JSON.stringify({ reservation_id: 2, vehicle: 'Toyota Corolla', customer: 'John Smith' })
      },
      {
        user_id: 1,
        type: 'user',
        title: 'New Agency Registration',
        message: 'Morocco Premium Rentals has applied for partnership approval',
        data: JSON.stringify({ agency_name: 'Morocco Premium Rentals', status: 'pending' })
      },
      {
        user_id: 1,
        type: 'payment',
        title: 'Payment Processed',
        message: 'Payment of $350 has been successfully processed for reservation #R2025001',
        data: JSON.stringify({ amount: 350, reservation_id: 'R2025001' })
      },
      {
        user_id: 1,
        type: 'system',
        title: 'System Update',
        message: 'System maintenance completed successfully. All services are now operational',
        data: JSON.stringify({ maintenance_type: 'routine', duration: '2 hours' })
      },
      {
        user_id: 1,
        type: 'review',
        title: 'New Customer Review',
        message: 'Customer left a 5-star review for BMW X3 rental experience',
        data: JSON.stringify({ rating: 5, vehicle: 'BMW X3', customer: 'Sarah Johnson' })
      }
    ];
    
    // Sample notifications for agency user (user_id = 3)
    const agencyNotifications = [
      {
        user_id: 3,
        type: 'booking',
        title: 'New Booking Request',
        message: 'New booking request received for your Honda City vehicle',
        data: JSON.stringify({ vehicle: 'Honda City', dates: '2025-01-25 to 2025-01-27' })
      },
      {
        user_id: 3,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of $120 received for booking confirmation',
        data: JSON.stringify({ amount: 120, booking_id: 'B2025001' })
      },
      {
        user_id: 3,
        type: 'system',
        title: 'Profile Verification',
        message: 'Your agency profile has been verified and approved',
        data: JSON.stringify({ status: 'approved', verification_date: new Date().toISOString() })
      }
    ];
    
    // Insert admin notifications
    for (const notification of notifications) {
      await connection.execute(
        'INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          notification.user_id,
          notification.type,
          notification.title,
          notification.message,
          notification.data,
          Math.random() > 0.5 ? 1 : 0, // Randomly mark some as read
          new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString() // Random time within last 24 hours
        ]
      );
    }
    
    // Insert agency notifications
    for (const notification of agencyNotifications) {
      await connection.execute(
        'INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          notification.user_id,
          notification.type,
          notification.title,
          notification.message,
          notification.data,
          Math.random() > 0.7 ? 1 : 0, // Keep most unread for agency
          new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString() // Random time within last 12 hours
        ]
      );
    }
    
    console.log(`✅ Successfully seeded ${notifications.length + agencyNotifications.length} notifications`);
    
    // Check if notifications were inserted
    const [results] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    console.log(`📊 Total notifications in database: ${results[0].count}`);
    
    await connection.end();
    console.log('✨ Notification seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  }
}

// Run the seeding
seedNotifications();