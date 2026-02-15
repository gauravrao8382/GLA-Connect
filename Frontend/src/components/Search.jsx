import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchPage = ({ me }) => {
  const API = "http://localhost:3000";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);

  const filteredUsers =
    search.trim() !== ""
      ? users.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const openUser = (id) => {
    navigate(`/user/${id}`, {
      state: {
        myId: me?._id, // ✅ safe
        myName:me?.name,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* 🔍 SEARCH BAR */}
      <div className="sticky top-0 bg-black p-4 border-b border-gray-800 z-10">
        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#111] border border-gray-700 outline-none"
        />
      </div>

      {/* 👥 USERS LIST */}
      <div className="p-4 space-y-3">
        {filteredUsers.map((u) => (
          <button
            key={u._id}
            onClick={() => openUser(u._id)}
            className="flex items-center gap-3 p-2 rounded-lg bg-[#111] w-full hover:bg-[#222]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg">
              {u.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold">{u.name}</p>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && search && (
          <p className="text-center text-gray-500 mt-10">No user found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
