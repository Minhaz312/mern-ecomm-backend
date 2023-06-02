import express from "express"
import { addNewAd, deleteAds, getAdsById, getAllAds, updateAdWithoutImage } from "../controllers/AdsController.js"

const adRouter = express.Router()

adRouter.get("/get/all",(req,res)=>{
    getAllAds(req,res)
})
adRouter.get("/get/:id",(req,res)=>{
    getAdsById(req,res)
})
adRouter.delete("/delete/:id",(req,res)=>{
    deleteAds(req,res)
})
adRouter.post("/update/withoutimage",(req,res)=>{
    updateAdWithoutImage(req,res)
})
adRouter.post("/add",(req,res)=>{
    addNewAd(req,res)
})
adRouter.post("/update/withimage",(req,res)=>{
    res.send("asdf")
})

export default adRouter;