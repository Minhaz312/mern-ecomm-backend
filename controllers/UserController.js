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
        if(error.message.indexOf('duplicate key error') !== -1){
            res.status(400).json({success:false,token:null,message:"Mobile number is already taken"})
        }else if(error.message.indexOf('Invalid Mobile Number') !== -1){
            res.status(400).json({success:false,token:null,message:"Invalid Mobile Number"})
        } else {
            res.status(500).json({success:false,token:null,message:"failed to create account"})
        }
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
        console.log('req.body.authId: ',req.body.authId)
        const authId = mongoose.Types.ObjectId(req.body.authId)
        const user = await UserModel.findOne({_id:authId});
        if(user==null){
            res.status(401)
            res.json({success:false,message:"Unauthorized"})
        }else{
            console.log('authId: ',authId)
            console.log('user: ',user)
            const cartList = await CartModel.find({userId:authId});
            const orderList = await OrderModel.find({user:authId});
            let userData = {
                name:user.name,
                mobile:user.mobile,
                address:user.address,
                cartList:cartList,
                orderList:orderList
            }
            res.status(200).json({success:true,data:userData}); 
        }
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
        }).select({password:false}).exec()
        console.log('login data: ',req.body)
        if(result!=null){
            console.log('login reuqest user found')
            const authToken = jwt.sign({loggedin:true,authId:result._id},process.env.JWT_SECRETE,{algorithm:"HS256"})
            res.status(200).json({success:true, token:authToken, message:"Logged in successfully"})
        }else {
            console.log('login request user not found')
            res.status(400).json({success:false,token:null, message:"failed to login"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,token:null, message:"failed to login"})
    }
}
export const passwordReset = (req,res) => {

}
