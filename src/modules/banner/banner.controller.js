import bannerService from "./banner.service.js"
import { deleteFile } from "../../utilities/helper.js";
class BannerController {
    #id;
    #banner;

    create = async (req, res, next) => {
        try {
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            data.createdBy = req.authUser._id
            const banner = await bannerService.store(data)

            res.json({
                result: banner,
                message: "Banner created successfully",
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
            const { data, count } = await bannerService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter

            })
            res.json({
                result: data,
                message: 'Banner List',
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
            this.#banner = await bannerService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#banner) {
                throw { status: 404, message: 'Banner not found' }
            }
        } catch (e) {
            throw e
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#banner,
                message: 'Banner Detail',
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
            const response = await bannerService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/banners/' + response.image)
            }
            res.json({
                result: data,
                message: 'Banner Updated Successfully',
                meta: null
            })

        } catch (error) {
            next(error)

        }


    }
    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            const response = await bannerService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/banners/' + response.image)
            }

            res.json({
                result: null,
                message: 'Banner deleted successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }

    listForHome = async (req, res, next) => {
        try {
            const {data} = await bannerService.listAllData({
                limit: 5,
                skip: 0,
                sort: { _id: 1 },
                filter: {
                    status: 'active'
                }
            })
            res.json({
                result: data,
                message: 'Banner for Carousel listed successfully.',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }
}
export default new BannerController