import React, { useState } from 'react';

// Icons for room features to make the UI more intuitive
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 9c-1.55 0-2.958.68-3.93 1.67a6.97 6.97 0 00-1.5 4.33c0 .34.024.673.07 1h9.72z" /></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;


const RoomList = ({ onSelectRoom }) => {
    const rooms = [
        {
            id: 1,
            name: "FAMILY SUITE (A/C)",
            bed: 2,
            max: 6,
            view: "Street (Nala Theertham)",
            price: 2000,
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/doublecot_ac?updatedAt=1750576914374"
        },
        {
            id: 2,
            name: "FAMILY SUITE (NON A/C)",
            bed: 2,
            max: 6,
            view: "Street (Nala Theertham)",
            price: 1799,
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/doublecot2?updatedAt=1750576916914"
        },
        {
            id: 3,
            name: "SINGLE COT (A/C)",
            bed: 1,
            max: '3 adults + 2 children',
            view: "Garden View",
            price: 1299,
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/DOUBLECOT?updatedAt=1750576330117"
        },
        {
            id: 4,
            name: "SINGLE COT (NON A/C)",
            bed: 1,
            max: '3 adults + 2 children',
            view: "Garden View",
            price: 999,
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/family?updatedAt=1750590730271"
        },
    ];

    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    }

    const GST_RATE = 0.18;
    const RAZORPAY_FEE_RATE = 0.02;
    const RAZORPAY_GST_RATE = 0.18;

    return (
        <div className="space-y-8 text-white">
            {rooms.map(room => {
                return (
                    <div key={room.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="md:w-1/3">
                                {!imageErrors[room.id] ? (
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-48 md:h-full object-cover"
                                        onError={() => handleImageError(room.id)}
                                    />
                                ) : (
                                    <div className="w-full h-48 md:h-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-gray-400">Image not available</span>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="md:w-2/3 p-6 flex flex-col">
                                <div>
                                    <h3 className="text-xl font-bold">{room.name}</h3>
                                    <div className="flex items-center text-gray-400 mt-2 space-x-4 border-b border-gray-700 pb-2">
                                        <span>Bed {room.bed}</span>
                                        <span>Max {typeof room.max === 'string' ? room.max : (room.max === 6 ? '6 adults + children infinite' : room.max + ' Adult')}</span>
                                        <span>View {room.view}</span>
                                    </div>
                                </div>

                                <div className="flex-grow"></div>

                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Price</p>
                                        <p className="text-lg font-bold text-yellow-500">₹{room.price.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => onSelectRoom({ ...room, totalWithGst: room.price })}
                                        className="bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded hover:bg-white transition-colors duration-300"
                                    >
                                        Select this room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="text-center mt-8">
                <div className="text-red-600 font-semibold text-sm">For Friday to Sunday booking, contact us</div>
            </div>
        </div>
    );
};

export default RoomList; 