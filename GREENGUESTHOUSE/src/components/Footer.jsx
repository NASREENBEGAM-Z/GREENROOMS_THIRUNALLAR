import React from 'react';
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const mapEmbedUrl = "https://maps.google.com/maps?q=Green%20guest%20house%20hotel%20and%20rooms%2C%20Thirunallar&t=&z=17&ie=UTF8&iwloc=&output=embed";
    const whatsappLink = "https://wa.me/918667853501";
    const phoneNumber = "tel:+918667853501";
    const instagramLink = "https://www.instagram.com/greenrooms.thirunallar/";

    return (
        <>
            <footer id="contact" className="bg-green-900 text-green-50 pt-16 pb-6">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Location Section */}
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Our Location</h3>
                            <div className="rounded-lg overflow-hidden h-64 shadow-xl border-4 border-green-800">
                                <iframe
                                    src={mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Green Guest House Location"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Us Section */}
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-4">Contact Us!</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <FaPhone className="w-5 h-5 mr-3 text-white" />
                                    <span className="text-green-100">+91-8667853501</span>
                                </li>
                                <li className="flex items-center">
                                    <FaEnvelope className="w-5 h-5 mr-3 text-white" />
                                    <a href="mailto:greenrooms.thirunallar@gmail.com" className="hover:text-white text-green-100">greenrooms.thirunallar@gmail.com</a>
                                </li>
                                <li className="flex items-center">
                                    <FaInstagram className="w-5 h-5 mr-3 text-white" />
                                    <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-white text-green-100">instagram.com/greenrooms.thirunallar</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="bg-green-900 border-t border-green-800 py-4">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    <div className="space-x-4 mb-4 sm:mb-0">
                        <a href="/#home" className="text-green-200 hover:text-white">Home</a>
                        <span>|</span>
                        <a href="/#about" className="text-green-200 hover:text-white">About</a>
                        <span>|</span>
                        <a href="/#rooms" className="text-green-200 hover:text-white">Rooms</a>
                        <span>|</span>
                        <a href="/booking" className="text-green-200 hover:text-white">Booking</a>
                        <span>|</span>
                        <a href="/#contact" className="text-green-200 hover:text-white">Contact</a>
                    </div>
                    <p className="text-green-300 text-sm">&copy; 2025 Green Guest House. All Rights Reserved.</p>
                </div>
            </div>

            {/* Floating Phone Button */}
            <a
                href={phoneNumber}
                className="fixed bottom-24 right-5 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center transition-transform transform hover:scale-110 z-50"
                style={{ textDecoration: 'none' }}
            >
                <FaPhone className="w-6 h-6 mr-2" />
                <span>Call Us</span>
            </a>
            {/* Floating WhatsApp Button */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center transition-transform transform hover:scale-110 z-50"
            >
                <FaWhatsapp className="w-6 h-6 mr-2" />
                <span>WhatsApp Us</span>
            </a>
        </>
    );
};

export default Footer; 