import { Router } from 'express';
import { addToCartValidator } from '../validators/cart.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { addToCart } from '../controllers/cart.controller.js';


const router = Router();


router.post('/addToCart',authenticate,addToCartValidator,addToCart);

export default router;
