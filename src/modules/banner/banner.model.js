
import mongoose from "mongoose";
import { GeneralStatus } from "../../config/constants.js";
const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2
    },
    link: {
        type: String,
        required: false,
    },
    image: String,
    status: {
        type: String,
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
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

const bannerModel = new mongoose.model("Banner", bannerSchema)
export default bannerModel;