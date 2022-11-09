import mongoose, { model, Schema } from "mongoose";


const likeschema = new Schema({
   
    userId:{
        type:mongoose.Types.ObjectId
    },
    
    postId:{
        type:mongoose.Types.ObjectId
    },

    
},{versionKey:false})

const likePostModel = model('like',likeschema)
export default likePostModel