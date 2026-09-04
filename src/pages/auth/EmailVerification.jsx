import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/client';

export const EmailVerification = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        const handleVerification = async () => {
            if (token) {
                try {
                    // Verify the token via mock
                    await api.verifyEmail(token);
                    // On success, redirect to login with success message
                    navigate('/login?verification=success');
                } catch (error) {
                    // Invalid token
                    navigate('/login?verification_error=invalid_token');
                }
            } else if (error) {
                navigate(`/login?verification_error=${error}`);
            } else {
                navigate('/login');
            }
        };

        handleVerification();
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                <p className="mt-4">Processing verification...</p>
            </div>
        </div>
    );
};