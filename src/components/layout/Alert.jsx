import React, { useState, useEffect } from 'react';

export const Alert = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const backgroundColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    const textColorClasses = {
        success: 'text-white',
        error: 'text-white',
        warning: 'text-black',
        info: 'text-white',
    };

    const buttonColors = {
        success: 'bg-green-700 hover:bg-green-800',
        error: 'bg-red-700 hover:bg-red-800',
        warning: 'bg-yellow-700 hover:bg-yellow-800 text-black',
        info: 'bg-blue-700 hover:bg-blue-800',
    };


    const backgroundColor = backgroundColors[type] || 'bg-gray-700';
    const textColorClass = textColorClasses[type] || 'text-white';
    const buttonColorClass = buttonColors[type] || 'bg-gray-800 hover:bg-gray-900';

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`fixed top-1/16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 z-50 rounded-md shadow-lg ${backgroundColor} text-white`} >
            <div className="container mx-auto py-3 px-4 flex items-center justify-between">
                <span className="text-sm font-medium">{message}</span>
                <button onClick={handleClose} className={`py-2 px-4 rounded-md text-white focus:outline-none `}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default Alert;
