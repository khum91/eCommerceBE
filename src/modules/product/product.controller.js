import { deleteFile } from "../../utilities/helper.js";
import productModel from "./product.model.js";
import productService from "./product.service.js";
class ProductController {
    #id;
    #product;
    create = async (req, res, next) => {
        try {
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            data.createdBy = req.authUser._id
            const product = await productService.store(data)
            res.json({
                result: product,
                message: "Product created successfully",
                meta: null
            })

        } catch (error) {
            next(error)
        }

    }
    index = async (req, res, next) => {
        try {
            //pagination
            //searching/filter
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const sorting = { _id: 'desc' }
            let filter = {}

            if (req.query.search) {
                filter = {
                    $or: [{ name: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }]
                }
            }
            const { data, count } = await productService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter
            })
            res.json({
                result: data,
                message: 'Product List',
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit,
                    totalPages: Math.ceil(count / limit)
                }
            })

        } catch (error) {
            next(error)

        }
    }

    options = async (req, res, next) => {
        try {
            const data = await productService.options({
            })
            res.json(data)

        } catch (error) {
            next(error)

        }
    }

    productAsCategory = async (req, res, next) => {
        try {
            this.#id = req.params.id;
            const sorting = req.query.sort1
            const data = await productService.productAsCategory({ _id: this.#id }, sorting)
            res.json(data)
        } catch (error) {
            next(error)

        }
    }

    #validateId = async (req) => {
        try {
            this.#id = req.params.id;
            this.#product = await productService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#product) {
                throw { status: 404, message: 'Product not found' }
            }
        } catch (e) {
            throw e
        }
    }

    checkauthor = async (req, res, next) => {
        try {
            if (req.authUser.role !== 'admin') {
                this.#id = req.params.id;
                const currentId = req.authUser._id
                const author = await productModel.find({ _id: this.#id, createdBy: currentId }, { _id: 0, createdBy: 1 })
                if (author.length == 0) {
                    res.json({
                        result: 'notallowed',
                        message: 'You cannot modify entities created by others.',
                        meta: null
                    })
                    return
                }
            }
            next()
        } catch (error) {
            next(error)
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#product,
                message: 'Product Detail',
                meta: null
            })
        } catch (error) {
            next(error)
        }

    }
    update = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            data.createdBy = req.authUser._id
            const response = await productService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/products/' + response.image)
            }
            res.json({
                result: data,
                message: 'Product Updated Successfully',
                meta: null
            })

        } catch (error) {
            next(error)

        }


    }
    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const response = await productService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/products/' + response.image)
            }

            res.json({
                result: null,
                message: 'Product deleted successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ProductController;