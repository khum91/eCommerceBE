import joi from 'joi'
const ProductCreateDto = joi.object({
  name: joi.string().min(2).required(),
  seller: joi.string().min(2).required(),
  category: joi.string().min(2).required(),
  brand: joi.string(),
  detail: joi.string().min(2).required(),
  status: joi.string().regex(/^(active||inactive)$/).required(),
  price: joi.number().required(),
  image: joi.string()
});
export default ProductCreateDto 