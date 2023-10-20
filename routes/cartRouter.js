import express from "express"
import AuthMiddleware from "../middleware/AuthMiddleware.js"
import { addProductToCart, deleteCartById, getAllCartItem, updateCartItemQuantity } from "../controllers/ProductController.js"


const cartRouter = express.Router()

cartRouter.post("/add",AuthMiddleware,addProductToCart)
cartRouter.post("/update/quantity",AuthMiddleware,updateCartItemQuantity)
cartRouter.post("/delete",addProductToCart)
cartRouter.post("/get/all",getAllCartItem)
cartRouter.delete("/delete/:id",deleteCartById)


export default cartRouter;