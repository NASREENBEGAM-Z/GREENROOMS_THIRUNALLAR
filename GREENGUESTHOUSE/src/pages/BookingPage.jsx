import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Stepper from '../components/Booking/Stepper';
import ReservationSidebar from '../components/Booking/ReservationSidebar';
import RoomList from '../components/Booking/RoomList';
import UserDetailsForm from '../components/Booking/UserDetailsForm';
import Confirmation from '../components/Booking/Confirmation';
import RoomSelectionComplete from '../components/Booking/RoomSelectionComplete';

const BookingPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [bookingDetails, setBookingDetails] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parseDate = (dateString) => {
            if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return null;
            }
            const parts = dateString.split('-').map(p => parseInt(p, 10));
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date;
        };

        let checkIn = today.toISOString().split('T')[0];
        const queryCheckIn = queryParams.get('checkIn');
        const providedCheckInDate = parseDate(queryCheckIn);

        if (providedCheckInDate && providedCheckInDate >= today) {
            checkIn = queryCheckIn;
        }

        const checkInDate = parseDate(checkIn);

        let checkOut;
        const queryCheckOut = queryParams.get('checkOut');
        const providedCheckOutDate = parseDate(queryCheckOut);

        if (providedCheckOutDate && providedCheckOutDate > checkInDate) {
            checkOut = queryCheckOut;
        }

        if (!checkOut) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(checkInDate.getDate() + 1);
            checkOut = nextDay.toISOString().split('T')[0];
        }

        return {
            checkIn: checkIn,
            checkOut: checkOut,
            adults: queryParams.get('adults') || 1,
            children: queryParams.get('children') || 0,
            rooms: queryParams.get('rooms') || 1,
            room: null,
            totalPrice: 0,
        };
    });

    const [currentStep, setCurrentStep] = useState(1);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => {
            const newDetails = { ...prev, [name]: value };

            const checkInDate = new Date(newDetails.checkIn);
            const checkOutDate = new Date(newDetails.checkOut);

            if (checkOutDate <= checkInDate) {
                const nextDay = new Date(checkInDate);
                nextDay.setDate(checkInDate.getDate() + 1);
                newDetails.checkOut = nextDay.toISOString().split('T')[0];
            }
            return newDetails;
        });
    };

    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handlePrevStep = () => setCurrentStep(prev => prev - 1);
    const handleResetToRoomSelection = () => setCurrentStep(1);

    const handleRoomSelect = (room) => {
        const nights = (new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn)) / (1000 * 60 * 60 * 24);
        const price = room.price * nights;
        setBookingDetails(prev => ({ ...prev, room, totalPrice: price }));
        handleNextStep(); // Move to step 2: selection complete message
    };

    const handleUserDetailsSubmit = async (formData) => {
        // Combine user details with booking details (dates, room, price)
        const finalBookingData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            note: formData.note,
            checkIn: bookingDetails.checkIn,
            checkOut: bookingDetails.checkOut,
            adults: Number(bookingDetails.adults),
            children: Number(bookingDetails.children),
            totalPrice: Number(bookingDetails.totalPrice),
            room: bookingDetails.room || {},
            roomId: bookingDetails.room?.id || null
        };

        try {
            const response = await axios.post('https://greenrooms-thirunallar.onrender.com/api/bookings', finalBookingData);
            console.log('Booking successful! Response from server:', response.data);
            setBookingDetails(prev => ({ ...prev, user: formData }));
            handleNextStep();
        } catch (error) {
            const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
            console.error('Booking failed:', errorMessage);
            alert(`Booking failed with error: ${errorMessage}. Please check the console for details and contact support if the issue persists.`);
        }
    };

    const getBookingSummary = (bookingDetails) => {
        const basePrice = bookingDetails.room?.price || 0;
        return {
            basePrice,
            totalWithGst: basePrice, // Same as base price without GST
        };
    };

    const handleAdultsChange = (e) => {
        setBookingDetails(prev => ({ ...prev, adults: parseInt(e.target.value) }));
    };

    const handleChildrenChange = (e) => {
        setBookingDetails(prev => ({ ...prev, children: parseInt(e.target.value) }));
    };

    // The stepper now has 4 steps
    const steps = ['Choose Date', 'Choose Room', 'Make a Reservation', 'Confirmation'];

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold text-center mb-8">Booking</h1>
                <Stepper steps={steps} currentStep={currentStep} />
                <div className="mt-8 grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <ReservationSidebar
                            bookingDetails={bookingDetails}
                            onChangeRoom={handleResetToRoomSelection}
                            currentStep={currentStep}
                            onDateChange={handleDateChange}
                            onAdultsChange={handleAdultsChange}
                            onChildrenChange={handleChildrenChange}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {currentStep === 1 && <RoomList onSelectRoom={handleRoomSelect} />}
                        {currentStep === 2 && <RoomSelectionComplete onNext={handleNextStep} />}
                        {currentStep === 3 && <UserDetailsForm onSubmit={handleUserDetailsSubmit} onBack={handlePrevStep} />}
                        {currentStep === 4 && (
                            <Confirmation
                                bookingDetails={bookingDetails}
                                onBack={handlePrevStep}
                                summary={getBookingSummary(bookingDetails)}
                            />
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingPage; 