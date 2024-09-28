
import mongoose from "mongoose";
import { GeneralStatus } from "../../config/constants.js";
const categorySchema = new mongoose.Schema({
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
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: String,
    brand: [{
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

const categoryModel = new mongoose.model("Category", categorySchema)
export default categoryModel;