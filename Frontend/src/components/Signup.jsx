import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import axios from 'axios'
const Signup = () => {

  const API = "http://localhost:3000";
  const navigate = useNavigate();
  // useEffect(() => {
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //       navigate("/home");
  //       }
  //   }, []);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const signUp = async () => {
    try {
      const res = await axios.post(`${API}/signup`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      setName("");
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#111] w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl border border-orange-500">

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500">
          😶‍🌫️ GLA Confession
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mt-1 mb-6">
          Speak your heart anonymously
        </p>

        {/* Inputs */}
        <input
          value={name}
          onChange={(e)=>{setName(e.target.value)}}
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 bg-black text-white text-sm sm:text-base
                     border border-gray-700 rounded-lg
                     outline-none focus:border-orange-500"
        />

        <input
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          type="email"
          placeholder="College Email"
          className="w-full p-3 mb-4 bg-black text-white text-sm sm:text-base
                     border border-gray-700 rounded-lg
                     outline-none focus:border-orange-500"
        />

        <input
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-5 bg-black text-white text-sm sm:text-base
                     border border-gray-700 rounded-lg
                     outline-none focus:border-orange-500"
        />

        {/* Button */}
        <button onClick={signUp} className="w-full py-3 bg-orange-500 text-black rounded-lg font-semibold text-sm sm:text-base hover:bg-orange-400 transition">
          Sign Up
        </button>

        {/* Login link */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
