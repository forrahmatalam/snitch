import { body, validationResult } from 'express-validator';

export const registerValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("enter valid email"),

    body("name")
        .trim()
        .notEmpty().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string")
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string")
        .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            });
        }

        next();
    }
];