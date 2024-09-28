import brandModel from "./brand.model.js"

class BrandService {
    store = async (data) => {
        try {
            const brand = new brandModel(data)
            return await brand.save()

        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await brandModel.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await brandModel.countDocuments();
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await brandModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
            return data
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await brandModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await brandModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'Brand does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }
}

export default new BrandService