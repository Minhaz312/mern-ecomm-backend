import express from "express"
import AuthMiddleware from "../middleware/AuthMiddleware.js"
import { addProductToCart, deleteCartById, getAllCartItem, updateCartItemQuantity } from "../controllers/ProductController.js"


const cartRouter = express.Router()

cartRouter.post("/get/all",getAllCartItem)
cartRouter.post("/add",AuthMiddleware,addProductToCart)
cartRouter.post("/update/quantity",AuthMiddleware,updateCartItemQuantity)
cartRouter.delete("/delete",deleteCartById)


export default cartRouter;