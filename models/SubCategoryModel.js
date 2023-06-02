import mongoose, { Schema } from "mongoose";

const SubCategorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    parent:{type: Schema.Types.ObjectId,required:true,unique:false,ref:"category"}
})

const SubCategoryModel = mongoose.model("sub_category",SubCategorySchema);

export default SubCategoryModel;