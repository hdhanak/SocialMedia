import mongoose, { model, Schema } from "mongoose";


const schema = new Schema({
   
    userId:{
        type:mongoose.Types.ObjectId
    },
    
    postId:{
        type:mongoose.Types.ObjectId
    },
    inviteeId:{
        type:mongoose.Types.ObjectId
    },
status:{
    type:String,
    default:"pending"
}
    
},{versionKey:false,timestamps:true})

const invitationModel = model('invitation',schema)
export default invitationModel