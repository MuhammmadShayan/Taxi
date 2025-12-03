'use client';

import { useState } from 'react';

export default function SubscribeForm({
  label = 'Enter email address',
  placeholder = 'Enter email address',
  buttonText = 'Subscribe',
  disclaimer = "Don't worry, we don't spam",
  className = 'contact-form-style-2'
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error' | 'info'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || 'Subscription failed. Please try again.');
        setMessageType('error');
      } else {
        setMessage(data.message || 'Subscribed successfully.');
        setMessageType('success');
        setEmail('');
      }
    } catch (err) {
      setMessage('Network error. Please try again shortly.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} aria-live="polite">
      <div className="input-box">
        {label && <label className="label-text text-white">{label}</label>}
        <div className="form-group">
          <span className="la la-envelope form-icon"></span>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            required
          />
          <button className="theme-btn subscribe__btn" type="submit" disabled={loading}>
            {loading ? 'Subscribing…' : buttonText}
          </button>
          {disclaimer && (
            <span className="font-size-14 pt-1 text-white-50">
              <i className="la la-lock text-white"></i> {disclaimer}
            </span>
          )}
          {message && (
            <div
              className={`mt-2 ${
                messageType === 'success'
                  ? 'text-success'
                  : messageType === 'error'
                  ? 'text-danger'
                  : 'text-info'
              }`}
              role={messageType === 'error' ? 'alert' : undefined}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}