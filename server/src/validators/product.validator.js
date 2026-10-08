import { body, validationResult } from "express-validator";

export const createProductValidator = [
    body("title")
        .isString().withMessage("Title must be a string").bail()
        .trim().isLength({ min: 2, max: 50 }).withMessage("Title must be between 2 and 50 characters"),
    body("description")
        .isString().withMessage("Description must be a string").bail()
        .trim().isLength({ min: 2, max: 500 }).withMessage("Description must be between 2 and 500 characters"),
    body("price.amount")
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
    body("price.currency")
        .isIn(["INR", "USD"]).withMessage("Currency must be INR or USD"),
    body("images")
        .optional().isArray({ max: 5 }).withMessage("Images must be an array of at most 5 URLs"),
    body("images.*")
        .isString().withMessage("Each image must be a string").bail()
        .isURL().withMessage("Each image must be a valid URL"),
    body("sizes")
        .isArray({ min: 1 }).withMessage("At least one size is required"),
    body("sizes.*.size")
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size must be XS, S, M, L, XL, or XXL"),
    body("sizes.*.stock")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid Request", errors: errors.array() });
        }
        next();
    }
];
