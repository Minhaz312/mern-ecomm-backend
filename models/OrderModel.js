import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId:{type:String, required:true},
    userName:{type:String,required:true},
    userMobile:{type:String,required:true},
    productList:[{
        productId:{type:mongoose.Types.ObjectId,required:true},
        productName:{type:String,required:true},
        productImage:{type:String,required:true},
        productCategory:{type:String,required:true},
        productSize:{type:String,required:false,default:null},
        productColor:{type:String,required:false,default:null},
        quantity:{type:Number,required:true},
        totalPrice:{type:Number,required:true},
    }],
    shippingAddress:{type:String, required:true},
    accepted:{type:Boolean,default:false},
    delivered:{type:Boolean,default:false},
    orderDate:{type:Date, default:Date.now}
})

const OrderModel = mongoose.model("orders",orderSchema)

export default OrderModel;
// let data = {
//     user:"asdfkals",
//     productList:[
//         {productId:"akjglkkad",productSize:"xl",productColor:"white",quantity:2,totalPrice:1235},
//         {productId:"akjglkkad",productSize:"xl",productColor:"white",quantity:2,totalPrice:1235},
//         {productId:"akjglkkad",productSize:"xl",productColor:"white",quantity:2,totalPrice:1235},
//     ],
//     shippingAddress:"user shipping address",
//     accepted:true,
//     orderDate:"date string"
// }