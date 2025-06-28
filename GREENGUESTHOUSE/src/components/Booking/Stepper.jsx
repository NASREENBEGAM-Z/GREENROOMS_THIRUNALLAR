import React from 'react';
import axios from 'axios';

const Stepper = ({ currentStep }) => {
    const steps = ['1. Choose Date', '2. Choose Room', '3. Make a Reservation', '4. Confirmation'];

    const bookingData = {
        "First Name": "John",
        "Last Name": "Doe",
        "Email": "john@example.com",
        "Phone Number": "1234567890",
        "Check-in Date": "2024-07-01",
        "Check-out Date": "2024-07-05",
        "Number of Adults": 2,
        "Number of Children": 1,
        "Room Type": "Deluxe Two Double Bed A/C",
        "Total Price": 5000,
        "Special Note": "Late check-in",
        "Booking Status": "Pending"
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/airtable/add-booking', bookingData);
            console.log('Booking data sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending booking data:', error);
        }
    };

    return (
        <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <React.Fragment key={step}>
                        <div className="flex items-center">
                            <div
                                className={`
                                    py-2 px-4 rounded-sm text-sm font-semibold transition-colors duration-300
                                    ${isActive ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-500'}
                                    ${isCompleted ? 'bg-gray-800 text-gray-400' : ''}
                                `}
                            >
                                {step}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-auto border-t-2 border-dashed border-gray-700 mx-2"></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper; 