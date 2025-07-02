import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('https://greenrooms-thirunallar.onrender.com/api/admin/login', { email, password });
            if (res.data && res.data.token) {
                localStorage.setItem('admin_logged_in', 'yes');
                localStorage.setItem('admin_token', res.data.token);
                navigate('/admin');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
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