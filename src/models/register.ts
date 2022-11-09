import mongoose, { model, Schema } from "mongoose";


const registerSchema = new Schema({
   
    firstName:{
        type:String,
        required: true
    },
    
    email:{
        type:String,
    },
    password:{
        type:String
    },
    PhoneNo :{
        type:Number,
        min:[10,'phone number must be 10 digit']
    },

    
},{versionKey:false})
registerSchema.index({location:"2dsphere"})

const signUp = model('register',registerSchema,'register')
export {registerSchema}
export default signUp