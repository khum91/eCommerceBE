
import mongoose from "mongoose";
import { GeneralStatus } from "../../config/constants.js";
const catagorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    parentid: {
        type: mongoose.Types.ObjectId,
        ref: 'Catagory',
        default: null
    },
    image: String,
    brands: [{
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        default: null
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})

const catagoryModel = new mongoose.model("Catagory", catagorySchema)
export default catagoryModel;