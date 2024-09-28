import Order from "./order.model.js";
import orderService from "./order.service.js";
class OrderController {
    #id;
    #order;
    create = async (req, res, next) => {
        try {
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            const order = await orderService.store(data)
            res.json({
                result: order,
                message: "Order created successfully",
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

            let idfilter = {}
            if (req.authUser.role !== 'admin') {
                idfilter = { seller: req.authUser._id }
            }

            if (req.query.search) {
                filter = {
                    $or: [{ _id: new RegExp(req.query.search, 'i') },
                    { orderStatus: new RegExp(req.query.search, 'i') }]
                }
            }
            const { data, count } = await orderService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter,
                idfilter: idfilter
            })
            res.json({
                result: data,
                message: 'Order List',
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
            this.#order = await orderService.getSingleDataByFilter({ _id: this.#id })
            if (!this.#order) {
                throw { status: 404, message: 'Order not found' }
            }
        } catch (e) {
            throw e
        }
    }
    show = async (req, res, next) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#order,
                message: 'Order Detail',
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
            data.createdBy = req.authUser._id
            const response = await orderService.updateById(this.#id, data)
            res.json({
                result: data,
                message: 'Order Updated Successfully',
            })

        } catch (error) {
            next(error)
        }
    }

    //for customer Only
    customer = async (req, res, next) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const sorting = { _id: 'desc' }
            let filter = {}
            let idfilter = { customer: req.authUser._id }

            if (req.query.search) {
                filter = {
                    $or: [{ _id: new RegExp(req.query.search, 'i') },
                    { orderStatus: new RegExp(req.query.search, 'i') }]
                }
            }
            const { data, count } = await orderService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter,
                idfilter: idfilter
            })
            res.json({
                result: data,
                message: 'Order List',
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
}

export default new OrderController;