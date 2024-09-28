import orderModel from './order.model.js'
import productModel from '../product/product.model.js'
class OrderService {

    store = async (data) => {
        try {
            const order = new orderModel(data)
            return await order.save()
        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {}, idfilter = {} }) => {
        try {
            const data = await orderModel.find(idfilter)
                .populate({
                    path: 'items',
                    populate: {
                        path: 'productId',
                        select: 'name',
                    },
                })
                .populate({
                    path: 'customer',
                    select: 'name'
                })
                .populate({
                    path: 'seller',
                    select: 'name'
                })
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await orderModel.countDocuments(idfilter);
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await orderModel.findOne(filter)
                .populate({
                    path: 'items',
                    populate: {
                        path: 'productId',
                        select: ('name image'),
                    },
                })
                .populate({
                    path: 'customer',
                    select: 'name'
                })
                .populate({
                    path: 'seller',
                    select: 'name'
                })
            return data

        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await orderModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await productModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'Order does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }





}

export default new OrderService