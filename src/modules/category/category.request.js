import joi from 'joi'
const CategoryCreateDto = joi.object({
  name: joi.string().min(2).required(),
  status: joi.string().regex(/^(active||inactive)$/).required(),
  parent: joi.string().allow(''),
  brand: joi.array().allow(''),
  image: joi.string()
});
export default CategoryCreateDto 