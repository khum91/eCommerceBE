
import mongoose from "mongoose";
import { GeneralStatus } from "../../config/constants.js";
 const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true,
        min:2
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    image: String,
    status:{
        type:String,
        enum:[...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        default:null
    }
 },{
    timestamps:true,
    autoCreate:true,
    autoIndex:true
 })

 const brandModel = new mongoose.model("Brand", brandSchema)
 export default brandModel;