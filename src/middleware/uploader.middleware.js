import multer from 'multer';
import fs from 'fs';
import {randomString} from '../utilities/helper.js';

const mystorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = './public/uploads/' + req.upLoadPath;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
        cb(null, path)
    },

    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const random = Math.floor(Math.random() * 9999);
        const name= randomString(20)

        const filename = name + '-' + random + '.' + ext;
        //const filename = Date.now() + '-' + random + '.' + ext;
        cb(null, filename);
    }
});

const uploader = multer({
    storage: mystorage,
    fileFilter:(req, file, cb)=>{
        const ext =file.originalname.split('.').pop()
        const allowed=['jpeg','jpg','png','gif','svg','webp','bmp'];
        if(allowed.includes(ext.toLowerCase())){
            cb(null, true)
        }else{
            cb({status:400, message:'Invalid File format'}, false);
        }
    },

    limits:{
        fieldSize: 3000000
    }
});

const setPath = (path) => {
    return (req, res, next) => {
        req.upLoadPath = path;
        next();
    }
}


export { uploader, setPath};