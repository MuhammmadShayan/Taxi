'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DriverDashboardSupport() {
  const [ticketForm, setTicketForm] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    message: '',
    tripId: ''
  });

  const [chatMessage, setChatMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API call to submit ticket
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Support ticket submitted successfully! You will receive a confirmation email shortly.');
      setTicketForm({ category: '', priority: 'medium', subject: '', message: '', tripId: '' });
    }, 2000);
  };

  return (
    <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard-bread-2">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Support & Help</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><Link href="/" className="text-white">Home</Link></li>
                      <li><Link href="/driver/dashboard" className="text-white">Dashboard</Link></li>
                      <li>Support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4">
                  {/* Quick Help */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Help</h3>
                    </div>
                    <div className="form-content">
                      <div className="quick-help-items">
                        <div className="help-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-question-circle me-3 text-primary" style={{fontSize: '24px'}}></i>
                            <div>
                              <h5 className="mb-1">Getting Started</h5>
                              <p className="text-muted mb-0">Learn the basics of driving with KiraStay</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="help-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-car me-3 text-success" style={{fontSize: '24px'}}></i>
                            <div>
                              <h5 className="mb-1">Vehicle Management</h5>
                              <p className="text-muted mb-0">Add, edit, and manage your vehicles</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="help-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-dollar-sign me-3 text-warning" style={{fontSize: '24px'}}></i>
                            <div>
                              <h5 className="mb-1">Earnings & Payments</h5>
                              <p className="text-muted mb-0">Understanding your earnings and payouts</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="help-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-route me-3 text-info" style={{fontSize: '24px'}}></i>
                            <div>
                              <h5 className="mb-1">Trip Guidelines</h5>
                              <p className="text-muted mb-0">Best practices for successful trips</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="help-item p-3" style={{background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-shield-alt me-3 text-danger" style={{fontSize: '24px'}}></i>
                            <div>
                              <h5 className="mb-1">Safety & Security</h5>
                              <p className="text-muted mb-0">Stay safe while driving</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contacts */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Emergency Contacts</h3>
                    </div>
                    <div className="form-content">
                      <div className="emergency-contacts">
                        <div className="contact-item d-flex align-items-center p-3 mb-3" style={{background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7'}}>
                          <i className="la la-phone me-3 text-warning" style={{fontSize: '24px'}}></i>
                          <div>
                            <h5 className="mb-1">KiraStay 24/7 Support</h5>
                            <p className="mb-0"><strong>+1-800-KIRA-HELP</strong></p>
                          </div>
                        </div>
                        
                        <div className="contact-item d-flex align-items-center p-3 mb-3" style={{background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb'}}>
                          <i className="la la-exclamation-triangle me-3 text-danger" style={{fontSize: '24px'}}></i>
                          <div>
                            <h5 className="mb-1">Emergency Services</h5>
                            <p className="mb-0"><strong>911</strong> (Police, Fire, Medical)</p>
                          </div>
                        </div>
                        
                        <div className="contact-item d-flex align-items-center p-3" style={{background: '#d1ecf1', borderRadius: '8px', border: '1px solid #bee5eb'}}>
                          <i className="la la-wrench me-3 text-info" style={{fontSize: '24px'}}></i>
                          <div>
                            <h5 className="mb-1">Roadside Assistance</h5>
                            <p className="mb-0"><strong>1-800-ROADHELP</strong></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-8">
                  {/* Support Tickets */}
                  <div className="form-box">
                    <div className="form-title-wrap d-flex justify-content-between align-items-center">
                      <h3 className="title">My Support Tickets</h3>
                      <button className="theme-btn theme-btn-small">
                        <i className="la la-plus me-1"></i>New Ticket
                      </button>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Ticket #</th>
                              <th scope="col">Subject</th>
                              <th scope="col">Status</th>
                              <th scope="col">Priority</th>
                              <th scope="col">Created</th>
                              <th scope="col">Last Updated</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>#12845</td>
                              <td>Payment not received for Trip #TR789</td>
                              <td><span className="badge bg-warning">In Progress</span></td>
                              <td><span className="badge bg-danger">High</span></td>
                              <td>Dec 15, 2024</td>
                              <td>Dec 16, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="la la-eye me-2"></i>View Details</a></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-comment me-2"></i>Add Comment</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#12823</td>
                              <td>App crashing during trip navigation</td>
                              <td><span className="badge bg-success">Resolved</span></td>
                              <td><span className="badge bg-warning">Medium</span></td>
                              <td>Dec 12, 2024</td>
                              <td>Dec 14, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="la la-eye me-2"></i>View Details</a></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-star me-2"></i>Rate Support</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#12798</td>
                              <td>How to update vehicle insurance information?</td>
                              <td><span className="badge bg-success">Resolved</span></td>
                              <td><span className="badge bg-info">Low</span></td>
                              <td>Dec 8, 2024</td>
                              <td>Dec 9, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="la la-eye me-2"></i>View Details</a></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-star me-2"></i>Rate Support</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Support Form */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Contact Support</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post" onSubmit={handleSubmitTicket}>
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Issue Category</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select 
                                      className="select-contain-select"
                                      value={ticketForm.category}
                                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                                    >
                                      <option value="">Select Category</option>
                                      <option value="payment">Payment Issues</option>
                                      <option value="technical">Technical Problems</option>
                                      <option value="vehicle">Vehicle Related</option>
                                      <option value="trip">Trip Issues</option>
                                      <option value="account">Account Problems</option>
                                      <option value="safety">Safety Concerns</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Priority Level</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="low">Low</option>
                                      <option value="medium" selected>Medium</option>
                                      <option value="high">High</option>
                                      <option value="urgent">Urgent</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Subject</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-pencil"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="subject"
                                    placeholder="Brief description of your issue"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Trip ID (if applicable)</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-route"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="trip_id"
                                    placeholder="Enter trip ID if this issue is related to a specific trip"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Message</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-comment"></i>
                                  </span>
                                  <textarea
                                    className="message-control form-control"
                                    name="message"
                                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information."
                                    rows="6"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Attach Files (optional)</label>
                                <div className="file-upload-wrap">
                                  <input type="file" name="attachments" id="supportAttachments" className="file-upload-input" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" />
                                  <div className="file-upload-item">
                                    <div className="file-upload-icon">
                                      <i className="la la-cloud-upload"></i>
                                    </div>
                                    <div className="file-upload-text">
                                      <h3 className="file-upload-title">Drop files here or click to upload</h3>
                                      <p className="file-upload-hint">Supported: JPG, PNG, PDF, DOC (Max 10MB each)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="btn-box">
                                <button 
                                  type="submit" 
                                  className="theme-btn"
                                  disabled={isSubmitting}
                                >
                                  <i className={`la ${isSubmitting ? 'la-spinner la-spin' : 'la-paper-plane'} me-2`}></i>
                                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                                <Link href="/driver/dashboard" className="theme-btn theme-btn-transparent ms-3">
                                  <i className="la la-arrow-left me-2"></i>Back to Dashboard
                                </Link>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-8">
                  {/* FAQ Section */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Frequently Asked Questions</h3>
                    </div>
                    <div className="form-content">
                      <div className="accordion" id="faqAccordion">
                        <div className="card mb-2">
                          <div className="card-header" id="faq1">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                                How do I get paid for my trips?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse1" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              Payments are processed automatically based on your payout frequency setting. You can choose daily, weekly, bi-weekly, or monthly payouts. Earnings are transferred directly to your registered bank account or PayPal.
                            </div>
                          </div>
                        </div>
                        
                        <div className="card mb-2">
                          <div className="card-header" id="faq2">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                                What should I do if a passenger doesn't show up?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse2" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              Wait at the pickup location for the designated time (usually 5 minutes). If the passenger doesn't arrive, you can mark the trip as "No Show" in the app and receive a cancellation fee.
                            </div>
                          </div>
                        </div>
                        
                        <div className="card mb-2">
                          <div className="card-header" id="faq3">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                                How do I update my vehicle information?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse3" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              Go to "Manage Cars" in your dashboard. You can edit vehicle details, upload new documents, and update insurance information. Some changes may require admin approval.
                            </div>
                          </div>
                        </div>
                        
                        <div className="card mb-2">
                          <div className="card-header" id="faq4">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
                                What happens if I get into an accident during a trip?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse4" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              First, ensure everyone's safety and call 911 if needed. Then immediately contact KiraStay support through the emergency button in the app. We provide insurance coverage during active trips.
                            </div>
                          </div>
                        </div>
                        
                        <div className="card mb-2">
                          <div className="card-header" id="faq5">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5">
                                How can I improve my driver rating?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse5" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              Maintain a clean vehicle, be punctual, follow the GPS route, be courteous to passengers, offer amenities like water or phone chargers, and ensure a smooth, safe ride experience.
                            </div>
                          </div>
                        </div>
                        
                        <div className="card">
                          <div className="card-header" id="faq6">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6">
                                Can I work flexible hours?
                              </button>
                            </h2>
                          </div>
                          <div id="collapse6" className="collapse" data-bs-parent="#faqAccordion">
                            <div className="card-body">
                              Yes! You can set your availability in the Settings page. You have complete control over when you want to accept trips and can go online/offline at any time.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Chat */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Live Chat Support</h3>
                    </div>
                    <div className="form-content">
                      <div className="chat-container p-3" style={{background: '#f8f9fa', borderRadius: '8px', height: '300px', overflow: 'auto'}}>
                        <div className="chat-message mb-3">
                          <div className="d-flex align-items-start">
                            <div className="chat-avatar me-3">
                              <i className="la la-user-circle text-primary" style={{fontSize: '32px'}}></i>
                            </div>
                            <div className="chat-content">
                              <div className="chat-bubble bg-primary text-white p-2 rounded">
                                <p className="mb-1">Hello! I'm here to help. What can I assist you with today?</p>
                                <small className="opacity-75">Support Agent - 2 mins ago</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="chat-input mt-3">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Type your message..."
                          />
                          <button className="btn btn-primary" type="button">
                            <i className="la la-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="chat-status d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center">
                          <div className="status-indicator bg-success rounded-circle me-2" style={{width: '8px', height: '8px'}}></div>
                          <small className="text-muted">Support Agent Online</small>
                        </div>
                        <small className="text-muted">Average response time: 2 minutes</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
