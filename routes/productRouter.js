import { Router } from "express";
import { addNewProduct, addProductToCart, deleteCartById, deleteMultipleProduct, deleteProduct, getAllCartItem, getAllProduct, getPaginatedProduct, getProductByCategory, getProductById, getProductByStock, getSuggestedProduct, getTopProductByPurchasedAmount, searchProduct, updateCartItemQuantity, updateProductWithoutImage } from "../controllers/ProductController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const productRouter = Router()

// get prodcut
productRouter.get("/get/all",(req,res)=>{
    getAllProduct(req,res)
})
productRouter.get("/get/:skip/:take/:keyword",(req,res)=>{
    console.log("get paginated product")
    getPaginatedProduct(req,res)
})
productRouter.get("/get/category/:category",(req,res)=>{
    getProductByCategory(req,res)
})
productRouter.get("/get/search/:keyword",(req,res)=>{
    searchProduct(req,res)
})
productRouter.post("/get/suggested",(req,res)=>{
    getSuggestedProduct(req,res)
})
productRouter.get("/get/top",(req,res)=>{
    getTopProductByPurchasedAmount(req,res)
})
productRouter.get("/get/:id",(req,res)=>{
    getProductById(req,res)
})
productRouter.get("/get/stock/:stock",(req,res)=>{
    getProductByStock(req,res)
})


// add product

productRouter.post("/add",(req,res)=>{
    addNewProduct(req,res)
})

// update product 

productRouter.post("/update/without-image",(req,res)=>{
    updateProductWithoutImage(req,res)
})

// delete product
productRouter.post("/delete",(req,res)=>{
    deleteMultipleProduct(req,res)
})

productRouter.delete("/delete/:id",(req,res)=>{
    deleteProduct(req,res)
})




export default productRouter