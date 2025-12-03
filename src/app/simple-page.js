'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SimplePage() {
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                <option value="Casablanca Mohammed V Airport">Casablanca Mohammed V Airport</option>
                <option value="Rabat City Center">Rabat City Center</option>
                <option value="Marrakech Menara Airport">Marrakech Menara Airport</option>
                <option value="Fes Train Station">Fes Train Station</option>
                <option value="Beni Mellal Train Station">Beni Mellal Train Station</option>
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
            Search Vehicles
          </button>
        </form>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>150+</div>
            <div style={{ color: '#6b7280' }}>Available Vehicles</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>25+</div>
            <div style={{ color: '#6b7280' }}>Trusted Agencies</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>1200+</div>
            <div style={{ color: '#6b7280' }}>Happy Customers</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>20+</div>
            <div style={{ color: '#6b7280' }}>Pickup Locations</div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#1f2937', marginBottom: '30px' }}>Why Choose HOLIKEY?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛡️</div>
              <h3 style={{ marginBottom: '10px' }}>Verified Agencies</h3>
              <p style={{ color: '#6b7280' }}>All partner agencies are carefully vetted for quality and reliability.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💳</div>
              <h3 style={{ marginBottom: '10px' }}>Flexible Payment</h3>
              <p style={{ color: '#6b7280' }}>Pay as little as 20% upfront or the full amount - your choice.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎧</div>
              <h3 style={{ marginBottom: '10px' }}>24/7 Support</h3>
              <p style={{ color: '#6b7280' }}>Customer support available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1f2937', color: 'white', padding: '40px 20px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '20px' }}>HOLIKEY</h3>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
            Connecting Morocco's finest vehicle rental agencies with the world
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About</Link>
            <Link href="/search" style={{ color: '#9ca3af', textDecoration: 'none' }}>Search</Link>
            <Link href="/agency/register" style={{ color: '#9ca3af', textDecoration: 'none' }}>Become Partner</Link>
            <Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</Link>
          </div>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            © 2025 HOLIKEY. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

