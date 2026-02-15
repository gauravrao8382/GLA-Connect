import React, { useState, useEffect } from "react";
import { FaEdit, FaMinus } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, setUser, posts }) => {
  const navigate = useNavigate();
  const API = "http://localhost:3000";

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [myPosts, setMyPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostText, setEditPostText] = useState("");
  const [showFriends, setShowFriends] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (posts && user?.email) {
      const filtered = posts.filter(p => p.email === user.email);
      setMyPosts(filtered);
    }
  }, [posts, user]);

  useEffect(() => {
    if (user?.friends) {
      setFilteredFriends(user.friends);
    }
  }, [search, user]);

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

  const editPost = async () => {
    const res = await axios.put(`${API}/edit/${editPostId}`, {
      post: editPostText
    });

    setMyPosts(prev =>
      prev.map(p =>
        p._id === editPostId ? { ...p, post: editPostText } : p
      )
    );

    alert(res.data.message);
    setActivePost(null);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-6">

      {/* 🔝 PROFILE HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">

        {/* Profile Image */}
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-orange-500 flex items-center justify-center text-2xl md:text-4xl font-bold">
          {user?.name?.charAt(0)}
        </div>

        <div className="flex-1 w-full text-center md:text-left">

          {!editName ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-400 text-sm md:text-base break-all">
                {user?.email}
              </p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 md:gap-10 mt-4">

                <div>
                  <p className="text-lg md:text-2xl font-bold">
                    {myPosts.length}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Posts
                  </p>
                </div>

                <div
                  onClick={() => setShowFriends(true)}
                  className="cursor-pointer hover:text-orange-400"
                >
                  <p className="text-lg md:text-2xl font-bold">
                    {user?.friends?.length || 0}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Friends
                  </p>
                </div>

              </div>

              <button
                onClick={Logout}
                className="mt-4 text-orange-400 hover:text-orange-500 text-sm md:text-base"
              >
                Logout
              </button>

              <button
                onClick={() => setEditName(true)}
                className="mt-2 flex items-center justify-center md:justify-start gap-2 text-orange-400 hover:text-orange-500 text-sm md:text-base"
              >
                <FaEdit /> Edit Profile
              </button>
            </>
          ) : (
            <div className="space-y-3 mt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 p-2 rounded outline-none text-sm md:text-base"
              />
              <button
                onClick={() => handleSave(user._id)}
                className="bg-orange-500 px-4 py-2 rounded text-black font-semibold text-sm md:text-base"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧱 POSTS */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Your Confessions
        </h3>

        {myPosts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myPosts.map((post, index) => (
            <div key={post._id} className="bg-zinc-900 p-4 rounded-lg relative">

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

              <p className="text-gray-300 text-sm mt-6">
                {post.post}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 FRIEND PANEL */}
      {showFriends && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start md:items-center">

          <div className="bg-zinc-900 w-full md:w-[500px] h-[80vh] md:h-[75vh] rounded-t-3xl md:rounded-3xl p-6 relative animate-slideDown">

            <button
              onClick={() => setShowFriends(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h3 className="text-lg md:text-xl font-semibold text-center mb-4">
              Friends
            </h3>

            <input
              type="text"
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-800 p-2 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />

            <div className="overflow-y-auto h-[60vh] pr-2">
              {filteredFriends.length === 0 ? (
                <p className="text-gray-400 text-center mt-4 text-sm">
                  No friends found.
                </p>
              ) : (
                filteredFriends.map((friend, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate(`/profile/${friend.friendId?._id || friend.friendId}`)
                    }
                    className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-zinc-700 transition"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                      {friend.friendId?.name?.charAt(0) || "F"}
                    </div>
                    <p className="text-sm md:text-base">
                      {friend.friendName || "Friend"}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
