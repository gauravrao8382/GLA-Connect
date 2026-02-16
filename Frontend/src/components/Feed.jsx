import React from "react";
import { FiSend } from "react-icons/fi";
import PostCard from "./PostCard.jsx";

const stories = [
  { id: 1, name: "You" },
  { id: 2, name: "Rahul" },
  { id: 3, name: "Aman" },
  { id: 4, name: "Neha" },
  { id: 5, name: "Priya" },
];

const Feed = ({ feedPosts ,user}) => {
  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-x-hidden">

      {/* 🔝 Top Bar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-800 shrink-0">
        {/* Stories */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar flex-1">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center min-w-[56px] sm:min-w-[60px]"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-[2px]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white text-sm sm:text-lg">
                  {story.name[0]}
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-300 mt-1 truncate w-12 sm:w-14 text-center">
                {story.name}
              </p>
            </div>
          ))}
        </div>

        {/* Message */}
        <button className="ml-3 sm:ml-4 text-xl sm:text-2xl shrink-0">
          <FiSend />
        </button>
      </div>

      {/* 📰 Feed Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-1 sm:px-2 py-2 sm:py-3">
        <div className="flex flex-col gap-5 sm:gap-6 items-center max-w-full">
          {feedPosts.length === 0 && (
            <p className="text-gray-400 text-sm">No posts yet.</p>
          )}

          {feedPosts.map((post) => (
            <PostCard postId={post._id} post={post} user={user}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
