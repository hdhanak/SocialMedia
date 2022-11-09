import mongoose, { model, Schema } from "mongoose";


const postSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId
    },
   
    description:{
        type:String,
    },
    image:Array,
    visibilty:{
        type:Boolean,
        default:false
    } // true-private
},{versionKey:false})

const postModel = model('posts',postSchema)
export default postModel