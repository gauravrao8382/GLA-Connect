import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // 📅 Responsive Date Format
  const formatDate = (date) => {
    const d = new Date(date);

    return window.innerWidth < 640
      ? d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }) +
          " • " +
          d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
      : d.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  const handleLike = () => setLiked(!liked);
  const handleSave = () => setSaved(!saved);

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <div className="w-full sm:w-[80%] lg:w-[60%] mx-auto bg-[#1a1a1a] 
                    flex flex-col gap-3 p-3 sm:p-4 rounded-lg shadow-md">

      {/* ✅ HEADER FIXED */}
      <div className="flex items-start justify-between gap-2">

        {/* LEFT SIDE */}
        <div className="flex gap-3 items-center min-w-0">
          <img
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            src="https://media.istockphoto.com/id/1389348844/photo/studio-shot-of-a-beautiful-young-woman-smiling-while-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=anRTfD_CkOxRdyFtvsiPopOluzKbhBNEQdh4okZImQc="
            alt=""
          />
          <p className="text-sm sm:text-lg font-semibold truncate">
            Anonymous
          </p>
        </div>

        {/* RIGHT SIDE DATE */}
        <p className="text-[11px] sm:text-sm text-gray-400 whitespace-nowrap">
          {formatDate(post.createdAt)}
        </p>
      </div>

      {/* POST TEXT */}
      <div className="text-sm sm:text-base">
        {post.post}
      </div>

      {/* IMAGE */}
      <img
        className="w-full max-h-[400px] object-cover rounded-md"
        src="https://png.pngtree.com/thumb_back/fh260/background/20230411/pngtree-nature-forest-sun-ecology-image_2256183.jpg"
        alt=""
      />

      {/* ACTION BAR */}
      <div className="flex justify-between items-center mt-2 px-1">

        <div className="flex gap-6">

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm ${
              liked ? "text-red-500" : "text-gray-300"
            }`}
          >
            <span className="material-icons text-[22px]">
              {liked ? "favorite" : "favorite_border"}
            </span>
            Like
          </button>

          <button
            onClick={() => setShowComment(!showComment)}
            className="flex items-center gap-1 text-sm text-gray-300"
          >
            <span className="material-icons text-[22px]">
              chat_bubble_outline
            </span>
            Comment
          </button>
        </div>
      </div>

      {/* COMMENT SECTION */}
      {showComment && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 rounded bg-black border border-gray-700 text-sm outline-none"
            />
            <button
              onClick={handleComment}
              className="px-3 py-1 bg-orange-500 rounded text-sm"
            >
              Post
            </button>
          </div>

          {comments.map((c, i) => (
            <p key={i} className="text-xs sm:text-sm bg-black p-2 rounded">
              {c}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
