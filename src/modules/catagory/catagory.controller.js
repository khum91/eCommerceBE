import slugify from "slugify"
import catagoryService from "./catagory.service.js"
import { deleteFile } from "../../utilities/helper.js";
class CatagoryController {
    #id;
    #catagory;
    #validateParentAndBrands = async (data) => {
        try {
            if (data.parent) {
                const parentname = data.parent;
                const parentData = await catagoryService.getSingleDataByFilter({ name: parentname })
                if (!parentData) {
                    throw { status: 404, message: 'Parent catagory not found' }
                } else {
                    const parentId = parentData._id
                    data.parentid = parentId
                }
            } else {
                data.parent = null;
            }
            if (data.brand) {
                const brand = data.brand
                const filter = { name: { $in: ['Samsung', 'Philips'] } }
                const brandId = await catagoryService.getMultiDataByFilter(filter)

                if (!brandId) {
                    throw { status: 404, message: 'Brand not found' }
                } else {
                    data.brands = brandId
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
            const catagory = await catagoryService.store(data)

            res.json({
                result: catagory,
                message: "Catagory created successfully",
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
            const { data, count } = await catagoryService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter
            })
            res.json({
                result: data,
                message: 'Catagory List',
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

    #validateId = async (req) => {
        try {
            this.#id = req.params.id;
            this.#catagory = await catagoryService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#catagory) {
                throw { status: 404, message: 'Catagory not found' }
            }
        } catch (e) {
            throw e
        }
    }
    show = async (req, res, next) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#catagory,
                message: 'Catagory Detail',
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
            const response = await catagoryService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/catagories/' + response.image)
            }
            res.json({
                result: data,
                message: 'Catagory Updated Successfully',
                meta: null
            })

        } catch (error) {
            next(error)

        }


    }
    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const response = await catagoryService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/catagories/' + response.image)
            }

            res.json({
                result: null,
                message: 'Catagory deleted successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new CatagoryController;