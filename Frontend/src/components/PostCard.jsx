import React from 'react'

const PostCard = ({post}) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        });
    };
  return (
    <div className='w-[90vw]  bg-orange-500 flex flex-col gap-2 p-2 rounded-md'>
        <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
                <img className='w-12 h-12 rounded-full' src="https://media.istockphoto.com/id/1389348844/photo/studio-shot-of-a-beautiful-young-woman-smiling-while-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=anRTfD_CkOxRdyFtvsiPopOluzKbhBNEQdh4okZImQc=" alt="" />
                <p className='text-xl'>Ananomus</p>
            </div>
            <p className="text-md text-white">
                {formatDate(post.createdAt)}
            </p>
        </div>
        <div>
            {post.post}
        </div>
        <img className='w-auto h-auto' src="https://png.pngtree.com/thumb_back/fh260/background/20230411/pngtree-nature-forest-sun-ecology-image_2256183.jpg" alt="" />

        <div className='flex justify-between'>
            
        </div>
    </div>
  )
}

export default PostCard
