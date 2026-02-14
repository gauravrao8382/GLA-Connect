import React, { useState } from "react";

const ConfessionCard = ({ text, tag, time }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 50));

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  // Tag colors with gradient
  const tagStyles = {
    Crush: "bg-gradient-to-r from-pink-500 to-pink-400",
    Rant: "bg-gradient-to-r from-red-600 to-red-500",
    Exam: "bg-gradient-to-r from-blue-600 to-blue-400",
    Funny: "bg-gradient-to-r from-yellow-400 to-yellow-300"
  };

  return (
    <div className="bg-[#1a1a1a] border border-orange-500 rounded-2xl p-5 mb-5 shadow-lg hover:scale-[1.02] transition-transform w-full max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-orange-500 font-bold text-sm sm:text-base">GLA Confession</span>
        <span className={`text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold ${tagStyles[tag]}`}>
          {tag}
        </span>
      </div>

      {/* Confession Text */}
      <p className="text-gray-200 text-sm sm:text-base mb-4 break-words">{text}</p>

      {/* Footer: Like + Time */}
      <div className="flex justify-between items-center text-gray-400 text-sm sm:text-base">
        <button
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${liked ? "text-orange-500 bg-[#2a2a2a]" : "hover:text-orange-500 hover:bg-[#2a2a2a]"} transition`}
          onClick={handleLike}
        >
          ❤️ {likesCount}
        </button>
        <span className="text-gray-500">{time}</span>
      </div>
    </div>
  );
};

export default ConfessionCard;
