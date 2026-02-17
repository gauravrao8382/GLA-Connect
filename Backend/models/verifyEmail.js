const mongoose = require('mongoose');
 
const verifySchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    }
})

const verifyEmail=mongoose.model("verifyEmail",verifySchema);

module.exports=User;