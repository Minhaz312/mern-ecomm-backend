import mongoose from "mongoose";
import has from "../helper/inputHas.js";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const cartToOrder = async (req,res) =>{
    try {
        const data = req.body;
        console.log("data: ",data)
        const cartList = await CartModel.find({userId:mongoose.Types.ObjectId(data.userId)}).populate("productId").exec();
        let cartItemIdList = []
        let orderList = {}
        let productList = []
        cartList.map(item=>{
            // console.log(item.productId)
            cartItemIdList.push(item._id)
            productList.push({
                productId:item.productId._id,
                productName:item.productId.name,
                productImage:item.productId.primaryImage,
                productCategory:item.productId.category.name,
                productSize:item.productSize,
                productColor:item.productColor,
                quantity:item.quantity,
                totalPrice:item.totalPrice})
        })
        if(has(data,"userId") && has(data,"shippingAddress")){
            const user = await UserModel.findOne({_id:mongoose.Types.ObjectId(data.userId)})
            orderList.userId = user._id;
            orderList.userName = user.name
            orderList.userMobile = user.mobile
            orderList.shippingAddress = data.shippingAddress
            orderList.productList = productList
            orderList.accepted = false
        }
        const result = await OrderModel.create(orderList);
        if(result){
            await CartModel.deleteMany({_id:{$in:cartItemIdList}});
            res.status(200).json({success:true,message:"order placed successfully!"})
        }else {
            res.status(400).json({success:false,message:"failed to order!"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false,message:"failed to order!"})
    }
}
export const acceptOrder = async (req,res) =>{
    try {
        const orderId = req.body.orderId
        const result = await OrderModel.updateOne({_id:mongoose.Types.ObjectId(orderId)},{$set:{accepted:true}});
        if(result.acknowledged){
            const orderList = await OrderModel.findOne({_id:mongoose.Types.ObjectId(orderId)})
            let prodIdList = []
            orderList.productList.map(prod=>{
                prodIdList.push({
                    updateOne:{
                        filter:{_id:mongoose.Types.ObjectId(prod.productId)},
                        update:{$inc:{purchased:prod.quantity}}
                    }
                })
            })
            await ProductModel.bulkWrite(prodIdList);
            res.status(200).json({success:true})
        }else {
            res.status(400).json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false})
    }
}
export const deleteOrderById = async (req,res) =>{

}
export const deliveryConfirm = async (req,res) => {
    try {
        const id = mongoose.Types.ObjectId(req.body.orderId);
        const result = await OrderModel.updateOne({_id:id,accepted:true},{delivered:true});
        if(result.acknowledged && result.modifiedCount>0){
            res.status(200).json({success:true,message:"Delivery confirmed!"})
        }else {
            res.status(400).json({success:false,message:"Failed to confirm delivery"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Failed to confirm delivery"})
    }
}
export const getAllOrder = async (req,res) =>{
    try {
        const result = await OrderModel.find({delivered:{$ne:true}});
        res.status(200).json({success:true,data:result})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,data:[]})
    }
}
export const getAllOrderByUserId = async (req,res) =>{
    try {
        const result = await OrderModel.find({user:mongoose.Types.ObjectId(req.body.userId),delivered:{$ne:true}});
        res.status(200).json({success:true,data:result})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,data:[]})
    }
}
export const getAllDeliveredOrder = async (req,res) =>{
    try {
        const result = await OrderModel.find({delivered:true,accepted:true});
        res.status(200).json({success:true,data:result})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,data:[]})
    }
}
export const getOrderById = async (req,res) =>{

}