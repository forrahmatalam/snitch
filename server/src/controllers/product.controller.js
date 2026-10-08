import productsModel from "../models/product.model.js";


//use for create product by seller
export const createProduct = async (req, res) => {
    const product = await productsModel.create({
        ...req.body,
        seller: req.user.userId
    });

    return res.status(201).json({
        message: "Product created successfully",
        data: { product }
    });
};
