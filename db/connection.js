import mongoose from "mongoose";

export const connectDb = ()=>{
    mongoose.connect('mongodb://localhost:27017/socket-lab')
    .then(()=>{
        console.log("db connected");
    })
    .catch(err=>{
        console.log("db connection error " + err);
    })
}