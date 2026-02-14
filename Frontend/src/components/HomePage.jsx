import React, { useState, useEffect } from "react";
import axios from "axios";
import Feed from "./Feed";
import Profile from "./Profile";
import Search from "./Search"

const API = "http://localhost:3000";

const HomePage = () => {
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("feed");

  const [posts, setPosts] = useState([]);
  const [feedPosts,setFeedPosts] = useState([]);

  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState("");

  // 🔍 USER SEARCH STATES
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);

  /* ================= USER ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDashboard();
  }, []);

  /* ================= POSTS ================= */
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data.posts);
      setFeedPosts(res.data.randomPosts);
    };
    fetchPosts();
  }, []);

  /* ================= USERS (FOR SEARCH) ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);

  /* ================= ADD POST ================= */
  const addPost = async () => {
    if (!newPost.trim()) return alert("Post cannot be empty");
    try {
      const res = await axios.post(`${API}/new`, {
        post: newPost,
        email: user.email,
      });
      setPosts(res.data.posts);
      setNewPost("");
      setShowNewPost(false);
      alert("New Post added");
    } catch {
      alert("Error adding post");
    }
  };


  return (
    <div className="relative min-h-screen bg-black pb-20 text-white">

      {/* MAIN CONTENT */}
      <div className="p-4">
        {activeTab === "feed" && <Feed feedPosts={feedPosts} />}
        {activeTab === "profile" && (
          <Profile user={user} setUser={setUser} posts={posts} />
        )}
        {activeTab === "search" && <Search me={user}/>}
      </div>

      {/* ================= ADD POST MODAL ================= */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Post</h2>

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 mb-4 rounded bg-black border border-gray-700 outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => setShowNewPost(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-orange-500 rounded"
                onClick={addPost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 flex justify-around py-3">

        {/* FEED */}
        <button
          className={`flex flex-col items-center ${
            activeTab === "feed" ? "text-orange-500" : "text-white"
          }`}
          onClick={() => setActiveTab("feed")}
        >
          <span className="material-icons">dynamic_feed</span>
          Feed
        </button>

        {/* SEARCH USERS */}
        <button
          className={`flex flex-col items-center ${
            activeTab === "search" ? "text-orange-500" : "text-white"
          }`}
          onClick={() => setActiveTab("search")}
        >
          <span className="material-icons">search</span>
          Search
        </button>

        {/* ADD POST */}
        <button
          className="flex flex-col items-center"
          onClick={() => setShowNewPost(true)}
        >
          <span className="material-icons  text-3xl">
            add_circle
          </span>
          Post
        </button>

        {/* PROFILE */}
        <button
          className={`flex flex-col items-center ${
            activeTab === "profile" ? "text-orange-500" : "text-white"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <span className="material-icons">account_circle</span>
          Profile
        </button>
      </div>
    </div>
  );
};

export default HomePage;
