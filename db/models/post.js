import mongoose, { model, Schema } from "mongoose";

const postSchema = Schema({
    title: String,
    desc: String
},{ timestamps: true })

export const postModel = model("post" , postSchema);

