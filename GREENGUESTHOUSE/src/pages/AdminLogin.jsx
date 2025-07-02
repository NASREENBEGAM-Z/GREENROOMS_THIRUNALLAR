import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'greenrooms.thirunallar@gmail.com';
const ADMIN_PASSWORD = 'Thirunallar@2025';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem('admin_logged_in', 'yes');
            navigate('/admin');
        } else {
            setError('Invalid email or password');
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '4rem auto', background: '#f8f8f8', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #ccc' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, fontSize: 18 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, fontSize: 18 }} />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                <button type="submit" style={{ width: '100%', padding: 12, fontSize: 20, background: '#2ecc40', color: '#fff', border: 'none', borderRadius: 8 }}>Login</button>
            </form>
        </div>
    );
} 