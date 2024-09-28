import mongoose from "mongoose";
import { GeneralStatus } from "../../config/constants.js";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
        default: null
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        default: null
    },
    detail: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    image: String,
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

const productModel = new mongoose.model("Product", productSchema)
export default productModel;