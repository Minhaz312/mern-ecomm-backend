import fs from "fs"
import mongoose from "mongoose"
import AdsModel from "../models/AdsModel.js"
import { v4 as uuidv4 } from 'uuid';
import multer from "multer"
import path from "path";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
		cb(null,"public/images")
	},
	filename:(req,file,cb)=>{
		const extension = file.originalname.split(".")[file.originalname.split(".").length-1]
		const filename = uuidv4().split("-").join("").concat(".",extension);
		cb(null,filename)
	}
})

const imageUploader = multer({
	storage:storage,
	fileFilter:(req,file,cb)=>{
		const mimeType = file.mimetype;
		const extension = file.originalname.split(".")[file.originalname.split(".").length-1]
		if(mimeType=="image/jpg" || mimeType==="image/jpeg" || mimeType==="image/png") {
			cb(null,true)
		}else {
			cb(new Error(`${extension} is not acceptable`),false)
		}
	}
}).single("image")

export const getAllAds = async (req,res) => {
    try {
        const result = await AdsModel.find().sort({_id:-1}).exec()
        res.status(200).json({success:true,data:result})
    } catch (error) {
        res.status(500).json({success:false,data:[]})
    }
}

export const addNewAd = async (req,res) => {
    imageUploader(req,res,async err=>{
        if(err){
            res.status(400).json({success:false,message:err.message})
        }else {
            const image = req.file.filename
            try {
                const productLink = req.body.productLink;
                console.log("productLink: ",productLink)
                const result = await AdsModel.create({
                    productLink:productLink,
                    image:image,
                    $currentDate:{createdAt:true}
                })
                console.log("created result: ",result)
                if(result){
                    res.status(200).json({success:true,message:"ad added successfully"})
                }else {
                    console.log("in try block")
                    fs.unlinkSync(path.join("public/images",image));
                    res.status(400).json({success:false,message:"failed to add"})
                }
            } catch (error) {
                console.log("in cattch block: ",error)
                fs.unlinkSync(path.join("public/images",image));
                res.status(500).json({success:false,message:"failed to add"})
            }
        }
    })
}

export const getAdsById = async (req,res) => {
    try {
        const {id} = req.params;
        const result = await AdsModel.findOne({_id:mongoose.Types.ObjectId(id)}).sort({_id:-1}).exec()
        if(result==null) {
            res.status(400).json({success:false,data:{}})
        }else {
            res.status(200).json({success:true,data:result})
        }
    } catch (error) {
        res.status(500).json({success:false,data:{}})
    }
}
export const deleteAds = async (req,res) => {
    try {
        const {id} = req.params;
        const image = await AdsModel.findOne({_id:mongoose.Types.ObjectId(id)},{image:1});
        const result = await AdsModel.deleteOne({_id:mongoose.Types.ObjectId(id)}).sort({_id:-1}).exec()
        if(result.acknowledged==true) {
            fs.unlinkSync(path.join("public/images",image.image))
            res.status(200).json({success:true,message:"deleted successfully"})
        }else {
            res.status(400).json({success:false,message:"failed to delete"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to delete"})
    }
}
export const updateAdWithoutImage = async (req,res) => {
    try {
        const {id,productLink} = req.body;
        const formatedId = mongoose.Types.ObjectId(id);
        const result = await AdsModel.updateOne({_id:formatedId},{productLink:productLink});
        console.log("update result: ",result)
        if(result.acknowledged==true) {
            res.status(200).json({success:true,message:"updated successfully"})
        }else {
            res.status(400).json({success:false,message:"failed to update"})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"failed to update"})
    }
}