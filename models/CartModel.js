import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    productId:{type:mongoose.Types.ObjectId,required:true,ref:"product"},
    productSize:{type:String,required:false,default:null},
    productColor:{type:String,required:false,default:null},
    quantity:{type:Number,required:true},
    totalPrice:{type:Number,required:true},
    createdAt:{type:Date, default:Date.now}
})

const CartModel = mongoose.model("carts",cartSchema)

export default CartModel;