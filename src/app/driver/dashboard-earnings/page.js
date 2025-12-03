'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DriverDashboardEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [payoutRequest, setPayoutRequest] = useState(false);
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch driver stats and earnings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, earningsResponse] = await Promise.all([
          fetch('/api/driver/stats'),
          fetch(`/api/driver/earnings?period=${selectedPeriod}`)
        ]);
        
        if (!statsResponse.ok || !earningsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const statsData = await statsResponse.json();
        const earningsData = await earningsResponse.json();
        
        setStats(statsData);
        setEarnings(earningsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPeriod]);

  const handlePayoutRequest = async () => {
    try {
      const response = await fetch('/api/driver/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: stats?.availableBalance || 0 })
      });
      
      if (response.ok) {
        setPayoutRequest(true);
      }
    } catch (err) {
      console.error('Error requesting payout:', err);
    }
  };

  // Generate dynamic stats cards from API data
  const statsCards = stats ? [
    {
      title: "Today's Earnings",
      value: `$${(stats.todayEarnings || 0).toFixed(2)}`,
      icon: 'la la-dollar',
      bgClass: 'bg-1'
    },
    {
      title: 'This Week',
      value: `$${(stats.weekEarnings || 0).toFixed(2)}`,
      icon: 'la la-calendar',
      bgClass: 'bg-2'
    },
    {
      title: 'Available Balance',
      value: `$${(stats.availableBalance || 0).toFixed(2)}`,
      icon: 'la la-money',
      bgClass: 'bg-3'
    },
    {
      title: 'Hours Driven',
      value: `${stats.totalHoursDriven || 0}h`,
      icon: 'la la-clock-o',
      bgClass: 'bg-4'
    }
  ] : [];

  if (loading) {
    return (
      <>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading earnings data...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Main Earnings Content */}

              {/* Earnings Chart & Quick Actions */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Earnings Overview</h3>
                        <div className="select-contain">
                          <select 
                            className="select-contain-select"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                          >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="earnings-chart">
                        {/* Chart placeholder */}
                        <div className="chart-placeholder text-center py-5">
                          <i className="la la-line-chart" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-3">Earnings trend chart will be displayed here</p>
                          <div className="earnings-breakdown mt-3">
                            <div className="row text-center">
                              <div className="col-md-4">
                                <h4 className="text-success">${(earnings?.tripEarnings || stats?.totalEarnings || 0).toFixed(2)}</h4>
                                <p className="text-muted">Trip Earnings</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-info">${(earnings?.tips || 0).toFixed(2)}</h4>
                                <p className="text-muted">Tips</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-warning">${(earnings?.bonuses || 0).toFixed(2)}</h4>
                                <p className="text-muted">Bonuses</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="payout-info">
                        <div className="payout-balance text-center mb-4">
                          <h2 className="text-success">${(stats?.availableBalance || 0).toFixed(2)}</h2>
                          <p className="text-muted">Available for payout</p>
                        </div>
                        
                        <div className="payout-details mb-4">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Gross Earnings:</span>
                            <span>${((stats?.weekEarnings || 0) * 1.25).toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Platform Fee (20%):</span>
                            <span>-${((stats?.weekEarnings || 0) * 0.25).toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2 text-success">
                            <strong>Net Earnings:</strong>
                            <strong>${(stats?.weekEarnings || 0).toFixed(2)}</strong>
                          </div>
                        </div>

                        {!payoutRequest ? (
                          <button 
                            className="theme-btn w-100"
                            onClick={handlePayoutRequest}
                          >
                            <i className="la la-credit-card me-2"></i>Request Instant Payout
                          </button>
                        ) : (
                          <div className="alert alert-success">
                            <i className="la la-check-circle me-2"></i>
                            Payout request submitted! Funds will be transferred within 1-2 business days.
                          </div>
                        )}

                        <Link href="/driver/dashboard-settings" className="theme-btn theme-btn-transparent w-100 mt-2">
                          <i className="la la-cog me-2"></i>Payment Settings
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Next Payout</h3>
                    </div>
                    <div className="form-content">
                      <div className="payout-info">
                        <div className="payout-amount text-center mb-3">
                          <h2 className="text-success">${(stats?.availableBalance || 0).toFixed(2)}</h2>
                          <p className="text-muted">Available for payout</p>
                        </div>
                        <div className="payout-details">
                          <p><strong>Payout Date:</strong> Every Friday</p>
                          <p><strong>Method:</strong> Bank Transfer</p>
                          <p><strong>Processing:</strong> 1-2 business days</p>
                          <p><strong>Total Payouts:</strong> {stats?.total_payouts || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Payment History</h3>
                        <div className="select-contain">
                          <select className="select-contain-select">
                            <option value="all">All Payments</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Period</th>
                              <th scope="col">Trips</th>
                              <th scope="col">Gross Amount</th>
                              <th scope="col">Fees</th>
                              <th scope="col">Net Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {earnings?.paymentHistory?.length > 0 ? (
                              earnings.paymentHistory.map((payment, index) => (
                                <tr key={index}>
                                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                                  <td>{payment.period}</td>
                                  <td>{payment.trips}</td>
                                  <td>${payment.grossAmount.toFixed(2)}</td>
                                  <td>${payment.fees.toFixed(2)}</td>
                                  <td><strong>${payment.netAmount.toFixed(2)}</strong></td>
                                  <td>
                                    <span className={`badge ${payment.status === 'completed' ? 'bg-success' : payment.status === 'pending' ? 'bg-warning' : 'bg-danger'} text-white`}>
                                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                  </td>
                                  <td>
                                    {payment.status === 'completed' ? (
                                      <a href="#" className="theme-btn theme-btn-small">View Details</a>
                                    ) : (
                                      <span className="text-muted">Processing...</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center py-4">
                                  <i className="la la-inbox" style={{fontSize: '48px', color: '#ccc'}}></i>
                                  <p className="text-muted mt-2">No payment history available</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </>
  );
}
