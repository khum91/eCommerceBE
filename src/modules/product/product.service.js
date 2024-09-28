import { UserModel } from '../user/user.model.js'
import categoryModel from '../category/category.model.js'
import brandModel from '../brand/brand.model.js'
import productModel from '../product/product.model.js'

class ProductService {
    store = async (data) => {
        try {
            const product = new productModel(data)
            return await product.save()

        } catch (error) {
            throw error
        }
    }

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await productModel.find(filter)
                .populate('seller', ['_id', 'name'])
                .populate('category', ['_id', 'name'])
                .populate('brand', ['_id', 'name'])
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await productModel.countDocuments();
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    options = async () => {
        try {
            const seller = await UserModel.find({ role: 'seller', status: 'active' }, { _id: true, name: true })
            const category = await categoryModel.find({ status: 'active' }, { _id: true, name: true })
            const brand = await brandModel.find({ status: 'active' }, { _id: true, name: true })
            return { seller, category, brand }
        } catch (error) {
            throw error
        }
    }
    productAsCategory = async (id, s) => {
        try {
            const product = await productModel.find({ category: id, status: 'active'})
                .populate('seller', ['_id', 'name'])
                .populate('category', ['_id', 'name'])
                .populate('brand', ['_id', 'name'])
                .sort(s);
            return product
        } catch (error) {
            throw error
        }
    }

    getSingleDataByFilter = async (filter) => {
        try {
            const data = await productModel.findOne(filter)
                .populate('seller', ['_id', 'name'])
                .populate('category', ['_id', 'name'])
                .populate('brand', ['_id', 'name'])
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
            return data
        } catch (error) {
            throw error
        }
    }

    getMultiDataByFilter = async (filter) => {
        try {
            const data = await productModel.distinct("_id", filter)
            return data
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await productModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await productModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'Product does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }
}

export default new ProductService