import mongoose from "mongoose";

export const DBConnection = () => {
    mongoose.connect(process.env.DB)
        .then(console.log("Database Connected"))
};