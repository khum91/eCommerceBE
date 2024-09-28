import categoryModel from "../category/category.model.js";
class ProductController {

    landing = async (req, res, next) => {
        try {
            const data = await categoryModel.find()
                .populate('parent', ['_id', 'name'])
                .sort({ _id: 'desc' })
            res.json({
                result: data
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ProductController;