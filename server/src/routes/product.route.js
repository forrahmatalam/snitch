import { Router } from "express";
import { createProductValidator } from "../validators/product.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer"

const router = Router();

//Multer
const upload = multer({ storage: multer.memoryStorage() });


router.post("/create", authenticate, /*inline middleware*/ (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            message:"You are not authorized to perform this operation"
        });
    }
    next();
}, upload.array("images", 5), (req, res, next) => {
    try {
        req.body.price = JSON.parse(req.body.price);
        req.body.sizes = JSON.parse(req.body.sizes);
        next();
        
    } catch {
        res.status(400).json({ message: "price aur sizes valid JSON mein bhejo" });
    }
}, createProductValidator, createProduct);




export default router;
