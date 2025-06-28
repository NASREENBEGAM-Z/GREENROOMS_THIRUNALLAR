import React from 'react';

const Confirmation = ({ bookingDetails, onBack, onConfirm }) => {
    const { room, user, checkIn, checkOut, adults, children } = bookingDetails;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const roomPrice = parseFloat(room.price.replace(/[^0-9.-]+/g, ""));
    const totalCost = roomPrice * nights;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                    <p><strong>Room:</strong> {room.name}</p>
                    <p><strong>Check-in:</strong> {checkIn}</p>
                    <p><strong>Check-out:</strong> {checkOut}</p>
                    <p><strong>Guests:</strong> {adults} Adults, {children} Children</p>
                </div>
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-xl font-bold text-gray-800">Total: ₹{totalCost.toLocaleString()}</h3>
                </div>
            </div>
            <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={onBack} className="btn-secondary">Back</button>
                <button type="button" onClick={onConfirm} className="btn-primary">Confirm & Pay</button>
            </div>
        </div>
    );
};

export default Confirmation; 