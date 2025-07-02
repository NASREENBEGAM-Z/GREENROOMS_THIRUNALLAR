import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Confirmation = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchBooking() {
            setLoading(true);
            try {
                const res = await axios.get(`https://greenrooms-thirunallar.onrender.com/api/bookings/${bookingId}`);
                setBooking(res.data.booking);
            } catch (err) {
                setError('Failed to fetch booking details');
            }
            setLoading(false);
        }
        fetchBooking();
    }, [bookingId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!booking) return <div>No booking found.</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Booking Confirmation</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
                    <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                </div>
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                    <p><strong>Room:</strong> {booking.room?.name}</p>
                    <p><strong>Check-in:</strong> {booking.checkIn}</p>
                    <p><strong>Check-out:</strong> {booking.checkOut}</p>
                    <p><strong>Guests:</strong> {booking.adults} Adults, {booking.children} Children</p>
                    <p><strong>Price:</strong> ₹{booking.totalPrice?.toLocaleString()}</p>
                </div>
                {booking.adminReply && (
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-green-700">Message from Admin</h3>
                        <p>{booking.adminReply}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Confirmation; 