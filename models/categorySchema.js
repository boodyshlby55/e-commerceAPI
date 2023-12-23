import { Schema, model } from "mongoose";

const categoriesSchema = new Schema(
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
        image: { type: String }
    },
    { timestamps: true }
);

const imageUrl = (document) => {
    if (document.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${document.image}`
        document.image = imageUrl;
    }
}
categoriesSchema.post('init', (document) => { imageUrl(document) })
    .post('save', (document) => { imageUrl(document) })

export default model("categories", categoriesSchema)