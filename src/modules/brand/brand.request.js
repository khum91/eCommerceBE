import joi from 'joi'
const BrandCreateDto = joi.object({
  name: joi.string().min(2).required(),
  status: joi.string().regex(/^(active||inactive)$/).required(),
  isFeatured: joi.boolean().default(false),
  image: joi.string()
});
export default BrandCreateDto 