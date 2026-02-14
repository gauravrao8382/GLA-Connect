import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./middlewares/ProtectedRoutes";
import UserProfile from "./components/UserProfile"

function App() {

  return (
        <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Route>
    </Routes>

  );
}

export default App;
