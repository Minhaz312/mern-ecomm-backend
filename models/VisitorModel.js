import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    ipAddress: {type:String,required:true,unique:true},
    country:{type:String,default:null},
    latitude:{type:String,default:null},
    longitude:{type:String,default:null},
})

const VisitorModel = mongoose.model("visitor",visitorSchema)
export default VisitorModel;