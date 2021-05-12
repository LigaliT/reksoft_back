import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    countInStock:{ type: Number, required: true },
    image: { type: String, required: true },
    seller: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
},{
    timestamps: true,
});

const Product = new mongoose.model("Product", productSchema);

export default Product;