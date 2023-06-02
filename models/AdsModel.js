import mongoose from "mongoose";

const adsSchema = new mongoose.Schema({
    image:{type:String,required:true},
    productLink:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

const AdsModel = mongoose.model("ads",adsSchema);

export default AdsModel;