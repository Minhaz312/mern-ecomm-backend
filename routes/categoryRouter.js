import { Router } from "express";
import { addNewCategory, addNewSubCategory, deleteCategory, deleteSubCategory, getAllCategory, updateCategory, updateSubCategory } from "../controllers/CategoryController.js";

const categoryRouter = Router();


categoryRouter.get("/get/all",(req,res)=>{
    getAllCategory(req,res)
})

categoryRouter.post("/add",(req,res)=>{
    addNewCategory(req,res)
})
categoryRouter.post("/sub/add",(req,res)=>{
    addNewSubCategory(req,res)
})

categoryRouter.delete("/delete/:id",(req,res)=>{
    deleteCategory(req,res)
})
categoryRouter.delete("/sub/delete/:id",(req,res)=>{
    deleteSubCategory(req,res)
})

categoryRouter.post("/update",(req,res)=>{
    updateCategory(req,res)
})
categoryRouter.post("/sub/update",(req,res)=>{
    updateSubCategory(req,res)
})


export default categoryRouter