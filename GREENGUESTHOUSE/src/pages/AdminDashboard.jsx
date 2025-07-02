import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://greenrooms-thirunallar.onrender.com/api';

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];
  for (const row of rows) {
    const values = headers.map(h => JSON.stringify(row[h] ?? ''));
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

function formatDateTime(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-US', { weekday: 'long' })} ${d.toLocaleTimeString()}`;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editBooking, setEditBooking] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [messageModal, setMessageModal] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Protect route
    if (localStorage.getItem('admin_logged_in') !== 'yes') {
      navigate('/admin-login');
      return;
    }
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/bookings`);
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
    setLoading(false);
  }

  function handleReset() {
    fetchBookings();
    setUndoStack([]);
    setRedoStack([]);
  }

  function handleUndo() {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, bookings]);
    setBookings(prev);
    setUndoStack(u => u.slice(0, -1));
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, bookings]);
    setBookings(next);
    setRedoStack(r => r.slice(0, -1));
  }

  async function confirmBooking(id) {
    if (!window.confirm('Send confirmation email to customer?')) return;
    try {
      await axios.post(`${API_BASE}/bookings/${id}/confirm`);
      alert('Confirmation sent!');
      fetchBookings();
    } catch (err) {
      alert('Failed to send confirmation');
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin-login');
  }

  function handleExportCSV() {
    const exportRows = bookings.map(b => ({
      ID: b.id,
      Name: `${b.firstName} ${b.lastName}`,
      Email: b.email,
      Phone: b.phone,
      Address: b.address,
      Note: b.note,
      Room: b.roomData?.name || b.room?.name || '-',
      CheckIn: b.checkIn?.slice(0, 10),
      CheckOut: b.checkOut?.slice(0, 10),
      Adults: b.adults,
      Children: b.children,
      Status: b.status,
      TotalPrice: b.totalPrice,
      CreatedAt: b.createdAt,
      FormattedDate: formatDateTime(b.createdAt)
    }));
    const csv = toCSV(exportRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function filteredBookings() {
    if (!search) return bookings;
    const s = search.toLowerCase();
    return bookings.filter(b =>
      b.firstName?.toLowerCase().includes(s) ||
      b.lastName?.toLowerCase().includes(s) ||
      b.email?.toLowerCase().includes(s) ||
      b.phone?.toLowerCase().includes(s) ||
      b.status?.toLowerCase().includes(s) ||
      (b.roomData?.name || b.room?.name || '').toLowerCase().includes(s)
    );
  }

  function openEdit(booking) {
    setEditBooking(booking);
    setEditNote(booking.note || '');
  }
  async function saveEdit() {
    try {
      setUndoStack(u => [...u, bookings]);
      setRedoStack([]);
      await axios.put(`${API_BASE}/bookings/${editBooking.id}`, { note: editNote });
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking');
    }
  }

  function openMessage(booking) {
    setMessageModal(booking);
    setCustomMessage('');
  }
  async function sendCustomMessage() {
    try {
      await axios.post(`${API_BASE}/bookings/${messageModal.id}/message`, { message: customMessage });
      alert('Message sent!');
      setMessageModal(null);
    } catch (err) {
      alert('Failed to send message');
    }
  }

  return (
    <div style={{ maxWidth: 1300, margin: '2rem auto', background: '#f8f8f8', color: '#222', padding: 24, borderRadius: 12, fontSize: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32 }}>Admin Dashboard - Bookings</h2>
        <div>
          <button onClick={handleReset} style={{ background: '#7f8c8d', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 18, cursor: 'pointer', marginRight: 12 }}>Reset</button>
          <button onClick={handleUndo} disabled={undoStack.length === 0} style={{ background: undoStack.length === 0 ? '#bdc3c7' : '#f39c12', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 18, cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer', marginRight: 12 }}>Undo</button>
          <button onClick={handleRedo} disabled={redoStack.length === 0} style={{ background: redoStack.length === 0 ? '#bdc3c7' : '#2980b9', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 18, cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer', marginRight: 12 }}>Redo</button>
          <button onClick={handleExportCSV} style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 18, cursor: 'pointer', marginRight: 12 }}>Export to CSV</button>
          <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 18, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone, status, room..." style={{ width: 400, padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', background: '#fff', color: '#222', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: 10 }}>ID</th>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Phone</th>
              <th style={{ padding: 10 }}>Address</th>
              <th style={{ padding: 10 }}>Note</th>
              <th style={{ padding: 10 }}>Room</th>
              <th style={{ padding: 10 }}>Check-in</th>
              <th style={{ padding: 10 }}>Check-out</th>
              <th style={{ padding: 10 }}>Adults</th>
              <th style={{ padding: 10 }}>Children</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Total Price</th>
              <th style={{ padding: 10 }}>Created At</th>
              <th style={{ padding: 10 }}>Formatted Date</th>
              <th style={{ padding: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings().map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>{b.id}</td>
                <td style={{ padding: 10 }}>{b.firstName} {b.lastName}</td>
                <td style={{ padding: 10 }}>{b.email}</td>
                <td style={{ padding: 10 }}>{b.phone}</td>
                <td style={{ padding: 10 }}>{b.address}</td>
                <td style={{ padding: 10 }}>{b.note}</td>
                <td style={{ padding: 10 }}>{b.roomData?.name || b.room?.name || '-'}</td>
                <td style={{ padding: 10 }}>{b.checkIn?.slice(0, 10)}</td>
                <td style={{ padding: 10 }}>{b.checkOut?.slice(0, 10)}</td>
                <td style={{ padding: 10 }}>{b.adults}</td>
                <td style={{ padding: 10 }}>{b.children}</td>
                <td style={{ padding: 10 }}>{b.status}</td>
                <td style={{ padding: 10 }}>{b.totalPrice}</td>
                <td style={{ padding: 10 }}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</td>
                <td style={{ padding: 10 }}>{formatDateTime(b.createdAt)}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => openEdit(b)} style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginLeft: 4, marginBottom: 6 }}>Edit</button>
                  <button onClick={() => openMessage(b)} style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginLeft: 4 }}>Send Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Edit Modal */}
      {editBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 400 }}>
            <h3>Edit Booking Note (ID: {editBooking.id})</h3>
            <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={4} style={{ width: '100%', fontSize: 16, marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditBooking(null)} style={{ marginRight: 12 }}>Cancel</button>
              <button onClick={saveEdit} style={{ background: '#2ecc40', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Send Message Modal */}
      {messageModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 400 }}>
            <h3>Send Custom Message to {messageModal.firstName} {messageModal.lastName}</h3>
            <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} rows={4} style={{ width: '100%', fontSize: 16, marginBottom: 16 }} placeholder="Type your message here..." />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setMessageModal(null)} style={{ marginRight: 12 }}>Cancel</button>
              <button onClick={sendCustomMessage} style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 