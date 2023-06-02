import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    mobile:{type:String,required:true},
    address:{type:String,required:false,default:null},
    password:{type:String,required:true}
})

const UserModel = mongoose.model("users",userSchema)

export default UserModel;