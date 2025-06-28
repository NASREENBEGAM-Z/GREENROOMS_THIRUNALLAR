import React from 'react';

const ReservationSidebar = ({ bookingDetails, onchangeRoom, currentStep, onDateChange }) => {
    const { checkIn, checkOut, adults, children, room, rooms, totalPrice } = bookingDetails;
    const today = new Date().toISOString().split('T')[0];

    // The screenshot shows a static number of nights initially.
    // Let's make it dynamic if dates are available, otherwise default to 1.
    const nights = checkIn && checkOut ? Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 1;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Your Reservation</h3>

            {/* Room details */}
            {currentStep > 1 && room ? (
                <div className="mb-4">
                    <p className="font-semibold">{room.name}</p>
                    <div className="text-sm text-gray-400">
                        <span>Adult: {adults}</span>
                        <span className="ml-2">Children: {children}</span>
                    </div>
                    <button onClick={onchangeRoom} className="text-blue-400 hover:underline text-sm">Change Room</button>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="font-semibold">Room 1:</p>
                    <div className="text-sm text-gray-400">
                        <span>Adult: {adults}</span>
                        <span className="ml-2">Children: {children}</span>
                    </div>
                </div>
            )}


            {/* Price breakdown */}
            {currentStep === 3 ? (
                <div className="space-y-4 border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-bold">Price Breakdown</h4>
                    <div className="flex justify-between">
                        <span>Room: {room.name}</span>
                        <span>₹{room.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Adult: {adults}</span>
                        <span>Children: {children}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t border-gray-700 pt-4 mt-4">
                        <span>Grand Total</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 border-t border-gray-700 pt-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400">Check In</label>
                        <div className="flex items-center bg-gray-700 p-2 rounded-md">
                            <input
                                type="date"
                                name="checkIn"
                                value={checkIn}
                                onChange={onDateChange}
                                min={today}
                                className="bg-transparent w-full focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400">Night</label>
                        <select className="w-full p-2 bg-gray-700 rounded-md focus:outline-none">
                            <option>{nights}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400">Check Out</label>
                        <div className="flex items-center bg-gray-700 p-2 rounded-md">
                            <input
                                type="date"
                                name="checkOut"
                                value={checkOut}
                                onChange={onDateChange}
                                min={checkIn}
                                className="bg-transparent w-full focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400">Rooms</label>
                        <select className="w-full p-2 bg-gray-700 rounded-md focus:outline-none">
                            <option>{rooms || 1}</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400">Adults</label>
                            <select value={adults} readOnly className="w-full p-2 bg-gray-700 rounded-md focus:outline-none">
                                <option>{adults}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400">Children</label>
                            <select value={children} readOnly className="w-full p-2 bg-gray-700 rounded-md focus:outline-none">
                                <option>{children}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationSidebar; 