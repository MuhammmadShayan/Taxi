'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencyEarningsPage() {
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('this_month');

  useEffect(() => {
    fetchEarnings();
  }, [dateRange]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`/api/agency/earnings?range=${dateRange}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.earnings || {});
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading earnings...</p>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout pageTitle="Financial Overview">
        <div className="row">
          <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Financial Overview</h3>
                    <p className="subtitle">Track earnings, commissions, and payment history</p>
                  </div>
                  
                  {/* Earnings Stats */}
                  <div className="form-content">
                    <div className="row mb-4">
                      <div className="col-lg-3 col-md-6">
                        <div className="card-item stats-card">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h4 className="card-title text-primary">{formatCurrency(earnings.total || 0)}</h4>
                                <p className="card-text">Total Earnings</p>
                              </div>
                              <div className="icon-element bg-1">
                                <i className="la la-dollar"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="card-item stats-card">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h4 className="card-title text-success">{formatCurrency(earnings.thisMonth || 0)}</h4>
                                <p className="card-text">This Month</p>
                              </div>
                              <div className="icon-element bg-2">
                                <i className="la la-calendar"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="card-item stats-card">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h4 className="card-title text-info">{formatCurrency(earnings.lastMonth || 0)}</h4>
                                <p className="card-text">Last Month</p>
                              </div>
                              <div className="icon-element bg-3">
                                <i className="la la-chart-line"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-3 col-md-6">
                        <div className="card-item stats-card">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h4 className="card-title text-warning">{formatCurrency(earnings.thisYear || 0)}</h4>
                                <p className="card-text">This Year</p>
                              </div>
                              <div className="icon-element bg-4">
                                <i className="la la-trophy"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="row mb-4">
                      <div className="col-lg-4">
                        <div className="input-box">
                          <label className="label-text">Date Range</label>
                          <select
                            className="form-control"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                          >
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="this_year">This Year</option>
                            <option value="last_year">Last Year</option>
                            <option value="all_time">All Time</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card-item">
                          <div className="card-title-wrap">
                            <h4 className="card-title">Recent Transactions</h4>
                          </div>
                          <div className="card-content">
                            {transactions.length === 0 ? (
                              <div className="text-center p-4">
                                <i className="la la-receipt display-4 text-muted"></i>
                                <h5 className="mt-3">No transactions found</h5>
                                <p className="text-muted">No earnings for the selected period.</p>
                              </div>
                            ) : (
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Customer</th>
                                      <th>Vehicle</th>
                                      <th>Trip Duration</th>
                                      <th>Amount</th>
                                      <th>Commission</th>
                                      <th>Net Earning</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {transactions.map(transaction => (
                                      <tr key={transaction.payment_id}>
                                        <td>{formatDate(transaction.payment_date)}</td>
                                        <td>
                                          <div>
                                            <h6 className="mb-1">{transaction.customer_name}</h6>
                                            <small className="text-muted">{transaction.customer_email}</small>
                                          </div>
                                        </td>
                                        <td>
                                          <div>
                                            <strong>{transaction.vehicle_brand} {transaction.vehicle_model}</strong>
                                            <br />
                                            <small className="text-muted">{transaction.vehicle_number}</small>
                                          </div>
                                        </td>
                                        <td>
                                          <div>
                                            <small>{formatDate(transaction.start_date)}</small>
                                            <br />
                                            <small>to {formatDate(transaction.end_date)}</small>
                                            <br />
                                            <strong>{transaction.total_days} days</strong>
                                          </div>
                                        </td>
                                        <td>
                                          <strong>{formatCurrency(transaction.amount)}</strong>
                                        </td>
                                        <td>
                                          <span className="text-warning">
                                            {formatCurrency(transaction.commission || 0)}
                                          </span>
                                        </td>
                                        <td>
                                          <strong className="text-success">
                                            {formatCurrency((transaction.amount || 0) - (transaction.commission || 0))}
                                          </strong>
                                        </td>
                                        <td>
                                          <span className={`badge ${
                                            transaction.status === 'completed' ? 'bg-success' :
                                            transaction.status === 'pending' ? 'bg-warning' :
                                            'bg-secondary'
                                          }`}>
                                            {transaction.status?.toUpperCase()}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </AgencyLayout>
    </AuthProvider>
  );
}

