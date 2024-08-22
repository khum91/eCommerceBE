import catagoryModel from "./catagory.model.js"
import brandModel from '../../modules/brand/brand.model.js'

class CatagoryService {
    store = async (data) => {
        try {
            const catagoryd = new catagoryModel(data)
            return await catagoryd.save()

        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await catagoryModel.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await catagoryModel.find(filter);
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await catagoryModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
            return data
        } catch (error) {
            throw error
        }
    }

    getMultiDataByFilter = async (filter) => {
        try {
            const data = await brandModel.distinct("_id", filter)
            return data
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await catagoryModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await catagoryModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'Catagory does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }
}

export default new CatagoryService