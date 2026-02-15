import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const API = "http://localhost:3000";
  const location = useLocation();
  const navigate = useNavigate();

  const myId = location.state?.myId;
  const myName = location.state?.myName;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [frdStatus, setFrdStatus] = useState("Add Friend");
  const [showFriends, setShowFriends] = useState(false);
  const [search, setSearch] = useState(""); // ✅ FIXED
  const [filteredFriends, setFilteredFriends] = useState([]);

  // 🔹 Fetch Profile Data
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

  // 🔹 Fetch Friend Request Status
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`${API}/user/${id}/request`, {
          params: { myId }
        });
        setFrdStatus(res.data.status);
      } catch (err) {
        console.error("REQUEST STATUS ERROR 👉", err);
      }
    };
    fetchRequest();
  }, [id]);

  // 🔹 Filter Friends Logic
  useEffect(() => {
      if (!user?.friends) return;
  
      const filtered = user.friends.filter(friend => {
        const name = friend.friendName || "";
        return name.toLowerCase().includes(search.toLowerCase());
      });
  
      setFilteredFriends(filtered);
    }, [search, user]);

  // 🔹 Friend Functions
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

      {/* PROFILE HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">

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

          <div className="flex justify-center md:justify-start gap-10 mt-3 text-gray-300">

            <p>
              <span className="text-lg md:text-2xl font-bold">
                {posts.length}
              </span>{" "}
              Posts
            </p>

            <p
              onClick={() => setShowFriends(true)}
              className="cursor-pointer hover:text-orange-400"
            >
              <span className="text-lg md:text-2xl font-bold">
                {user.friends?.length || 0}
              </span>{" "}
              Friends
            </p>

          </div>

          <div className="mt-3 flex justify-center md:justify-start flex-wrap gap-2">

            <button
              onClick={() =>
                frdStatus === "Add Friend"
                  ? addFriend()
                  : frdStatus === "Accept Request"
                  ? acceptRequest()
                  : cancelRequest()
              }
              className="bg-orange-500 text-black px-4 py-1 rounded-md font-semibold hover:bg-orange-400"
            >
              {frdStatus}
            </button>

            {frdStatus === "Accept Request" && (
              <button
                onClick={deleteRequest}
                className="bg-gray-700 text-white px-4 py-1 rounded-md font-semibold hover:bg-gray-600"
              >
                Delete Request
              </button>
            )}

          </div>
        </div>
      </div>

      {/* POSTS SECTION */}
      <div className="max-w-5xl mx-auto mt-10">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          {user.name} Confessions
        </h3>

        {posts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-zinc-900 p-4 rounded-lg">
              <p className="text-gray-300">{post.post}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FRIENDS MODAL */}
      {showFriends && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">

          <div className="bg-zinc-900 w-full md:w-[500px] h-[80vh] rounded-3xl p-6 relative">

            <button
              onClick={() => setShowFriends(false)}
              className="absolute top-4 right-6 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold text-center mb-4">
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
                filteredFriends.map((friend, index) => {
                  const friendData = friend.friendId || friend;

                  return (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(`/profile/${friendData._id}`, {
                          state: { myId, myName }
                        })
                      }
                      className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-zinc-700 transition"
                    >
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                        {friend.friendId?.name?.charAt(0) || "F"}
                      </div>
                      <p>{friend.friendName || "Friend"}</p>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
