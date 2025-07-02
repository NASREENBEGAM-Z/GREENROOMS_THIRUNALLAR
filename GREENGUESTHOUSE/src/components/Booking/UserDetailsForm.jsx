import React, { useState } from 'react';

const UserDetailsForm = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        note: '',
    });

    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).some(key => validationErrors[key])) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onSubmit(formData);
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
                    {/* Email Field */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 font-semibold mb-2">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    {/* Phone Field */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 font-semibold mb-2">Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                <div className="flex justify-between mt-8">
                    <button type="button" onClick={onBack} className="btn-secondary">Back</button>
                    <button type="submit" className="btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailsForm; 