import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to the booking page with query params
        const queryParams = new URLSearchParams(bookingData).toString();
        navigate(`/booking?${queryParams}`);
    };

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <section id="booking" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="section-title">Book Your Stay</h2>
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="card">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            {/* Check-in Date */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Check In</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={bookingData.checkIn}
                                        onChange={handleChange}
                                        min={today}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Check-out Date */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Check Out</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={bookingData.checkOut}
                                        onChange={handleChange}
                                        min={bookingData.checkIn}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Adults</label>
                                    <select
                                        name="adults"
                                        value={bookingData.adults}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Children</label>
                                    <select
                                        name="children"
                                        value={bookingData.children}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {[0, 1, 2, 3, 4].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="lg:col-span-1">
                                <button type="submit" className="w-full btn-primary text-lg py-3">
                                    Check Availability
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm; 