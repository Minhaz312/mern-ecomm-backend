import mongoose, { mongo } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    size:[{type:String,required:true,default:[]}],
    brand:{type:String,required:true},
    colors:[{type:String,required:true}],
    quantity:{type:Number,required:true},
    discount:{type:Number,required:true},
    tags:{type:String},
    primaryImage:{type:String,required:true},
    images:[{type:String,required:false}],
    status:{type:Boolean,required:true,default:true},
    purchased:{type:Number,default:0},
    slug:{type:String,required:true},
    category: {
        id:{type:mongoose.Types.ObjectId},
        name:{type:String,required:true},
    }
})


const ProductModel = mongoose.model("product",ProductSchema);

export default ProductModel;