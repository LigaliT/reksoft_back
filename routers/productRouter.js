import express from "express";
import expressAsyncHandler from "express-async-handler";
import {isAdmin, isAuth, isSellerOrAdmin} from '../utils.js';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const productRouter = express.Router();

productRouter.get("/", expressAsyncHandler(async (req, res) => {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || "";
    const order = req.query.order || "";
    const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const nameFilter = name ? {name: {$regex: name, $options: "i"}} : {};
    const priceFilter = min && max ? {price: {$gte: min, $lte: max}} : {};
    const sortOrder = order === "lowest" ? {price: 1} : order === "highest" ? {price: -1} : {_id: -1};
    const count = await Product.count({
        ...nameFilter,
        ...priceFilter,
    });
    const products = await Product.find({
        ...nameFilter,
        ...priceFilter,
    })
        .populate('seller', 'seller.name seller.logo')
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    res.send({products, page, pages: Math.ceil(count / pageSize)});
}));

productRouter.get("/seed", expressAsyncHandler(async (req, res) => {
    const seller = await User.findOne({isSeller: true});
    if (seller) {
        const products = data.products.map((product) => ({
            ...product,
            seller: seller._id
        }));
        const createdProducts = await Product.insertMany(products);
        res.send({createdProducts});
    } else {
        res.status(500).send({message: "No seller found. first run /api/users/seed"})
    }
}));

productRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("seller", "seller.name seller.logo");
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({message: "Product not found"});
    }
}));

productRouter.post("/", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: "sample name" + Date.now(),
        seller: req.user._id,
        image: "/images/p1.jpg",
        price: 0,
        countInStock: 0,
        description: "sample description",
    });
    const createdProduct = await product.save();
    res.send({message: "Product is created", product: createdProduct});
}));

productRouter.put("/:id", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({message:"Product is updated",product: updatedProduct});
    }else{
        res.status(404).send({message:"Product not found"});
    }
}));

productRouter.delete("/:id",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deletedProduct = product.remove();
        res.send({message:"Product deleted",product:deletedProduct})
    }
}));

export default productRouter;
