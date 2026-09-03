import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import api from "../api/client";

export const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_number: "",
    location: "",
    bio: "",
    profile_photo: null,
    notificationEnabled: true,
    payementMethode: [],
    is_organizer: false,
  });
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verification = queryParams.get("verification");
    const errorType = queryParams.get("verification_error");

    if (verification || errorType) {
      window.history.replaceState({}, document.title, "/profile");
    }

    if (verification === "success") {
      setVerificationStatus("success");
      if (!localStorage.getItem("token")) {
        const timer = setTimeout(() => navigate("/login"), 5000);
        return () => clearTimeout(timer);
      }
    } else if (errorType) {
      setVerificationError(
        errorType === "invalid_token"
          ? "Invalid verification link"
          : errorType === "already_verified"
          ? "Email already verified"
          : "Verification error occurred"
      );
      if (!localStorage.getItem("token")) {
        const timer = setTimeout(() => navigate("/login"), 5000);
        return () => clearTimeout(timer);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.getProfile(token);
        const profilePhotoPath = data.profile_photo
          ? data.profile_photo.startsWith("storage/")
            ? data.profile_photo
            : `storage/${data.profile_photo}`
          : null;

        setUserData({
          ...data,
          phone_number: data.phone_number || "",
          location: data.location || "",
          bio: data.bio || "",
          profile_photo: profilePhotoPath ? `${API_BASE_URL}/${profilePhotoPath}` : null,
          notificationEnabled: data.notificationEnabled ?? true,
          payementMethode: data.payementMethode || [],
          is_organizer: data.is_organizer || false,
        });

        if (profilePhotoPath) {
          console.log("Profile Image URL:", `${API_BASE_URL}/${profilePhotoPath}`);
        }
      } catch (error) {
        if (error.message === "Unauthorized") {
          setAuthError("Session expired. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setAuthError(error.message || "An error occurred while fetching profile.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, location.search]);

  useEffect(() => {
    if (verificationStatus || verificationError) {
      const timer = setTimeout(() => {
        setVerificationStatus(null);
        setVerificationError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, verificationError]);

  const handleImageUpload = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Please log in to upload a photo.");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setUserData((prev) => ({ ...prev, profile_photo: tempUrl }));

    const formData = new FormData();
    formData.append("profile_photo", file);
    formData.append("_method", "PUT");

    try {
      const data = await api.uploadPhoto(token, formData);
      const profilePhotoPath = data.user.profile_photo
        ? data.user.profile_photo.startsWith("storage/")
          ? data.user.profile_photo
          : `storage/${data.user.profile_photo}`
        : null;

      setUserData((prev) => ({
        ...prev,
        profile_photo: profilePhotoPath ? `${API_BASE_URL}/${profilePhotoPath}` : null,
      }));

      if (profilePhotoPath) {
        console.log("Updated Profile Image URL:", `${API_BASE_URL}/${profilePhotoPath}`);
      }
    } catch (error) {
      setAuthError(error.message || "An error occurred while uploading the photo.");
      setUserData((prev) => ({ ...prev, profile_photo: null }));
      URL.revokeObjectURL(tempUrl);
    }
  };

  const handleSavePersonalInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Please log in to update your profile.");
      return;
    }

    try {
      const data = await api.updateProfile(token, {
        name: userData.name,
        phone_number: userData.phone_number,
        location: userData.location,
      });
      setUserData((prev) => ({
        ...prev,
        name: data.user.name,
        phone_number: data.user.phone_number,
        location: data.user.location,
      }));
      setIsEditingPersonalInfo(false);
    } catch (error) {
      setAuthError(error.message || "An error occurred while updating profile.");
    }
  };

  const handleSaveBio = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Please log in to update your bio.");
      return;
    }

    try {
      const data = await api.updateProfile(token, { bio: userData.bio });
      setUserData((prev) => ({
        ...prev,
        bio: data.user.bio,
      }));
      setIsEditingBio(false);
    } catch (error) {
      setAuthError(error.message || "An error occurred while updating bio.");
    }
  };

  const completionSteps = [
    { label: "Setup account", completed: true, percentage: 10 },
    { label: "Upload your photo", completed: !!userData.profile_photo, percentage: 5 },
    {
      label: "Personal info",
      completed:
        userData.name.trim() !== "" &&
        userData.email.trim() !== "" &&
        userData.phone_number.trim() !== "" &&
        userData.location.trim() !== "",
      percentage: 35,
    },
    { label: "Biography", completed: userData.bio.trim() !== "", percentage: 20 },
    { label: "Notifications", completed: userData.notificationEnabled, percentage: 10 },
    { label: "Payment details", completed: userData.payementMethode.length > 0, percentage: 20 },
  ];

  const totalPercentage = completionSteps.reduce(
    (sum, step) => sum + (step.completed ? step.percentage : 0),
    0
  );

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (circumference * totalPercentage) / 100;

  const renderVerificationAlerts = () => {
    if (verificationStatus === "success") {
      return (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Email verified successfully! Please log in to continue.
        </div>
      );
    }

    if (verificationError) {
      let errorMessage = "";
      switch (verificationError) {
        case "invalid_token":
          errorMessage = "Invalid verification link";
          break;
        case "already_verified":
          errorMessage = "Email already verified";
          break;
        default:
          errorMessage = "Verification error occurred";
      }
      return (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      );
    }
    return null;
  };

  const SidebarItems = [
    { text: "Contact info", link: "/contact-info", className: "" },
    { text: "Change email", link: "/change-email", className: "" },
    { text: "Password", link: "/password", className: "" },
    { text: "Credit/Debit cards", link: "/credit-cards", className: "" },
    { text: "Location", link: "/location", className: "" },
    { text: "Email preferences", link: "/email-preferences", className: "" },
    { text: "Linked accounts", link: "/linked-accounts", className: "" },
    { text: "Personal data", link: "/personal-data", className: "" },
    { text: "Close accounts", link: "/close-account", className: "" },
    { text: "History", link: "/event-history", className: "" },
    { text: "Favorite", link: "/favorite-events", className: "" },
    { text: "Booked events", link: "/booked-events", className: "" },
    { text: "Settings", link: "/settings", className: "" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-300"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (authError && !verificationStatus && !verificationError) {
    return <Navigate to="/login" />;
  }

  if (verificationStatus === "success" && !localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="bg-[#2c2c3e] p-6 rounded-lg text-center text-white">
          <p className="text-green-500 text-lg mb-4">
            Email verified successfully! Please log in to continue.
          </p>
          <p className="text-gray-300 mb-4">
            You will be redirected to the login page shortly.
          </p>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  if (verificationError && !localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="bg-[#2c2c3e] p-6 rounded-lg text-center text-white">
          <p className="text-red-500 text-lg mb-4">{verificationError}</p>
          <p className="text-gray-300 mb-4">
            You will be redirected to the login page shortly.
          </p>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="bg-[#2c2c3e] p-6 rounded-lg text-center text-white">
          <p className="text-red-500 text-lg mb-4">{authError}</p>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] text-white font-sans">
      {renderVerificationAlerts()}
      <Navbar />
      <div className="flex pt-19">
        <Sidebar SidebarItems={SidebarItems} />
        <main className="flex-grow p-6 space-y-6 w-8/5">
          <section className="p-6 rounded-lg border border-[#2c2c3e] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Personal Info</h2>
              <button
                className="border-white border-1 px-2 py-1 rounded inline-flex items-center gap-2"
                onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
              >
                <FaEdit /> Edit
              </button>
            </div>
            {isEditingPersonalInfo ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-[#2c2c3e] p-2 rounded w-full"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={userData.email}
                  className="bg-[#2c2c3e] p-2 rounded w-full"
                  readOnly
                />
                <input
                  type="tel"
                  value={userData.phone_number}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  className="bg-[#2c2c3e] p-2 rounded w-full"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="bg-[#2c2c3e] p-2 rounded w-full"
                  placeholder="Location"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                    onClick={() => setIsEditingPersonalInfo(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
                    onClick={handleSavePersonalInfo}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Full Name:</strong> {userData.name || "Not provided"}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {userData.phone_number
                    ? `${userData.phone_number.slice(0, 4)} ${userData.phone_number.slice(4, 6)} ***`
                    : "Not provided"}
                </p>
                {userData.location && (
                  <p>
                    <strong>Location:</strong> {userData.location}
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="p-6 rounded-lg border border-[#2c2c3e] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Bio</h2>
              <button
                className="border-white border-1 px-2 py-1 rounded inline-flex items-center gap-2"
                onClick={() => setIsEditingBio(!isEditingBio)}
              >
                <FaEdit /> Edit
              </button>
            </div>
            {isEditingBio ? (
              <div className="space-y-4">
                <textarea
                  value={userData.bio}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="bg-[#2c2c3e] p-2 rounded w-full h-32"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
                    onClick={handleSaveBio}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 whitespace-pre-line">
                {userData.bio || "No biography added yet"}
              </p>
            )}
          </section>

          <section className="p-6 rounded-lg border border-[#2c2c3e] space-y-4 text-center">
            <h2 className="text-xl font-semibold">Profile Picture</h2>
            <div className="w-[200px] h-[200px] mx-auto bg-gray-700 rounded-full overflow-hidden">
              {userData.profile_photo ? (
                <img
                  src={userData.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", userData.profile_photo);
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full bg-purple-500 flex items-center justify-center text-2xl ${
                  userData.profile_photo ? "hidden" : "flex"
                }`}
              >
                {userData.name[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <label className="bg-blue-500 px-4 py-2 mt-4 rounded hover:bg-blue-600 cursor-pointer inline-block">
              Upload new photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-400 mt-2">
              At least 800 x 800 px recommended. JPG or PNG is allowed.
            </p>
          </section>
        </main>

        <aside className="w-150 p-6 mb-6.5 pl-10 mr-6 mt-5.5 rounded-lg border border-[#2c2c3e] space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <svg width={120} height={120}>
              <circle cx={60} cy={60} r={50} stroke="#333" strokeWidth={10} fill="none" />
              <circle
                cx={60}
                cy={60}
                r={50}
                stroke="#6b5b95"
                strokeWidth={10}
                fill="none"
                strokeDasharray={314}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 60 60)"
              />
              <text x={60} y={65} textAnchor="middle" fill="#fff" fontSize={20}>
                {totalPercentage}%
              </text>
            </svg>
            <h3 className="text-lg font-semibold">Complete your profile</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {completionSteps.map((step, index) => (
                <li key={index} className="flex items-center gap-2">
                  {step.completed ? (
                    <FaCheck className="text-green-400" />
                  ) : (
                    <FaTimes className="text-red-400" />
                  )}
                  <span>
                    {step.label} ({step.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
            {!userData.is_organizer && (
              <a href="/organizer" className="block mt-[50px] w-full">
                <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 cursor-pointer w-full">
                  Be an organizer
                </button>
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};