import joi from 'joi'
const CatagoryCreateDto = joi.object({
  name: joi.string().min(2).required(),
  status: joi.string().regex(/^(active||inactive)$/).required(),
  parent: joi.string().allow(''),
  brand: joi.string().allow(''),
  image: joi.string()
});
export default CatagoryCreateDto 