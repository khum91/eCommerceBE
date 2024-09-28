import slugify from "slugify"
import categoryService from "./category.service.js"
import categoryModel from "./category.model.js";
import { deleteFile } from "../../utilities/helper.js";
class CategoaryController {
    #id;
    #category;
    #validateParentAndBrands = async (data) => {
        try {
            if (data.parent) {
                const parentname = data.parent;
                const parentData = await categoryService.getSingleDataByFilter({ _id: parentname })
                if (!parentData) {
                    throw { status: 404, message: 'Parent category not found' }
                }
            } else {
                data.parent = null;
            }
            if (data.brand) {
                const brand = data.brand
                const filter = { _id: { $in: [brand] } }
                const brandId = await categoryService.getMultiDataByFilter({ filter })
                if (!brandId) {
                    throw { status: 404, message: 'Brand not found' }
                }
            } else {
                data.brand = null
            }
        } catch (error) {
            throw error
        }
    }

    create = async (req, res, next) => {
        try {
            const data = req.body
            await this.#validateParentAndBrands(data)
            if (req.file) {
                data.image = req.file.filename
            }
            data.slug = slugify(data.name, { lower: true })
            data.createdBy = req.authUser._id
            const category = await categoryService.store(data)
            res.json({
                result: category,
                message: "Categoary created successfully",
                meta: null
            })

        } catch (error) {
            console.log(error)
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
            const { data, count } = await categoryService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter
            })
            res.json({
                result: data,
                message: 'Categoary List',
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
            const data = await categoryService.options({
            })
            res.json(data)

        } catch (error) {
            next(error)

        }
    }

    #validateId = async (req) => {
        try {
            this.#id = req.params.id;
            this.#category = await categoryService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#category) {
                throw { status: 404, message: 'Categoary not found' }
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
                const author = await categoryModel.find({ _id: this.#id, createdBy: currentId }, { _id: 0, createdBy: 1 })
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
                result: this.#category,
                message: 'Categoary Detail',
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
            await this.#validateParentAndBrands(data)
            data.slug = slugify(data.name, { lower: true })
            data.createdBy = req.authUser._id
            const response = await categoryService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/categories/' + response.image)
            }
            res.json({
                result: data,
                message: 'Categoary Updated Successfully',
                meta: null
            })

        } catch (error) {
            next(error)

        }
    }
    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const response = await categoryService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/categories/' + response.image)
            }

            res.json({
                result: null,
                message: 'Categoary deleted successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new CategoaryController;