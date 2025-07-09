import React, { useState } from "react";
import toast from "react-hot-toast";
import { checkEventUser, verifyOtpToCheckIn } from "../api";

const EventCheckInModal = ({ eventId, onClose, onSuccess }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  console.log("modal id", eventId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowOtp(null);
    try {
      const response = await checkEventUser(eventId, mobile);
      setShowOtp(response.data);
      // If check-in is successful, close modal and notify parent
      //   if (response.data && (response.data.success || response.data.message)) {
      //     setTimeout(() => {
      //       if (onSuccess) onSuccess();
      //     }, 1000); // Show success for a moment before closing
      //   }
    } catch (err) {
      setError(
        err.response?.data?.message || "Check-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    setResult(null);
    try {
      const resp = await verifyOtpToCheckIn(eventId, otp, mobile);
      setResult(resp.data);
      if (resp.data && (resp.data.success || resp.data.message)) {
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      }
      console.log("Response", resp);
    } catch (error) {
      toast.error("Failed To Verify Otp!");
      console.log("Not Valid Otp", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Event Check-In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border p-2 rounded"
            required
            pattern="[0-9]{10}"
            maxLength={10}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Checking..." : "Send Otp"}
            </button>
          </div>
        </form>
        {showOtp && (
          <div className="flex flex-col gap-2 mt-4">
            <input
              className="border border-gray-700 p-2 rounded"
              type="number"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={verifyOtp}
              type="button"
            >
              Verify
            </button>
          </div>
        )}
        {result && (
          <div className="mt-4 items-center justify-center text-green-600 font-semibold">
            {result.message || "Check-in successful!"}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 font-semibold">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EventCheckInModal;
