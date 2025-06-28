import React from 'react';

const RoomSelectionComplete = ({ onNext }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Room Selection is Complete</h2>
            <p className="text-gray-400 mb-6">You can edit your booking by using the panel on the left.</p>
            <div className="border-t border-gray-700 w-1/2 mx-auto"></div>
            <div className="mt-6">
                <button
                    onClick={onNext}
                    className="bg-gray-300 text-gray-900 font-bold py-2 px-6 rounded hover:bg-white transition-colors duration-300"
                >
                    Go to next step
                </button>
            </div>
        </div>
    );
};

export default RoomSelectionComplete; 