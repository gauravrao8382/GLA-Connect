import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const API = "http://localhost:3000";
  const location = useLocation();
  const myId = location.state?.myId;
  const myName = location.state?.myName;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [frdStatus, setFrdStatus] = useState("Add Friend");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/user/${id}`, {
          params: { myId }
        });
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`${API}/user/${id}/request`, {
          params: { myId }
        });
        setFrdStatus(res.data.status);
      } catch (err) {
        console.error("PROFILE FETCH ERROR 👉", err);
      }
    };
    fetchRequest();
  }, [id]);

  const addFriend = async () => {
    setFrdStatus("Request Sent");
    try {
      const res = await axios.post(`${API}/user/${id}/request`, {
        fromId: myId,
        status: "Request Sent",
        toId: user._id
      });
      setFrdStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRequest = async () => {
    setFrdStatus("Add Friend");
    try {
      const res = await axios.post(`${API}/user/${id}/requestcancel`, {
        fromId: myId,
        toId: user._id
      });
      setFrdStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async () => {
    setFrdStatus("Friend");
    try {
      const res = await axios.post(`${API}/user/${id}/requestAccept`, {
        fromId: myId,
        toId: user._id,
        fromUser: myName,
        toUser: user.name
      });
      setFrdStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRequest = async () => {
    setFrdStatus("Add Friend");
    try {
      const res = await axios.post(`${API}/user/${id}/requestDelete`, {
        fromId: myId,
        toId: user._id
      });
      setFrdStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">

        {/* Profile Image */}
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-orange-500 flex items-center justify-center text-2xl md:text-4xl font-bold">
          {user.name?.charAt(0)}
        </div>

        <div className="flex-1 w-full text-center md:text-left">

          <h2 className="text-xl md:text-2xl font-bold">
            {user.name}
          </h2>

          <p className="text-gray-400 text-sm md:text-base break-all mt-1">
            {user.email}
          </p>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-6 md:gap-10 mt-3 text-gray-300">

            <p className="text-sm md:text-base">
              <span className="font-bold text-white text-lg md:text-xl">
                {posts.length}
              </span>{" "}
              Posts
            </p>

            <p className="text-sm md:text-base">
              <span className="font-bold text-white text-lg md:text-xl">
                {user.friends.length}
              </span>{" "}
              Friends
            </p>
          </div>

          {/* Friend Button */}
          <div className="mt-3 flex justify-center md:justify-start flex-wrap gap-2">

            <button
              onClick={() =>
                frdStatus === "Add Friend"
                  ? addFriend()
                  : frdStatus === "Accept Request"
                  ? acceptRequest()
                  : cancelRequest()
              }
              className="bg-orange-500 text-black px-4 py-1 rounded-md font-semibold hover:bg-orange-400 text-sm md:text-base"
            >
              {frdStatus}
            </button>

            {frdStatus === "Accept Request" && (
              <button
                onClick={deleteRequest}
                className="bg-gray-700 text-white px-4 py-1 rounded-md font-semibold hover:bg-gray-600 text-sm md:text-base"
              >
                Delete Request
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 🧱 POSTS SECTION */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          {user.name} Confessions
        </h3>

        {posts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-900 p-4 rounded-lg"
            >
              <p className="text-gray-300 text-sm md:text-base">
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
