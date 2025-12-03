const testBooking = async () => {
  const testData = {
    "vehicle_id": "2",
    "booking_details": {
      "pickup_location": "karachi",
      "dropoff_location": "lahore",
      "pickup_date": "2025-09-09",
      "pickup_time": "9:00AM",
      "dropoff_date": "2025-09-10",
      "dropoff_time": "9:00AM",
      "passengers": 1
    },
    "customer_details": {
      "title": "Mr",
      "firstName": "name",
      "lastName": "nmae",
      "email": "testuser@kirastay.com",
      "phone": "1234678",
      "dateOfBirth": "2007-09-04",
      "nationality": "Norway",
      "passport": "12313",
      "license": "123123",
      "address": "testing addres",
      "city": "karachi",
      "country": "Pakistan",
      "postalCode": "1231231",
      "specialRequests": "lkjljlj"
    },
    "payment_details": {
      "method": "cash",
      "cardNumber": "",
      "cardName": "",
      "expiryDate": "",
      "cvv": "",
      "billingAddress": "",
      "billingCity": "",
      "billingCountry": "",
      "billingPostalCode": ""
    },
    "extras": {
      "gps": true,
      "childSeat": true,
      "additionalDriver": true,
      "insurance": true,
      "wifi": true,
      "fuelService": true
    },
    "pricing": {
      "subtotal": 100,
      "extras_total": 133,
      "tax": 27.959999999999997,
      "total": 260.96,
      "days": 1
    },
    "newsletter_subscribe": true
  };

  try {
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Booking API is working correctly!');
    } else {
      console.log('❌ Booking API returned an error');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

testBooking();
