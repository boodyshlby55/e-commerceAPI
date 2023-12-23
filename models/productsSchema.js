import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Product title is Required'],
            minlength: [2, 'min length must be 2 char'],
            maxlength: [100, 'max length must be 50 char']
        },
        slug: {
            type: String,
            lowercase: true
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Product description is Required'],
            minlength: [2, 'min length must be 2 char'],
            maxlength: [100, 'max length must be 50 char']
        },
        quantity: {
            type: Number,
            trim: true,
            required: [true, 'Product quantity is Required'],
        },
        price: {
            type: Number,
            trim: true,
            required: [true, 'Product price is Required'],
        },
        colors: [String],
        images: [String],
        imageCover: { type: String },
        sold: {
            type: Number,
            default: 0
        },
        category: {
            type: Schema.ObjectId,
            ref: 'categories',
            required: [true, 'Category must be Required'],
        },
        subcategory: {
            type: Schema.ObjectId,
            ref: 'subCategories',
            required: [true, 'Subcategory must be Required'],
        }
    },
    { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    this.populate({ path: 'subcategory', select: 'name' });
    next();
})

const imageUrl = (document) => {
    if (document.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${document.imageCover}`
        document.imageCover = imageUrl;
    }
    if (document.images) {
        const imagesList = [];
        document.images.forEach(image => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        document.images = imagesList;
    }
}
productSchema.post('init', (document) => { imageUrl(document) })
    .post('save', (document) => { imageUrl(document) })

export default model("products", productSchema)