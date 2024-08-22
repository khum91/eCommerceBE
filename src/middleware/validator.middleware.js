import {deleteFile} from '../utilities/helper.js';
const bodyValidator = (schema) => {
        return async (req, res, next) => {
        try {
            const data = req.body;

            if (req.file) {
                data[req.file.fieldname] = req.file.filename;
                // data.image = req.file.filename;
            }
            await schema.validateAsync(data, { abortEarly: false });
            next();

        }
        catch (error) {
            if (req.file) {
                deleteFile('./' + req.file.path)
            } else if (req.files) {
                req.files.map((file) => {
                    deleteFile('./' + file.path)
                })

            }
            const detail = {};
            error.details.map((e) => {
                detail[e.context.label] = e.message

            })
            next({ status: 422, message: 'validation error', detail: detail })
        }
    }
}

export default bodyValidator;