"use client"
import { useState } from 'react'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/email/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed')
        setStatus('idle')
        return
      }
      setStatus('success')
    } catch (e) {
      setError('Network error')
      setStatus('idle')
    }
  }
  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 24 }}>
      <h1>Unsubscribe</h1>
      {status === 'success' ? (
        <p>You have been unsubscribed.</p>
      ) : (
        <form onSubmit={submit}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="form-control" />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Submit</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  )
}
