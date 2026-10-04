import { Router } from "express";
import { createProductValidator } from "../validators/product.validator";

const router = Router();

router.post("api/product",createProductValidator);

export default router;