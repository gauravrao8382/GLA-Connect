import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const API = "http://localhost:3000";
  const navigate = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  useEffect(() => {
          const token = localStorage.getItem("token");
          if (token) {
          navigate("/home");
          }
      }, []);
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
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
          Welcome Back 😶‍🌫️
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mt-1 mb-6">
          GLA Confession. Anonymous. Safe. Honest.
        </p>

        {/* Inputs */}
        <input
          value={email}
          type="email"
          onChange={(e)=>{setEmail(e.target.value)}}
          placeholder="College Email"
          className="w-full p-3 mb-4 bg-black text-white text-sm sm:text-base
                     border border-gray-700 rounded-lg
                     outline-none focus:border-orange-500"
        />

        <input
          value={password}
          type="password"
          onChange={(e)=>{setPassword(e.target.value)}}
          placeholder="Password"
          className="w-full p-3 mb-5 bg-black text-white text-sm sm:text-base
                     border border-gray-700 rounded-lg
                     outline-none focus:border-orange-500"
        />

        {/* Button */}
        <button onClick={login} className="w-full py-3 bg-orange-500 text-black rounded-lg font-semibold text-sm sm:text-base hover:bg-orange-400 transition">
          Login
        </button>

        {/* Signup link */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-5">
          New here?{" "}
          <span
            onClick={() => navigate("/sign")}
            className="text-orange-500 cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
