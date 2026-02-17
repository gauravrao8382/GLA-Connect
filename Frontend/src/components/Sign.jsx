import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const API = "http://localhost:3000";
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // Send OTP
  const sendOtp = async () => {
    try {
      const res = await axios.post(`${API}/send-otp`, { email });
      setStep(2);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      await axios.post(`${API}/verify-otp`, { email, otp });
      alert("OTP verified");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Register
  const register = async () => {
    try {
      await axios.post(`${API}/register`, { email, password });
      alert("Account created successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#111] w-full max-w-sm p-6 rounded-2xl border border-orange-500">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Create Account 🚀
        </h2>

        {/* Step 1 - Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-black text-white border border-gray-700 rounded-lg focus:border-orange-500 outline-none"
            />
            <button
              onClick={sendOtp}
              className="w-full py-3 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-400"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2 - OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 bg-black text-white border border-gray-700 rounded-lg focus:border-orange-500 outline-none"
            />
            <button
              onClick={verifyOtp}
              className="w-full py-3 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-400"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3 - Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-black text-white border border-gray-700 rounded-lg focus:border-orange-500 outline-none"
            />
            <button
              onClick={register}
              className="w-full py-3 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-400"
            >
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
