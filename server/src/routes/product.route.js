import { Router } from "express";
import { createProductValidator ,unlistProductValidator,listProductValidator } from "../validators/product.validator.js";
import { authenticate ,isSeller  } from "../middleware/auth.middleware.js";
import { createProduct ,listAllProducts ,unlistProduct,listProduct} from "../controllers/product.controller.js";
import multer from "multer"

const router = Router();


const upload = multer({ storage: multer.memoryStorage(),
    limits: {
        files: 5, //limit file upload to 5 files
        fileSize: 1024 * 1024 * 10  //limit file size to 10 MB
    },
  
 });   //Multer form data read krne ke lie use hota hai 


router.post("/create", authenticate, isSeller, upload.array(/*ye image wala image nhi hai naam dena hota hai jo bhi form data me hai*/ "images", 5), /*ye ek aur middle ware*/(req, res, next) => {
    try {
        req.body.price = JSON.parse(req.body.price);
        req.body.sizes = JSON.parse(req.body.sizes);
        next();

    } catch {
        res.status(400).json({ message: "price aur sizes valid JSON mein bhejo" });
    }
}, createProductValidator, createProduct );


//get api for product
router.get("/",authenticate,listAllProducts);

//unlist product
router.patch("/unlist/:id",authenticate,isSeller,unlistProductValidator,unlistProduct);

//list product
router.patch("/list/:id",authenticate,isSeller,listProductValidator,listProduct);

export default router;
