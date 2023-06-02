import express from "express"
import { acceptOrder, cartToOrder, deliveryConfirm, getAllDeliveredOrder, getAllOrder } from "../controllers/OrderController.js"
import AuthMiddleware from "../middleware/AuthMiddleware.js"

const orderRouter = express.Router()

orderRouter.post("/place/all-cart-product",AuthMiddleware,(req,res)=>{
    cartToOrder(req,res)
})
orderRouter.get("/get/all",(req,res)=>{// admin authMiddleware shuld be added later
    getAllOrder(req,res)
})
orderRouter.get("/get/all-delivered",(req,res)=>{// admin authMiddleware shuld be added later
    getAllDeliveredOrder(req,res)
})
orderRouter.put("/accept",(req,res)=>{// admin authMiddleware shuld be added later
    acceptOrder(req,res)
})
orderRouter.put("/delivery/confirm",(req,res)=>{// admin authMiddleware shuld be added later
    deliveryConfirm(req,res)
})
orderRouter.get("/get/:id",AuthMiddleware,(req,res)=>{
    cartToOrder(req,res)
})
orderRouter.get("/delete/:id",AuthMiddleware,(req,res)=>{
    cartToOrder(req,res)
})
orderRouter.put("/update/status",AuthMiddleware,(req,res)=>{
    cartToOrder(req,res)
})

export default orderRouter