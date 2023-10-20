import express from "express"
import { createAccount, getUserById, login, updateAccount } from "../controllers/UserController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js"
const userRouter = express.Router()


userRouter.post("/account/login",(req,res)=>{
    login(req,res)
})

userRouter.post("/account/create",(req,res)=>{
    createAccount(req,res);
})

userRouter.put("/account/update",AuthMiddleware,(req,res)=>{
    updateAccount(req,res)
})


userRouter.get("/get",AuthMiddleware,(req,res)=>{
    getUserById(req,res);
})

export default userRouter