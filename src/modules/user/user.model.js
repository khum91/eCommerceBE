import mongoose from "mongoose";
import { GeneralStatus, UserProvider, UserTypes } from "../../config/constants.js";

const AddressSchema = new mongoose.Schema({
    province: String,
    district: String,
    muniVdc: String,
    wardNo: Number,
    tole: String,
    landmark: String
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 15,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        permanentAddress: AddressSchema,
        temporaryAddress: AddressSchema
    },
    role: {
        type: String,
        enum: [...Object.values(UserTypes)],
        default: UserTypes.CUSTOMER
    },
    status: {
        type: String,
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    phone: String,
    activationToken: String,
    activateFor: Date,
    userProider: {
        type: String,
        enum: [...Object.values(UserProvider)],
        default: UserProvider.CUSTOM
    },
    userProviderId: String,
    forgetToken: String,
    forgetTokenFor: Date,
    image: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
})
const UserModel = mongoose.model('User', UserSchema)

export {UserModel}