import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js"
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";


export const createAccount = async (req,res) => {
    try {
        const {name,mobile,password} = req.body;
        const result = await UserModel.create({
            name:name,
            mobile:mobile,
            password:password
        })
        if(result){
            const authToken = jwt.sign({loggedin:true,me:result._id},process.env.JWT_SECRETE,{algorithm:"HS256"})
            res.status(200).json({success:true,token:authToken, message:"account created successfully"})
        }else {
            res.status(400).json({success:false,token:null,message:"failed to create account"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,token:null,message:"failed to create account"})
    }
}
export const updateAccount = async (req,res) => {
    try {
        const data = req.body;
        const id = data.id;
        let updatedData = {}
        if(data.name!==undefined && data.name.trim()!="" && data.name!=null){
            updatedData.name = data.name
        }
        if(data.mobile!==undefined && data.mobile.trim()!="" && data.mobile!=null){
            updatedData.mobile = data.mobile
        }
        if(data.password!==undefined && data.password.trim()!="" && data.password!=null){
            updatedData.password = data.password
        }
        if(Object.entries(updatedData).length>0){
            const result = await UserModel.updateOne({_id:mongoose.Types.ObjectId(id)},updatedData)
            if(result){
                res.status(200).json({success:true, message:"account updated successfully"})
            }else {
                res.status(400).json({success:false,message:"failed to update account"})
            }
        }else {
            res.status(400).json({success:false,message:"failed to update account"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to update account"})
    }
}
export const deleteAccount = (req,res) => {

}

export const getUserById = async (req,res) => {
    try {
        const user = await UserModel.findById(mongoose.Types.ObjectId(req.body.userId)).select({name:1,mobile:1,password:-1}).exec();
        const cartList = await CartModel.find({userId:mongoose.Types.ObjectId(req.body.userId)}).populate("productId").exec();
        const orderList = await OrderModel.find({userId:mongoose.Types.ObjectId(req.body.userId)});
        let userData = {
            name:user.name,
            mobile:user.mobile,
            address:user.address,
            cartList:cartList,
            orderList:orderList
        }
        res.status(200).json({success:true,data:userData}); 
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,data:{}})
    }
}

export const login = async (req,res) => {
    try {
        const {mobile,password} = req.body;
        const result = await UserModel.findOne({
            mobile:mobile,
            password:password
        })
        console.log("user found: ",result)
        if(result!=null){
            const authToken = jwt.sign({loggedin:true,me:result._id},process.env.JWT_SECRETE,{algorithm:"HS256"})
            res.status(200).json({success:true, token:authToken, message:"account created successfully"})
        }else {
            res.status(400).json({success:false,token:null, message:"failed to create account"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,token:null, message:"failed to create account"})
    }
}
export const passwordReset = (req,res) => {

}
