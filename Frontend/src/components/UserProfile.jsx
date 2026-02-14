import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const API = "http://localhost:3000";
  const location = useLocation();
  const myId = location.state?.myId;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [frdStatus, setFrdStatus] = useState("Add friend");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/user/${id}`,{
          params:{
            myId
          }
        });
        setUser(res.data.user);
        setPosts(res.data.posts ); 
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`${API}/user/${id}/request`,{
          params:{
            myId
          }
        });
        setFrdStatus(res.data.status); 
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
    };

    fetchRequest();
  }, [id]);

  const addFriend = async() =>{
    setFrdStatus("Request Sent");
    try {
        const res = await axios.post(`${API}/user/${id}/request`,{
          fromId:myId,
          status:"Request Sent",
          toId:user._id
        });
        setFrdStatus(res.data.status)
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
  }

  const cancelRequest = async() =>{
    setFrdStatus("Add Friend");
    try {
        const res = await axios.post(`${API}/user/${id}/requestcancel`,{
          fromId:myId,
          toId:user._id
        });
        setFrdStatus(res.data.status)
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
  }

  const acceptRequest = async() =>{
    setFrdStatus("Friend");
    try {
        const res = await axios.post(`${API}/user/${id}/requestAccept`,{
          fromId:myId,
          toId:user._id
        });
        setFrdStatus(res.data.status)
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
  }
  const deleteRequest = async() =>{
    setFrdStatus("Add Friend");
    try {
        const res = await axios.post(`${API}/user/${id}/requestDelete`,{
          fromId:myId,
          toId:user._id
        });
        setFrdStatus(res.data.status)
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-6">

      {/* 🔝 PROFILE HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-bold">
          {user.name?.charAt(0)}
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400 mt-1">{user.email}</p>

          {/* ✅ ADD FRIEND BUTTON */}
          <button
            onClick={()=> frdStatus==="Add Friend"?addFriend():frdStatus==="Accept Request"?acceptRequest():cancelRequest()} 
            className="mt-3 bg-orange-500 text-black px-4 py-1 rounded-md font-semibold hover:bg-orange-400"
          >
            {frdStatus}
          </button>

          {frdStatus==="Accept Request"?<button
          onClick={deleteRequest}
          className="mt-3 ml-2 bg-orange-500 text-black px-4 py-1 rounded-md font-semibold hover:bg-orange-400"
          >
            Delete Request
          </button>:""}
        </div>
      </div>

      {/* 🧱 POSTS SECTION */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-xl font-semibold mb-4">
          {user.name} Confessions
        </h3>

        {posts.length === 0 && (
          <p className="text-gray-500">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-900 p-4 rounded-lg"
            >
              <p className="text-gray-300 text-sm">
                {post.post}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
