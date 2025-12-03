'use client';

import { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../../components/AdminDashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = async () => {
    if (!user?.user_id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?user_id=${user.user_id}&page=${currentPage}&limit=20&filter=${filter}&include_total=true`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications || []);
        setTotalPages(Math.ceil((data.total || 0) / 20));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, currentPage, filter]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_id: notificationId,
          is_read: true,
          user_id: user?.user_id
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.notification_id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      const response = await fetch(`/api/notifications?notification_id=${notificationId}&user_id=${user?.user_id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.notification_id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case 'booking': return 'la la-calendar';
      case 'payment': return 'la la-credit-card';
      case 'review': return 'la la-star';
      case 'user': return 'la la-user';
      case 'system': return 'la la-cog';
      case 'promotion': return 'la la-bullhorn';
      default: return 'la la-bell';
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'booking': return 'bg-primary';
      case 'payment': return 'bg-success';
      case 'review': return 'bg-warning';
      case 'user': return 'bg-info';
      case 'system': return 'bg-secondary';
      case 'promotion': return 'bg-danger';
      default: return 'bg-dark';
    }
  };

  return (
    <AdminDashboardLayout 
      pageTitle="Notifications" 
      breadcrumbs={['Notifications']}
    >
      <div className="dashboard-content-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-box">
                <div className="form-title-wrap">
                  <div className="d-flex align-items-center justify-content-between">
                    <h3 className="title">All Notifications</h3>
                    <div className="select-contain">
                      <select 
                        className="select-contain-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Notifications</option>
                        <option value="unread">Unread Only</option>
                        <option value="booking">Booking Notifications</option>
                        <option value="payment">Payment Notifications</option>
                        <option value="system">System Notifications</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-content">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="la la-bell-slash-o" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                      <h4 className="mt-3">No Notifications</h4>
                      <p className="text-muted">You have no notifications to display.</p>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.notification_id}
                          className={`notification-item d-flex align-items-center p-3 mb-3 border rounded ${!notification.is_read ? 'bg-light' : ''}`}
                        >
                          <div className={`notification-icon me-3 p-3 rounded-circle text-white ${getBgClass(notification.type)}`}>
                            <i className={getIconClass(notification.type)}></i>
                          </div>
                          <div className="notification-content flex-grow-1">
                            <h5 className="notification-title mb-1">{notification.title}</h5>
                            <p className="notification-message mb-1">{notification.message}</p>
                            <small className="text-muted">{notification.time_ago}</small>
                          </div>
                          <div className="notification-actions">
                            {!notification.is_read && (
                              <button 
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => markAsRead(notification.notification_id)}
                              >
                                Mark as Read
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteNotification(notification.notification_id)}
                            >
                              <i className="la la-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <nav aria-label="Notifications pagination">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => setCurrentPage(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}