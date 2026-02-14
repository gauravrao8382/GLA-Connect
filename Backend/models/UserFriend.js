const mongoose = require('mongoose');
 
const FriendSchema=new mongoose.Schema({
    fromId: {
        type: String,
        required: true
    },
    status:{
        type:String,
        required:true
    },
    toId:{
        type:String,
        required:true
    }
})

const Friend=mongoose.model("Friend",FriendSchema);

module.exports=Friend;