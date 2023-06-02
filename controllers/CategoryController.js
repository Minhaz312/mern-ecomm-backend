import mongoose, { Schema, mongo } from "mongoose"
import CategoryModel from "./../models/CategoryModel.js"
import SubCategoryModel from "./../models/SubCategoryModel.js"
import ProductModel from "../models/ProductModel.js"
export const addNewCategory = async (req,res) => {
    console.log(req.body)
    try {
        const {name} = req.body
        const result = await CategoryModel.create({
            name:name
        })
        if(result) {
            res.status(200).json({success:true,message:"added category"})
        }else {
            res.status(401).json({success:false,message:"failed to add category"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to add category"})
    }
}
export const addNewSubCategory = async (req,res) => {
    console.log(req.body)
    try {
        const {parentId,name} = req.body
        const result = await SubCategoryModel.create({
            name:name,
            parent: mongoose.Types.ObjectId(parentId)
        })
        if(result) {
            res.status(200).json({success:true,message:"added category"})
        }else {
            res.status(401).json({success:false,message:"failed to add category"})
        }
    } catch (error) {
        console.log(error)            
        res.status(500).json({success:false,message:"failed to add category"})
    }
}

export const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params;
        try {
            const formatedId = mongoose.Types.ObjectId(id)
            const totalSubcategory = await SubCategoryModel.countDocuments({parent:formatedId});
            const totalProduct = await ProductModel.countDocuments({"category.id":formatedId});
            // CODE TO DELETE CORRESPONDING SUBCATEGORIES AND PRODUCTS, NOW WON'T USE THIS FEATURE. IF NEEDED, LATER WILL ENABLE THIS FREATURE. NOW WILL RESTRIC THE DELETION IF SUBCATEGORIES AND PRODUCTS AVAILABLE UNDER THE CATEGORY
            // const subcategory_available = await SubCategoryModel.find({parent:formatedId}).select("_id -name -__v").exec();
            // let subCategoryList = []
            // subcategory_available.map(item=>subCategoryList.push(mongoose.Types.ObjectId(item._id)))
            // if(subcategory_available.length>0){
            //     const subCategoryUnderProduct = await ProductModel.find({category:{$in:subCategoryList}}).select("_id primaryImage images").exec();
            //     let imageListToDelete = []
            //     subCategoryUnderProduct.map(p=>{
            //         p.images.map(image=>imageListToDelete.push({image:image}))
            //         imageListToDelete.push({image:p.primaryImage})
            //     })
            //     // const result = await SubCategoryModel.deleteMany({parent:formatedId});
            //     // if(result){
            //     //     // const deletedMainCat = await CategoryModel.deleteOne({_id:formatedId})
            //     //     if(deletedMainCat){
            //     //         if(correspondingProduct.length>0) {
            //     //             // await ProductModel.deleteMany(correspondingProduct);
            //     //         }
            //     //         res.status(200).json({success:true,message:"deleted category"})
            //     //     }else {
            //     //         res.status(401).json({success:false,message:"failed to delete category"})
            //     //     }
            //     // }else {
            //     //     res.status(401).json({success:false,message:"failed to delete category"})
            //     // }
            // }else {
            //     const categoryUnderProduct = await ProductModel.find({category:formatedId}).select("_id primaryImage images").exec();
            //     let imageListToDelete = []
            //     categoryUnderProduct.map(p=>{
            //         p.images.map(image=>imageListToDelete.push({image:image}))
            //         imageListToDelete.push({image:p.primaryImage})
            //     })
            //     // const deletedMainCat = await CategoryModel.deleteOne({_id:formatedId})
            //     // if(deletedMainCat){
            //     //     // if(correspondingProduct.length>0) {
            //     //     //     await ProductModel.deleteMany(correspondingProduct);
            //     //     // }
            //     //     res.status(200).json({success:true,message:"deleted category"})
            //     // }else {
            //     //     // res.status(401).json({success:false,message:"failed to delete category"})
            //     // }
            // }
            if(totalSubcategory>0) {
                res.status(400).json({success:false,message:`the category has ${totalSubcategory} sub category, first delete all subcategroy`})
            }else if (totalProduct>0) {
                res.status(400).json({success:false,message:`the category has ${totalProduct} product, first delete product`})
            }else {
                const result = await CategoryModel.deleteOne({_id:formatedId})
                if(result.acknowledged==true) {
                    res.status(200).json({success:true,message:"categroy deleted"})
                }else {
                    res.status(400).json({success:false,message:`the category has ${totalProduct} product, first delete product`})
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success:false,message:"failed to delete"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to delete"})        
    }
}
export const deleteSubCategory = async (req,res) => {
    try {
        const {id} = req.params;
        try {
            const formatedId = mongoose.Types.ObjectId(id)
            const totalProduct = await ProductModel.countDocuments({"category.id":formatedId});
            if(totalProduct>0) {
                res.status(400).json({success:false,message:`the category has ${totalProduct} product, first delete product`})
            }else {
                const result = await SubCategoryModel.deleteOne({_id:formatedId});
                if(result){
                    res.status(200).json({success:true,message:"deleted category"})
                }else {
                    res.status(401).json({success:false,message:"failed to delete category"})
                }
            }
        } catch (error) {
            res.status(401).json({success:false,message:"failed to delete category"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to delete category"})
    }
}

export const updateCategory = async (req,res) => {
    try {
        const {id,name} = req.body;
        console.log("id name: ",id,name)
        const result = await CategoryModel.updateOne({_id:mongoose.Types.ObjectId(id)},{name:name});
        if(result) {
            let pUpdate = await ProductModel.updateMany({"category.id":mongoose.Types.ObjectId(id)},{$set:{"category.name":name}});
            res.status(200).json({success:true,message:"Updated successfully"})
        }else {
            res.status(401).json({success:false,message:"failed to update"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to update"})
    }
}

export const updateSubCategory = async (req,res) => {
    try {
        const {id,name} = req.body;
        const result = await SubCategoryModel.updateOne({_id:mongoose.Types.ObjectId(id)},{name:name});
        if(result) {
            let pUpdate = await ProductModel.updateMany({"category.id":mongoose.Types.ObjectId(id)},{$set:{"category.name":name}});
            res.status(200).json({success:true,message:"Updated successfully"})
        }else {
            res.status(401).json({success:false,message:"failed to update"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to update"})
    }
}

export const getAllCategory = async (req,res) => {
    try {
        const categories = await CategoryModel.find().sort({_id:-1}).exec()
        const subcategories = await SubCategoryModel.find();
        let categoryList = []
        categories.map(m_cat=>{
            let child_cat = []
            subcategories.map(s_cat=>{
                if(s_cat.parent.toString()==m_cat._id.toString()){
                    child_cat.push({_id:s_cat._id,name:s_cat.name})
                }
            })
            categoryList.push({_id:m_cat._id,name:m_cat.name,subcategories:child_cat});
        })
        res.status(200).json({success:true,categories:categoryList})
    } catch (error) {
        res.status(500).json({success:false,categories:null})
    }
}