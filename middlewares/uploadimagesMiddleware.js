import multer from "multer";
import { APIerrors } from "../utils/Errors.js";

const uploadOptions = () => {
    // DiskStorage Engine
    // const multerStorage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, 'uploads/categories')
    //     },
    //     filename: (req, file, cb) => {
    //         const ext = file.mimetype.split('/')[1];
    //         const fileName = `category-${Date.now()}.${ext}`
    //         // const fileName = `category-${Date.now()}-${file.originalname}`
    //         cb(null, fileName);
    //     }
    // })

    // MemoryStorage Engine
    const multerStorage = multer.memoryStorage()
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) { cb(null, true); }
        else { cb(new APIerrors("Not an image!", 400), false); }
    }
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
    return upload
}
export const uploadSingleimage = (fieldName) => { return uploadOptions().single(fieldName) }
export const uploadMultiImages = (fields) => { return uploadOptions().fields(fields) }