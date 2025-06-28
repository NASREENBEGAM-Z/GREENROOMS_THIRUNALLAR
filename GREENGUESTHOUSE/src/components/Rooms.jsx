import React from 'react';
import { Link } from 'react-router-dom';

const Rooms = () => {
    const rooms = [
        {
            id: 1,
            name: "Deluxe Two Double Bed A/C",
            description: "Spacious room with two double beds and air conditioning",
            price: "₹2,500",
            features: ["Air Conditioning", "Two Double Beds", "Attached Bathroom", "TV", "WiFi"],
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/family?updatedAt=1750590730271"
        },
        {
            id: 2,
            name: "Deluxe Two Double Bed Non A/C",
            description: "Comfortable room with two double beds",
            price: "₹1,800",
            features: ["Two Double Beds", "Attached Bathroom", "TV", "WiFi", "Fan"],
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/doublecot2?updatedAt=1750576916914"
        },
        {
            id: 3,
            name: "Deluxe One Double Bed A/C",
            description: "Cozy room with one double bed and air conditioning",
            price: "₹2,000",
            features: ["Air Conditioning", "One Double Bed", "Attached Bathroom", "TV", "WiFi"],
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/doublecot_ac?updatedAt=1750576914374"
        },
        {
            id: 4,
            name: "Deluxe One Double Bed Non A/C",
            description: "Comfortable room with one double bed",
            price: "₹1,500",
            features: ["One Double Bed", "Attached Bathroom", "TV", "WiFi", "Fan"],
            image: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/DOUBLECOT?updatedAt=1750576330117"
        }
    ];

    return (
        <section id="rooms" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="section-title">Our Rooms</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {rooms.map((room) => (
                        <div key={room.id} className="room-card flex flex-col">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden w-full h-full bg-green-600 items-center justify-center text-white text-lg font-bold">
                                    Room Image
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{room.name}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">{room.description}</p>
                                <div className="text-2xl font-bold text-green-600 mb-4">{room.price}/night</div>
                                <ul className="space-y-2 mb-6">
                                    {room.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/booking" className="w-full btn-primary text-center mt-auto">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Rooms; 