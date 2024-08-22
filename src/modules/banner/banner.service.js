import bannerModel from "./banner.model.js"

class BannerService {
    store = async (data) => {
        try {
            const bannerd = new bannerModel(data)
            return await bannerd.save()

        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await bannerModel.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await bannerModel.find(filter).count();
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await bannerModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
            return data
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await bannerModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await bannerModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'Banner does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }
}

export default new BannerService