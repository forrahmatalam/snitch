import productsModel from "../models/product.model.js";
import {uploadFile} from "../services/storage.service.js";



//use for create product by seller
export const createProduct = async (req, res) => {

    const fileUrls = [];

    // upload images
    for (let i = 0; i < req.files.length; i++) {

        const response = await uploadFile({
            buffer: req.files[i].buffer,
            fileName: req.files[i].originalname
        });

        fileUrls.push(response.url);
    }

    const product = await productsModel.create({
         title: req.body.title,
         description: req.body.description,
         price:{
             amount: req.body.price.amount,
             currency: req.body.price.currency
         },
         sizes: req.body.sizes,
         images: fileUrls,
         seller: req.user.userId
    });

    res.status(201).json({
        message: "Product Created Successfully",
        data:{product}
    });

};


//
export const listAllProducts = async (req, res) => {
    const products = await productsModel.find();
    res.status(200).json({
        message: "Products fetched successfully",
        data:{products}
    });
};