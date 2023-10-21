import express from "express"
import { createAccount, getUserById, login, updateAccount } from "../controllers/UserController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js"
const userRouter = express.Router()


userRouter.post("/account/login",login)

userRouter.post("/account/create",createAccount)

userRouter.put("/account/update",AuthMiddleware,updateAccount)

userRouter.get("/get",AuthMiddleware,getUserById)

export default userRouter