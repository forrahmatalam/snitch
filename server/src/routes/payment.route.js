import { Router } from "express";
import { processPayment, getKey, paymentVerification } from "../controllers/payment.controller.js";

const router = Router();

router.post("/payment/process", processPayment);
router.get("/payment/key", getKey);
router.post("/payment/verification", paymentVerification);

export default router;