import crypto from "node:crypto";
import { instance } from "../app/app.js";
import config from "../config/config.js";

// Create a Razorpay order for the selected product total.
export const processPayment = async (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isSafeInteger(amount) || amount < 100) {
        return res.status(400).json({
            message: "Amount must be at least ₹1 and must be provided in paise.",
            success: false
        });
    }

    if (!config.RAZOR_KEY_ID || !config.RAZOR_SECRET_KEY) {
        return res.status(503).json({
            message: "Razorpay test keys are missing. Set RAZOR_KEY_ID and RAZOR_SECRET_KEY in server/.env.",
            success: false
        });
    }

    try {
        const order = await instance.orders.create({
            amount,
            currency: "INR"
        });

        return res.status(200).json({
            message: "Payment order created successfully.",
            success: true,
            order_id: order.id
        });
    } catch (error) {
        const errorDetails = error?.error?.description
            || error?.description
            || error?.message
            || JSON.stringify(error)
            || String(error);
        console.error("Razorpay order creation failed:", errorDetails);
        return res.status(502).json({
            message: `Razorpay order creation failed: ${errorDetails}`,
            success: false
        });
    }
};

// Return the public Razorpay key to the checkout page.
export const getKey = async (req, res) => {
    if (!config.RAZOR_KEY_ID) {
        return res.status(503).json({
            message: "Razorpay test key is missing. Set RAZOR_KEY_ID in server/.env.",
            success: false
        });
    }

    return res.status(200).json({
        message: "Key retrieved successfully.",
        success: true,
        key: config.RAZOR_KEY_ID
    });
};

// Verify the signature returned by Razorpay Checkout.
export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !/^[a-f0-9]{64}$/i.test(razorpay_signature || "")) {
        return res.status(400).json({
            message: "Razorpay payment details are incomplete or invalid.",
            success: false
        });
    }

    if (!config.RAZOR_SECRET_KEY) {
        return res.status(503).json({
            message: "Razorpay test secret is missing. Set RAZOR_SECRET_KEY in server/.env.",
            success: false
        });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", config.RAZOR_SECRET_KEY)
        .update(body)
        .digest("hex");
    const signatureMatches = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
    );

    if (!signatureMatches) {
        return res.status(400).json({
            message: "Payment verification failed.",
            success: false
        });
    }

    return res.status(200).json({
        message: "Payment verified successfully.",
        success: true
    });
};
