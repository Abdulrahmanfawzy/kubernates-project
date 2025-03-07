import express from "express";
import { Server } from "socket.io";
import { connectDb } from "./db/connection.js";
import { postModel } from "./db/models/post.js";
import cors from "cors";
const app = express();

app.get('/' , (req,res)=>res.send("Hello bro!"));
connectDb()
app.use(cors());
const appServer = app.listen(3000,()=>{
    console.log('server listened');
})

const io = new Server(appServer , {
    cors: '*'
})

io.on("connection" , async (socket)=>{
    console.log(socket.id);

    const allPosts = await postModel.find();
    socket.emit("allPosts" , allPosts);

    socket.on("addPost" , async (post)=>{
        const addPost = await postModel(post);
        const postSaved = await addPost.save();
        const allPosts = await postModel.find();
        socket.emit("postSaved" , allPosts);
    })

    socket.on("deletePost", async (id) => {
        try {
          const item = await postModel.findByIdAndDelete(id);
          const allPosts = await postModel.find();
          socket.emit("allPostsAfterDelete" , allPosts);
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      });

    socket.on("searchTitle" , async(data)=>{
        const searchedPost = await postModel.find({
            title: { $regex: `^${data}`, $options: "i" }
          });
        if (searchedPost.length > 0) {
            socket.emit("searchResult" , searchedPost)
        } else {
            socket.emit("searchResult" , "No posts found")
        }
        
    })

    socket.on("editPost" , async (data)=>{
        const editPost = await postModel.findByIdAndUpdate(data.id , {
            title: data.title,
            desc: data.desc
        })
        const allPosts = await postModel.find();
        socket.emit("allPosts" , allPosts )
    })
})







// import express from 'express';
// import { Server } from 'socket.io';
// const app = express();

// app.get('/' , (req,res)=>res.send("Hello world"))

// let appServer = app.listen(3000 , ()=>{
//     console.log("server listened");
// })

// let io = new Server(appServer , {
//     cors: '*'
// }); 

// io.on("connection" , (socket)=>{
//     console.log(socket.id);
//     socket.on("chat" , (msg)=>{
//         console.log(msg);
//     })
// })



