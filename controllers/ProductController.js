import fs from "node:fs"
import mongoose, { mongo } from "mongoose";
import multer from "multer"
import requestIp from "request-ip";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';
import ProductModel from "../models/ProductModel.js"
import SubCategoryModel from "../models/SubCategoryModel.js";
import CategoryModel from "../models/CategoryModel.js";
import path from "path";
import has from "../helper/inputHas.js";
import CartModel from "../models/CartModel.js";

const imageUploadStorage = multer.diskStorage({
	destination:(req,file,cb)=>{
		if(!fs.existsSync("./public/images")){
            fs.mkdirSync("./public/images")
        }
		cb(null,"public/images")
	},
	filename:(req,file,cb)=>{
		const extension = file.originalname.split(".")[file.originalname.split(".").length-1]
		const filename = uuidv4().split("-").join("").concat(".",extension);
		cb(null,filename)
	}
})

const imageUploader = multer({
	storage:imageUploadStorage,
	fileFilter:(req,file,cb)=>{
		const mimeType = file.mimetype;
		const extension = file.originalname.split(".")[file.originalname.split(".").length-1]
		if(mimeType=="image/jpg" || mimeType==="image/jpeg" || mimeType==="image/png") {
			cb(null,true)
		}else {
			cb(new Error(`${extension} is not acceptable`),false)
		}
	}
}).fields([
	{name:"primaryImage",maxCount:1},
	{name:"images",maxCount:15}
])

export const addNewProduct = (req,res) => {
	imageUploader(req,res,async (err)=>{
		if(err) {
			res.status(400).json({success:false,message:err.message})
		}else {
			try {
				const uploadedImagesFileName = []
				const primaryImage = req.files.primaryImage[0].filename
				req.files.images!=null?.map(file=>{
					uploadedImagesFileName.push(file.filename)
				})
				const {name,description,price,brand,size,colors,quantity,discount,tags,categoryId} = JSON.parse(req.body.data);
				const categoryNameById = await SubCategoryModel.find({_id:mongoose.Types.ObjectId(categoryId)}).select("name").exec();
				let categoryName = ""
				if(categoryNameById.length>0) {
					categoryName = categoryNameById[0].name
				}else {
					const categoryNameById = await CategoryModel.find({_id:mongoose.Types.ObjectId(categoryId)}).select("name").exec();
					categoryName = categoryNameById[0].name
					
				}
				const slug = slugify(name,"-")
				const data = {
					name:name,
					description:description,
					price:price,
					size:size,
					brand:brand,
					colors:colors,
					quantity:quantity,
					discount:discount,
					tags:tags,
					primaryImage:primaryImage,
					images:uploadedImagesFileName,
					slug:slug,
					category:{
						id:categoryId,
						name:categoryName
					}
				}
				console.log(data)
				const result = await ProductModel.create(data)
				if(result) {
					res.status(200).json({success:true,message:"product added"})
				}else {
					res.status(401).json({success:false,message:"failed to add product"})
				}
			} catch (error) {
				console.log(error)
				res.status(500).json({success:false,message:"failed to add product"})
			}
		}
	})
}
export const deleteProduct = async (req,res) => {
	try {
		const {id} = req.params;
		const productImage = await ProductModel.findOne({_id:mongoose.Types.ObjectId(id)}).select("primaryImage images -_id").exec()
		let imageList = []
		imageList.push({image:productImage.primaryImage})
		productImage.images.map(image=>{
			imageList.push({image:image});
		})

		const result = await ProductModel.deleteOne({_id:mongoose.Types.ObjectId(id)})
		if(result) {
			imageList.map(image=>{
				fs.unlinkSync(path.join("public/images",image.image))
			})
			res.status(200).json({success:true,message:"product deleted"})
		}else {
			res.status(401).json({success:false,message:"failed to delete product"})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,message:"failed to delete product"})
	}
}
export const deleteMultipleProduct = async (req,res) => {
	console.log(req.body)
	try {
		const id = req.body.id;
		let idList = []
		id.map(id=>{
			idList.push(mongoose.Types.ObjectId(id.id));
		})
		const productImage = await ProductModel.find({_id:{$in:idList}}).select("primaryImage images -_id").exec()
		let imageList = []
		productImage.map(item=>{
			imageList.push({image:item.primaryImage})
			item.images.map(image=>{
				imageList.push({image:image});
			})
		})

		const result = await ProductModel.deleteMany({_id:{$in:idList}});
		if(result) {
			imageList.map(image=>{
				fs.unlinkSync(path.join("public/images",image.image))
			})
			res.status(200).json({success:true,message:"product deleted"})
		}else {
			res.status(401).json({success:false,message:"failed to delete product"})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,message:"failed to delete"})
	}
}
export const updateProductWithoutImage = async (req,res) => {
	try {
		
		const data = req.body.data;
		let updatedData = {}
		const formatedId = mongoose.Types.ObjectId(data.productId)
		if(data.name!=undefined && data.name.trim()!=""){
			updatedData.name = data.name
			updatedData.slug = slugify(data.name,"-")
		}
		if(data.description!=undefined && data.description.trim()!=""){
			updatedData.description = data.description
		}
		if(data.price!=undefined && data.price.trim()!=""){
			updatedData.price = data.price
		}
		if(data.discount!=undefined && data.discount.trim()!=""){
			updatedData.discount = data.discount
		}
		if(data.quantity!=undefined && data.quantity.trim()!=""){
			updatedData.quantity = data.quantity
		}
		if(data.tags!=undefined && data.tags.trim()!=""){
			updatedData.tags = data.tags
		}
		if(data.size!=undefined && data.size.length>0){
			updatedData.size = data.size
		}
		if(data.colors!=undefined && data.colors.length>0){
			updatedData.colors = data.colors
		}
		if(data.brand!=undefined && data.brand.length>0){
			updatedData.brand = data.brand
		}
		if(data.category!=undefined && data.category.trim()!=""){
			let category = await CategoryModel.findOne({_id:mongoose.Types.ObjectId(data.category)});
			if(category==null) {
				category = await SubCategoryModel.findOne({_id:mongoose.Types.ObjectId(data.category)});
			}
			updatedData.category = {
				id:category._id,
				name:category.name
			}
		}
		const propsLength = Object.keys(data).length
		if(propsLength>0) {
			const result = await ProductModel.updateOne({_id:formatedId},updatedData);
			if(result.acknowledged==true) {
				res.status(200).json({success:true,message:"updated successfully"})
			}else {
				res.status(400).json({success:false,message:"failed to update"})
			}
		}else {
			res.status(400).json({success:false,message:"failed to update"})
		}
		
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,message:"failed to update"})
	}
}

// get product 
export const getAllProduct = async (req,res) => {
   try {
       const result = await ProductModel.find().populate("category").sort({_id:-1}).exec();
		res.status(200).json({success:true,data:result});
    
   } catch (error) {
	console.log(error)
    res.status(500).json({success:false,data:[]})
   }
}
export const getPaginatedProduct = async (req,res) => {
	console.log(req.params)
	try {
        const {skip,take,keyword} = req.params;
		const totalProudct = await ProductModel.find().countDocuments();
		if(keyword.toLowerCase()=="all"){
			const result = await ProductModel.find().populate("category").skip(skip).limit(take).sort({_id:-1}).exec();
		   res.status(200).json({success:true,data:result,totalProudct:totalProudct});   
		}else {
			const regex = new RegExp(keyword,'i')
			const result = await ProductModel.find({$or:[
				{name:{$regex:regex}},
				{"category.name":{$regex:regex}},
				{tags:{$regex:regex}},
				{"colors":{$regex:regex}},
			]}).populate("category").skip(skip).limit(take).sort({_id:-1}).exec();
		   res.status(200).json({success:true,data:result,totalProudct:totalProudct});   
		}
   } catch (error) {
	console.log(error)
    res.status(500).json({success:false,data:[]})
   }
}
export const getSuggestedProduct = async (req,res) => {
	try {
		const keyword = req.body.keyword
		let productList = []
		let keywordList = keyword.split(",")
		let c = 0
		let regexArr = []
		keywordList.map(async item=>{
			const regex = new RegExp(item,'i')
			regexArr.push(regex)
		})
		const result = await ProductModel.find({$or:[
			{name:{$in:regexArr}},
			{"category.name":{$in:regexArr}},
			{tags:{$in:regexArr}},
			{"colors":{$in:regexArr}},
		]}).populate("category").limit(6).exec();
		productList = [...result]
		if(result.length<6){
			let get = 6-result.length
			let getMore = await ProductModel.find().sort({_id:-1}).limit(get).exec()
			productList = [...result,...getMore]
		}
		console.log(productList.length)
		res.status(200).json({success:true,data:productList})
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,data:[]})
	}
}
export const searchProduct = async (req,res) => {
	try {
		const keyword = req.params.keyword
		const regex = new RegExp(keyword,'i')
		const totalMatched = await ProductModel.find({$or:[
			{name:{$regex:regex}},
			{"category.name":{$regex:regex}},
			{tags:{$regex:regex}},
			{"colors":{$regex:regex}},
		]}).countDocuments()
		const result = await ProductModel.find({$or:[
			{name:{$regex:regex}},
			{"category.name":{$regex:regex}},
			{tags:{$regex:regex}},
			{"colors":{$regex:regex}},
		]}).populate("category").sort({_id:-1}).exec();
		res.status(200).json({success:true,data:result,totalMatched:totalMatched})
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,data:[]})
	}
}
export const getTopProductByPurchasedAmount = async (req,res) => {
	try {
		const result = await ProductModel.find({purchased:{$gte:1}}).sort({purchased:-1}).limit(12).exec()
		let productList = []
		if(result.length<6){
			const nmbrOfMore = 6-result.length
			const moreProduct = await ProductModel.find().sort({quantity:-1}).limit(nmbrOfMore).exec();
			productList = [...result,...moreProduct]
		}else {
			productList = [...result]
		}
		res.status(200).json({success:true,data:productList});
	} catch (error) {
		res.status(500).json({success:false,data:[]});
	}
}

export const getProductByCategory = async (req,res) => {
    try {
		const category = req.params.category
		const result = await ProductModel.find({"category.name":category}).populate("category").skip(0).limit(12).sort({_id:-1}).exec();
		const totalFound = await ProductModel.find({"category.name":category}).countDocuments();
		res.status(200).json({success:true,data:result,totalProduct:totalFound});
	} catch (error) {
	 console.log(error)
	 res.status(500).json({success:false,data:[]})
	}
}


export const getProductById = async (req,res) => {
	try {
		const id = req.params.id
		const formatedId = mongoose.Types.ObjectId(id);
		const product = await ProductModel.findOne({_id:formatedId});
		const relatedProduct = await ProductModel.find({"category.name":product.category.name}).sort({_id:-1}).exec()
		if(product) {
			res.status(200).json({success:true,data:product,relatedProduct:relatedProduct});
		}else {
			res.status(400).json({success:false,product:null})
		}
	} catch (error) {
		res.status(500).json({success:false,product:null})
	}
}
export const getProductByStock = async (req,res) => {
	try {
		const stock = req.params.stock
		let product = []
		if(stock=="out"){
			product = await ProductModel.find({quantity:{$eq:0}});
		}else {
			product = await ProductModel.find({quantity:{$gt:0}});
		}
		console.log(product)
		if(product) {
			res.status(200).json({success:true,data:product});
		}else {
			res.status(400).json({success:false,product:null})
		}
	} catch (error) {
		res.status(500).json({success:false,product:null})
	}
}


// add product to cart

export const addProductToCart = async (req,res)=>{
	try {
		const data = req.body;
		let cartItem = {}
		console.log("data body: ",req.body)
		cartItem.userId = mongoose.Types.ObjectId(data.authId)
		if(has(data,"productId")){
			data.productId = mongoose.Types.ObjectId(data.productId)
		}
		if(has(data,"size")){
			cartItem.productSize = data.size
		}
		if(has(data,"color")){
			cartItem.productColor = data.color
		}
		if(has(data,"quantity")){
			cartItem.quantity = data.quantity
		}
		const product = await ProductModel.findOne({_id:mongoose.Types.ObjectId(data.productId),quantity:{$gte:Number(data.quantity)}});
		if(product==null){
			res.status(400).json({success:false,message:"Maybe product is out of stock!"})
		}else {
			cartItem.productId = mongoose.Types.ObjectId(data.productId)
			cartItem.productImage = product.primaryImage,
			cartItem.productPrice = product.price,
			cartItem.productName = product.name
			cartItem.productId = mongoose.Types.ObjectId(data.productId)
			cartItem.totalPrice = Number(cartItem.quantity)*Number(product.price)
			console.log("cartItem: ",cartItem)
			const result = await CartModel.create(cartItem);
			if(result._id!=undefined){
				let avaialbleProduct = Math.abs(Number(product.quantity)-Number(data.quantity))
				await ProductModel.updateOne({_id:mongoose.Types.ObjectId(data.productId)},{quantity:avaialbleProduct})
				res.status(200).json({success:true,data:result,message:"Item added"});
			}else {
				res.status(500).json({success:false,message:"Failed to add item"});
			}
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({success:false,message:"Failed to add item"});
	}
}
export const updateCartItemQuantity = async (req,res) => {
	try {
		const authId = mongoose.Types.ObjectId(req.body.authId)
		const cartId = mongoose.Types.ObjectId(req.body.cartId);
		const {quantity,totalPrice} = req.body;
		await CartModel.updateOne({_id:cartId,userId:authId},{$set:{quantity,totalPrice}})
		res.status(200)
		res.json({success:true,message:"Product Updated"})
	} catch (error) {
		console.log('error: ',error)
		res.status(500)
		res.json({success:false,message:"Failed to update"})
	}
}
export const getAllCartItem = async (req,res) => {
	try {

		const result = await CartModel.find();
		res.status(200).json({success:true,data:result});
	} catch (error) {
		res.status(500).json({success:false,data:[]});
	}
}
export const deleteCartById = async (req,res) => {
	try {
		const id = req.params.id
		const result = await CartModel.deleteOne({_id:mongoose.Types.ObjectId(id)});
		if(result.acknowledged){
			res.status(200).json({success:true});
		}else {
			res.status(400).json({success:false});
		}
	} catch (error) {
		res.status(500).json({success:false});
	}
}