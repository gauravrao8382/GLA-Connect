import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { FaMinus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, setUser, posts }) => {
  const navigate = useNavigate();
  const API = "http://localhost:3000";

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [myPosts, setMyPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [openEditPost, setOpenEditPost] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostText, setEditPostText] = useState("");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  /* 🔥 FILTER USER POSTS */
  useEffect(() => {
    if (posts && user?.email) {
      const filtered = posts.filter(p => p.email === user.email);
      setMyPosts(filtered);
    }
  }, [posts, user]);

  const handleSave = async (id) => {
    const res = await axios.put(`${API}/editname/${id}`, { name });
    setUser(res.data.user);
    alert(res.data.message);
    setEditName(false);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const deletePost = async (id) => {
    const res = await axios.delete(`${API}/delete/${id}`);
    alert(res.data.message);
    setMyPosts(prev => prev.filter(p => p._id !== id));
    setActivePost(null);
  };

  const editPost = async (id) => {
    const res = await axios.put(`${API}/edit/${id}`, {
      post: editPostText
    });

    setMyPosts(prev =>
      prev.map(p =>
        p._id === editPostId ? { ...p, post: editPostText } : p
      )
    );

    alert(res.data.message);
    setOpenEditPost(false);
    setActivePost(null);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-6">

      {/* 🔝 PROFILE HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">

        <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-bold">
          {user?.name?.charAt(0)}
        </div>

        <div className="flex-1 w-full">
          {!editName ? (
            <>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>

              {/* 🔢 COUNTS */}
              <div className="flex gap-10 mt-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{myPosts.length}</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {user?.friends?.length || 0}
                  </p>
                  <p className="text-gray-400 text-sm">Friends</p>
                </div>
              </div>

              <button
                onClick={Logout}
                className="mt-4 text-orange-400 hover:text-orange-500"
              >
                Logout
              </button>

              <button
                onClick={() => setEditName(true)}
                className="mt-2 flex items-center gap-2 text-orange-400 hover:text-orange-500"
              >
                <FaEdit /> Edit Profile
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 p-2 rounded outline-none"
                placeholder="Edit Name"
              />

              <button
                onClick={() => handleSave(user._id)}
                className="bg-orange-500 px-4 py-2 rounded text-black font-semibold"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧱 POSTS SECTION */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-xl font-semibold mb-4">Your Confessions</h3>

        {myPosts.length === 0 && (
          <p className="text-gray-500">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myPosts.map((post, index) => (
            <div key={index} className="bg-zinc-900 p-4 rounded-lg relative">

              {activePost !== index ? (
                <button
                  onClick={() => setActivePost(index)}
                  className="absolute top-2 right-2"
                >
                  <FiMoreVertical />
                </button>
              ) : (
                <div className="absolute top-2 right-2 bg-gray-800 p-2 rounded">
                  <button onClick={() => setActivePost(null)}>
                    <FaMinus size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setOpenEditPost(true);
                      setEditPostId(post._id);
                      setEditPostText(post.post);
                    }}
                    className="block text-sm hover:bg-gray-600 rounded px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="block text-sm text-red-400 hover:bg-gray-600 rounded px-2"
                  >
                    Delete
                  </button>
                </div>
              )}

              <p className="text-gray-300 text-sm mt-6">{post.post}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
