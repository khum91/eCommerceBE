import mongoose from "mongoose";
const patSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }},
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    })
const patModel = mongoose.model('PAT', patSchema)
export default patModel;