import React, { useState } from 'react';

const OtpDemo = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: request, 2: verify
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch('/api/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('OTP sent to your email!');
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('OTP verified!');
                setStep(3);
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>Email OTP Demo</h2>
            {step === 1 && (
                <form onSubmit={handleRequestOtp}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: 12 }}
                    />
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
                    <div style={{ marginBottom: 12 }}>OTP sent to <b>{email}</b></div>
                    <label>Enter OTP:</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        style={{ width: '100%', marginBottom: 12, letterSpacing: 4, fontSize: 18 }}
                    />
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: 8 }}>
                        Change Email
                    </button>
                </form>
            )}
            {step === 3 && (
                <div style={{ color: 'green', fontWeight: 'bold' }}>OTP verified for {email}!</div>
            )}
            {message && <div style={{ color: 'green', marginTop: 16 }}>{message}</div>}
            {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
        </div>
    );
};

export default OtpDemo; 