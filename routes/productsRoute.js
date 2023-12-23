import { Router } from "express";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validators/productsValidator.js";
import { createProduct, deleteProduct, getProduct, getProducts, resizeImage, updateProduct, uploadProductImages } from "../controllers/products.js";
import { allowedTo, protectRoutes } from "../controllers/auth.js";

const router = new Router();

router.route('/')
    .get(getProducts)
    .post(protectRoutes, allowedTo('admin', 'manager'), uploadProductImages, resizeImage, createProductValidator, createProduct)

router.route('/:_id')
    .get(getProductValidator, getProduct)
    .put(protectRoutes, allowedTo('admin', 'manager'), uploadProductImages, resizeImage, updateProductValidator, updateProduct)
    .delete(protectRoutes, allowedTo('admin', 'manager'), deleteProductValidator, deleteProduct)

export default router