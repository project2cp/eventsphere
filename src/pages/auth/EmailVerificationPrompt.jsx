import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/client";

export const EmailVerificationPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const message = location.state?.message || "We've sent a verification link to your email.";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  const handleResendVerification = async () => {
    if (!email) {
      setResendError("No email provided. Please sign up again.");
      return;
    }
    setIsResending(true);
    setResendSuccess("");
    setResendError("");

    try {
      const response = await api.resendVerification(email);
      setResendSuccess(response.message || "Verification email resent successfully!");
    } catch (error) {
      setResendError(error.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden login">
      <div className="relative z-10 w-full h-fit max-w-md bg-[rgba(93,51,139,0.2)] rounded-2xl backdrop-blur-lg border border-[rgba(255,255,255,0.1)] shadow-2xl p-6 mx-4 my-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-300">
            {message}
            <br />
            <span className="text-purple-300">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          {resendSuccess && (
            <div className="text-green-400 text-center mb-4">{resendSuccess}</div>
          )}
          {resendError && (
            <div className="text-red-400 text-center mb-4">{resendError}</div>
          )}

          <div className="text-center text-gray-400 text-sm">
            <p>Didn't receive the email?</p>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className={`mt-2 text-purple-300 hover:text-purple-200 transition-colors ${
                isResending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="w-full py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Return to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};