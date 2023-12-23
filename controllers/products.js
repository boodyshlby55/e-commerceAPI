import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import products from '../models/productsSchema.js'
import { uploadMultiImages } from '../middlewares/uploadimagesMiddleware.js';
import { createMethod, deleteMethod, getAllMethod, getOneMethod, updateMethod } from './handlersFactory.js'

export const uploadProductImages = uploadMultiImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 }
])

export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.files) {
        if (req.files.imageCover) {
            const imageCoverFileName = `product-${Date.now()}-cover.jpeg`;
            await sharp(req.files.imageCover[0].buffer)
                .resize(650, 600)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`uploads/products/${imageCoverFileName}`)
            req.body.imageCover = imageCoverFileName;
        }
        if (req.files.images) {
            req.body.images = [];
            await Promise.all(req.files.images.map(async (img, index) => {
                const imageName = `product-${Date.now()}N${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(650, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/products/${imageName}`);
                req.body.images.push(imageName);
            }))
        }
    }
    next();
})

// @desc    Get products
// @route   GET /api/products
// @access  Public
// @author  Abdelrahman Sherif
export const getProducts = getAllMethod(products, 'products');

// @desc    Get specific product by id
// @route   GET /api/products/:_id
// @access  Public
// @author  Abdelrahman Sherif
export const getProduct = getOneMethod(products);

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const createProduct = createMethod(products);

// @desc    Update specific product
// @route   PUT /api/products/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const updateProduct = updateMethod(products);

// @desc    Delete specific product
// @route   DELETE /api/products/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const deleteProduct = deleteMethod(products);