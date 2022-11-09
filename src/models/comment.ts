import mongoose, { model, Schema } from "mongoose";


const commentschema = new Schema({
   
    userId:{
        type:mongoose.Types.ObjectId
    },
    
    postId:{
        type:mongoose.Types.ObjectId
    },

    
},{versionKey:false})

const commentOnPost = model('comment',commentschema)
export default commentOnPost