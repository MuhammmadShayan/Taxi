'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickup_location: '',
    start_date: '',
    end_date: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.pickup_location || !formData.start_date || !formData.end_date) {
      alert('Please fill all fields');
      return;
    }
    const params = new URLSearchParams(formData);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ background: '#2563eb', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>HOLIKEY</h1>
        <p style={{ margin: '10px 0 0 0' }}>Multi-vendor Vehicle Rental Platform</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Find Your Perfect Vehicle in Morocco</h2>
          <p style={{ color: '#6b7280' }}>Connect with trusted Moroccan rental agencies</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ 
          background: '#f9fafb', 
          padding: '30px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pickup Location*</label>
              <select
                value={formData.pickup_location}
                onChange={(e) => setFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              >
                <option value="">Choose location</option>
                <option value="Casablanca Mohammed V Airport">Casablanca Airport</option>
                <option value="Rabat City Center">Rabat City Center</option>
                <option value="Marrakech Menara Airport">Marrakech Airport</option>
                <option value="Fes Train Station">Fes Train Station</option>
                <option value="Beni Mellal Train Station">Beni Mellal Station</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date*</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date*</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🔍 Search Vehicles
          </button>
        </form>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '40px' }}>
          <div style={{ textAlign: 'center', padding: '15px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>150+</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Vehicles</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>25+</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Agencies</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>1200+</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Customers</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>20+</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Locations</div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '30px' }}>Why Choose HOLIKEY?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '15px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🛡️</div>
              <h4 style={{ marginBottom: '5px' }}>Verified Agencies</h4>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>All partners are carefully vetted</p>
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💳</div>
              <h4 style={{ marginBottom: '5px' }}>Flexible Payment</h4>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Pay 20% upfront or full amount</p>
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎧</div>
              <h4 style={{ marginBottom: '5px' }}>24/7 Support</h4>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Customer support available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div style={{ background: '#1f2937', color: 'white', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <h4 style={{ marginBottom: '10px' }}>HOLIKEY</h4>
        <p style={{ color: '#9ca3af', marginBottom: '15px', fontSize: '14px' }}>
          Connecting Morocco's vehicle rental agencies with the world
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
          © 2025 HOLIKEY. All rights reserved. | 📞 +212 600 123 456 | ✉️ info@holikey.com
        </p>
      </div>
    </div>
  );
}

