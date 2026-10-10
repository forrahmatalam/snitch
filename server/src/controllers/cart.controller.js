
import cartModel from '../models/cart.model.js';
import productsModel from '../models/product.model.js';

export const addToCart = async (req, res) => {
    const { productId, quantity, size } = req.body;

    const product = await productsModel.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const selectedSize = product.sizes.find((item) => item.size === size);
    if (!selectedSize) {
        return res.status(400).json({
            message: 'Size not found'
        });
    }

    //user ka cart bna rhe hai if nhi milti hai to
    let cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) {
        cart = new cartModel({ user: req.user.userId });
    }

    const cartItem = cart.products.find(
        (item) => item.product.toString() === productId && item.size === size
    );
    const updatedQuantity = (cartItem?.quantity || 0) + Number(quantity);

    if (selectedSize.stock < updatedQuantity) {
        return res.status(400).json({
            message: 'Quantity exceeds stock'
        });
    }

    if (cartItem) {
        cartItem.quantity = updatedQuantity;
    } else {
        cart.products.push({ product: productId, quantity: Number(quantity), size });
    }

    await cart.save();

    return res.status(200).json({
        message: 'Product added to cart successfully',
        data: { cart }
    });
};
