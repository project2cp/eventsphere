import React, { useState, useEffect } from "react";
import validator from "validator";
import { FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const validatePassword = (password) => password.length >= 8;

  useEffect(() => {
    setIsFormValid(
      firstNameError === "" &&
      lastNameError === "" &&
      emailError === "" &&
      passwordError === "" &&
      confirmPasswordError === "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      password !== "" &&
      confirmPassword !== ""
    );
  }, [
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  ]);

  const handleFirstNameChange = (e) => {
    const newFirstName = e.target.value;
    setFirstName(newFirstName);
    setFirstNameError(newFirstName.trim() ? "" : "First name is required");
  };

  const handleLastNameChange = (e) => {
    const newLastName = e.target.value;
    setLastName(newLastName);
    setLastNameError(newLastName.trim() ? "" : "Last name is required");
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validator.isEmail(newEmail) ? "" : "Invalid email");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(
      validatePassword(newPassword) ? "" : "Password must be 8+ characters"
    );
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(
      newConfirmPassword === password ? "" : "Passwords do not match"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setIsLoading(true);

    if (isFormValid) {
      try {
        const payload = {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.toLowerCase().trim(),
          password: password,
          password_confirmation: confirmPassword,
        };

        await api.register(payload);
        // Success: navigate to verification prompt
        navigate("/verify-email", { 
          state: { email: email.trim() } 
        });
      } catch (error) {
        // Handle errors from mock (which may have a response property)
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          if (errors.email) setEmailError(errors.email.join(' '));
          if (errors.password) setPasswordError(errors.password.join(' '));
          if (errors.name) setSignupError(errors.name.join(' '));
        } else {
          setSignupError(error.message || 'An error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden login">
      <div className="relative z-10 w-full h-fit max-w-md bg-[rgba(93,51,139,0.2)] rounded-2xl backdrop-blur-lg border border-[rgba(255,255,255,0.1)] shadow-2xl p-6 mx-4 my-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {signupError && (
            <div className="text-red-400 text-center mb-4">{signupError}</div>
          )}

          <div className="flex space-x-3">
            <div className="w-1/2">
              <label className="block text-gray-300 text-sm mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
                placeholder="First Name"
                className={`w-full p-3 rounded-lg bg-white/10 border ${
                  firstNameError
                    ? "border-red-400"
                    : "border-[rgba(255,255,255,0.2)] focus:ring-1 focus:ring-purple-300"
                } text-white placeholder-gray-400 focus:outline-none`}
              />
              {firstNameError && (
                <p className="text-red-400 text-sm mt-1">{firstNameError}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-300 text-sm mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                placeholder="Last Name"
                className={`w-full p-3 rounded-lg bg-white/10 border ${
                  lastNameError
                    ? "border-red-400"
                    : "border-[rgba(255,255,255,0.2)] focus:ring-1 focus:ring-purple-300"
                } text-white placeholder-gray-400 focus:outline-none`}
              />
              {lastNameError && (
                <p className="text-red-400 text-sm mt-1">{lastNameError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                emailError
                  ? "border-red-400"
                  : "border-[rgba(255,255,255,0.2)] focus:ring-1 focus:ring-purple-300"
              } text-white placeholder-gray-400 focus:outline-none`}
            />
            {emailError && (
              <p className="text-red-400 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                passwordError
                  ? "border-red-400"
                  : "border-[rgba(255,255,255,0.2)] focus:ring-1 focus:ring-purple-300"
              } text-white placeholder-gray-400 focus:outline-none`}
            />
            {passwordError && (
              <p className="text-red-400 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                confirmPasswordError
                  ? "border-red-400"
                  : "border-[rgba(255,255,255,0.2)] focus:ring-1 focus:ring-purple-300"
              } text-white placeholder-gray-400 focus:outline-none`}
            />
            {confirmPasswordError && (
              <p className="text-red-400 text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isFormValid && !isLoading
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="relative my-4 flex items-center">
            <div className="flex-grow border-t border-gray-500"></div>
            <div className="mx-4 text-gray-300 text-sm">Or continue with</div>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button type="button" className="p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition-colors">
              <FaGoogle className="text-2xl text-white" />
            </button>
            <button type="button" className="p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition-colors">
              <FaFacebookF className="text-2xl text-white" />
            </button>
            <button type="button" className="p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition-colors">
              <FaApple className="text-2xl text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};