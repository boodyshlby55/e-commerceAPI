import { Schema, model } from "mongoose";

const subCategoriesSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Category name is Required'],
            unique: [true, 'Category must be Unique'],
            minlength: [2, 'min length must be 2 char'],
            maxlength: [50, 'max length must be 50 char']
        },
        slug: {
            type: String,
            lowercase: true
        },
        image: { type: String },
        category: {
            type: Schema.ObjectId,
            ref: 'categories',
            required: [true, 'Category must be Required'],
        }
    },
    { timestamps: true }
);

const imageUrl = (document) => {
    if (document.image) {
        const imageUrl = `${process.env.BASE_URL}/subcategories/${document.image}`
        document.image = imageUrl;
    }
}

subCategoriesSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    next();
})

subCategoriesSchema.post('init', (document) => { imageUrl(document) })
    .post('save', (document) => { imageUrl(document) })

export default model("subCategories", subCategoriesSchema)