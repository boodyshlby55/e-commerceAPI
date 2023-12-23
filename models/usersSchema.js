import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const usersSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'user name is Required'],
            minlength: [2, 'min length must be 2 char'],
            maxlength: [50, 'max length must be 50 char']
        },
        slug: {
            type: String,
            lowercase: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'email is Required'],
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'password is Required'],
            minlength: [6, 'Password should be between 6 and 14'],
            maxlength: [14, 'Password should be between 6 and 14']
        },
        passwordChangedAt: { type: Date },
        passwordResetCode: { type: String },
        passwordResetCodeExpires: { type: Date },
        passwordResetCodeVerify: { type: Boolean },
        profileImage: { type: String },
        phone: { type: String },
        role: {
            type: String,
            enum: ['admin', 'manager', 'user'],
            default: 'user'
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

// const imageUrl = (document) => {
//     if (document.profileImage) {
//         const imageUrl = `${process.env.BASE_URL}/users/${document.profileImage}`
//         document.profileImage = imageUrl;
//     }
// }
// usersSchema
//     .post('init', (document) => { imageUrl(document) })
//     .post('save', (document) => { imageUrl(document) })

export default model("users", usersSchema)