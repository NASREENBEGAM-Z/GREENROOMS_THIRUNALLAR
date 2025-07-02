import React from 'react';

const Confirmation = ({ bookingDetails, onBack, summary }) => {
    const { room, user, checkIn, checkOut, adults, children } = bookingDetails;
    const { basePrice, totalWithGst } = summary || {};

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Booking Successful!</h2>
            <div className="space-y-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Phone:</strong> {user?.phone}</p>
                </div>
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                    <p><strong>Room:</strong> {room?.name}</p>
                    <p><strong>Check-in:</strong> {checkIn}</p>
                    <p><strong>Check-out:</strong> {checkOut}</p>
                    <p><strong>Guests:</strong> {adults} Adults, {children} Children</p>
                    <p><strong>Price:</strong> ₹{basePrice?.toLocaleString()}</p>
                </div>
            </div>
            <div className="text-green-700 font-semibold text-lg mb-4">
                Thank you for your booking! You will receive a confirmation soon via WhatsApp or SMS.
            </div>
            <button type="button" onClick={onBack} className="btn-secondary mt-4">Back</button>
        </div>
    );
};

export default Confirmation; 