import categoryModel from "./category.model.js"
import brandModel from '../brand/brand.model.js'

class CatagoryService {
    store = async (data) => {
        try {
            const categoryd = new categoryModel(data)
            return await categoryd.save()

        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await categoryModel.find(filter)
                .populate('parent', ['_id', 'name'])
                .populate('brand', ['_id', 'name'])
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await categoryModel.countDocuments();
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    options = async () => {
        try {
            const parent = await categoryModel.find({status:'active'},{_id:true, name:true})
            const brand = await brandModel.find({status:'active'},{_id:true, name:true})
            return {parent, brand}
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await categoryModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .populate('parent', ['_id', 'name'])
                .populate('brand', ['_id', 'name'])
            return data
        } catch (error) {
            throw error
        }
    }

    getMultiDataByFilter = async (filter) => {
        try {
            const data = await categoryModel.distinct("_id", filter)
            return data
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await categoryModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await categoryModel.findByIdAndDelete(id)
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