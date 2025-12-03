'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencySupportPage() {
  const [activeTab, setActiveTab] = useState('ticket');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/agency/support/tickets', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch('/api/agency/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(ticketForm),
      });

      if (response.ok) {
        alert('Support ticket submitted successfully!');
        setTicketForm({
          subject: '',
          category: 'general',
          priority: 'medium',
          description: ''
        });
        fetchTickets(); // Refresh tickets list
      } else {
        const err = await response.json();
        alert('Error: ' + (err.error || 'Failed to submit ticket'));
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-warning text-dark',
      in_progress: 'bg-info text-white',
      resolved: 'bg-success text-white',
      closed: 'bg-secondary text-white'
    };
    return badges[status] || 'bg-secondary text-white';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-secondary text-white',
      medium: 'bg-warning text-dark',
      high: 'bg-danger text-white',
      urgent: 'bg-danger text-white'
    };
    return badges[priority] || 'bg-secondary text-white';
  };

  return (
    <AuthProvider>
      <AgencyLayout>
        <div className="dashboard-main-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Support Center</h3>
                    <p className="subtitle">Get help and submit support requests</p>
                  </div>

                  <div className="form-content">
                    {/* Tab Navigation */}
                    <ul className="nav nav-tabs mb-4" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button 
                          className={`nav-link ${activeTab === 'ticket' ? 'active' : ''}`}
                          onClick={() => setActiveTab('ticket')}
                          type="button"
                        >
                          Submit Ticket
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button 
                          className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
                          onClick={() => setActiveTab('tickets')}
                          type="button"
                        >
                          My Tickets
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button 
                          className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                          onClick={() => setActiveTab('faq')}
                          type="button"
                        >
                          FAQ
                        </button>
                      </li>
                    </ul>

                    {/* Submit Ticket Tab */}
                    {activeTab === 'ticket' && (
                      <form onSubmit={handleTicketSubmit}>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Subject *</label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="subject"
                                  value={ticketForm.subject}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="Brief description of your issue"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Category</label>
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="category"
                                  value={ticketForm.category}
                                  onChange={handleInputChange}
                                >
                                  <option value="general">General Question</option>
                                  <option value="technical">Technical Issue</option>
                                  <option value="billing">Billing & Payment</option>
                                  <option value="booking">Booking Issue</option>
                                  <option value="vehicle">Vehicle Management</option>
                                  <option value="account">Account Settings</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Priority</label>
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="priority"
                                  value={ticketForm.priority}
                                  onChange={handleInputChange}
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="urgent">Urgent</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Description *</label>
                              <div className="form-group">
                                <textarea
                                  className="form-control"
                                  name="description"
                                  value={ticketForm.description}
                                  onChange={handleInputChange}
                                  required
                                  rows={6}
                                  placeholder="Please provide a detailed description of your issue..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="btn-box">
                              <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={submitLoading}
                              >
                                {submitLoading ? 'Submitting...' : 'Submit Ticket'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* My Tickets Tab */}
                    {activeTab === 'tickets' && (
                      <div className="tickets-list">
                        {loading ? (
                          <div className="text-center p-4">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : tickets.length === 0 ? (
                          <div className="text-center p-4">
                            <p>No support tickets found.</p>
                            <button 
                              className="btn btn-primary"
                              onClick={() => setActiveTab('ticket')}
                            >
                              Submit Your First Ticket
                            </button>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Ticket ID</th>
                                  <th>Subject</th>
                                  <th>Category</th>
                                  <th>Priority</th>
                                  <th>Status</th>
                                  <th>Created</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tickets.map(ticket => (
                                  <tr key={ticket.id}>
                                    <td>#{ticket.id}</td>
                                    <td>{ticket.subject}</td>
                                    <td>
                                      <span className="text-capitalize">
                                        {ticket.category.replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                                        {ticket.priority.toUpperCase()}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${getStatusBadge(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ').toUpperCase()}
                                      </span>
                                    </td>
                                    <td>
                                      {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                      <button className="btn btn-sm btn-outline-primary">
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                      <div className="faq-section">
                        <div className="accordion" id="faqAccordion">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button 
                                className="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#faq1"
                              >
                                How do I add a new vehicle to my fleet?
                              </button>
                            </h2>
                            <div id="faq1" className="accordion-collapse collapse">
                              <div className="accordion-body">
                                Go to Dashboard → Add Car and fill out the vehicle details form. Make sure to upload clear photos and set competitive pricing.
                              </div>
                            </div>
                          </div>

                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button 
                                className="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#faq2"
                              >
                                How do I handle booking cancellations?
                              </button>
                            </h2>
                            <div id="faq2" className="accordion-collapse collapse">
                              <div className="accordion-body">
                                You can manage cancellations from the Trips page. Check your cancellation policy settings and process refunds according to your terms.
                              </div>
                            </div>
                          </div>

                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button 
                                className="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#faq3"
                              >
                                When do I receive payments?
                              </button>
                            </h2>
                            <div id="faq3" className="accordion-collapse collapse">
                              <div className="accordion-body">
                                Payments are processed weekly and deposited to your registered bank account. You can view payment history in the Earnings section.
                              </div>
                            </div>
                          </div>

                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button 
                                className="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#faq4"
                              >
                                How can I improve my booking rate?
                              </button>
                            </h2>
                            <div id="faq4" className="accordion-collapse collapse">
                              <div className="accordion-body">
                                Keep your vehicle photos updated, maintain competitive pricing, respond quickly to customer inquiries, and maintain high ratings through excellent service.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

