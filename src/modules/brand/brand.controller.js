import slugify from "slugify"
import brandService from "./brand.service.js"
import { deleteFile } from "../../utilities/helper.js";
class BrandController {
    #id;
    #brand;

    create = async (req, res, next) => {
        try {
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            data.slug = slugify(data.name, { lower: true })
            data.createdBy = req.authUser._id
            const brand = await brandService.store(data)

            res.json({
                result: brand,
                message: "Brand created successfully",
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
            const { data, count } = await brandService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter
            })
            res.json({
                result: data,
                message: 'Brand List',
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
            this.#brand = await brandService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#brand) {
                throw { status: 404, message: 'Brand not found' }
            }
        } catch (e) {
            throw e
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#brand,
                message: 'Brand Detail',
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
            const response = await brandService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/brands/' + response.image)
            }
            res.json({
                result: data,
                message: 'Brand Updated Successfully',
                meta: null
            })

        } catch (error) {
            next(error)

        }


    }
    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const response = await brandService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/brands/' + response.image)
            }

            res.json({
                result: null,
                message: 'Brand deleted successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }

    getBySlug = async (req, res, next) => {
        try {
            const slug = req.params.slug
            const brand = await brandService.getSingleDataByFilter({ slug: slug })
            if (!brand) {
                throw { status: 404, message: 'Brand does not exists' }
            }

            //TODO: Fetch product list by Brand
            res.json({
                result: {
                    detail: brand,
                    product: null
                },
                meta: {
                    total: 0,
                    currentPage: 1,
                    limit: 15,
                    totalPage: 0
                },
                message: 'Brand detail with product'
            })
        } catch (error) {
            next(error)

        }
    }

}
export default new BrandController