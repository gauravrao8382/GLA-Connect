import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
dotenv.config();

const app=express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

import User from "./models/user.js";
import Post from "./models/post.js";
import Friend from "./models/UserFriend.js";

main();
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/GLAConnect')
    console.log("Mongo DB connected");
    app.listen(3000,()=>{
        console.log("Server is running")
    })
}


app.post('/signup', async (req, res) => {
    try {
        console.log("BODY 👉", req.body);

        const { email, password, name } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!email.endsWith("@gla.ac.in")) {
            return res.status(400).json({
                message: "Only GLA college email allowed (@gla.ac.in)"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id,},         
            process.env.JWT_KEY,       
            { expiresIn: "2d" }       
        );
        return res.status(201).json({
                    message: "SignUp successful",
                    token
        });

    } catch (err) {
        console.error("SIGNUP ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log("BODY 👉", req.body);

        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!email.endsWith("@gla.ac.in")) {
            return res.status(400).json({
                message: "Only GLA college email allowed (@gla.ac.in)"
            });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: "User doesn't exists"
            });
        }
        if (existingUser) {
            if(existingUser.password!==password){
                return res.status(400).json({
                    message: "Incorrect Password"
                });
            }
            else{
                const token = jwt.sign(
                    { id: existingUser._id,},          
                    process.env.JWT_KEY,       
                    { expiresIn: "1d" }        
                );
                return res.status(201).json({
                    message: "Login successful",
                    token
                });
            }
            
        }


    } catch (err) {
        console.error("LOGIN ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; 
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/home", protect, async(req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  res.status(200).json({
        user,
        message: "Login successful"
      });
});

app.get("/posts",async(req,res)=>{
    const posts= await Post.find();
    
    const randomPosts = await Post.aggregate([
      { $sample: { size: posts.length } }
    ]);

    console.log(posts);
    return res.status(201).json({
                    randomPosts:randomPosts,
                    posts:posts
                });
})

app.post("/new",async(req,res)=>{
    
    try{
        console.log(req.body);
        const {post,email}=req.body;
        const newPost=new Post({
            post,
            email
        })
        await newPost.save();
        const posts=await Post.find();
        return res.status(201).json({
                    message: "Post added successfully",
                    posts:posts
                });
    }
    catch (err) {
        console.error("ADD POST ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }

})

app.put("/editname/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const {name}=req.body;
        const updatedUser=await User.findByIdAndUpdate(id,{name},{ new: true });
        return res.status(201).json({
            message:'Name edited successfully',
            user:updatedUser
        })
    }
    catch(error){
        console.error("NAME EDIT ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
})

app.delete("/delete/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        await Post.findByIdAndDelete(id);
        return res.status(201).json({
            message: "Post deleted successfully",
        })
    }
    catch(err){
        console.error("DELETE ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }

})

app.put("/edit/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const {post}=req.body;
        await Post.findByIdAndUpdate(id,{post},{ new: true });
        return res.status(201).json({
            message: "Post edited successfully",
        })
    }
    catch(err){
        console.error("EDIT ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
})

app.get('/users',async(req,res)=>{
    try{
        const users=await User.find();
        return res.status(201).json({
            message: "Post edited successfully",
            users:users
        })
    }
    catch(err){
        console.error("SERACH ERROR 👉", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
})

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ email: user.email });
    return res.status(200).json({
      user,
      posts,
    });
  } catch (err) {
    console.error("SEARCH ERROR 👉", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

app.get('/user/:id/request',async(req,res)=>{
    try {
        const {id} = req.params;
        const {myId} = req.query;
        const Requestfind = await Friend.findOne({fromId:id,toId:myId});
        if (Requestfind) {
            console.log(Requestfind.status);
            if(Requestfind.status==="Request"){
                return res.status(200).json({
                    status: "Accept Request",
                });
            }
            else{
                return res.status(200).json({
                    status: "Friend",
                });
            }
        }
        const request = await  Friend.findOne({fromId:myId,toId:id});
        if (!request) {
            return res.status(200).json({
                status: "Add Friend",
            });
        }
        return res.status(200).json({
            status: request.status
        });
        
    } catch (error) {
        console.error("SEARCH ERROR 👉", error);
        return res.status(500).json({
        message: "Server error",
        error: error.message
        }); 
    }
})
app.post("/user/:id/request",async(req,res)=>{
    try {
        const {fromId,status,toId} = req.body;
        const newRequest = new Friend({
            fromId,
            status,
            toId
        })
        console.log(fromId,toId);
        await newRequest.save();
        return res.status(201).json({
            status,
        });
    } catch (error) {
       console.error("SEARCH ERROR 👉", error);
        return res.status(500).json({
        message: "Server error",
        error: error.message
        }); 
    }
})

app.post("/user/:id/requestcancel",async(req,res)=>{
    try {
        const {fromId,toId} = req.body;
        const request = await Friend.findOneAndDelete({fromId,toId});
        console.log(request);
        return res.status(201).json({
            status:"Add Friend",
        });
    } catch (error) {
       console.error("SEARCH ERROR 👉", error);
        return res.status(500).json({
        message: "Server error",
        error: error.message
        }); 
    }
})

app.post("/user/:id/requestAccept",async(req,res)=>{
    try {
        const {fromId,toId} = req.body;
        await User.findByIdAndUpdate(fromId,{$push:{friends:{friendId:toId}}},{new:true});
        await User.findByIdAndUpdate(toId,{$push:{friends:{friendId:fromId}}},{new:true});
        await Friend.findOneAndUpdate({fromId:toId,toId:fromId},{status:"Friend"});
        return res.status(201).json({
            status:"Friend",
        });
    } catch (error) {
       console.error("SEARCH ERROR 👉", error);
        return res.status(500).json({
        message: "Server error",
        error: error.message
        }); 
    }
})

app.post("/user/:id/requestDelete",async(req,res)=>{
    try {
        const {fromId,toId} = req.body;
        await Friend.findOneAndDelete({fromId:toId,toId:fromId});
        return res.status(201).json({
            status:"Add Friend",
        });
    } catch (error) {
       console.error("SEARCH ERROR 👉", error);
        return res.status(500).json({
        message: "Server error",
        error: error.message
        }); 
    }
})