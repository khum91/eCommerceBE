import joi from 'joi'
const BannerCreateDto = joi.object({
  name: joi.string().min(2).required(),
  status: joi.string().regex(/^(active||inactive)$/).required(),
  link: joi.string().uri(),
  image: joi.string()
});
export default BannerCreateDto 