const mongoose = require('mongoose');
 
const postSchema=new mongoose.Schema({
     post: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type:String,
        required:true
    },
    },
    {timestamps: true, }
)

const Post=mongoose.model("Post",postSchema);

module.exports=Post;