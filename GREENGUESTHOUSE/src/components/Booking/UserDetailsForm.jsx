import React, { useState } from 'react';

const UserDetailsForm = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        note: '',
        coupon: '',
    });

    const [errors, setErrors] = useState({});

    // OTP State
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [generatedEmailOtp, setGeneratedEmailOtp] = useState(null);
    const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);

    const validate = (field) => {
        const newErrors = { ...errors };
        if (field === 'email' || !field) {
            delete newErrors.email;
            if (!formData.email) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email address is invalid';
            }
        }
        if (field === 'phone' || !field) {
            delete newErrors.phone;
            if (!formData.phone) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = 'Phone number must be 10 digits';
            }
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSendOtp = (type) => {
        const validationErrors = validate(type);
        setErrors(validationErrors);

        if (validationErrors[type]) {
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (type === 'email') {
            setGeneratedEmailOtp(otp);
            setEmailOtpSent(true);
        } else {
            setGeneratedPhoneOtp(otp);
            setPhoneOtpSent(true);
        }
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} OTP: ${otp}`);
        alert(`An OTP has been sent to your ${type}. For this demo, check the console or use: ${otp}`);
    };

    const handleVerifyOtp = (type) => {
        if (type === 'email') {
            if (emailOtp === generatedEmailOtp) {
                setIsEmailVerified(true);
                alert('Email verified successfully!');
                setErrors(prev => ({ ...prev, email: null }));
            } else {
                setErrors(prev => ({ ...prev, email: 'Invalid OTP' }));
            }
        } else {
            if (phoneOtp === generatedPhoneOtp) {
                setIsPhoneVerified(true);
                alert('Phone number verified successfully!');
                setErrors(prev => ({ ...prev, phone: null }));
            } else {
                setErrors(prev => ({ ...prev, phone: 'Invalid OTP' }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).some(key => validationErrors[key])) {
            setErrors(validationErrors);
            return;
        }

        if (!isEmailVerified || !isPhoneVerified) {
            alert('Please verify both email and phone number before submitting.');
            return;
        }

        setErrors({});
        onSubmit(formData);
    };

    const renderOtpButton = (type) => {
        const isVerified = type === 'email' ? isEmailVerified : isPhoneVerified;
        const otpSent = type === 'email' ? emailOtpSent : phoneOtpSent;

        if (isVerified) {
            return <span className="ml-3 text-green-500 font-bold self-center">Verified</span>;
        }
        return (
            <button
                type="button"
                onClick={() => handleSendOtp(type)}
                disabled={otpSent}
                className="ml-3 px-3 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
            >
                {otpSent ? 'Sent' : 'Send OTP'}
            </button>
        );
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6">Make a Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 font-semibold mb-2">Name *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-400 font-semibold mb-2">Last Name *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500" required />
                    </div>

                    {/* Email Field with OTP */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 font-semibold mb-2">Email *</label>
                        <div className="flex items-start">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isEmailVerified || emailOtpSent}
                                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 disabled:bg-gray-600"
                                required
                            />
                            {renderOtpButton('email')}
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        {emailOtpSent && !isEmailVerified && (
                            <div className="flex items-center mt-2">
                                <input type="text" placeholder="Enter OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500" />
                                <button type="button" onClick={() => handleVerifyOtp('email')} className="ml-3 px-3 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400">Verify</button>
                            </div>
                        )}
                    </div>

                    {/* Phone Field with OTP */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 font-semibold mb-2">Phone *</label>
                        <div className="flex items-start">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isPhoneVerified || phoneOtpSent}
                                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 disabled:bg-gray-600"
                                required
                            />
                            {renderOtpButton('phone')}
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        {phoneOtpSent && !isPhoneVerified && (
                            <div className="flex items-center mt-2">
                                <input type="text" placeholder="Enter OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500" />
                                <button type="button" onClick={() => handleVerifyOtp('phone')} className="ml-3 px-3 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400">Verify</button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-400 font-semibold mb-2">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-400 font-semibold mb-2">Additional Note</label>
                        <textarea name="note" value={formData.note} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"></textarea>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 font-semibold mb-2">Coupon Code</label>
                    <div className="flex">
                        <input type="text" name="coupon" value={formData.coupon} onChange={handleChange} className="w-full md:w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:border-yellow-500" />
                        <button type="button" className="bg-yellow-500 text-gray-900 font-bold p-3 rounded-r-lg hover:bg-yellow-400 transition-colors duration-300">Apply</button>
                    </div>
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!isEmailVerified || !isPhoneVerified}
                        className="w-full bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded hover:bg-white transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Book now by email and we will contact you back.
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailsForm; 