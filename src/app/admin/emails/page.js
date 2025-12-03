"use client"
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminEmailsPage() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [templates, setTemplates] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [processing, setProcessing] = useState(false)

  async function loadLogs(p = page) {
    const res = await fetch(`/api/admin/emails/logs?page=${p}&limit=${limit}`)
    const data = await res.json()
    if (res.ok) {
      setLogs(data.logs || [])
      setTotal(data.pagination?.total || 0)
      setPage(data.pagination?.page || p)
      setLimit(data.pagination?.limit || limit)
    }
  }

  async function loadTemplates() {
    const res = await fetch('/api/admin/emails/templates')
    const data = await res.json()
    if (res.ok) {
      setTemplates(data.templates || [])
    }
  }

  async function processQueue() {
    setProcessing(true)
    const res = await fetch('/api/email/queue/process', { method: 'POST' })
    setProcessing(false)
    await loadLogs()
  }

  async function saveTemplate(tpl) {
    setSaving(true)
    const res = await fetch('/api/admin/emails/templates', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tpl) })
    setSaving(false)
    setEditing(null)
    await loadTemplates()
  }

  useEffect(() => { loadLogs(1); loadTemplates() }, [])

  return (
    <AdminLayout>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Email Logs</h3>
          <button className="btn btn-primary" onClick={processQueue} disabled={processing}>{processing ? 'Processing...' : 'Process Queue'}</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>To</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.to_email}</td>
                  <td>{l.subject}</td>
                  <td><span className={`badge ${l.status === 'sent' ? 'bg-success' : l.status === 'failed' ? 'bg-danger' : 'bg-secondary'}`}>{l.status}</span></td>
                  <td>{l.sent_at ? new Date(l.sent_at).toLocaleString() : '-'}</td>
                  <td style={{ maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.error_text || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={6} className="text-center">No logs</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>Page {page} of {Math.max(1, Math.ceil(total / limit))}</div>
          <div>
            <button className="btn btn-outline-secondary me-2" disabled={page <= 1} onClick={() => loadLogs(page - 1)}>Prev</button>
            <button className="btn btn-outline-secondary" disabled={page >= Math.ceil(total / limit)} onClick={() => loadLogs(page + 1)}>Next</button>
          </div>
        </div>

        <hr className="my-4" />
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Email Templates</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Key</th>
                <th>Subject</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.template_key}>
                  <td>{t.template_key}</td>
                  <td>{t.subject}</td>
                  <td>{new Date(t.updated_at).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(t)}>Edit</button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr><td colSpan={4} className="text-center">No templates</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="card mt-3">
            <div className="card-header">Edit Template</div>
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">Key</label>
                <input className="form-control" value={editing.template_key} disabled />
              </div>
              <div className="mb-2">
                <label className="form-label">Subject</label>
                <input className="form-control" value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} />
              </div>
              <div className="mb-2">
                <label className="form-label">HTML</label>
                <textarea className="form-control" rows={10} value={editing.html} onChange={e => setEditing({ ...editing, html: e.target.value })} />
              </div>
              <div className="d-flex">
                <button className="btn btn-primary me-2" onClick={() => saveTemplate(editing)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button className="btn btn-outline-secondary" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
